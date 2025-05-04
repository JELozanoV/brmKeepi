import { FAQ } from '../types';

export const faqs = {
  hogarCostos: [
    {
      question: '¿Qué beneficios incluye mi plan actual?',
      answer: 'Su plan incluye servicios premium como Claro Video, Paramount+, y Claro Drive, que en conjunto tienen un valor comercial superior a $30.000 mensuales.'
    },
    {
      question: '¿Puedo ajustar mi plan según mi presupuesto?',
      answer: 'Sí, contamos con diferentes opciones de planes que podemos adaptar a sus necesidades y presupuesto, manteniendo beneficios exclusivos.'
    }
  ],

  internetLento: [
    {
      question: '¿Qué factores pueden afectar la velocidad?',
      answer: 'La velocidad puede verse afectada por la cantidad de dispositivos conectados, la ubicación del router, interferencias físicas o la distancia al router.'
    },
    {
      question: '¿Cuándo se requiere una visita técnica?',
      answer: 'Se programa una visita técnica cuando las optimizaciones remotas no resuelven el problema o se detecta que es necesario realizar ajustes físicos en la instalación.'
    }
  ]
} as const; 