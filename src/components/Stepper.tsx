import React from 'react';
import './Stepper.scss';

interface Props {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step-item ${index + 1 <= currentStep ? 'active' : ''}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
