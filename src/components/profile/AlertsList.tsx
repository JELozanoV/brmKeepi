import React from 'react';
import { Alert } from '../../types/operational';

export interface AlertsListProps {
  /** Lista de alertas personalizadas */
  alerts: Alert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div className="op-card" role="region" aria-label="Alertas personalizadas">
      <div className="card-title">Alertas</div>
      <div className="alerts-list">
        {alerts.map((a, idx) => (
          <div key={idx} className={`alert-item sev-${a.severity}`}>
            <span className="badge" aria-label={a.severity}>
              {a.severity === 'high' ? 'Alta' : a.severity === 'medium' ? 'Media' : 'Baja'}
            </span>
            <span className="text">{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;


