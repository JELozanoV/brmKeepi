import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection, BenefitsSection } from './sections';

interface Props {
  onApplySolution: () => void;
}

const HogarServicioClientePromesasIncumplidasSolution: React.FC<Props> = ({ onApplySolution }) => {
  const scriptLines: { text: string; type: 'empathy' | 'action' | 'solution' | 'closing' }[] = [
    {
      text:
        'Lamento que lo prometido en contactos anteriores no se haya cumplido. Entiendo tu frustración y voy a ayudarte ahora mismo.',
      type: 'empathy',
    },
    {
      text: 'Voy a verificar el compromiso registrado y ejecutar la gestión correcta para que quede resuelto en esta llamada.',
      type: 'action',
    },
    {
      text: 'Te propongo la alternativa más ágil y te explico cada paso para cumplir con lo acordado.',
      type: 'solution',
    },
    {
      text:
        'Al cierre, dejaré la marcación correspondiente en RR con el detalle del cumplimiento y próximos pasos si aplica. ¿Continuamos?',
      type: 'closing',
    },
  ];

  // Sin botones auxiliares ni modales mientras no sean necesarios


  const sections = [
    {
      id: 1,
      icon: '🤝',
      title: 'Guión de Retención — Promesas incumplidas',
      content: (
        <div>
          <ScriptSection title="Guión recomendado" lines={scriptLines} />
        </div>
      )
    },
    {
      id: 2,
      icon: '📋',
      title: 'Acciones del Asesor',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '🔎',
              title: 'Validar compromisos previos y fechas',
              features: []
            },
            {
              icon: '⚙️',
              title: 'Ejecutar/encaminar cumplimiento inmediato',
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
              answer: 'Usa siempre “marcación”, nunca “ticket”. Incluye la promesa cumplida/pendiente y plazos.'
            },
            {
              question: '¿Qué hago si no puedo cumplirlo en línea?',
              answer: 'Informa el plan de acción, tiempos claros y programa devolución (24h) dejando la marcación.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución — Promesas incumplidas"
      icon="🤝"
      sections={sections}
      onSolutionApplied={onApplySolution}
      acceptButtonText="Cliente acepta continuar la gestión"
      rejectButtonText="Proceder con otra alternativa"
    />
  );
};

export default HogarServicioClientePromesasIncumplidasSolution;
