/**
 * Tipos para Información Operativa del perfil
 */

export type Comparator = '≤' | '≥';

export type KpiKey = 'tmo' | 'transfers' | 'retention' | 'nps';

export interface KpiGoal {
  key: KpiKey;
  label: string;
  /**
   * Valor normalizado del KPI
   * - tmo: segundos
   * - transfers, retention, nps: porcentaje entero
   */
  value: number;
  /** Valor formateado para UI, por ejemplo "06:40" o "58%" o "92% / 4.6" */
  displayValue: string;
  target: {
    comparator: Comparator;
    /**
     * Valor objetivo en la misma unidad que value
     * - tmo: segundos (por ejemplo 480 para 08:00)
     * - transfers, retention, nps: porcentaje entero
     */
    value: number;
    /** Objetivo formateado para UI, por ejemplo "≤ 08:00" */
    display: string;
  };
}

export interface DailyPoint {
  date: string; // ISO e.g. YYYY-MM-DD
  value: number;
  display?: string;
}

export interface TrendSeries {
  key: KpiKey;
  label: string;
  points: DailyPoint[];
}

export interface Benchmark {
  position: number;
  total: number;
  percentile: number; // 0-100
  teamAvg: { tmoSec: number; retentionPct: number; npsPct: number };
  deltas: { tmoSec: number; retentionPct: number; npsPct: number };
}

export type AlertSeverity = 'high' | 'medium' | 'low';

export interface Alert {
  severity: AlertSeverity;
  text: string;
}

export type OperationalTimeframe = 'today' | 'week' | 'month';

export interface OperationalProfile {
  timeframe: OperationalTimeframe;
  goals: KpiGoal[];
  trends: TrendSeries[];
  benchmark: Benchmark;
  alerts: Alert[];
}


