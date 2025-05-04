import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarMejorOfertaSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title="Guión de Retención"
          lines={[
            {
              text: "Entiendo que hayas encontrado una oferta que te parece más atractiva. ¿Me permites revisar juntos qué incluye esa oferta para asegurarme de ofrecerte algo igual o mejor?",
              type: "empathy"
            },
            {
              text: "Además de la velocidad y el precio, es importante considerar los beneficios adicionales. En Claro, incluimos servicios premium como Claro Video con Paramount+, Claro Drive y Claro Música, que otras compañías cobran por separado.",
              type: "solution"
            },
            {
              text: "También tenemos una promoción especial en nuestra plataforma 'Conectados' que podría interesarte, con descuentos significativos en los primeros meses y beneficios exclusivos.",
              type: "benefit"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '📊',
      title: 'Comparativa de Beneficios',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '🎮',
              title: 'Entretenimiento Premium',
              features: [
                'Claro Video + Paramount+ incluido ($19.900 valor comercial)',
                'Contenido exclusivo y estrenos',
                'Hasta 5 dispositivos simultáneos',
                'Descarga de contenido sin costo adicional'
              ]
            },
            {
              icon: '💾',
              title: 'Almacenamiento en la Nube',
              features: [
                'Claro Drive con 100GB incluido ($15.900 valor comercial)',
                'Respaldo automático de fotos y documentos',
                'Acceso desde cualquier dispositivo',
                'Compartir archivos de forma segura'
              ]
            },
            {
              icon: '🛡️',
              title: 'Garantías Exclusivas',
              features: [
                'Soporte técnico prioritario 24/7',
                'Garantía de velocidad contratada',
                'Mantenimiento preventivo sin costo',
                'Router WiFi 6 última generación'
              ]
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '💰',
      title: 'Tarifas Conectados',
      content: (
        <RatesSection
          title="Planes Recomendados en 'Conectados'"
          rates={[
            {
              title: 'Triple Claro TV+ Intermedio Plus 500 MB',
              price: '$111.900/mes',
              features: [
                '✓ Internet 500 Mbps',
                '✓ Netflix con plan Básico',
                '✓ Win + Futbol',
                '✓ 3 Prime',
                '✓ 1 Deco HD',
                '✓ Ultra Wifi',
              ]
            },
            {
              title: 'Triple Box TV Digital Avanzada 500 MB',
              price: '$121.900/mes',
              features: [
                '✓ Internet 500 Mbps',
                '✓ Deco Digital',
                '✓ Multiasistencia',
                '✓ 1 Deco HD',
                '✓ Deco Box TV',
                '✓ Ultra Wifi'
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
              question: '¿Qué pasa si no estoy satisfecho con el servicio?',
              answer: 'Ofrecemos garantía de satisfacción de 30 días. Si no estás conforme, puedes cancelar sin penalidad.'
            },
            {
              question: '¿Los beneficios premium tienen algún costo oculto?',
              answer: 'No, todos los beneficios mencionados (Claro Video, Drive y Música) están incluidos sin costo adicional en tu plan.'
            },
            {
              question: '¿Cómo se compara la velocidad real con la ofertada?',
              answer: 'Garantizamos al menos el 80% de la velocidad contratada por cable y realizamos mediciones gratuitas.'
            },
            {
              question: '¿Qué sucede después del período de descuento?',
              answer: 'Un mes antes de que termine el descuento, te contactaremos para revisar nuevas promociones disponibles.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Mejoramos tu Oferta"
      icon="🏆"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente aceptó nuestra oferta"
      rejectButtonText="Cliente prefiere otra oferta"
    />
  );
};

export default HogarMejorOfertaSolution; 