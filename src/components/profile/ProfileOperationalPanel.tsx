import React, { useEffect, useState } from 'react';
import { OperationalProfile, OperationalTimeframe, TrendSeries } from '../../types/operational';
import { fetchOperationalProfile } from '../../services/operationalProfile';
import GoalsTrafficLight from './GoalsTrafficLight';
import TrendMiniChart from './TrendMiniChart';
import BenchmarkCard from './BenchmarkCard';

export interface ProfileOperationalPanelProps {
  /** today | week | month */
  timeframe: OperationalTimeframe;
}

/**
 * Panel de Información Operativa en Mi Perfil
 */
const ProfileOperationalPanel: React.FC<ProfileOperationalPanelProps> = ({ timeframe }) => {
  const [data, setData] = useState<OperationalProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchOperationalProfile(timeframe);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError('No se pudo cargar la información operativa');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [timeframe]);

  if (loading) return <div className="op-card">Cargando información…</div>;
  if (error) return <div className="op-card">{error}</div>;
  if (!data) return null;

  const tmoSeries = data.trends.find(s => s.key === 'tmo') as TrendSeries;
  const transfersSeries = data.trends.find(s => s.key === 'transfers') as TrendSeries;
  const npsSeries = data.trends.find(s => s.key === 'nps') as TrendSeries;

  return (
    <div className="operational-grid">
      {/* Semáforo global oculto; la lógica ahora vive en las tarjetas principales */}
      <div className="op-chart-cards">
        <TrendMiniChart series={tmoSeries} />
        <TrendMiniChart series={transfersSeries} />
      </div>
      <BenchmarkCard data={data.benchmark} />
      <div className="op-chart-cards">
        <TrendMiniChart series={transfersSeries} />
        <TrendMiniChart series={npsSeries} />
      </div>
    </div>
  );
};

export default ProfileOperationalPanel;


