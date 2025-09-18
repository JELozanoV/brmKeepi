import React from 'react';
import { MetricKey, RankingViewModel } from '../../types/ranking';

interface RankingCardProps {
  title: string;
  metric: MetricKey;
  onMetricChange: (m: MetricKey) => void;
  vm: RankingViewModel;
}

const tabs: MetricKey[] = ['tmo','transfers','nps','combined'];

const RankingCard: React.FC<RankingCardProps> = ({ title, metric, onMetricChange, vm }) => {
  return (
    <section className="op-card" aria-label={title} style={{ marginTop: '1rem' }}>
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <div className="ranking-tabs">
          {tabs.map(t => (
            <button key={t} className={`ranking-tab ${t===metric?'active':''}`} onClick={()=>onMetricChange(t)}>
              {t==='tmo'?'TMO':t==='transfers'?'Transferencia':t==='nps'?'NPS':'Combinado'}
            </button>
          ))}
        </div>
      </div>

      <div className="ranking-header" style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
        <div>Tu posición: {vm.position} de {vm.total}</div>
        <div>Top {vm.topPercent}%</div>
        <div>— {vm.headerMessage}</div>
      </div>

      <div className="ranking-gap" style={{ marginTop: '0.5rem' }}>{vm.gapText}</div>

      {/* Lista vertical de 6 filas */}
      <div className="ranking-vertical" style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
        {vm.sixRows.map((r) => (
          <div key={r.id} className={`ranking-row ${r.isMe ? 'ranking-row-me' : ''}`} aria-label={r.ariaLabel || `Puesto ${r.position} de ${vm.total}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`rank-num`}>#{r.position}</span>
              {r.medal && <span className={`medal medal-${r.medal}`} aria-label={r.medal==='gold'?'Oro':r.medal==='silver'?'Plata':'Bronce'}></span>}
              <span className={r.isMe ? 'me-name' : ''}>{r.name}</span>
              {r.isMe && <span className="me-badge">Mi perfil</span>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>{r.valueLabel}</div>
              {r.isMe && r.secondary && <div className="kpi-subtle">{r.secondary}</div>}
            </div>
          </div>
        ))}
      </div>
      {vm.smallNote && <div className="kpi-subtle" style={{ marginTop: '0.5rem' }}>{vm.smallNote}</div>}
    </section>
  );
};

export default RankingCard;


