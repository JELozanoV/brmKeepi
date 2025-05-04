import React from 'react';
import './ValidationSection.scss';

interface Props {
  onSelectValidation: (type: 'titularidad' | 'td') => void;
}

const ValidationSection: React.FC<Props> = ({ onSelectValidation }) => {
  return (
    <div className="validation-options">
      <div className="validation-buttons">
        <button 
          className="option-button"
          onClick={() => onSelectValidation('titularidad')}
        >
          <span className="button-icon">👤</span>
          <span className="button-text">Validación de titularidad</span>
          <span className="arrow-icon">→</span>
        </button>
        
        <button 
          className="option-button"
          onClick={() => onSelectValidation('td')}
        >
          <span className="button-icon">🔍</span>
          <span className="button-text">Validación en T&D</span>
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default ValidationSection; 