import React, { useEffect, useMemo, useState } from 'react';
import { useKpiHistory } from '../../hooks/useKpiHistory';
import { useKpiLiveData } from '../../hooks/useKpiLiveData';
import { KPI_TARGETS, TIMEZONE } from '../../config/constants';
import { formatTmo } from '../../utils/metrics';
import KpiCard from './KpiCard';
import { evaluateDayStatus } from '../../services/kpisHistoryService';

type ViewMode = 'month' | 'day';

function clampToMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const KpiHistoryCard: React.FC<{ userId: string | null }>
  = ({ userId }) => {
  // Fecha actual según zona horaria de Colombia (America/Bogota)
  function nowInTimezone(tz: string): Date {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(new Date());
    const y = Number(parts.find(p => p.type === 'year')?.value || new Date().getFullYear());
    const m = Number(parts.find(p => p.type === 'month')?.value || (new Date().getMonth() + 1));
    const d = Number(parts.find(p => p.type === 'day')?.value || new Date().getDate());
    return new Date(y, m - 1, d);
  }

  const today = nowInTimezone(TIMEZONE);
  const [month, setMonth] = useState<Date>(clampToMonth(today));
  const [mode, setMode] = useState<ViewMode>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { data, loading, loadMonth } = useKpiHistory(userId);
  const { snapshot: liveSnapshot } = useKpiLiveData(30000, 'today');

  // Selects Año/Mes
  const currentYear = today.getFullYear();
  const [yearSel, setYearSel] = useState<number | null>(currentYear);
  const [monthSel, setMonthSel] = useState<number | null>(today.getMonth() + 1);
  const canLoad = yearSel != null && monthSel != null;

  // Si el año seleccionado es el actual, limitar meses al mes actual
  useEffect(() => {
    if (yearSel === currentYear && monthSel && monthSel > (today.getMonth() + 1)) {
      setMonthSel(today.getMonth() + 1);
    }
  }, [yearSel]);

  // cargar datos del mes cuando hay año/mes
  useEffect(() => {
    if (canLoad) {
      const d = new Date(yearSel as number, (monthSel as number) - 1, 1);
      setMonth(clampToMonth(d));
      loadMonth(yearSel as number, monthSel as number);
      setSelectedDay(null);
      console.log('[HistorialKPI] loadMonth', { advisorId: userId, year: yearSel, month: monthSel });
    }
  }, [yearSel, monthSel, canLoad, loadMonth]);

  // mapear a daysMap para el calendario
  const days = useMemo(() => {
    const map: Record<string, { tmoSec?: number; transfersPct?: number; npsPct?: number }> = {};
    (data?.days || []).forEach(d => { map[d.date] = { tmoSec: d.tmoSec, transfersPct: d.transfersPct, npsPct: d.npsPct }; });
    const keys = Object.keys(map);
    if (keys.length) {
      console.log('[HistorialKPI] days loaded', { count: keys.length, sample: keys.slice(0, 5) });
    } else if (canLoad && !loading) {
      console.log('[HistorialKPI] days empty for month', { year: yearSel, month: monthSel });
    }
    return map;
  }, [data, canLoad, loading, yearSel, monthSel]);

  const monthAverages = useMemo(() => {
    const values = Object.values(days);
    const withData = values.filter(v => v && (v.tmoSec != null || v.transfersPct != null || v.npsPct != null));
    const n = withData.length;
    if (!n) return { n: 0, tmo: '00:00', trans: '0%', nps: '0%' };
    const tmoAvg = Math.round(withData.reduce((s, v) => s + (v.tmoSec || 0), 0) / n);
    const transAvg = withData.reduce((s, v) => s + (v.transfersPct || 0), 0) / n;
    const npsAvg = withData.reduce((s, v) => s + (v.npsPct || 0), 0) / n;
    return { n, tmo: formatTmo(tmoAvg), trans: `${Math.round(transAvg)}%`, nps: `${Math.round(npsAvg)}%` };
  }, [days]);

  const dayKey = (d: Date | null) => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : '';

  const isTodaySelected = selectedDay != null &&
    selectedDay.getFullYear() === today.getFullYear() &&
    selectedDay.getMonth() === today.getMonth() &&
    selectedDay.getDate() === today.getDate();

  const selectedData = isTodaySelected && liveSnapshot
    ? { tmoSec: liveSnapshot.tmoSec, transfersPct: liveSnapshot.transfersPct, npsPct: liveSnapshot.npsPct }
    : (selectedDay ? days[dayKey(selectedDay)] : undefined);

  return (
    <section className="op-card" aria-label="Historial KPI" style={{ marginTop: '1.5rem' }}>
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>Historial KPI</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div aria-live="polite" aria-atomic="true" style={{ minWidth: 140, textAlign: 'center' }}>
            {/* Selects Año/Mes */}
            <label style={{ marginRight: 8 }}>
              <select aria-label="Seleccionar año" value={yearSel ?? ''} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setYearSel(v); setSelectedDay(null); setMode('month'); }} style={{ background: 'var(--brm-bg-input)', color: 'var(--brm-text)', border: '1px solid var(--brm-accent)', borderRadius: 8, padding: '4px 8px' }}>
                <option value="" disabled>—</option>
                {Array.from({ length: 7 }, (_, i) => currentYear - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label>
              <select aria-label="Seleccionar mes" value={monthSel ?? ''} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setMonthSel(v); setSelectedDay(null); setMode('month'); }} style={{ background: 'var(--brm-bg-input)', color: 'var(--brm-text)', border: '1px solid var(--brm-accent)', borderRadius: 8, padding: '4px 8px' }}>
                <option value="" disabled>—</option>
                {(() => {
                  const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                  const maxMonth = yearSel === currentYear ? (today.getMonth() + 1) : 12;
                  return names.slice(0, maxMonth).map((mName, idx) => (
                    <option key={mName} value={idx+1}>{mName}</option>
                  ));
                })()}
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
              <div style={{ background: 'var(--brm-bg-card)', border: '1px solid var(--brm-border)', borderRadius: 12, padding: 12 }}>
                <div className="kpi-grid">
                  <KpiCard showChip={false} label="TMO" value={monthAverages.tmo} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator="≤" numericValue={Number((() => { const arr = monthAverages.tmo.split(':'); return Number(arr[0]) * 60 + Number(arr[1]); })())} targetValue={KPI_TARGETS.tmoSec} />
                  <KpiCard showChip={false} label="% Transferencias" value={monthAverages.trans} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator="≤" numericValue={Number(monthAverages.trans.replace('%',''))} targetValue={KPI_TARGETS.transfersPct} />
                  <KpiCard showChip={false} label="Tu NPS" value={monthAverages.nps} hint={`Promedio de ${new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month)}`} comparator="≥" numericValue={Number(monthAverages.nps.replace('%',''))} targetValue={KPI_TARGETS.npsPct} />
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'day' && (() => {
          const y = month.getFullYear();
          const m = month.getMonth();
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const first = new Date(y, m, 1);
          const mondayIndex = (first.getDay() + 6) % 7;
          const labels = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
          const statusColor: Record<string, string> = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444', gray: '#6b7280' };
          const toKey = (d: number) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const title = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month);
          const blanks = Array.from({ length: mondayIndex });
          const nums = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          const selectedDateLabel = selectedDay
            ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}`
            : '';
          return (
            <div aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Calendario inline */}
              <div style={{ background: 'var(--brm-bg-card)', border: '1px solid var(--brm-border)', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ textAlign: 'center', color: 'var(--brm-text)', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem', textTransform: 'capitalize' }}>{title}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                  {labels.map(l => (
                    <div key={l} style={{ textAlign: 'center', color: 'var(--brm-text-secondary)', fontSize: '0.75rem', fontWeight: 600, padding: '2px 0' }}>{l}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {blanks.map((_, i) => <div key={`b-${i}`} />)}
                  {nums.map(dn => {
                    const kpi = days[toKey(dn)];
                    const status = kpi ? evaluateDayStatus({ ...kpi, date: toKey(dn) }) : 'gray';
                    const dot = statusColor[status];
                    const isSelected = selectedDay && selectedDay.getFullYear()===y && selectedDay.getMonth()===m && selectedDay.getDate()===dn;
                    const dateObj = new Date(y, m, dn);
                    const isFuture = dateObj > today;
                    const isDisabled = isFuture || !kpi;
                    return (
                      <button
                        key={dn}
                        onClick={() => { if (isDisabled) return; setSelectedDay(new Date(y, m, dn)); console.log('[HistorialKPI] day selected', { date: toKey(dn) }); }}
                        disabled={isDisabled}
                        style={{
                          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          height: 36, borderRadius: 8, fontSize: '0.85rem', fontWeight: isSelected ? 700 : 400,
                          border: isSelected ? '2px solid var(--brm-accent)' : '1px solid var(--brm-border)',
                          background: isSelected ? 'var(--brm-btn-active-bg)' : 'var(--brm-bg-input)',
                          color: isSelected ? 'var(--brm-btn-active-color)' : 'var(--brm-text)',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.4 : 1,
                          transition: 'all 0.15s'
                        }}
                        title={kpi ? `TMO ${formatTmo(kpi.tmoSec || 0)} · %Trans ${(kpi.transfersPct || 0).toFixed(1)}% · NPS ${(kpi.npsPct || 0).toFixed(1)}%` : 'Sin datos'}
                        aria-disabled={isDisabled}
                        aria-pressed={!!isSelected}
                      >
                        {dn}
                        {kpi && <span aria-hidden style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 5, height: 5, borderRadius: 999, background: dot }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* KPIs del día seleccionado */}
              <div style={{ background: 'var(--brm-bg-card)', border: '1px solid var(--brm-border)', borderRadius: 12, padding: 12 }}>
                {selectedDay && selectedData ? (
                  <div className="kpi-grid">
                    <KpiCard showChip={false} label="TMO" value={formatTmo(selectedData.tmoSec || 0)} hint={`Valores del ${selectedDateLabel}`} comparator="≤" numericValue={selectedData.tmoSec || 0} targetValue={KPI_TARGETS.tmoSec} />
                    <KpiCard showChip={false} label="% Transferencias" value={`${Math.round(selectedData.transfersPct || 0)}%`} hint={`Valores del ${selectedDateLabel}`} comparator="≤" numericValue={selectedData.transfersPct || 0} targetValue={KPI_TARGETS.transfersPct} />
                    <KpiCard showChip={false} label="Tu NPS" value={`${Math.round(selectedData.npsPct || 0)}%`} hint={`Valores del ${selectedDateLabel}`} comparator="≥" numericValue={selectedData.npsPct || 0} targetValue={KPI_TARGETS.npsPct} />
                  </div>
                ) : (
                  <div className="kpi-loading" style={{ textAlign: 'center', padding: '12px 0' }}>
                    {loading ? 'Cargando…' : (selectedDay ? 'No hay registros para esta fecha.' : '← Selecciona un día del calendario')}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default KpiHistoryCard;


