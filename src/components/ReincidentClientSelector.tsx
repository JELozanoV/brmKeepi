import React from 'react';
import { ReincidentClientType } from '../types';

interface Props {
  onSelect: (type: ReincidentClientType) => void;
}

const ReincidentClientSelector = ({ onSelect }: Props) => {
  const reasons = [
    {
      id: 'problemas-recurrentes',
      text: 'Problemas Recurrentes',
      icon: '🔄'
    },
    {
      id: 'asesor-inapropiado',
      text: 'Asesor Inapropiado',
      icon: '😤'
    },
    {
      id: 'competencia-atractiva',
      text: 'Competencia Atractiva',
      icon: '🎯'
    },
    {
      id: 'dificultades-cancelacion',
      text: 'Dificultades en el proceso de cancelación',
      icon: '⚠️'
    },
    {
      id: 'falta-transparencia',
      text: 'Falta de transparencia en facturación',
      icon: '📄'
    },
    {
      id: 'llamada-colgada',
      text: 'Le colgaron',
      icon: '📞'
    }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Cuál es el motivo de reincidencia?</h2>
      
      <div className="options-container">
        {reasons.map(reason => (
          <button 
            key={reason.id}
            className="option-button"
            onClick={() => onSelect(reason.id as ReincidentClientType)}
          >
            <span className="button-icon">{reason.icon}</span>
            <span className="button-text">{reason.text}</span>
            <span className="arrow-icon">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReincidentClientSelector; 