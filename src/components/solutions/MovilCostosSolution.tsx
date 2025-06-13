import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const MovilCostosSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: <ScriptSection />
    },
    {
      id: 2,
      icon: '✨',
      title: 'Beneficios Adicionales',
      content: <BenefitsSection benefits={[]} />
    },
    {
      id: 3,
      icon: '💰',
      title: 'Tarifas Especiales',
      content: <RatesSection title="Planes con Descuento" rates={[]} />
    },
    {
      id: 4,
      icon: '❓',
      title: 'Preguntas Frecuentes',
      content: <FAQSection faqs={[]} />
    }
  ];

  return (
    <BaseSolution
      title="Solución para Costos Móvil"
      icon="📱"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente acepta la solución"
      rejectButtonText="Cliente no acepta la solución"
    />
  );
};

export default MovilCostosSolution;
