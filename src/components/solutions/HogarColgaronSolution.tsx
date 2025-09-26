import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection } from './sections';

interface Props {
  onApplySolution: () => void;
}

const HogarColgaronSolution: React.FC<Props> = ({ onApplySolution }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión de Retención — Llamada colgada',
      content: (
        <ScriptSection
          title="Guión de Retención — Llamada colgada"
          lines={[
            { text: 'Lamento que la llamada anterior se haya cortado. Gracias por contactarnos nuevamente; retomemos desde donde te quedaste.', type: 'empathy' },
            { text: 'Voy a priorizar tu caso ahora mismo para resolverlo en este contacto, sin más demoras.', type: 'action' },
            { text: 'Te propongo la alternativa más ágil según lo que me indicas y te acompaño paso a paso.', type: 'solution' },
            { text: 'Al cierre, dejaré la marcación correspondiente y un resumen claro de lo acordado. ¿Continuamos?', type: 'closing' }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '📋',
      title: 'Acciones del Asesor',
      content: (
        <BenefitsSection
          benefits={[
            { icon: '💬', title: 'Retomar con empatía y confirmar el motivo principal', features: [] },
            { icon: '⚡', title: 'Priorizar solución en primer contacto', features: [] },
            { icon: '🔄', title: 'Mantener informado al cliente del avance', features: [] },
            { icon: '📝', title: 'Registrar la marcación correspondiente en RR', features: [] }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '💬',
      title: 'Frases Rápidas',
      content: (
        <ScriptSection
          title=""
          lines={[
            { text: 'Gracias por tu paciencia; retomemos la gestión de inmediato.', type: 'solution' },
            { text: 'Te propongo resolverlo ahora y mantenerte informado en todo momento.', type: 'solution' },
            { text: 'Déjame validar tu cuenta y ofrecerte la alternativa más rápida.', type: 'solution' },
            { text: 'Quiero asegurar que esta vez quede completamente resuelto.', type: 'closing' }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución — Llamada colgada"
      icon="📞"
      sections={sections}
      onSolutionApplied={onApplySolution}
      acceptButtonText="Retomar gestión ahora"
      rejectButtonText="Proceder con otra alternativa"
    />
  );
};

export default HogarColgaronSolution;
