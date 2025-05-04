import React, { useState } from 'react';
import BaseSolution from './BaseSolution';
import ValidationSection from './sections/ValidationSection';
import ValidationStepsSection from './sections/ValidationStepsSection';
import ProcedureSection from './sections/ProcedureSection';
import ProcedureStepsSection from './sections/ProcedureStepsSection';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarWifiInestableSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const [selectedValidation, setSelectedValidation] = useState<'titularidad' | 'td' | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<'pruebas' | 'soporte' | 'aprovisionamiento' | 'marcacion' | null>(null);

  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title="Guión de Diagnóstico WiFi"
          lines={[
            {
              text: "Entiendo su frustración con la inestabilidad del WiFi. Vamos a realizar un diagnóstico completo para identificar qué está afectando la señal.",
              type: "empathy"
            },
            {
              text: "¿Me podría indicar en qué áreas de su hogar nota más la inestabilidad y cuántos dispositivos suelen estar conectados simultáneamente?",
              type: "diagnostic"
            },
            {
              text: "Realizaremos algunas pruebas y ajustes para optimizar su señal WiFi y, si es necesario, evaluaremos si requiere una solución de Ultra WiFi para mejorar la cobertura.",
              type: "solution"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '📡',
      title: 'Diagnóstico WiFi',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '📊',
              title: 'Análisis de Red WiFi',
              features: [
                'Verificación de banda y canal',
                'Medición de intensidad de señal',
                'Análisis de interferencias',
                'Revisión de dispositivos conectados',
                'Evaluación de cobertura'
              ]
            },
            {
              icon: '🔍',
              title: 'Herramientas de Diagnóstico',
              features: [
                'Mapa de calor WiFi',
                'Test de velocidad por zona',
                'Análisis de congestión',
                'Verificación de router',
                'Diagnóstico de frecuencias'
              ]
            },
            {
              icon: '⚡',
              title: 'Optimización de Red',
              features: [
                'Ajuste de canales WiFi',
                'Configuración de bandas',
                'Priorización de tráfico',
                'Actualización de firmware',
                'Optimización de seguridad'
              ]
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '🛠️',
      title: 'Plan de Acción',
      content: (
        <RatesSection
          title="Proceso de Estabilización WiFi"
          rates={[
            {
              title: 'Diagnóstico Básico',
              price: '5-10 min',
              features: [
                '✓ Verificación de configuración',
                '✓ Análisis de dispositivos',
                '✓ Test de velocidad',
                '✓ Revisión de cobertura'
              ]
            },
            {
              title: 'Optimización WiFi',
              price: '10-15 min',
              features: [
                '✓ Ajuste de configuración',
                '✓ Cambio de canales',
                '✓ Actualización de router',
                '✓ Pruebas de estabilidad'
              ],
              isHighlighted: true
            },
            {
              title: 'Ultra WiFi',
              price: '24-48 hrs',
              features: [
                '✓ Instalación de extensores',
                '✓ Configuración mesh',
                '✓ Optimización de red',
                '✓ Garantía de cobertura'
              ]
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
              question: '¿Por qué mi WiFi es inestable en ciertas áreas?',
              answer: 'La señal WiFi puede verse afectada por la distancia al router, paredes, interferencias de otros dispositivos o redes cercanas. La ubicación del router y los materiales de construcción también influyen en la cobertura.'
            },
            {
              question: '¿Qué es Ultra WiFi y cuándo lo necesito?',
              answer: 'Ultra WiFi es una solución que utiliza extensores de señal mesh para garantizar cobertura en todo el hogar. Es recomendado cuando tienes áreas sin señal o con señal débil, especialmente en hogares grandes o de varios pisos.'
            },
            {
              question: '¿Cómo puedo mejorar la velocidad de mi WiFi?',
              answer: 'Puedes mejorar la velocidad ubicando el router en un lugar central, evitando interferencias, usando la banda de 5GHz para dispositivos cercanos, y manteniendo actualizado el firmware del router.'
            },
            {
              question: '¿Por qué algunos dispositivos tienen mejor señal que otros?',
              answer: 'La capacidad de recepción WiFi varía según el dispositivo, su antigüedad y su compatibilidad con diferentes estándares WiFi (como WiFi 4, 5 o 6). Los dispositivos más nuevos suelen tener mejor conectividad.'
            },
            {
              question: '¿Cuántos dispositivos pueden conectarse sin afectar el rendimiento?',
              answer: 'El número óptimo depende de tu plan de internet y el router. En general, un router moderno puede manejar 15-20 dispositivos simultáneos sin degradación significativa del servicio.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Diagnóstico WiFi Inestable"
      icon="📡"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Señal estabilizada"
      rejectButtonText="Requiere Ultra WiFi"
    />
  );
};

export default HogarWifiInestableSolution; 