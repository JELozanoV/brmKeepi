import React from 'react';
import './ProcedureSection.scss';

interface Props {
  onSelectProcedure: (type: 'pruebas' | 'soporte' | 'aprovisionamiento' | 'marcacion') => void;
}

const ProcedureSection: React.FC<Props> = ({ onSelectProcedure }) => {
  const procedures = [
    {
      type: 'pruebas',
      icon: '🔍',
      title: 'Pruebas básicas del navegador',
      description: 'Realiza pruebas básicas para identificar y solucionar problemas del navegador.'
    },
    {
      type: 'soporte',
      icon: '🛠️',
      title: 'Soporte en T&D',
      description: 'Brinda soporte técnico utilizando la herramienta T&D.'
    },
    {
      type: 'aprovisionamiento',
      icon: '📦',
      title: 'Aprovisionamiento',
      description: 'Gestiona el aprovisionamiento del servicio cuando sea necesario.'
    },
    {
      type: 'marcacion',
      icon: '✅',
      title: 'Marcación',
      description: 'Realiza la marcación correspondiente en el sistema.'
    }
  ];

  return (
    <div className="procedure-section">
      <div className="procedure-options">
        {procedures.map((procedure) => (
          <button
            key={procedure.type}
            className="procedure-option"
            onClick={() => onSelectProcedure(procedure.type as any)}
          >
            <span className="procedure-icon">{procedure.icon}</span>
            <div className="procedure-info">
              <h4>{procedure.title}</h4>
              <p>{procedure.description}</p>
            </div>
            <span className="arrow-icon">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProcedureSection; 