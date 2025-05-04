import { Benefit } from '../types';

export const benefits = {
  hogarCostos: [
    {
      icon: '📺',
      title: 'Entretenimiento Premium',
      features: [
        'Claro Video incluido',
        'Contenido exclusivo',
        'Paramount+ sin costo adicional',
        'Múltiples dispositivos'
      ]
    },
    {
      icon: '💾',
      title: 'Almacenamiento en la Nube',
      features: [
        'Claro Drive incluido',
        'Respaldo automático',
        'Compartir archivos',
        'Acceso multiplataforma'
      ]
    }
  ],

  internetLento: [
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
  ]
} as const; 