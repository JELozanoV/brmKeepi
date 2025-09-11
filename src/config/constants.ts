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