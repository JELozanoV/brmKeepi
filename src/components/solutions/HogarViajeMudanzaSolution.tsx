import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarViajeMudanzaSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión de Gestión Especial - Mudanza Permanente',
      content: (
        <ScriptSection
          title="Guión de Gestión Especial HOGAR — Mudanza permanente"
          lines={[
            { text: "Gracias por informarnos sobre tu mudanza. Entiendo perfectamente que al salir definitivamente del país quieras finalizar tu servicio.", type: "empathy" },
            { text: "Quiero facilitarte el proceso para que sea lo más rápido y sencillo posible. Si lo deseas, podríamos también revisar si algún familiar tuyo quisiera aprovechar tu servicio vigente para no perder los beneficios actuales.", type: "solution" },
            { text: "Si prefieres cerrar el servicio, te explicaré de forma clara los pasos a seguir para que no tengas ningún inconveniente.", type: "closing" }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '📋',
      title: 'Opciones de Acción para Asesor',
      content: (
        <BenefitsSection
          benefits={[
            { icon: '✅', title: 'Facilitar proceso de cancelación inmediata', features: [] },
            { icon: '🔄', title: 'Ofrecer traspaso del servicio a familiar (si aplica)', features: [] },
            { icon: '⚠️', title: 'Recordar devolución de equipos (modem, router, decodificador)', features: [] },
            { icon: '🎉', title: 'Agradecer preferencia y desear éxito en su nueva etapa', features: [] }
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
            { text: "Te acompañamos en el cierre de tu servicio de forma rápida y sin complicaciones.", type: "solution" },
            { text: "Si quieres, podemos transferir el servicio a algún familiar.", type: "solution" },
            { text: "Recuerda devolver los equipos de Claro para evitar cobros adicionales.", type: "solution" },
            { text: "Gracias por haber sido parte de Claro. ¡Te deseamos muchos éxitos!", type: "closing" }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución Mudanza Permanente"
      icon="🚚"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Transferir servicio"
      rejectButtonText="Cancelar servicio"
    />
  );
};

export default HogarViajeMudanzaSolution; 