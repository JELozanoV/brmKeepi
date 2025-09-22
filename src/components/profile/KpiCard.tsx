import React, { useMemo } from 'react';
import { GOALS_WARN_THRESHOLD } from '../../config/constants';
import { computeKpiStatus } from '../../utils/kpiStatus';
import { KpiViewModel } from '../../utils/kpiSelector';

export interface KpiCardProps {
  label: string;           // "TMO", "% Transferencias", "% Retención", "QA / CSAT"
  value: string;           // "06:45", "22%", "38%", "91% / 4.6"
  hint?: string;           // "Meta ≤ 08:00", etc.
  status?: 'good' | 'warn' | 'bad';
  /** Ocultar etiqueta/chip de estado visual encima del card. Por defecto true (se muestra). */
  showChip?: boolean;
  /** View-model unificado (preferido). Si se provee, no se recalcula estado en el componente. */
  vm?: KpiViewModel;
  /** Comparador de la meta: ≤ o ≥. Si se define junto a targetValue y numericValue, se ignora 'status' y se calcula internamente. */
  comparator?: '≤' | '≥';
  /** Valor numérico del KPI para la evaluación (segundos para TMO, porcentaje entero para %). */
  numericValue?: number;
  /** Valor objetivo (en mismas unidades que numericValue). */
  targetValue?: number;
  /** Umbral de advertencia (por defecto 5%): ventana cercana a meta que pinta amarillo. */
  warnThresholdPct?: number;
  /** Umbral absoluto para advertencia (en mismas unidades). Útil para %: 5 => 5 puntos. */
  warnAbsoluteDelta?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, status, vm, comparator, numericValue, targetValue, warnThresholdPct, warnAbsoluteDelta, showChip = true }) => {
  const statusData = vm ? undefined : useMemo(() => {
    if (!comparator || typeof numericValue !== 'number' || typeof targetValue !== 'number') return undefined;
    const key = label.toLowerCase().includes('tmo') ? 'tmo' : label.toLowerCase().includes('nps') ? 'nps' : 'transfers';
    const current = key === 'tmo' ? numericValue : Number(numericValue);
    const target = Number(targetValue);
    return computeKpiStatus(key as any, current, target);
  }, [comparator, numericValue, targetValue, label]);

  const unifiedStatus = vm?.status || (statusData?.status === 'good' ? 'ok' : statusData?.status) || (status === 'good' ? 'ok' : (status as any));
  const statusClass = unifiedStatus === 'ok' ? 'good' : unifiedStatus;
  const chipText = vm?.chipText || (statusData ? statusData.chipText : (status === 'bad' ? 'Necesita atención' : status === 'warn' ? 'En meta, pero muy cerca del límite' : 'En meta'));
  const aria = vm?.ariaLabel;

  return (
    <div className={`kpi-card ${statusClass ? `kpi-${statusClass}` : ''}`} role="status" aria-label={aria || `${label}: ${value}`}>
      {showChip && (vm || statusData) && <span className={`kpi-chip kpi-chip-${statusClass}`}>{chipText}</span>}
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
      {hint && <div className="kpi-card__hint">{hint}</div>}
      {vm && (
        <div style={{ display: 'none' }} data-debug={`${vm.status}|${vm.difference}|${vm.direction}`}></div>
      )}
    </div>
  );
};

export default KpiCard;
