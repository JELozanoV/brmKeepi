import React from 'react';

interface Rate {
  title: string;
  price: string;
  features: string[];
  isHighlighted?: boolean;
}

interface RatesSectionProps {
  title: string;
  rates: Rate[];
}

const RatesSection: React.FC<RatesSectionProps> = ({ title, rates }) => (
  <div className="rates-section">
    <h3>{title}</h3>
    <div className="rates-grid">
      {rates.map((rate, index) => (
        <div key={index} className={`rate-card ${rate.isHighlighted ? 'highlighted' : ''}`}>
          <div className="rate-header">
            <h4>{rate.title}</h4>
            <span className="price">{rate.price}</span>
          </div>
          <ul>
            {rate.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default RatesSection; 