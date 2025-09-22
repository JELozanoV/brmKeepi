import React, { useEffect, useMemo, useState } from 'react';
import { useKpiHistory } from '../../hooks/useKpiHistory';
import { KPI_TARGETS } from '../../config/constants';
import { formatTmo } from '../../utils/metrics';
import KpiCard from './KpiCard';
import KpiCalendar from './KpiCalendar';
import KpiCoach from './KpiCoach';

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
  const [dayPickerOpen, setDayPickerOpen] = useState<boolean>(false);
  const { data, loading, error, loadMonth } = useKpiHistory(userId);

  // Selects Año/Mes
  const currentYear = today.getFullYear();
  const [yearSel, setYearSel] = useState<number | null>(null);
  const [monthSel, setMonthSel] = useState<number | null>(null);
  const canLoad = yearSel != null && monthSel != null;

  // cargar datos del mes cuando hay año/mes
  useEffect(() => {
    if (canLoad) {
      const d = new Date(yearSel as number, (monthSel as number) - 1, 1);
      setMonth(clampToMonth(d));
      loadMonth(yearSel as number, monthSel as number);
    }
  }, [yearSel, monthSel, canLoad, loadMonth]);

  // mapear a daysMap para el calendario
  const days = useMemo(() => {
    const map: Record<string, { tmoSec?: number; transfersPct?: number; npsPct?: number }> = {};
    (data?.days || []).forEach(d => { map[d.date] = { tmoSec: d.tmoSec, transfersPct: d.transfersPct, npsPct: d.npsPct }; });
    return map;
  }, [data]);

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
          <div aria-live="polite" aria-atomic="true" style={{ minWidth: 140, textAlign: 'center' }}>
            {/* Selects Año/Mes */}
            <label style={{ marginRight: 8 }}>
              <select aria-label="Seleccionar año" value={yearSel ?? ''} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setYearSel(v); setSelectedDay(null); setMode('month'); }} style={{ background: '#111', color: '#e5e7eb', border: '1px solid #1A4DFF', borderRadius: 8, padding: '4px 8px' }}>
                <option value="" disabled>—</option>
                {Array.from({ length: 7 }, (_, i) => currentYear - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label>
              <select aria-label="Seleccionar mes" value={monthSel ?? ''} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setMonthSel(v); setSelectedDay(null); setMode('month'); }} style={{ background: '#111', color: '#e5e7eb', border: '1px solid #1A4DFF', borderRadius: 8, padding: '4px 8px' }}>
                <option value="" disabled>—</option>
                {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((mName, idx) => (
                  <option key={mName} value={idx+1}>{mName}</option>
                ))}
              </select>
            </label>
          </div>
          {/* Toggle Mes | Día */}
          <div role="tablist" aria-label="Cambiar vista" style={{ marginLeft: 12 }}>
            <button role="tab" aria-selected={mode==='month'} className={`range-btn ${mode==='month'?'active':''}`} onClick={() => setMode('month')}>Mes</button>
            <button role="tab" aria-selected={mode==='day'} className={`range-btn ${mode==='day'?'active':''}`} onClick={() => setMode('day')} style={{ marginLeft: 6 }}>Día</button>
          </div>
        </div>
      </div>

      <div className="card-body" style={{ paddingTop: 12 }}>
        {mode === 'month' && (
          <div>
            {!canLoad ? (
              <div className="kpi-loading">Selecciona año y mes para ver tu historial</div>
            ) : (
              <div style={{ background: '#222', border: '1px solid #1A4DFF', borderRadius: 12, padding: 12 }}>
                <div className="kpi-grid">
                  <KpiCard showChip={false} label="TMO" value={monthAverages.tmo} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator="≤" numericValue={Number((() => { const arr = monthAverages.tmo.split(':'); return Number(arr[0]) * 60 + Number(arr[1]); })())} targetValue={KPI_TARGETS.tmoSec} />
                  <KpiCard showChip={false} label="% Transferencias" value={monthAverages.trans} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator="≤" numericValue={Number(monthAverages.trans.replace('%',''))} targetValue={KPI_TARGETS.transfersPct} />
                  <KpiCard showChip={false} label="Tu NPS" value={monthAverages.nps} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator=">=" numericValue={Number(monthAverages.nps.replace('%',''))} targetValue={KPI_TARGETS.npsPct} />
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'day' && (
          <div aria-live="polite">
            {/* Selector de día en popover */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={dayPickerOpen}
                  onClick={() => setDayPickerOpen(v => !v)}
                  style={{ cursor: 'pointer', background: '#111', color: '#e5e7eb', border: '1px solid #1A4DFF', borderRadius: 8, padding: '6px 10px' }}
                >
                  {selectedDay ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}` : 'Selecciona día'}
                </button>
                {dayPickerOpen && (
                  <div style={{ position: 'absolute', zIndex: 10, marginTop: 6 }}>
                    <KpiCalendar
                      bare
                      disableNav
                      month={month}
                      mode="single"
                      selected={selectedDay || undefined}
                      onMonthChange={() => {}}
                      onSelect={() => {}}
                      onDaySelected={(d) => {
                        setSelectedDay(d);
                        setDayPickerOpen(false);
                      }}
                      daysMap={days}
                      disabledIf={(date) => {
                        const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
                        return !days[key];
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ background: '#222', border: '1px solid #1A4DFF', borderRadius: 12, padding: 12 }}>
                  <div className="kpi-grid">
                    {selectedDay && selectedData ? (
                      <>
                        <KpiCard showChip={false} label="TMO" value={formatTmo(selectedData.tmoSec || 0)} hint={`Valores del ${selectedDay ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}` : ''}`} comparator="≤" numericValue={selectedData.tmoSec || 0} targetValue={KPI_TARGETS.tmoSec} />
                        <KpiCard showChip={false} label="% Transferencias" value={`${(selectedData.transfersPct || 0).toFixed(1)}%`} hint={`Valores del ${selectedDay ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}` : ''}`} comparator="≤" numericValue={selectedData.transfersPct || 0} targetValue={KPI_TARGETS.transfersPct} />
                        <KpiCard showChip={false} label="Tu NPS" value={`${(selectedData.npsPct || 0).toFixed(1)}%`} hint={`Valores del ${selectedDay ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}` : ''}`} comparator=">=" numericValue={selectedData.npsPct || 0} targetValue={KPI_TARGETS.npsPct} />
                      </>
                    ) : (
                      <div className="kpi-loading">{loading ? 'Cargando día…' : 'No hay registros para esta fecha.'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KpiHistoryCard;


