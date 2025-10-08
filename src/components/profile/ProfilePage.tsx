import React, { useEffect, useMemo, useState } from 'react';
import { Range } from '../../types/profile';
import { getMyKpis } from '../../services/kpisService';
import { formatTmo } from '../../utils/metrics';
import { computeKpiViewModels } from '../../utils/kpiSelector';
import KpiCard from './KpiCard';
import ProfileInfoCard from './ProfileInfoCard';
import { useCurrentUser } from '../../hooks/useCurrentUser';
// import ProfileOperationalPanel from './ProfileOperationalPanel';
import KpiCoach from './KpiCoach';
import { EXPECTED_CALLS } from '../../config/constants';
import '../../styles/operational.scss';
import KpiHistoryCard from './KpiHistoryCard';
import ProfileRankingCard from './ProfileRankingCard';

const ProfilePage: React.FC = () => {
  const [range, setRange] = useState<Range>('week');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ callsHandled: number; totalHandleTimeSec: number; transfers: number; retentionAccepted: number; cancellationIntents?: number; qa: number; csat: number } | null>(null);

  // Por ahora hardcodeado; preparado para integrar datos reales (servicio backend o contexto)
  const { user, loading: userLoading } = useCurrentUser();
  const profile = {
    firstName: user?.firstName || 'Asesor',
    lastName: user?.lastName || '',
    coordinator: user?.coordinatorName || 'Andriu Orduz',
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyKpis(range);
        if (!cancelled) setData(res);
      } catch {
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
    const vm = computeKpiViewModels(range, {
      tmoSec,
      transfersPct: transPctNum,
      npsPct: Math.round(data.qa)
    }, undefined, {
      n: calls,
      N: EXPECTED_CALLS[range],
      totalTalkSec: data.totalHandleTimeSec,
      transfers: data.transfers
    });
    return { tmo, tmoSec, transPct, transPctNum, qaPct, csatStr, vm };
  }, [data, range]);

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
          {userLoading ? (
            <div className="kpi-loading">Cargando perfil…</div>
          ) : (
            <ProfileInfoCard
              firstName={profile.firstName}
              lastName={profile.lastName}
              coordinator={profile.coordinator}
            />
          )}

          {/* Componente de ranking reducido en el sidebar */}
          <ProfileRankingCard range={range} />

          {/* Botón para ver Rankings completos */}
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button
              style={{
                background: '#1A4DFF',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #1A4DFF33',
                letterSpacing: 0.3,
                width: '100%'
              }}
              onClick={() => window.location.href = '/brmKeepi/ranking'}
            >
              Ver Rankings Completos
            </button>
          </div>
        </aside>

        <main className="profile-main">
          {loading && <div className="kpi-loading">Cargando KPIs…</div>}
          {error && <div className="kpi-error">{error}</div>}

          {derived && (
            <>
              <div className="kpi-grid">
                <KpiCard label="TMO" value={derived.tmo} hint="Tu meta hoy: 07:00 o menos" vm={derived.vm.tmo} />
                <KpiCard label="Transferencia" value={derived.transPct} hint="Tu meta hoy: 40% o menos" vm={derived.vm.transfers} />
                <KpiCard label="Tu NPS" value={derived.qaPct} hint="Tu meta hoy: 60% o más" vm={derived.vm.nps} />
              </div>
              {/* Sección KpiCoach (debajo de KPI cards) */}
              <section aria-label="KpiCoach" style={{ marginTop: '1.5rem' }}>
                <h3 className="profile-title" style={{ marginBottom: '0.75rem' }}>KpiCoach</h3>
                <KpiCoach
                  range={range}
                  callsHandled={data?.callsHandled || 0}
                  totalHandleTimeSec={data?.totalHandleTimeSec || 0}
                  transfers={data?.transfers || 0}
                  npsPct={Math.round(data?.qa || 0)}
                />
              </section>

              {/* Historial KPI */}
              <KpiHistoryCard userId={user?.id || null} />
            </>
          )}

          {/* Sección Información operativa removida a solicitud */}

          
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
