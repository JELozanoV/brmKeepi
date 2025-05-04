import { Solution } from '../types';

export const SOLUTIONS: Record<string, Solution> = {
  'cancelacion-falla': {
    title: 'Solución para problemas técnicos',
    steps: [
      'Verificar el estado actual del servicio',
      'Realizar diagnóstico remoto',
      'Ofrecer visita técnica sin costo',
      'Programar mantenimiento preventivo',
      'Actualizar equipos si es necesario'
    ]
  },
  'cancelacion-precio': {
    title: 'Beneficios incluidos en su servicio (VAS)',
    benefits: [
      'Claro Video - Acceso a películas y series exclusivas',
      'Claro Música - Millones de canciones sin límite',
      'Claro Drive - 25GB de almacenamiento en la nube',
      'Descuentos exclusivos en equipos',
      'Programa de puntos Claro'
    ],
    steps: [
      'Revisar el plan actual',
      'Mostrar el valor de los servicios incluidos',
      'Ofrecer promociones vigentes',
      'Explicar beneficios del programa de fidelización'
    ]
  }
}; 