import React from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, BenefitsSection, RatesSection, FAQSection } from './sections';

interface Props {
  onSolutionApplied: () => void;
}

const HogarCortesFrecuentesSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guión de Diagnóstico',
      content: (
        <ScriptSection
          title="Guión para Cortes Frecuentes"
          lines={[
            {
              text: "Entiendo lo frustrante que debe ser experimentar cortes frecuentes en el servicio. Vamos a trabajar juntos para resolver esta situación lo antes posible.",
              type: "empathy"
            },
            {
              text: "¿Podrías indicarme en qué momentos del día suelen ocurrir estos cortes y cuánto tiempo duran aproximadamente?",
              type: "diagnostic"
            },
            {
              text: "Realizaré un diagnóstico completo de tu conexión para identificar la causa de los cortes y determinar la mejor solución.",
              type: "action"
            },
            {
              text: "Basado en los resultados, implementaremos las medidas necesarias para estabilizar tu servicio de manera permanente.",
              type: "solution"
            }
          ]}
        />
      )
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Protocolo de Diagnóstico',
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
      icon: '⚡',
      title: 'Plan de Acción',
      content: (
        <RatesSection
          title="Proceso de Estabilización"
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
          faqs={[
            {
              question: '¿Qué causa los cortes frecuentes?',
              answer: 'Los cortes pueden ser causados por diversos factores como interferencias electromagnéticas, problemas de infraestructura, sobrecarga de red o configuraciones incorrectas de los equipos.'
            },
            {
              question: '¿Cuánto tiempo toma resolver el problema?',
              answer: 'El tiempo de resolución varía según la causa. Problemas de configuración pueden resolverse remotamente en minutos, mientras que problemas físicos pueden requerir una visita técnica programada en 24-48 horas.'
            },
            {
              question: '¿Se requiere cambio de equipos?',
              answer: 'Solo si el diagnóstico indica que el equipo actual está causando los cortes. En ese caso, el cambio se realiza sin costo adicional durante la visita técnica.'
            },
            {
              question: '¿Cómo se previenen futuros cortes?',
              answer: 'Implementamos un sistema de monitoreo continuo que detecta y previene posibles cortes antes de que ocurran, además de realizar mantenimiento preventivo periódico.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <BaseSolution
      title="Solución Cortes Frecuentes"
      icon="⚡"
      sections={sections}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Problema resuelto remotamente"
      rejectButtonText="Requiere visita técnica"
    />
  );
};

export default HogarCortesFrecuentesSolution; 