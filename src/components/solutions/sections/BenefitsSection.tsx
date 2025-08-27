import React from 'react';

interface Benefit {
  readonly icon: string;
  readonly title: string;
  readonly features: ReadonlyArray<string>;
}

interface BenefitsSectionProps {
  readonly benefits: ReadonlyArray<Benefit>;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => (
  <div className="benefits-section">
    <div className="benefits-grid">
      {benefits.map((benefit, index) => (
        <div key={index} className="benefit-card">
          <div className="benefit-header">
            <span className="benefit-icon">{benefit.icon}</span>
            <h4>{benefit.title}</h4>
          </div>
          <ul>
            {benefit.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default BenefitsSection;