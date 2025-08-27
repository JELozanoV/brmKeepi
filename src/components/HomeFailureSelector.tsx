import { HomeFailureType } from '../types';

interface Props {
  onSelect: (failureType: HomeFailureType) => void;
}

const HomeFailureSelector = ({ onSelect }: Props) => {
  const failureTypes = [
    { 
      id: 'internet-lento', 
      text: 'Internet lento', 
      icon: '🐌' 
    },
    { 
      id: 'fallas-intermitentes', 
      text: 'Fallas intermitentes', 
      icon: '📶' 
    },
    { 
      id: 'cortes-frecuentes', 
      text: 'Cortes frecuentes', 
      icon: '✂️' 
    },
    { 
      id: 'wifi-inestable', 
      text: 'WiFi inestable', 
      icon: '📡' 
    },
    { 
      id: 'fallas-navegador', 
      text: 'Fallas con el navegador', 
      icon: '🌐' 
    },
    { 
      id: 'activacion-demora', 
      text: 'Demora en la activación', 
      icon: '⏳' 
    }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Qué tipo de falla presenta el servicio?</h2>
      
      <div className="options-container">
        {failureTypes.map(type => (
          <button 
            key={type.id}
            className="option-button"
            onClick={() => onSelect(type.id as HomeFailureType)}
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

export default HomeFailureSelector; 