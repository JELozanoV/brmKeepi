import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarCostosSolution: React.FC<Props> = ({ onSolutionApplied }) => {
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
              text: "Entiendo tu preocupación por el costo del plan actual. Permíteme mostrarte algunas alternativas que tenemos disponibles en nuestra plataforma 'Conectados' que podrían ajustarse mejor a tu presupuesto.",
              type: "empathy"
            },
            {
              text: "Además, es importante que conozcas todos los beneficios adicionales que ya tienes incluidos en tu plan, como Claro Video con Paramount+, Claro Drive con 100GB y Claro Música, que por separado tendrían un costo significativo.",
              type: "solution"
            },
            {
              text: "¿Te parece si revisamos juntos las opciones que tenemos disponibles para encontrar el plan perfecto para ti?",
              type: "closing"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Beneficios VAS',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '🎬',
              title: 'Claro Video + Paramount+',
              features: [
                'Miles de películas y series',
                'Contenido exclusivo de Paramount+',
                'Hasta 5 dispositivos simultáneos',
                'Valor comercial: $19.900/mes'
              ]
            },
            {
              icon: '☁️',
              title: 'Claro Drive 100GB',
              features: [
                '100GB de almacenamiento seguro',
                'Respaldo automático de fotos',
                'Compartir archivos fácilmente',
                'Valor comercial: $15.900/mes'
              ]
            },
            {
              icon: '🎵',
              title: 'Claro Música',
              features: [
                'Millones de canciones sin anuncios',
                'Playlists personalizadas',
                'Modo sin conexión disponible',
                'Valor comercial: $14.900/mes'
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
              question: '¿Cuánto tiempo toma el cambio de plan?',
              answer: 'El cambio se hace efectivo en tu próximo ciclo de facturación, sin necesidad de visita técnica.'
            },
            {
              question: '¿Se mantienen mis beneficios VAS al cambiar de plan?',
              answer: 'Sí, todos los beneficios VAS (Claro Video, Drive y Música) se mantienen activos en los planes de "Conectados".'
            },
            {
              question: '¿Por qué mi factura parece más alta este mes?',
              answer: '“En algunos casos, puede reflejar cobros ocasionales como compras de contenidos, alquiler de películas, cargos prorrateados o cambios de ciclo de facturación. Podemos revisar tu factura contigo para aclarar cualquier diferencia.”.'
            },
            {
              question: '¿Cómo puedo aprovechar mejor mi plan actual para sentir que vale la pena?',
              answer: 'Te recomendamos activar y usar servicios como Claro Video, Claro Música y Claro Drive para maximizar tu experiencia. Además, recuerda que con Claro Club puedes acceder a descuentos exclusivos en múltiples comercios.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución Plan Hogar"
      icon="🏠"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente aceptó el cambio de plan"
      rejectButtonText="Cliente no aceptó el cambio"
    />
  );
};

export default HogarCostosSolution; 