import { Rate } from '../types';

export const rates = {
  hogarCostos: [
    {
      title: 'Plan Básico',
      price: '$45.900/mes',
      features: [
        '✓ Internet 200 Mbps',
        '✓ Claro Video incluido',
        '✓ Claro Drive 25GB',
        '✓ Sin permanencia'
      ]
    },
    {
      title: 'Plan Recomendado',
      price: '$55.900/mes',
      features: [
        '✓ Internet 300 Mbps',
        '✓ Claro Video + Paramount+',
        '✓ Claro Drive 100GB',
        '✓ Descuento 40% 6 meses'
      ],
      isHighlighted: true
    }
  ]
} as const; 