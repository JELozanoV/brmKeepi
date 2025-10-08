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
 * @constant API_BASE_URL
 * @description URL base de la API backend
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * @constant API_ENDPOINTS
 * @description Endpoints de la API (para futura implementación)
 */
export const API_ENDPOINTS = {
  SCRIPTS: '/api/scripts',
  RATES: '/api/rates',
  INVOICE_ANALYSIS: '/api/analizar-factura',
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

// Umbrales absolutos para advertencia (punto amarillo) en calendario
export const CALENDAR_WARN_ABSOLUTE = {
  tmoSeconds: 30,       // dentro de 30 segundos de la meta
  transfersPoints: 2,   // a ≤ 2 puntos del máximo
  npsPoints: 5,         // a ≤ 5 puntos del mínimo
} as const;

// Zona horaria fija para cálculos/agregaciones
export const TIMEZONE = 'America/Bogota';

/** Volúmenes esperados por timeframe (para cálculos Nivel 2 en KpiCoach) */
export const EXPECTED_CALLS: Record<'today'|'week'|'month', number> = {
  today: 40,        // 40 llamadas por día laboral
  week: 240,        // 40 llamadas * 6 días laborales por semana
  month: 1032,      // 40 llamadas * 6 días * 4.3 semanas promedio por mes
};

/** Encuestas NPS esperadas por timeframe (10 encuestas por día laboral) */
export const EXPECTED_SURVEYS: Record<'today'|'week'|'month', number> = {
  today: 10,        // 10 encuestas por día laboral
  week: 60,         // 10 encuestas * 6 días laborales por semana
  month: 258,       // 10 encuestas * 6 días * 4.3 semanas promedio por mes
};

// Usuario actual (mock)
export const CURRENT_USER = {
  id: 'me-1',
  displayName: 'Pepito Pérez',
  coordinatorId: 'c-1',
};