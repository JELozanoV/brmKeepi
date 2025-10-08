import { Script } from '../types';

export const scripts = {
  hogarCostos: {
    title: "Guión de Retención",
    lines: [
      {
        text: "Entiendo su preocupación por el costo del servicio. Permítame mostrarle cómo podemos maximizar el valor de su plan actual.",
        type: "empathy"
      },
      {
        text: "¿Me permite conocer cuál es su presupuesto ideal para el servicio?",
        type: "diagnostic"
      },
      {
        text: "Podemos enriquecer su experiencia actual con beneficios adicionales incluidos en su plan.",
        type: "solution"
      }
    ]
  },
  
  internetLento: {
    title: "Guión de Diagnóstico",
    lines: [
      {
        text: "Entiendo su situación con la velocidad del internet. Me imagino lo frustrante que debe ser esta situación para usted.",
        type: "empathy"
      },
      {
        text: "Permítame realizar una revisión completa de su servicio para identificar qué está afectando la velocidad de su internet.",
        type: "action"
      },
      {
        text: "Realizaré algunas pruebas de diagnóstico y, si es necesario, podemos programar una visita técnica para garantizar el óptimo funcionamiento de su servicio.",
        type: "solution"
      }
    ]
  },

  fallasIntermitentes: {
    title: "Guión de Diagnóstico",
    lines: [
      {
        text: "Comprendo su frustración con las interrupciones del servicio. Es una situación que necesitamos resolver lo antes posible.",
        type: "empathy"
      },
      {
        text: "Voy a realizar un diagnóstico completo de su servicio para identificar qué está causando estas interrupciones.",
        type: "action"
      },
      {
        text: "Mientras realizo las verificaciones necesarias, ¿podría indicarme en qué momentos del día suelen ocurrir estas fallas con más frecuencia?",
        type: "diagnostic"
      },
      {
        text: "Basado en el diagnóstico, determinaremos si podemos resolver la situación de manera remota o si es necesario programar una visita técnica.",
        type: "solution"
      }
    ]
  }
} as const; 