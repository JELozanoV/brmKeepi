import { FailureType } from '../types';

interface Props {
  onSelect: (failureType: FailureType) => void;
}

const FailureTypeSelector = ({ onSelect }: Props) => {
  const failureTypes = [
    { id: 'llamadas', text: 'Llamadas', icon: '📞' },
    { id: 'datos', text: 'Datos', icon: '📱' },
    { id: 'sms', text: 'SMS', icon: '✉️' },
    { id: 'llamadas-datos', text: 'Llamadas y datos', icon: '📲' }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Qué tipo de fallas presenta el servicio?</h2>
      
      <div className="options-container">
        {failureTypes.map(type => (
          <button 
            key={type.id}
            className="option-button"
            onClick={() => onSelect(type.id as FailureType)}
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

export default FailureTypeSelector; 