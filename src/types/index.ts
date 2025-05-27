export type ServiceType = 'hogar' | 'movil' | null;
export type PlanType = 'prepago' | 'pospago' | null;

// Nuevo tipo para problemas de servicio al cliente
export type CustomerServiceType = 
  | 'asesor-inapropiado'
  | 'llamada-colgada'
  | 'largas-esperas'
  | 'sin-solucion'
  | 'promesas-incumplidas'
  | null;

// Nuevo tipo para viajes
export type TravelType = 
  | 'trabajo'
  | 'vacaciones'
  | 'mudanza'
  | null;

// Nuevo tipo para fallas
export type FailureType = 
  | 'llamadas'
  | 'datos'
  | 'sms'
  | 'llamadas-datos'
  | null;

export type CostReason = 
  | 'falta-trabajo'
  | 'plan-alto'
  | 'mejor-oferta'
  | null;

export type CancellationReason = 
  | 'costo'
  | 'fallas'
  | 'viaje'
  | 'servicio-cliente'
  | 'demora-activacion'
  | 'cliente-reincidente'
  | 'competencia'
  | null;

export interface SolutionData {
  title: string;
  tips: string[];
  benefits: string[];
  phrases: string[];
}

export type CompetitorType = 
  | 'movistar'
  | 'tigo'
  | 'etb'
  | null;

export type HomeFailureType = 
  | 'internet-lento'
  | 'fallas-intermitentes'
  | 'cortes-frecuentes'
  | 'wifi-inestable'
  | 'fallas-navegador'
  | null;

export type ActivationDelayType = 
  | 'expectativas-no-cumplidas'
  | 'necesidad-urgente'
  | 'compromisos-personales'
  | null;

export type ReincidentClientType = 
  | 'problemas-recurrentes'
  | 'asesor-inapropiado'
  | 'competencia-atractiva'
  | 'dificultades-cancelacion'
  | 'falta-transparencia'
  | 'llamada-colgada'
  | null; 

// Nuevo tipo para el estado de ánimo del cliente
export type ClientMoodType = 
  | 'feliz'
  | 'neutral'
  | 'molesto'
  | 'triste'
  | 'satisfecho'
  | null;