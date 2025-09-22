import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { evaluateDayStatus } from '../../services/kpisHistoryService';
import { formatTmo } from '../../utils/metrics';

interface KpiCalendarProps {
  month: Date;
  selected: Date | { from: Date; to?: Date } | undefined;
  onMonthChange: (month: Date) => void;
  onSelect: (value: any) => void;
  daysMap: Record<string, { tmoSec?: number; transfersPct?: number; npsPct?: number } | undefined>;
  mode?: 'single' | 'range';
  onDaySelected?: (date: Date) => void;
  /** Oculta navegación (flechas) del caption. El mes lo controla el padre. */
  disableNav?: boolean;
  /** Deshabilita días según función. Útil para permitir solo días con datos. */
  disabledIf?: (date: Date) => boolean;
  /** Si true, no envuelve en el contenedor azul (para usar en popover). */
  bare?: boolean;
}

const statusColor: Record<string, string> = {
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  gray: '#6b7280',
};

export const KpiCalendar: React.FC<KpiCalendarProps> = ({ month, selected, onMonthChange, onSelect, daysMap, mode = 'range', onDaySelected, disableNav, disabledIf, bare }) => {
  const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    bare ? <>{children}</> : <div style={{ background: '#222', border: '1px solid #1A4DFF', borderRadius: 12, padding: 12 }}>{children}</div>
  );
  return (
    <Container>
      <DayPicker
        mode={mode as any}
        month={month}
        onMonthChange={onMonthChange}
        selected={selected as any}
        onSelect={(val: any) => {
          if (mode === 'single') {
            if (val && val instanceof Date) {
              onDaySelected && onDaySelected(val);
            }
          } else {
            onSelect(val);
          }
        }}
        disabled={(date: Date) => {
          const isFuture = date > new Date();
          const disabledByFn = disabledIf ? disabledIf(date) : false;
          return isFuture || disabledByFn;
        }}
        styles={{
          caption: { color: '#fff' },
          head: { color: '#8db0ff' },
          day: { color: '#e5e7eb' },
          day_selected: { backgroundColor: '#1A4DFF', color: '#fff' },
          day_today: { outline: '1px solid #1A4DFF' },
          chevron: { fill: '#8db0ff' },
        }}
        footer={
          <div style={{ height: 0 }} />
        }
        modifiersStyles={{}}
        components={{
          Caption: disableNav
            ? (props: any) => {
                const label = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(props.displayMonth || month);
                return <div style={{ textAlign: 'center', color: '#e5e7eb', marginBottom: 8 }}>{label}</div>;
              }
            : undefined,
          Day: (props: any) => {
            const { date } = props || {};
            if (!date) return null as any;
            const currentMonth = (props && props.displayMonth) ? props.displayMonth : month;
            const isOutside = currentMonth ? date.getMonth() !== currentMonth.getMonth() : false;
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const kpi = daysMap[key];
            const status = evaluateDayStatus(kpi as any);
            const color = statusColor[status];
            const summary = kpi ? `TMO ${formatTmo(kpi.tmoSec || 0)} · Trans ${((kpi.transfersPct ?? 0)).toFixed(1)}% · NPS ${((kpi.npsPct ?? 0)).toFixed(1)}% · Estado: ${status === 'green' ? 'En meta' : status === 'yellow' ? 'En meta, pero muy cerca del límite' : status === 'red' ? 'Necesita atención' : 'Sin datos'}` : 'Sin datos';
            const readableDate = `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
            const aria = `${readableDate}. ${summary.replace(' · ', ', ').replace(' · ', ', ').replace(' · ', ', ')}`;
            const btnProps = props.buttonProps || {};
            btnProps.title = `${readableDate} · ${summary}`;
            btnProps['aria-label'] = aria;
            const btnClass = btnProps.className || '';
            return (
              <div style={{ position: 'relative' }}>
                {btnProps ? (
                  <button {...btnProps} className={btnClass}>
                    <div style={{ opacity: isOutside ? 0.35 : 1 }}>{date.getDate()}</div>
                  </button>
                ) : (
                  <div className={btnClass}>
                    <div style={{ opacity: isOutside ? 0.35 : 1 }}>{date.getDate()}</div>
                  </div>
                )}
                <div aria-hidden style={{ position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: 999, background: color }} />
              </div>
            );
          }
        }}
      />
    </Container>
  );
};

export default KpiCalendar;


