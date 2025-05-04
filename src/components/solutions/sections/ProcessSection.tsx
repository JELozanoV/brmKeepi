import React from 'react';
import './ProcessSection.scss';

interface Step {
  description: string;
  image: string;
  details: string[];
}

interface Process {
  title: string;
  steps: Step[];
}

interface Props {
  processes: Process[];
}

const ProcessSection: React.FC<Props> = ({ processes }) => {
  return (
    <div className="process-section">
      {processes.map((process, index) => (
        <div key={index} className="process-container">
          <h3 className="process-title">{process.title}</h3>
          <div className="steps-container">
            {process.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="step-card">
                <div className="step-header">
                  <span className="step-number">{stepIndex + 1}</span>
                  <h4 className="step-description">{step.description}</h4>
                </div>
                <div className="step-content">
                  <img src={step.image} alt={step.description} className="step-image" />
                  <ul className="step-details">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessSection; 