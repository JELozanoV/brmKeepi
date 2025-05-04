import React from 'react';
import './DiagnosticSection.scss';

interface Step {
  title: string;
  duration: string;
  actions: string[];
}

interface Props {
  title: string;
  steps: Step[];
}

const DiagnosticSection: React.FC<Props> = ({ title, steps }) => {
  return (
    <div className="diagnostic-section">
      <h3>{title}</h3>
      <div className="diagnostic-steps">
        {steps.map((step, index) => (
          <div key={index} className="diagnostic-step">
            <div className="step-header">
              <h4>{step.title}</h4>
              <span className="duration">{step.duration}</span>
            </div>
            <ul className="step-actions">
              {step.actions.map((action, actionIndex) => (
                <li key={actionIndex}>{action}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticSection; 