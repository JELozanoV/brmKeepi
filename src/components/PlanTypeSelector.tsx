import { PlanType } from '../types';

interface Props {
  onSelect: (plan: PlanType) => void;
}

const PlanTypeSelector = ({ onSelect }: Props) => {
  return (
    <div className="selector-container">
      <h2 className="section-title">¿Cuál es el tipo de plan?</h2>
      
      <div className="options-container">
        <button 
          className="option-button"
          onClick={() => onSelect('prepago')}
        >
          <span className="button-icon">💳</span>
          <span className="button-text">Prepago</span>
          <span className="arrow-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('pospago')}
        >
          <span className="button-icon">📱</span>
          <span className="button-text">Pospago</span>
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default PlanTypeSelector; 