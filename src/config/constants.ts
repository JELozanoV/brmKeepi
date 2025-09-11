/**
 * @constant SOLUTION_TYPES
 * @description Tipos de soluciones disponibles en la aplicación
 */
export const SOLUTION_TYPES = {
  HOGAR_COSTOS: 'hogar_costos',
  INTERNET_LENTO: 'internet_lento',
  // ... más tipos
} as const;

/**
 * @constant API_ENDPOINTS
 * @description Endpoints de la API (para futura implementación)
 */
export const API_ENDPOINTS = {
  SCRIPTS: '/api/scripts',
  RATES: '/api/rates',
  // ... más endpoints
} as const; 

/**
 * Umbral de advertencia para semáforo de metas.
 * 0.05 = 5%. Ajustable sin tocar componentes.
 */
export const GOALS_WARN_THRESHOLD = 0.05;

/** Metas para KPIs principales (Mi Perfil) */
export const KPI_TARGETS = {
  tmoSec: 420,          // ≤ 07:00
  transfersPct: 40,     // ≤ 40%
  npsPct: 60,           // ≥ 60%
} as const;

/** Volúmenes esperados por timeframe (para cálculos Nivel 2 en KpiCoach) */
export const EXPECTED_CALLS: Record<'today'|'week'|'month', number> = {
  today: 40,
  week: 200,
  month: 800,
};