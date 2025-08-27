import React, { useEffect, useMemo, useState } from 'react';
import { Range } from '../../types/profile';
import { getMyKpis } from '../../services/kpisService';
import { formatTmo, getStatusByThresholds } from '../../utils/metrics';
import KpiCard from './KpiCard';

const ProfilePage: React.FC = () => {
  const [range, setRange] = useState<Range>('week');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ callsHandled: number; totalHandleTimeSec: number; transfers: number; retentionAccepted: number; cancellationIntents?: number; qa: number; csat: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyKpis(range);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError('No se pudieron cargar KPIs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [range]);

  const derived = useMemo(() => {
    if (!data) return null;
    const calls = data.callsHandled || 0;
    const intents = typeof data.cancellationIntents === 'number' ? data.cancellationIntents : calls;
    const tmoSec = calls ? data.totalHandleTimeSec / calls : 0;
    const tmo = formatTmo(tmoSec);
    const transPctNum = calls ? Math.round((data.transfers / calls) * 100) : 0;
    const transPct = `${transPctNum}%`;
    const retPctNum = intents ? Math.round((data.retentionAccepted / intents) * 100) : 0;
    const retPct = `${retPctNum}%`;
    const qaPct = `${Math.round(data.qa)}%`;
    const csatStr = data.csat.toFixed(1);

    const status = getStatusByThresholds({
      tmoSec,
      transPct: transPctNum,
      retPct: retPctNum,
      qa: data.qa,
      csat: data.csat,
    });

    return { tmo, tmoSec, transPct, transPctNum, retPct, retPctNum, qaPct, csatStr, status };
  }, [data]);

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h2 className="profile-title">Mi Perfil</h2>
        <div className="range-selector" aria-label="Seleccionar rango temporal">
          <button className={`range-btn ${range==='today' ? 'active' : ''}`} onClick={() => setRange('today')}>Hoy</button>
          <button className={`range-btn ${range==='week' ? 'active' : ''}`} onClick={() => setRange('week')}>Semana</button>
          <button className={`range-btn ${range==='month' ? 'active' : ''}`} onClick={() => setRange('month')}>Mes</button>
        </div>
      </div>

      {loading && <div className="kpi-loading">Cargando KPIs…</div>}
      {error && <div className="kpi-error">{error}</div>}

      {derived && (
        <div className="kpi-grid">
          <KpiCard label="TMO" value={derived.tmo} hint="Meta ≤ 08:00" status={derived.status.tmo} />
          <KpiCard label="% Transferencias" value={derived.transPct} hint="Meta ≤ 15%" status={derived.status.trans} />
          <KpiCard label="% Retención" value={derived.retPct} hint="Meta ≥ 35%" status={derived.status.ret} />
          <KpiCard label="NPS" value={`${derived.qaPct} / ${derived.csatStr}`} hint="Meta ≥ 90 / 4.5" status={derived.status.qa === 'bad' || derived.status.csat === 'bad' ? 'bad' : (derived.status.qa === 'warn' || derived.status.csat === 'warn' ? 'warn' : 'good')} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
