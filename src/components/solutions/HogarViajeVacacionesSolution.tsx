import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarViajeVacacionesSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title="Guión de Retención - Vacaciones"
          lines={[
            {
              text: "¡Qué bueno que puedas tomarte un descanso! Entiendo que al estar de viaje quieras dejar todo en orden.",
              type: "empathy"
            },
            {
              text: "Antes de cancelar, me gustaría contarte que muchos clientes que se van de vacaciones optan por mantener su servicio activo, ya que cancelar solo por unas semanas podría implicar perder tu instalación actual, tus beneficios especiales y tener costos adicionales si decides reconectar a tu regreso.",
              type: "solution"
            },
            {
              text: "Además, al mantenerlo activo, garantizas que tu casa sigue teniendo conexión disponible para familiares o seguridad remota, en caso de que la necesites.",
              type: "benefit"
            },
            {
              text: "¿Te parece si te explico cómo puedes dejarlo todo listo y asegurado mientras disfrutas tus vacaciones?",
              type: "closing"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '🌟',
      title: 'Beneficios Durante tus Vacaciones',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '🏠',
              title: 'Seguridad en Casa',
              features: [
                'Monitoreo remoto con cámaras',
                'Alertas de movimiento',
                'Control de acceso',
                'Sensores de seguridad'
              ]
            },
            {
              icon: '👨‍👩‍👧‍👦',
              title: 'Acceso Familiar',
              features: [
                'WiFi disponible para familiares',
                'Acceso a TV para cuidadores',
                'Mantén conexión con tu hogar',
                'Comparte beneficios con otros'
              ]
            },
            {
              icon: '💰',
              title: 'Ahorro y Conveniencia',
              features: [
                'Evita costos de reinstalación',
                'Mantén tus promociones actuales',
                'Sin pérdida de beneficios',
                'Reactivación inmediata al regresar'
              ]
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '🏠',
      title: 'Servicios Remotos Disponibles',
      content: (
        <RatesSection
          title="Servicios que puede usar desde el extranjero"
          rates={[
            {
              title: 'Hogar Conectado - Seguridad',
              price: 'Servicio disponible',
              features: [
                '✓ Monitoreo con cámaras HD',
                '✓ Alertas en tiempo real',
                '✓ Historial de eventos',
                '✓ Control desde App Mi Claro'
              ]
            },
            {
              title: 'Hogar Conectado - Control',
              price: 'Servicio disponible',
              features: [
                '✓ Control de iluminación',
                '✓ Termostatos inteligentes',
                '✓ Programación de dispositivos',
                '✓ Gestión de energía'
              ],
              isHighlighted: true
            }
          ]}
        />
      )
    },
    {
      id: 4,
      icon: '❓',
      title: 'Preguntas Frecuentes',
      content: (
        <FAQSection
          faqs={[
            {
              question: '¿Puedo monitorear mi casa mientras estoy de vacaciones?',
              answer: 'Sí, con Hogar Conectado puedes ver las cámaras de seguridad y recibir alertas desde cualquier lugar del mundo a través de la app Mi Claro.'
            },
            {
              question: '¿Qué pasa si regreso antes de lo planeado?',
              answer: 'No hay problema, tu servicio estará completamente funcional y disponible durante todo tu viaje.'
            },
            {
              question: '¿Puedo dar acceso temporal a alguien que cuide mi casa?',
              answer: 'Sí, el servicio se mantiene activo y puedes compartir el acceso con familiares o personas de confianza que cuiden tu casa.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución para Vacaciones"
      icon="🏖️"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente mantiene servicio"
      rejectButtonText="Cliente insiste en cancelar"
    />
  );
};

export default HogarViajeVacacionesSolution;