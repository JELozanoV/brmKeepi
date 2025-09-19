import React, { useEffect, useMemo, useState } from 'react';
import { useKpiHistory } from '../../hooks/useKpiHistory';
import { evaluateDayStatus } from '../../services/kpisHistoryService';
import { KPI_TARGETS } from '../../config/constants';
import { formatTmo } from '../../utils/metrics';
import KpiCard from './KpiCard';
import KpiCalendar from './KpiCalendar';

type ViewMode = 'month' | 'day';

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function clampToMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const KpiHistoryCard: React.FC<{ userId: string | null }>
  = ({ userId }) => {
  const today = new Date();
  const [month, setMonth] = useState<Date>(clampToMonth(today));
  const [mode, setMode] = useState<ViewMode>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { data, loading, error, loadMonth } = useKpiHistory(userId);

  // cargar datos del mes
  useEffect(() => { loadMonth(monthKey(month)); }, [month, loadMonth]);

  const days = data?.days || {};

  const monthAverages = useMemo(() => {
    const values = Object.values(days);
    const withData = values.filter(v => v && (v.tmoSec != null || v.transfersPct != null || v.npsPct != null));
    const n = withData.length;
    if (!n) return { n: 0, tmo: '00:00', trans: '0.0%', nps: '0.0%' };
    const tmoAvg = Math.round(withData.reduce((s, v) => s + (v.tmoSec || 0), 0) / n);
    const transAvg = withData.reduce((s, v) => s + (v.transfersPct || 0), 0) / n;
    const npsAvg = withData.reduce((s, v) => s + (v.npsPct || 0), 0) / n;
    return { n, tmo: formatTmo(tmoAvg), trans: `${transAvg.toFixed(1)}%`, nps: `${npsAvg.toFixed(1)}%` };
  }, [days]);

  const dayKey = (d: Date | null) => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : '';
  const selectedData = selectedDay ? days[dayKey(selectedDay)] : undefined;

  return (
    <section className="op-card" aria-label="Historial KPI" style={{ marginTop: '1.5rem' }}>
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>Historial KPI</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="range-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mes anterior">‹</button>
          <div aria-live="polite" aria-atomic="true" style={{ minWidth: 140, textAlign: 'center' }}>
            {new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}
          </div>
          <button className="range-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mes siguiente" disabled={monthKey(month) === monthKey(clampToMonth(new Date()))}>›</button>
          <div role="tablist" aria-label="Cambiar vista" style={{ marginLeft: 12 }}>
            <button role="tab" aria-selected={mode==='month'} className={`range-btn ${mode==='month'?'active':''}`} onClick={() => setMode('month')}>Mes</button>
            <button role="tab" aria-selected={mode==='day'} className={`range-btn ${mode==='day'?'active':''}`} onClick={() => setMode('day')} style={{ marginLeft: 6 }}>Día</button>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ paddingTop: 12 }}>
        {mode === 'month' && (
          <div>
            <KpiCalendar
              month={month}
              mode="single" selected={selectedDay || undefined}
              onMonthChange={setMonth}
              onSelect={() => {}}
              onDaySelected={(d) => { setSelectedDay(d); setMode('day'); }}
              daysMap={days}
            />
            <div style={{ marginTop: 12, color: '#e5e7eb' }} aria-live="polite">
              {loading ? (
                <span>Cargando histórico del mes…</span>
              ) : error ? (
                <div className="kpi-error">{error}</div>
              ) : (monthAverages.n > 0 ? (
                <span>Promedios del mes seleccionado: TMO {monthAverages.tmo} · %Trans {monthAverages.trans} · NPS {monthAverages.nps} (sobre {monthAverages.n} días con datos).</span>
              ) : (
                <span>No hay registros para este mes.</span>
              ))}
            </div>
          </div>
        )}

        {mode === 'day' && (
          <div className="kpi-grid" aria-live="polite">
            <div style={{ marginBottom: 12 }}>
              <KpiCalendar
                month={month}
                mode="single"
                selected={selectedDay || undefined}
                onMonthChange={setMonth}
                onSelect={() => {}}
                onDaySelected={(d) => setSelectedDay(d)}
                daysMap={days}
              />
            </div>
            <div className="kpi-grid" style={{ marginTop: 8 }}>
              {selectedDay && selectedData ? (
                <>
                  <KpiCard label="TMO" value={formatTmo(selectedData.tmoSec || 0)} hint={`Meta ${formatTmo(KPI_TARGETS.tmoSec)} o menos`} />
                  <KpiCard label="% Transferencias" value={`${(selectedData.transfersPct || 0).toFixed(1)}%`} hint={`Meta ${KPI_TARGETS.transfersPct}% o menos`} />
                  <KpiCard label="Tu NPS" value={`${(selectedData.npsPct || 0).toFixed(1)}%`} hint={`Meta ${KPI_TARGETS.npsPct}% o más`} />
                </>
              ) : (
                <div className="kpi-loading">{loading ? 'Cargando día…' : 'No hay registros para esta fecha.'}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KpiHistoryCard;


