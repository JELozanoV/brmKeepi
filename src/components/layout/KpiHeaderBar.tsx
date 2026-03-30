import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKpiLiveData } from '../../hooks/useKpiLiveData';

const formatSec = (sec?: number) => {
  if (sec == null) return '—';
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const r = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
};

const KpiHeaderBar: React.FC = () => {
  const { vm, snapshot } = useKpiLiveData(30000, 'today');
  const navigate = useNavigate();

  const tmoVal = snapshot ? formatSec(snapshot.tmoSec) : '—';
  const trVal = snapshot ? `${Math.round(snapshot.transfersPct)}%` : '—';
  const npsVal = snapshot ? `${Math.round(snapshot.npsPct)}%` : '—';

  const tmoState = vm?.tmo.status || 'ok';
  const trState = vm?.transfers.status || 'ok';
  const npsState = vm?.nps.status || 'ok';

  return (
    <div className="kpi-header-bar">
      <div className="kpi-header-bar__content">
        <button className={`kpi-chip kpi-chip-${tmoState}`} aria-label={vm?.tmo.ariaLabel || 'TMO actual'} onClick={() => navigate('/perfil')}>
          <span className="kpi-chip__label">TMO</span>
          <span className="kpi-chip__value">{tmoVal}</span>
        </button>
        <button className={`kpi-chip kpi-chip-${trState}`} aria-label={vm?.transfers.ariaLabel || 'Transferencias actuales'} onClick={() => navigate('/perfil')}>
          <span className="kpi-chip__label">Trans</span>
          <span className="kpi-chip__value">{trVal}</span>
        </button>
        <button className={`kpi-chip kpi-chip-${npsState}`} aria-label={vm?.nps.ariaLabel || 'NPS actual'} onClick={() => navigate('/perfil')}>
          <span className="kpi-chip__label">NPS</span>
          <span className="kpi-chip__value">{npsVal}</span>
        </button>
      </div>
    </div>
  );
};

export default KpiHeaderBar;
