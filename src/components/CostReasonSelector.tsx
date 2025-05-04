import { CostReason } from '../types';

interface Props {
  onSelect: (reason: CostReason) => void;
}

const CostReasonSelector = ({ onSelect }: Props) => {
  const costReasons = [
    { id: 'plan-alto', text: 'Plan muy costoso', icon: '💰' },
    { id: 'falta-trabajo', text: 'Falta de trabajo', icon: '💼' },
    { id: 'mejor-oferta', text: 'Encontró mejor oferta', icon: '🏷️' }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Cuál es el motivo relacionado al costo?</h2>
      
      <div className="options-container">
        {costReasons.map(reason => (
          <button 
            key={reason.id}
            className="option-button"
            onClick={() => onSelect(reason.id as CostReason)}
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

export default CostReasonSelector; 