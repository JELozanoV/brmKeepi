import React, { useEffect, useMemo, useState } from 'react';
import { Range } from '../../types/profile';
import { getMyKpis } from '../../services/kpisService';
import { formatTmo, getStatusByThresholds } from '../../utils/metrics';
import KpiCard from './KpiCard';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileOperationalPanel from './ProfileOperationalPanel';
import KpiCoach from './KpiCoach';
import '../../styles/operational.scss';

const ProfilePage: React.FC = () => {
  const [range, setRange] = useState<Range>('week');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ callsHandled: number; totalHandleTimeSec: number; transfers: number; retentionAccepted: number; cancellationIntents?: number; qa: number; csat: number } | null>(null);

  // Por ahora hardcodeado; preparado para integrar datos reales (servicio backend o contexto)
  const profile = {
    firstName: 'Juan',
    lastName: 'Pérez',
    coordinator: 'María Gómez',
  };

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
    const tmoSec = calls ? data.totalHandleTimeSec / calls : 0;
    const tmo = formatTmo(tmoSec);
    const transPctNum = calls ? Math.round((data.transfers / calls) * 100) : 0;
    const transPct = `${transPctNum}%`;
    const qaPct = `${Math.round(data.qa)}%`;
    const csatStr = data.csat.toFixed(1);

    const status = getStatusByThresholds({
      tmoSec,
      transPct: transPctNum,
      qa: data.qa,
      csat: data.csat,
    });

    return { tmo, tmoSec, transPct, transPctNum, qaPct, csatStr, status };
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

      <div className="profile-layout">
        <aside className="profile-sidebar" aria-label="Información del asesor">
          <ProfileInfoCard
            firstName={profile.firstName}
            lastName={profile.lastName}
            coordinator={profile.coordinator}
          />
        </aside>

        <main className="profile-main">
          {loading && <div className="kpi-loading">Cargando KPIs…</div>}
          {error && <div className="kpi-error">{error}</div>}

          {derived && (
            <>
              <div className="kpi-grid">
                <KpiCard label="TMO" value={derived.tmo} hint="Tu meta hoy: 07:00 o menos" comparator="≤" numericValue={derived.tmoSec} targetValue={420} />
                <KpiCard label="Tu tasa" value={derived.transPct} hint="Tu meta hoy: 40% o menos" comparator="≤" numericValue={derived.transPctNum} targetValue={40} warnAbsoluteDelta={5} />
                <KpiCard label="Tu NPS" value={`${derived.qaPct}%`} hint="Tu meta hoy: 60% o más" comparator="≥" numericValue={parseInt(derived.qaPct, 10)} targetValue={60} warnAbsoluteDelta={5} />
              </div>
              {/* Sección KpiCoach (debajo de KPI cards) */}
              <section aria-label="KpiCoach" style={{ marginTop: '1.5rem' }}>
                <h3 className="profile-title" style={{ marginBottom: '0.75rem' }}>KpiCoach</h3>
                <KpiCoach
                  range={range as any}
                  callsHandled={data?.callsHandled || 0}
                  totalHandleTimeSec={data?.totalHandleTimeSec || 0}
                  transfers={data?.transfers || 0}
                  npsPct={Math.round(data?.qa || 0)}
                />
              </section>
            </>
          )}

          {/* Sección Información operativa */}
          <section aria-label="Información operativa" style={{ marginTop: '1.5rem' }}>
            <h3 className="profile-title" style={{ marginBottom: '0.75rem' }}>Información operativa</h3>
            <ProfileOperationalPanel timeframe={range as any} />
          </section>

          
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
