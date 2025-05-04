import React from 'react';
import './StepByStepSection.scss';

interface Step {
  stepTitle: string;
  text: string;
  image: string;
}

interface Props {
  title: string;
  introduction: string;
  steps: Step[];
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  showBackToValidations: boolean;
  totalSteps: number;
}

const StepByStepSection: React.FC<Props> = ({
  title,
  introduction,
  steps,
  currentStep,
  onBack,
  onNext,
  showBackToValidations,
  totalSteps
}) => {
  return (
    <div className="step-by-step-section">
      <div className="step-header">
        <h3>{title}</h3>
        <div className="step-counter">
          {steps[currentStep].stepTitle.replace('.', '')} de {totalSteps}
        </div>
      </div>

      {currentStep === 0 && (
        <div className="step-introduction">
          {introduction}
        </div>
      )}

      <div className="step-content">
        <div className="step-text">
          <span className="step-title">{steps[currentStep].stepTitle}</span> {steps[currentStep].text}
        </div>
        
        <div className="step-image">
          <img src={steps[currentStep].image} alt={`${steps[currentStep].stepTitle} ${steps[currentStep].text}`} />
        </div>
      </div>

      <div className="step-navigation">
        <button 
          className="nav-button back"
          onClick={onBack}
        >
          <span className="button-icon">←</span>
          <span className="button-text">
            {showBackToValidations ? 'Volver a Validaciones' : 'Anterior'}
          </span>
        </button>

        {currentStep < totalSteps - 1 && (
          <button 
            className="nav-button next"
            onClick={onNext}
          >
            <span className="button-text">Siguiente</span>
            <span className="button-icon">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StepByStepSection; 