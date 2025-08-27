export interface ScriptStep {
  type: 'empatia' | 'accion' | 'oferta' | 'cierre';
  text: string;
}

export const GUION_A: ScriptStep[] = [
  {
    type: 'empatia',
    text: 'Lamento sinceramente lo ocurrido; entiendo lo incómodo que es que una llamada se corte. Gracias por darme la oportunidad de apoyarte ahora mismo.'
  },
  {
    type: 'accion',
    text: 'Voy a revisar tu caso en el sistema y me quedo contigo en línea para darte solución sin más interrupciones.'
  },
  {
    type: 'oferta',
    text: 'Si tu motivo era revisar costos/beneficios, puedo validar las opciones disponibles que mantengan o mejoren tu servicio. Además, te explico cómo aprovechar beneficios como Claro Video, Música o Claro Club para que el valor percibido sea mayor.'
  },
  {
    type: 'cierre',
    text: 'Déjame dejar la marcación correspondiente y un resumen claro de lo acordado. Si prefieres, agendo una devolución en menos de 24 horas para confirmarte los pasos finales.'
  }
];

export const GUION_B: ScriptStep[] = [
  {
    type: 'empatia',
    text: 'Siento lo sucedido con la llamada anterior; aquí me hago cargo para que te sientas bien atendido.'
  },
  {
    type: 'accion',
    text: 'Permíteme validar ahora mismo tu cuenta en RR y continuar desde donde quedaste.'
  },
  {
    type: 'oferta',
    text: 'Veo alternativas que, con un pequeño ajuste, mejoran velocidad/canales y suman beneficios VAS para que el valor mensual tenga más retorno.'
  },
  {
    type: 'cierre',
    text: 'Registraré la marcación y, si lo deseas, puedo dejar un compromiso de devolución 24h para confirmar que todo quede al día.'
  }
];

export const GUION_C: ScriptStep[] = [
  {
    type: 'empatia',
    text: 'Gracias por contarlo; entiendo la molestia. Me encargaré de darte un cierre adecuado hoy.'
  },
  {
    type: 'accion',
    text: 'Revisaré lo que quedó pendiente y priorizaré tu gestión.'
  },
  {
    type: 'oferta',
    text: 'Puedo explicarte alternativas disponibles que no reduzcan tu plan por debajo del valor actual y optimicen tu experiencia.'
  },
  {
    type: 'cierre',
    text: 'Dejaré la marcación correspondiente y, si lo prefieres, te agendo devolución 24h para validar resultados.'
  }
];

// Export all scripts in an array for random selection
export const ALL_SCRIPTS = [GUION_A, GUION_B, GUION_C];

// Helper function to get a random script
export const getRandomScript = (): ScriptStep[] => {
  const randomIndex = Math.floor(Math.random() * ALL_SCRIPTS.length);
  return ALL_SCRIPTS[randomIndex];
};
