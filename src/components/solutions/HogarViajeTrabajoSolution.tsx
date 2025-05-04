import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarViajeTrabajoSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title="Guión de Retención - Viaje de Trabajo"
          lines={[
            {
              text: "Entiendo que por tu viaje de trabajo estés considerando cancelar. Quiero comentarte que muchos clientes en tu situación deciden mantener su servicio hogar activo en su vivienda, ya sea para uso de sus familiares, o para mantener el acceso en caso de alquiler o regreso posterior.",
              type: "empathy"
            },
            {
              text: "Cancelar ahora podría implicar cargos de cancelación anticipada o costos de reconexión si en el futuro deseas instalar de nuevo. Además, perderías beneficios vigentes como tus promociones actuales y tarifas especiales.",
              type: "solution"
            },
            {
              text: "¿Te gustaría que revisemos juntos cómo puedes dejar tu servicio activo de manera conveniente mientras estás fuera?",
              type: "closing"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '💡',
      title: 'Beneficios de Mantener el Servicio',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '🏠',
              title: 'Mantén tu Hogar Conectado',
              features: [
                'Acceso para familiares o inquilinos',
                'Mantén la seguridad con cámaras IP',
                'Control remoto del hogar',
                'Monitoreo a distancia'
              ]
            },
            {
              icon: '💰',
              title: 'Ahorro a Largo Plazo',
              features: [
                'Evita cargos de cancelación',
                'Conserva promociones actuales',
                'Sin costos de reinstalación',
                'Mantén tu antigüedad'
              ]
            },
            {
              icon: '🌟',
              title: 'Beneficios Exclusivos',
              features: [
                'Acceso a Claro Video desde cualquier lugar',
                'Claro Drive para documentos importantes',
                'Claro Música sin límites',
                'WiFi móvil sin costo adicional'
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
                '✓ Monitoreo remoto con cámaras de seguridad',
                '✓ Notificaciones en tiempo real',
                '✓ Control de acceso y sensores',
                '✓ App Mi Claro desde cualquier lugar'
              ]
            },
            {
              title: 'Hogar Conectado - Automatización',
              price: 'Servicio disponible',
              features: [
                '✓ Control de iluminación remoto',
                '✓ Programación de dispositivos',
                '✓ Control por asistente de voz',
                '✓ Ahorro de energía automático'
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
              question: '¿Puedo acceder a mis servicios desde el extranjero?',
              answer: 'Sí, las plataformas como Claro Video, Claro Música y Claro Drive están disponibles internacionalmente.'
            },
            {
              question: '¿Qué pasa si decido regresar antes?',
              answer: 'Tu servicio estará completamente activo y podrás retomar tu plan normal inmediatamente.'
            },
            {
              question: '¿Puedo modificar mi plan mientras estoy fuera?',
              answer: 'Sí, podemos ajustar tu plan según tus necesidades en cualquier momento.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución para Viaje de Trabajo"
      icon="💼"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente mantiene servicio"
      rejectButtonText="Cliente insiste en cancelar"
    />
  );
};

export default HogarViajeTrabajoSolution;