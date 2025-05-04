import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarServicioClienteAsesorInapropiadoSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión de Retención — Asesor inapropiado',
      content: (
        <ScriptSection
          title="Guión de Retención — Asesor inapropiado"
          lines={[
            {
              text: "Lamento sinceramente que hayas tenido una mala experiencia en tu contacto anterior. De parte de Claro, te pido disculpas, ya que nuestro objetivo es siempre brindarte el mejor servicio posible.",
              type: "empathy"
            },
            {
              text: "Permíteme acompañarte ahora para ayudarte como mereces. Estoy aquí para escucharte y resolver la razón de tu llamada de la mejor manera posible.",
              type: "solution"
            },
            {
              text: "¿Podrías contarme nuevamente cuál era el motivo principal de tu contacto para que pueda ayudarte de inmediato?",
              type: "closing"
            }
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
            {
              icon: '✅',
              title: 'Disculparse de manera genuina y breve (no justificarse)',
              features: []
            },
            {
              icon: '🔍',
              title: 'Enfocar la conversación en solucionar la necesidad principal',
              features: []
            },
            {
              icon: '🔼',
              title: 'Ofrecer escalar el caso si el cliente lo solicita',
              features: []
            },
            {
              icon: '👍',
              title: 'Mostrar actitud positiva y de servicio proactiva',
              features: []
            }
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
            {
              text: "Lamento sinceramente lo sucedido. Estoy aquí para ayudarte.",
              type: "solution"
            },
            {
              text: "Gracias por tu paciencia. Permíteme acompañarte en lo que necesites.",
              type: "solution"
            },
            {
              text: "Ahora mismo resolveré tu solicitud de la mejor manera.",
              type: "solution"
            },
            {
              text: "Tu experiencia es muy importante para nosotros.",
              type: "closing"
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución Asesor inapropiado"
      icon="😞"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Comenzar nueva atención con empatía"
      rejectButtonText="Proceder con cancelación"
    />
  );
};

export default HogarServicioClienteAsesorInapropiadoSolution;
