import React, { useState, useEffect } from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection } from './sections';
import ActionsSection from './sections/ActionsSection';
import { ScriptLine } from './sections/ScriptSection';
import { activationScripts, activationActions, activationFaqs } from '../../data/solutions/activationDelay';

interface Props {
  onApplySolution: () => void;
}

const HogarActivacionDemoradaSolution: React.FC<Props> = ({ onApplySolution }) => {
  const [selectedScript, setSelectedScript] = useState<ScriptLine[]>([]);
  
  // Select a random script when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * activationScripts.length);
    setSelectedScript(activationScripts[randomIndex]);
  }, []);

  const sections = [
    {
      id: 1,
      icon: '💬',
      title: 'Guiones del asesor',
      content: <ScriptSection 
        title="Guión de atención"
        lines={selectedScript}
      />
    },
    {
      id: 2,
      icon: '✅',
      title: 'Acciones',
      content: (
        <ActionsSection 
          actions={activationActions}
          onCompleteChange={() => {}}
        />
      )
    },
    {
      id: 3,
      icon: '❓',
      title: 'Preguntas frecuentes',
      content: <FAQSection faqs={activationFaqs.map(faq => ({
        question: faq.q,
        answer: faq.a
      }))} />
    }
  ];

  return (
    <BaseSolution
      title="Solución para Demora en la Activación"
      icon="⏳"
      sections={sections}
      onSolutionApplied={onApplySolution}
      acceptButtonText="Aceptar solución"
      rejectButtonText="Rechazar solución"
    />
  );
};

export default HogarActivacionDemoradaSolution;
