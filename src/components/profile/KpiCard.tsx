import React, { useMemo } from 'react';
import { GOALS_WARN_THRESHOLD } from '../../config/constants';

export interface KpiCardProps {
  label: string;           // "TMO", "% Transferencias", "% Retención", "QA / CSAT"
  value: string;           // "06:45", "22%", "38%", "91% / 4.6"
  hint?: string;           // "Meta ≤ 08:00", etc.
  status?: 'good' | 'warn' | 'bad';
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

const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, status, comparator, numericValue, targetValue, warnThresholdPct, warnAbsoluteDelta }) => {
  const computedStatus: 'good' | 'warn' | 'bad' | undefined = useMemo(() => {
    if (!comparator || typeof numericValue !== 'number' || typeof targetValue !== 'number') return status;
    const thr = typeof warnThresholdPct === 'number' ? warnThresholdPct : GOALS_WARN_THRESHOLD;
    if (targetValue === 0) {
      if (comparator === '≤') return numericValue <= 0 ? 'good' : 'bad';
      return numericValue >= 0 ? 'good' : 'bad';
    }
    if (comparator === '≤') {
      if (typeof warnAbsoluteDelta === 'number') {
        const greenMaxAbs = targetValue - warnAbsoluteDelta;
        if (numericValue <= greenMaxAbs) return 'good';
        if (numericValue <= targetValue) return 'warn';
        return 'bad';
      }
      const greenMax = targetValue * (1 - thr);
      if (numericValue <= greenMax) return 'good';
      if (numericValue <= targetValue) return 'warn';
      return 'bad';
    }
    if (typeof warnAbsoluteDelta === 'number') {
      const greenMinAbs = targetValue + warnAbsoluteDelta;
      if (numericValue >= greenMinAbs) return 'good';
      if (numericValue >= targetValue) return 'warn';
      return 'bad';
    }
    const greenMin = targetValue * (1 + thr);
    if (numericValue >= greenMin) return 'good';
    if (numericValue >= targetValue) return 'warn';
    return 'bad';
  }, [comparator, numericValue, targetValue, warnThresholdPct, status]);

  return (
    <div className={`kpi-card ${computedStatus ? `kpi-${computedStatus}` : ''}`} role="status" aria-label={`${label}: ${value}`}>
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
      {hint && <div className="kpi-card__hint">{hint}</div>}
    </div>
  );
};

export default KpiCard;
