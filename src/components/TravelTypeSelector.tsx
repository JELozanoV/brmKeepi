import { TravelType } from '../types';

interface Props {
  onSelect: (travelType: TravelType) => void;
}

const TravelTypeSelector = ({ onSelect }: Props) => {
  const travelTypes = [
    { id: 'trabajo', text: 'Viaje de trabajo', icon: '💼' },
    { id: 'vacaciones', text: 'Vacaciones', icon: '🏖️' },
    { id: 'mudanza', text: 'Mudanza permanente a otro país', icon: '✈️' }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Qué tipo de viaje realizará?</h2>
      
      <div className="options-container">
        {travelTypes.map(type => (
          <button 
            key={type.id}
            className="option-button"
            onClick={() => onSelect(type.id as TravelType)}
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

export default TravelTypeSelector; 