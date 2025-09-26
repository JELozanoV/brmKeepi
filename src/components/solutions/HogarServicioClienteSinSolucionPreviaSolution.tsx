import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection, BenefitsSection } from './sections';

interface Props {
  onApplySolution: () => void;
}

const HogarServicioClienteSinSolucionPreviaSolution: React.FC<Props> = ({ onApplySolution }) => {
  // Script base para este escenario
  const scriptLines: { text: string; type: 'empathy' | 'action' | 'solution' | 'closing' }[] = [
    {
      text:
        'Lamento que no hayas recibido una solución en tus contactos anteriores. Entiendo tu molestia y estoy para resolverlo ahora mismo.',
      type: 'empathy'
    },
    {
      text: 'Voy a priorizar tu caso y encaminar la gestión correcta en esta llamada para dejarlo resuelto.',
      type: 'action'
    },
    {
      text: 'Te explico la alternativa más ágil y te acompaño paso a paso para cerrar el requerimiento.',
      type: 'solution'
    },
    {
      text:
        'Al finalizar, dejaré la marcación correspondiente y un resumen claro de lo acordado. ¿Continuamos?',
      type: 'closing'
    }
  ];


  // Sin botones auxiliares ni modales mientras no sean necesarios

  const sections = [
    {
      id: 1,
      icon: '❌',
      title: 'Guión de Retención — Sin solución previa',
      content: (
        <div>
          <ScriptSection title="Guión recomendado" lines={scriptLines} />
        </div>
      )
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Acciones del Asesor',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '⚡',
              title: 'Resolver en primer contacto',
              features: []
            },
            {
              icon: '🧭',
              title: 'Escalar correctamente si procede',
              features: []
            },
            {
              icon: '📝',
              title: 'Dejar marcación clara en RR',
              features: []
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '❓',
      title: 'Preguntas Frecuentes',
      content: (
        <FAQSection
          faqs={[
            {
              question: '¿Qué registro debo dejar?',
              answer: 'Usa siempre “marcación”, nunca “ticket”. Incluye detalle breve de lo acordado.'
            },
            {
              question: '¿Cuándo escalo?',
              answer: 'Si no es posible resolver en primer contacto, informa tiempos y programa devolución (24h) con marcación.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución — Sin solución previa"
      icon="❌"
      sections={sections}
      onSolutionApplied={onApplySolution}
      acceptButtonText="Cliente acepta continuar la gestión"
      rejectButtonText="Proceder con otra alternativa"
    />
  );
};

export default HogarServicioClienteSinSolucionPreviaSolution;
