import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKpiHistory } from '../../hooks/useKpiHistory';
import { KPI_TARGETS, TIMEZONE } from '../../config/constants';
import { formatTmo } from '../../utils/metrics';
import KpiCard from './KpiCard';
import KpiCalendar from './KpiCalendar';
import { evaluateDayStatus } from '../../services/kpisHistoryService';
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
  const [dayPickerOpen, setDayPickerOpen] = useState<boolean>(false);
  const { data, loading, error, loadMonth } = useKpiHistory(userId);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
      setDayPickerOpen(false);
      console.log('[HistorialKPI] loadMonth', { advisorId: userId, year: yearSel, month: monthSel });
    }
  }, [yearSel, monthSel, canLoad, loadMonth]);

  // Cerrar popover con Escape o clic fuera
  useEffect(() => {
    if (!dayPickerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDayPickerOpen(false); };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setDayPickerOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [dayPickerOpen]);

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
                  ref={buttonRef}
                  style={{ cursor: 'pointer', background: '#111', color: '#e5e7eb', border: '1px solid #1A4DFF', borderRadius: 8, padding: '6px 10px' }}
                >
                  {selectedDay ? `${String(selectedDay.getDate()).padStart(2,'0')}/${String(selectedDay.getMonth()+1).padStart(2,'0')}/${selectedDay.getFullYear()}` : 'Selecciona día'}
                </button>
                {dayPickerOpen && (
                  <div ref={popoverRef} style={{ position: 'absolute', zIndex: 9999, marginTop: 6, background: '#222', border: '1px solid #1A4DFF', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', padding: 8 }}>
                    {/* Calendario propio (mes/año del header) */}
                    {(() => {
                      const y = month.getFullYear();
                      const m = month.getMonth();
                      const daysInMonth = new Date(y, m + 1, 0).getDate();
                      const first = new Date(y, m, 1);
                      const mondayIndex = (first.getDay() + 6) % 7; // 0=lunes
                      const labels = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
                      const statusColor: Record<string, string> = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444', gray: '#6b7280' };
                      const toKey = (d: number) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                      const title = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(month);
                      const blanks = Array.from({ length: mondayIndex });
                      const nums = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                      return (
                        <div>
                          <div style={{ textAlign: 'center', color: '#e5e7eb', marginBottom: 8 }}>{title}</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 32px)', gap: 4, justifyItems: 'center', alignItems: 'center', color: '#8db0ff', fontSize: 12, marginBottom: 4 }}>
                            {labels.map(l => <div key={l}>{l}</div>)}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 36px)', gap: 6, justifyItems: 'center', alignItems: 'center' }}>
                            {blanks.map((_, i) => <div key={`b-${i}`} style={{ width: 32, height: 28 }} />)}
                            {nums.map(dn => {
                              const kpi = days[toKey(dn)];
                              const status = evaluateDayStatus(kpi as any);
                              const dot = statusColor[status];
                              const isSelected = selectedDay && selectedDay.getFullYear()===y && selectedDay.getMonth()===m && selectedDay.getDate()===dn;
                              const dateObj = new Date(y, m, dn);
                              const isFuture = dateObj > today; // hoy según America/Bogota
                              const isDisabled = isFuture || !kpi;
                              return (
                                <button
                                  key={dn}
                                  onClick={() => { if (isDisabled) return; const d = new Date(y, m, dn); setSelectedDay(d); setDayPickerOpen(false); console.log('[HistorialKPI] day selected', { date: toKey(dn) }); }}
                                  disabled={isDisabled}
                                  style={{ width: 36, height: 36, borderRadius: 8, border: isSelected ? '1px solid #1A4DFF' : '1px solid transparent', background: '#111', color: '#e5e7eb', cursor: isDisabled ? 'not-allowed' : 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', filter: isDisabled ? 'grayscale(1)' : undefined, opacity: isDisabled ? 0.6 : 1 }}
                                  title={kpi ? `TMO ${formatTmo(kpi.tmoSec || 0)} · %Trans ${(kpi.transfersPct || 0).toFixed(1)}% · NPS ${(kpi.npsPct || 0).toFixed(1)}%` : `Sin datos`}
                                  aria-disabled={isDisabled}
                                >
                                  {dn}
                                  <span aria-hidden style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, borderRadius: 999, background: dot }} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
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
                      <div className="kpi-loading">
                        {loading ? 'Cargando día…' : (selectedDay ? 'No hay registros para esta fecha.' : 'Selecciona un día para ver tus KPIs')}
                      </div>
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


