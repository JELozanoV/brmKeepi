import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';
import { scripts } from '../../data/scripts';
import { benefits } from '../../data/benefits';
import { faqs } from '../../data/faqs';

interface Props {
  onSolutionApplied: () => void;
}

const HogarInternetLentoSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión Recomendado',
      content: (
        <ScriptSection
          title={scripts.internetLento.title}
          lines={scripts.internetLento.lines}
        />
      )
    },
    {
      id: 2,
      icon: '🛠️',
      title: 'Herramientas de Soporte',
      content: (
        <BenefitsSection
          benefits={benefits.internetLento}
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
              title: 'Diagnóstico Inicial',
              price: '5-10 min',
              features: [
                '✓ Verificación de estado actual',
                '✓ Análisis de historial',
                '✓ Pruebas de conectividad',
                '✓ Revisión de configuración'
              ]
            },
            {
              title: 'Optimización Remota',
              price: '10-15 min',
              features: [
                '✓ Reconfiguración de equipos',
                '✓ Actualización de firmware',
                '✓ Ajustes de señal',
                '✓ Pruebas de estabilidad'
              ],
              isHighlighted: true
            },
            {
              title: 'Soporte Especializado',
              price: '24-48 hrs',
              features: [
                '✓ Visita técnica prioritaria',
                '✓ Cambio de equipos si necesario',
                '✓ Revisión de cableado',
                '✓ Optimización in situ'
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
          faqs={faqs.internetLento}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Diagnóstico de Velocidad"
      icon="🚀"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Problema resuelto"
      rejectButtonText="Requiere visita técnica"
    />
  );
};

export default HogarInternetLentoSolution; 