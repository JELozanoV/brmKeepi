import React from 'react';

export interface KpiCardProps {
  label: string;           // "TMO", "% Transferencias", "% Retención", "QA / CSAT"
  value: string;           // "06:45", "22%", "38%", "91% / 4.6"
  hint?: string;           // "Meta ≤ 08:00", etc.
  status?: 'good' | 'warn' | 'bad';
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, status }) => {
  return (
    <div className={`kpi-card ${status ? `kpi-${status}` : ''}`} role="status" aria-label={`${label}: ${value}`}>
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value">{value}</div>
      {hint && <div className="kpi-card__hint">{hint}</div>}
    </div>
  );
};

export default KpiCard;
