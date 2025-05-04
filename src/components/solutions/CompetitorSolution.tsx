import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';
import { CompetitorType } from '../../types';

interface Props {
  competitor: CompetitorType;
  onSolutionApplied: () => void;
}

const CompetitorSolution: React.FC<Props> = ({ competitor, onSolutionApplied }) => {
  // Lista de competidores
  const competitors = [
    { 
      id: 'movistar' as CompetitorType, 
      text: 'Movistar', 
      icon: '🔵',
      description: 'Telefónica Colombia' 
    },
    { 
      id: 'tigo' as CompetitorType, 
      text: 'Tigo', 
      icon: '🟣',
      description: 'Colombia Móvil' 
    },
    { 
      id: 'etb' as CompetitorType, 
      text: 'ETB', 
      icon: '🔵',
      description: 'Empresa de Telecomunicaciones de Bogotá' 
    }
  ];

  // Si no hay competidor seleccionado, mostrar la lista de competidores
  if (!competitor) {
    return (
      <div className="selector-container">
        <h2 className="section-title">¿Con qué operador quiere pasarse el cliente?</h2>
        <div className="options-container">
          {competitors.map(comp => (
            <button 
              key={comp.id}
              className="option-button"
              onClick={() => {
                onSolutionApplied();
              }}
            >
              <span className="button-icon">{comp.icon}</span>
              <span className="button-text">{comp.text}</span>
              <span className="arrow-icon">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Configuración específica para cada competidor
  const competitorConfig: Record<NonNullable<CompetitorType>, {
    icon: string;
    title: string;
    benefits: Array<{
      icon: string;
      title: string;
      features: string[];
    }>;
    rates: Array<{
      title: string;
      price: string;
      features: string[];
      isHighlighted?: boolean;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  }> = {
    movistar: {
      icon: '🔵',
      title: 'Ventajas vs Movistar',
      benefits: [
        {
          icon: '📡',
          title: 'Mejor Cobertura',
          features: [
            'Red 4.5G con mayor cobertura nacional',
            'Señal estable en zonas rurales',
            'Mejor penetración en interiores',
            'Menor tasa de llamadas caídas'
          ]
        },
        {
          icon: '🎮',
          title: 'Más Entretenimiento',
          features: [
            'Claro Video + Paramount+ incluido',
            'Claro Música sin costo adicional',
            'Claro Drive 100GB gratis',
            'Netflix con plan Básico en paquetes'
          ]
        },
        {
          icon: '💰',
          title: 'Mejor Valor',
          features: [
            'Más GB por el mismo precio',
            'Minutos ilimitados a todo operador',
            'Beneficios Claro Club',
            'Acumulación de megas no usados'
          ]
        }
      ],
      rates: [
        {
          title: 'Triple Claro TV+ Intermedio Plus 500 MB',
          price: '$111.900/mes',
          features: [
            '✓ Internet 500 Mbps',
            '✓ Netflix con plan Básico',
            '✓ Win + Futbol',
            '✓ 3 Prime',
            '✓ 1 Deco HD',
            '✓ Ultra Wifi'
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
      ],
      faqs: [
        {
          question: '¿Por qué Claro es mejor que Movistar?',
          answer: 'Claro ofrece mayor cobertura nacional, más beneficios de entretenimiento incluidos y mejor relación precio-valor en sus planes.'
        },
        {
          question: '¿Qué pasa con mi número al cambiarme?',
          answer: 'Puedes conservar tu número actual mediante la portabilidad numérica, el proceso es gratuito y toma máximo 3 días hábiles.'
        },
        {
          question: '¿Tengo que esperar a que termine mi contrato con Movistar?',
          answer: 'No es necesario, podemos iniciar el proceso de portabilidad en cualquier momento y te orientamos con los pasos a seguir.'
        }
      ]
    },
    tigo: {
      icon: '🟣',
      title: 'Ventajas vs Tigo',
      benefits: [
        {
          icon: '📡',
          title: 'Mayor Cobertura',
          features: [
            'Red más extensa a nivel nacional',
            'Mejor señal en zonas rurales',
            'Mayor estabilidad en interiores',
            'Tecnología 4.5G más avanzada'
          ]
        },
        {
          icon: '🎮',
          title: 'Entretenimiento Superior',
          features: [
            'Más opciones de streaming',
            'Contenido exclusivo',
            'Mayor calidad de video',
            'Plataformas premium incluidas'
          ]
        },
        {
          icon: '💰',
          title: 'Mejor Relación Precio-Valor',
          features: [
            'Planes más completos',
            'Beneficios adicionales incluidos',
            'Programa de lealtad Claro Club',
            'Descuentos exclusivos'
          ]
        }
      ],
      rates: [
        {
          title: 'Triple Claro TV+ Intermedio Plus 500 MB',
          price: '$111.900/mes',
          features: [
            '✓ Internet 500 Mbps',
            '✓ Netflix con plan Básico',
            '✓ Win + Futbol',
            '✓ 3 Prime',
            '✓ 1 Deco HD',
            '✓ Ultra Wifi'
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
      ],
      faqs: [
        {
          question: '¿Por qué elegir Claro en lugar de Tigo?',
          answer: 'Claro ofrece una red más extensa, mejor cobertura y más beneficios incluidos en todos los planes.'
        },
        {
          question: '¿Puedo mantener mi número?',
          answer: 'Sí, el proceso de portabilidad es gratuito y toma máximo 3 días hábiles.'
        },
        {
          question: '¿Qué pasa con mi contrato actual?',
          answer: 'Te ayudamos con todo el proceso de cambio, incluyendo la gestión con tu operador actual.'
        }
      ]
    },
    etb: {
      icon: '🔵',
      title: 'Ventajas vs ETB',
      benefits: [
        {
          icon: '📡',
          title: 'Cobertura Nacional',
          features: [
            'Presencia en todo el país',
            'No limitado a Bogotá',
            'Red nacional integrada',
            'Mejor experiencia en roaming'
          ]
        },
        {
          icon: '🎮',
          title: 'Más Entretenimiento',
          features: [
            'Claro Video + Paramount+',
            'Claro Música sin límites',
            'Claro Drive 100GB',
            'Más canales premium'
          ]
        },
        {
          icon: '💰',
          title: 'Beneficios Nacionales',
          features: [
            'Claro Club en todo el país',
            'Atención en cualquier ciudad',
            'Descuentos nacionales',
            'Soporte sin fronteras'
          ]
        }
      ],
      rates: [
        {
          title: 'Triple Claro TV+ Intermedio Plus 500 MB',
          price: '$111.900/mes',
          features: [
            '✓ Internet 500 Mbps',
            '✓ Netflix con plan Básico',
            '✓ Win + Futbol',
            '✓ 3 Prime',
            '✓ 1 Deco HD',
            '✓ Ultra Wifi'
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
      ],
      faqs: [
        {
          question: '¿Por qué preferir Claro sobre ETB?',
          answer: 'Claro ofrece cobertura nacional real, más servicios de entretenimiento y beneficios en todo el país.'
        },
        {
          question: '¿Qué pasa si me mudo de ciudad?',
          answer: 'Puedes mantener tus servicios Claro en cualquier ciudad del país donde tengamos cobertura.'
        },
        {
          question: '¿Los beneficios son solo en Bogotá?',
          answer: 'No, todos nuestros beneficios y servicios están disponibles a nivel nacional.'
        }
      ]
    }
  };

  const config = competitorConfig[competitor || 'movistar'];

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
              text: `Entiendo que estés considerando cambiarte a ${competitor}. ¿Me permites mostrarte por qué Claro podría ser una mejor opción?`,
              type: "empathy"
            },
            {
              text: "En Claro, no solo igualamos las ofertas de la competencia, sino que además incluimos beneficios exclusivos como Claro Video, Claro Drive y Claro Música sin costo adicional.",
              type: "solution"
            },
            {
              text: "También tenemos una cobertura más amplia y planes más flexibles que se adaptan a tus necesidades.",
              type: "benefit"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Ventajas Competitivas',
      content: (
        <BenefitsSection
          benefits={config.benefits}
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
          rates={config.rates}
        />
      )
    },
    {
      id: 4,
      icon: '❓',
      title: 'Preguntas Frecuentes',
      content: (
        <FAQSection
          faqs={config.faqs}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title={config.title}
      icon={config.icon}
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Cliente prefiere quedarse en Claro"
      rejectButtonText="Cliente insiste en cambiarse"
    />
  );
};

export default CompetitorSolution;
