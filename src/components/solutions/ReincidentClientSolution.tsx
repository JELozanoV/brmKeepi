import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const ReincidentClientSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '🔁',
      title: 'Guión para Cliente Reincidente',
      content: (
        <ScriptSection
          title="Guión para Cliente Reincidente"
          lines={[
            { text: 'Entiendo que has enfrentado problemas recurrentes y eso ha afectado tu experiencia.', type: 'empathy' },
            { text: 'Hemos reforzado nuestros procesos de atención y seguimiento para garantizar soluciones definitivas.', type: 'solution' },
            { text: '¿Te gustaría conocer las mejoras que hemos implementado para brindarte un mejor servicio?', type: 'closing' }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '✅',
      title: 'Acciones Recomendadas',
      content: (
        <BenefitsSection
          benefits={[
            { icon: '🤝', title: 'Asignación de un asesor dedicado', features: [] },
            { icon: '⏱️', title: 'Seguimiento proactivo en 24 horas', features: [] },
            { icon: '📄', title: 'Reportes de servicio personalizados', features: [] }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución Cliente Reincidente"
      icon="🔄"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente convencido de quedarse"
      rejectButtonText="Proceder con cancelación"
    />
  );
};

export default ReincidentClientSolution;
