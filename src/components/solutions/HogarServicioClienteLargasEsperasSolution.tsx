import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection, BenefitsSection } from './sections';

interface Props {
  onApplySolution: () => void;
}

const HogarServicioClienteLargasEsperasSolution: React.FC<Props> = ({ onApplySolution }) => {
  // Script base
  const scriptLines: { text: string; type: 'empathy' | 'action' | 'solution' | 'closing' }[] = [
    {
      text:
        'Lamento sinceramente el tiempo de espera que tuviste. Tu tiempo es valioso y estoy aquí para ayudarte de inmediato.',
      type: 'empathy',
    },
    {
      text: 'Permíteme priorizar tu caso ahora mismo y resolver la razón de tu contacto sin más demoras.',
      type: 'action',
    },
    {
      text:
        'Si te parece, avanzamos con la solución propuesta o te presento alternativas claras para cerrar el requerimiento en esta llamada.',
      type: 'solution',
    },
    {
      text:
        'Te acompañaré hasta dejar la marcación correspondiente y un resumen claro de lo acordado. ¿Continuamos?',
      type: 'closing',
    },
  ];

  // Sin botones auxiliares ni modales mientras no sean necesarios

  const sections = [
    {
      id: 1,
      icon: '🕰️',
      title: 'Guión de Retención — Largas esperas',
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
              icon: '⚡',
              title: 'Priorizar gestión en primer contacto',
              features: []
            },
            {
              icon: '🔄',
              title: 'Mantener informado al cliente del avance',
              features: []
            },
            {
              icon: '📝',
              title: 'Dejar marcación clara y completa en RR',
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
              question: '¿Debo transferir la llamada?',
              answer: 'Evita transferencias innecesarias. Prioriza solución en primer contacto.'
            },
            {
              question: '¿Qué término usar en el resumen?',
              answer: 'Usa siempre “marcación”, nunca “ticket”.'
            },
            {
              question: '¿Qué hacer si el cliente prefiere ser contactado más tarde?',
              answer: 'Ofrece programar devolución en 24h y dejar la marcación correspondiente en RR.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución — Largas esperas"
      icon="⏳"
      sections={sections}
      onSolutionApplied={onApplySolution}
      acceptButtonText="Cliente acepta continuar la gestión"
      rejectButtonText="Proceder con otra alternativa"
    />
  );
};

export default HogarServicioClienteLargasEsperasSolution;
