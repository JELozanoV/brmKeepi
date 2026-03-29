import React, { useEffect, useState } from 'react';
import { fetchRankingMock } from '../services/rankingService';
import { buildRankingVM } from '../utils/rankingUtils';
import { MetricKey } from '../types/ranking';
import RankingCard from '../components/profile/RankingCard';
// Importar la imagen correctamente desde assets
import patinetaImage from '../assets/Patineta.webp';

// Componente para el premio motivacional
const PrizeSection: React.FC<{ currentPosition: number; totalParticipants: number }> = ({ currentPosition, totalParticipants }) => {
  const isTopPerformer = currentPosition === 1;
  const isCloseToTop = currentPosition <= 3;
  const topPercentage = Math.round((1 - (currentPosition - 1) / totalParticipants) * 100);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #03346E 0%, #021526 100%)',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(110, 172, 218, 0.4)',
      boxShadow: '0 8px 32px rgba(2, 21, 38, 0.4)'
    }}>
      {/* Efecto de fondo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Ícono de trofeo */}
      <div style={{
        fontSize: 48,
        marginBottom: 16,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}>
        🏆
      </div>

      <h3 style={{
        color: '#E2E2B6',
        margin: '0 0 8px 0',
        fontSize: 24,
        fontWeight: 700,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        ¡Premio del Mes!
      </h3>

      <p style={{
        color: 'rgba(226, 226, 182, 0.9)',
        margin: '0 0 16px 0',
        fontSize: 16,
        lineHeight: 1.5
      }}>
        {isTopPerformer ? (
          <>🎉 ¡Felicitaciones! ¡Estás en el primer lugar! La patineta eléctrica es tuya si mantienes esta posición hasta fin de mes.</>
        ) : isCloseToTop ? (
          <>🚀 ¡Estás cerca del premio! Solo {currentPosition - 1} posición(es) te separan de ganar la patineta eléctrica.</>
        ) : (
          <>💪 ¡Sigue mejorando! El top 3% gana una patineta eléctrica al final del mes. ¡Tú puedes ser el próximo!</>
        )}
      </p>

      {/* Imagen representativa de la patineta eléctrica */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
        padding: '0 20px'
      }}>
        <img
          src={patinetaImage}
          alt="Patineta Eléctrica - Premio del Mes"
          style={{
            width: '100%',
            maxWidth: '200px',
            height: 'auto',
            borderRadius: '16px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            transition: 'transform 0.3s ease'
          }}
          className="prize-scooter"
          onError={(e) => {
            console.error('Error loading imported Patineta.webp, falling back to emoji');
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '🛴';
          }}
          onLoad={() => {
            console.log('Imported Patineta.webp loaded successfully');
          }}
        />
      </div>

      <div style={{
        background: 'rgba(110, 172, 218, 0.15)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'inline-block',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(110, 172, 218, 0.3)'
      }}>
        <div style={{
          color: '#E2E2B6',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 4
        }}>
          Tu posición actual
        </div>
        <div style={{
          color: '#6EACDA',
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1
        }}>
          #{currentPosition} de {totalParticipants}
        </div>
        <div style={{
          color: 'rgba(226, 226, 182, 0.8)',
          fontSize: 12,
          marginTop: 4
        }}>
          Top {topPercentage}%
        </div>
      </div>

      {/* Efectos visuales adicionales */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        fontSize: 24,
        opacity: 0.3
      }} className="prize-sparkle">
        ⚡
      </div>
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: -20,
        fontSize: 24,
        opacity: 0.3
      }} className="prize-sparkle-reverse">
        ⭐
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .prize-scooter {
          animation: bounce 2s infinite;
        }

        .prize-sparkle {
          animation: float 3s ease-in-out infinite;
        }

        .prize-sparkle-reverse {
          animation: float 3s ease-in-out infinite reverse;
        }
      `}</style>
    </div>
  );
};

const RankingPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rankingMetricTeam, setRankingMetricTeam] = useState<MetricKey>('tmo');
  const [rankingMetricOp, setRankingMetricOp] = useState<MetricKey>('tmo');
  const [rankingData, setRankingData] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      console.log('🚀 [RankingPage] Iniciando carga de datos...');
      const startTime = performance.now();
      setLoading(true);
      setError(null);
      try {
        console.log('📡 [RankingPage] Llamando fetchRankingMock...');
        const fetchStart = performance.now();
        const ds = await fetchRankingMock('week'); // Rango fijo
        const fetchEnd = performance.now();
        console.log(`✅ [RankingPage] Datos obtenidos en ${Math.round(fetchEnd - fetchStart)}ms`);

        if (!cancelled) {
          console.log('🔨 [RankingPage] Procesando datos con buildRankingVM...');
          const processStart = performance.now();
          setRankingData(ds);
          const processEnd = performance.now();
          console.log(`✅ [RankingPage] Datos procesados en ${Math.round(processEnd - processStart)}ms`);
        }
      } catch (e) {
        console.error('❌ [RankingPage] Error al cargar rankings:', e);
        if (!cancelled) setError('No se pudieron cargar los rankings');
      } finally {
        if (!cancelled) {
          setLoading(false);
          const endTime = performance.now();
          console.log(`🏁 [RankingPage] Carga completa en ${Math.round(endTime - startTime)}ms`);
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, []); // Sin dependencias, se ejecuta solo una vez

  return (
    <div className="app-content">
      <div className="filtered-rates-section" style={{
        background: 'rgba(2, 21, 38, 0.95)',
        color: '#E2E2B6',
        padding: 20,
        borderRadius: 12,
        maxWidth: 1200,
        margin: '0 auto',
        border: '1px solid rgba(110, 172, 218, 0.3)',
        boxShadow: '0 4px 16px rgba(2, 21, 38, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#E2E2B6', fontWeight: 700, margin: 0, fontSize: 22, letterSpacing: 0.3 }}>
            Rankings
          </h2>
        </div>

        {loading && <div style={{ textAlign: 'center', color: 'rgba(226, 226, 182, 0.8)' }}>Cargando rankings…</div>}
        {error && <div style={{ textAlign: 'center', color: 'rgba(226, 226, 182, 0.95)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(2, 21, 38, 0.95) 100%)', border: '1px solid rgba(239, 68, 68, 0.5)', padding: 12, borderRadius: 8 }}>{error}</div>}

        {rankingData && (
          <div style={{ display: 'grid', gap: 24 }}>
            {/* Sección de premio motivacional - basada en operación completa (300 asesores) */}
            <PrizeSection
              currentPosition={buildRankingVM(rankingMetricOp, rankingData, 'operation').position}
              totalParticipants={buildRankingVM(rankingMetricOp, rankingData, 'operation').total}
            />

            {/* Ranking de toda la operación - primero (contexto amplio: ~300 asesores) */}
            <RankingCard
              title="Ranking de toda la operación"
              metric={rankingMetricOp}
              onMetricChange={setRankingMetricOp}
              vm={buildRankingVM(rankingMetricOp, rankingData, 'operation')}
            />

            {/* Ranking de mi equipo - segundo (contexto específico: ~24 asesores) */}
            <RankingCard
              title="Ranking de mi equipo"
              metric={rankingMetricTeam}
              onMetricChange={setRankingMetricTeam}
              vm={buildRankingVM(rankingMetricTeam, rankingData, 'team', 'c-1')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;