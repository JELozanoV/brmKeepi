import React from 'react';
import { Benchmark } from '../../types/operational';

export interface BenchmarkCardProps {
  /** Datos de benchmark/ranking */
  data: Benchmark;
}

const formatSec = (sec: number) => {
  const m = Math.floor(Math.abs(sec) / 60).toString().padStart(2, '0');
  const s = Math.floor(Math.abs(sec) % 60).toString().padStart(2, '0');
  const sign = sec > 0 ? '+' : sec < 0 ? '−' : '';
  return `${sign}${m}:${s}`;
};

const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ data }) => {
  return (
    <div className="op-card" role="region" aria-label="Benchmark y ranking">
      <div className="card-title">Ranking</div>
      <div className="bench-grid">
        <div className="bench-main">
          <div className="position">#{data.position} de {data.total}</div>
          <div className="percentile">Top {data.percentile}%</div>
        </div>
        <div className="bench-stats">
          <div className="row">
            <span className="kpi-subtle">Prommedio de tu equipo TMO</span>
            <span>{formatSec(data.teamAvg.tmoSec)}</span>
          </div>
          <div className="row">
            <span className="kpi-subtle">Promedio de tu equipo NPS</span>
            <span>{data.teamAvg.npsPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkCard;


