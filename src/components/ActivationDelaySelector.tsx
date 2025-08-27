import { ActivationDelayType } from '../types';

interface Props {
  onSelect: (delayType: ActivationDelayType) => void;
}

const ActivationDelaySelector = ({ onSelect }: Props) => {
  const delayTypes = [
    { 
      id: 'expectativas-no-cumplidas', 
      text: 'Expectativas no cumplidas', 
      icon: '❌' 
    },
    { 
      id: 'necesidad-urgente', 
      text: 'Necesidad urgente del servicio', 
      icon: '⚡' 
    },
    { 
      id: 'compromisos-personales', 
      text: 'Compromisos personales', 
      icon: '📅' 
    },
    { 
      id: 'demora-activacion', 
      text: 'Demora en la activación', 
      icon: '⏳' 
    }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Cuál es el motivo de la inconformidad?</h2>
      
      <div className="options-container">
        {delayTypes.map(type => (
          <button 
            key={type.id}
            className="option-button"
            onClick={() => onSelect(type.id as ActivationDelayType)}
          >
            <span className="button-icon">{type.icon}</span>
            <span className="button-text">{type.text}</span>
            <span className="arrow-icon">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivationDelaySelector; 