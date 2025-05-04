import { CancellationReason } from '../types';
import { SOLUTIONS } from '../data/solutions';

interface Props {
  onSelectReason: (reason: CancellationReason) => void;
  selectedReason: CancellationReason;
}

interface Solution {
  title: string;
  benefits?: string[];
  steps: string[];
}

export const CancellationFlow = ({ onSelectReason, selectedReason }: Props) => {
  if (!selectedReason) {
    return (
      <>
        <p className="accent-text">¿Cuál es el motivo de la cancelación?</p>
        <div className="options-container">
          <button 
            className="option-button"
            onClick={() => onSelectReason('falla' as CancellationReason)}
          >
            <span className="button-text">Fallas en el servicio</span>
            <span className="button-icon">→</span>
          </button>

          <button 
            className="option-button"
            onClick={() => onSelectReason('precio' as CancellationReason)}
          >
            <span className="button-text">Precio del servicio</span>
            <span className="button-icon">→</span>
          </button>
        </div>
      </>
    );
  }

  const solution: Solution = SOLUTIONS[`cancelacion-${selectedReason}`];

  return (
    <div className="solution-container">
      <h2 className="solution-title">{solution.title}</h2>
      
      {solution.benefits && (
        <div className="benefits-section">
          <h3>Beneficios incluidos:</h3>
          <ul>
            {solution.benefits.map((benefit: string, index: number) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="steps-section">
        <h3>Pasos a seguir:</h3>
        <ol>
          {solution.steps.map((step: string, index: number) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}; 