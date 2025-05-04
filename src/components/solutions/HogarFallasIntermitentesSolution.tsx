import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarFallasIntermitentesSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title="Guión de Diagnóstico"
          lines={[
            {
              text: "Comprendo su frustración con las interrupciones del servicio. Es una situación que necesitamos resolver lo antes posible.",
              type: "empathy"
            },
            {
              text: "Voy a realizar un diagnóstico completo de su servicio para identificar qué está causando estas interrupciones.",
              type: "action"
            },
            {
              text: "Mientras realizo las verificaciones necesarias, ¿podría indicarme en qué momentos del día suelen ocurrir estas fallas con más frecuencia?",
              type: "diagnostic"
            },
            {
              text: "Basado en el diagnóstico, determinaremos si podemos resolver la situación de manera remota o si es necesario programar una visita técnica.",
              type: "solution"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '🛠️',
      title: 'Herramientas de Soporte',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '👤',
              title: 'RR ',
              features: [
                'Verificación del historial de fallas',
                'Consulta de equipos instalados',
                'Reset remoto de equipos',
                'Revisión de configuraciones',
                'Análisis de patrones de falla'
              ]
            },
            {
              icon: '🔍',
              title: 'T&D (Test & Diagnostic)',
              features: [
                'Verificación de fallas masivas',
                'Diagnóstico paso a paso',
                'Pruebas de estabilidad',
                'Generación de LLC si necesario',
                'Análisis de señal y ruido'
              ]
            },
            {
              icon: '📅',
              title: 'Módulo de Gestión',
              features: [
                'Agendamiento de visitas técnicas',
                'Aprovisionamiento de servicios',
                'Seguimiento de casos previos',
                'Gestión de órdenes de servicio',
                'Actualización de estado del servicio'
              ]
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '📈',
      title: 'Proceso de Diagnóstico',
      content: (
        <RatesSection
          title="Protocolo de Verificación"
          rates={[
            {
              title: 'Análisis en RR',
              price: '5-10 min',
              features: [
                '✓ Revisión de historial de fallas',
                '✓ Verificación de equipos',
                '✓ Reset preventivo de equipos',
                '✓ Análisis de configuración'
              ]
            },
            {
              title: 'Diagnóstico T&D',
              price: '10-15 min',
              features: [
                '✓ Verificación de zona',
                '✓ Pruebas de estabilidad',
                '✓ Medición de señal',
                '✓ Análisis de interferencias'
              ],
              isHighlighted: true
            },
            {
              title: 'Gestión de Caso',
              price: '5-10 min',
              features: [
                '✓ Registro de incidencia',
                '✓ Programación de visita',
                '✓ Asignación de prioridad',
                '✓ Seguimiento del caso'
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
              question: '¿Cómo se identifica el patrón de las fallas intermitentes?',
              answer: 'A través de RR podemos revisar el historial de fallas, horarios de ocurrencia y duración de las interrupciones para identificar patrones y determinar si el problema es interno o externo.'
            },
            {
              question: '¿Qué pruebas realiza T&D para fallas intermitentes?',
              answer: 'T&D ejecuta pruebas de estabilidad de la señal, verifica interferencias, analiza la calidad de la conexión y determina si hay afectaciones masivas en la zona que puedan estar causando las intermitencias.'
            },
            {
              question: '¿Cuándo se requiere una visita técnica?',
              answer: 'Se requiere una visita técnica cuando las pruebas remotas indican problemas de cableado, interferencias físicas, o cuando no se logra estabilizar el servicio después de los diagnósticos y resets remotos.'
            },
            {
              question: '¿Cómo se prioriza una falla intermitente?',
              answer: 'La priorización se basa en la frecuencia de las fallas, el impacto en el servicio y el historial del cliente. El Módulo de Gestión nos permite asignar la prioridad adecuada para la atención técnica.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Diagnóstico de Fallas Intermitentes"
      icon="📶"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Problema resuelto"
      rejectButtonText="Requiere visita técnica"
    />
  );
};

export default HogarFallasIntermitentesSolution; 