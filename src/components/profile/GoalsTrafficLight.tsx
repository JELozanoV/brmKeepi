import React from 'react';
import { KpiGoal } from '../../types/operational';
import { GOALS_WARN_THRESHOLD } from '../../config/constants';

export interface GoalsTrafficLightProps {
  /** Lista de metas y valores actuales por KPI */
  goals: KpiGoal[];
}

function evaluate(goal: KpiGoal): 'ok' | 'warn' | 'bad' {
  const { comparator, value: target } = goal.target;
  const current = goal.value;
  const thresholdPct = GOALS_WARN_THRESHOLD; // configurable

  if (target === 0) {
    // Fallback por si target es 0; aplica comparación directa
    if (comparator === '≤') return current <= 0 ? 'ok' : 'bad';
    return current >= 0 ? 'ok' : 'bad';
  }

  if (comparator === '≤') {
    const greenMax = target * (1 - thresholdPct);
    if (current <= greenMax) return 'ok';
    if (current <= target) return 'warn';
    return 'bad';
  } else {
    const greenMin = target * (1 + thresholdPct);
    if (current >= greenMin) return 'ok';
    if (current >= target) return 'warn';
    return 'bad';
  }
}

/**
 * Renderiza un semáforo por KPI según cumplimiento de meta
 */
const GoalsTrafficLight: React.FC<GoalsTrafficLightProps> = ({ goals }) => {
  return (
    <div className="op-card" role="region" aria-label="Metas por KPI">
      <div className="card-title">Metas (semáforo)</div>
      <div className="traffic-grid">
        {goals.map((g) => {
          const status = evaluate(g);
          return (
            <div key={g.key} className="traffic-item">
              <div className={`dot dot-${status}`} aria-label={status} />
              <div className="traffic-content">
                <div className="kpi-subtle">{g.label}</div>
                <div className="traffic-values">
                  <span className="current">{g.displayValue}</span>
                  <span className="target">Meta {g.target.display}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsTrafficLight;


