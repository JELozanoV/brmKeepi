import React, { useState } from 'react';
import './BaseSolution.scss';

interface Section {
  id: number;
  icon: string;
  title: string;
  content: React.ReactNode;
}

interface Props {
  title: string;
  subtitle?: string;
  icon: string;
  sections: Section[];
  onSolutionApplied: () => void;
  acceptButtonText: string;
  rejectButtonText: string;
  onBack?: () => void;
}

const BaseSolution: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  sections,
  onSolutionApplied,
  acceptButtonText,
  rejectButtonText,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  return (
    <div className="solution-container">
      {onBack && (
        <button 
          className="back-button"
          onClick={onBack}
        >
          <span className="button-icon">←</span>
          <span className="button-text">Volver</span>
        </button>
      )}
      <div className="solution-header">
        <h2 className="solution-title">
          <span className="title-icon">{icon}</span>
          {title}
        </h2>
        {subtitle && <p className="solution-subtitle">{subtitle}</p>}
      </div>

      <div className="sections-navigation">
        {sections.map(section => (
          <button 
            key={section.id}
            className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="tab-icon">{section.icon}</span>
            <span className="tab-text">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="section-content">
        {sections.find(section => section.id === activeSection)?.content}
      </div>

      <div className="solution-actions">
        <button 
          className="action-button accept"
          onClick={() => onSolutionApplied()}
        >
          {acceptButtonText}
        </button>
        <button 
          className="action-button reject"
          onClick={() => onSolutionApplied()}
        >
          {rejectButtonText}
        </button>
      </div>
    </div>
  );
};

export default BaseSolution; 