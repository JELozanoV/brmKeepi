import React, { useState, useEffect } from 'react';
import './ActionsSection.scss';

export interface ActionItem {
  id: string;
  title: string;   // nombre corto del paso
  detail: string;  // explicación breve
  required?: boolean;
}

interface ActionsSectionProps {
  title?: string;        // "Acciones del asesor"
  actions: ActionItem[]; // items a mostrar
  onCompleteChange?: (doneIds: string[]) => void; // opcional
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  title = 'Acciones del asesor',
  actions,
  onCompleteChange
}) => {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (onCompleteChange) {
      onCompleteChange(Array.from(completedActions));
    }
  }, [completedActions, onCompleteChange]);

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  return (
    <div className="actions-section">
      {title && <h3 className="actions-title">{title}</h3>}
      <div className="actions-list">
        {actions.map(action => (
          <div key={action.id} className="action-item">
            <label className="action-checkbox">
              <input
                type="checkbox"
                checked={completedActions.has(action.id)}
                onChange={() => toggleAction(action.id)}
                aria-label={`${action.title} - ${action.detail}`}
              />
              <span className="checkmark"></span>
              <div className="action-content">
                <div className="action-header">
                  <span className="action-title">{action.title}</span>
                  {action.required && <span className="required-pill">Obligatorio</span>}
                </div>
                <p className="action-detail">{action.detail}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionsSection;
