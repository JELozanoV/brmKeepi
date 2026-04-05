import React, { useEffect, useState } from 'react';
import { Range } from '../../types/profile';
import { fetchRankingMock } from '../../services/rankingService';
import { buildRankingVM } from '../../utils/rankingUtils';
import { RankingDataset, RankingViewModel } from '../../types/ranking';

interface ProfileRankingCardProps {
  range: Range;
}

const ProfileRankingCard: React.FC<ProfileRankingCardProps> = ({ range }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rankingData, setRankingData] = useState<RankingDataset | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const ds = await fetchRankingMock(range);
        if (!cancelled) setRankingData(ds);
      } catch {
        if (!cancelled) setRankingData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [range]);

  if (loading) {
    return (
      <div style={{
        background: 'var(--brm-bg-card)',
        border: '1px solid var(--brm-border)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'var(--brm-text-secondary)',
        fontSize: 14,
        textAlign: 'center'
      }}>
        Cargando posiciones...
      </div>
    );
  }

  if (!rankingData || !rankingData.participants || rankingData.participants.length === 0) {
    return (
      <div style={{
        background: 'var(--brm-bg-card)',
        border: '1px solid var(--brm-border)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'var(--brm-text-muted)',
        fontSize: 14,
        textAlign: 'center'
      }}>
        No hay datos de ranking disponibles
      </div>
    );
  }

  // Get user's position in team and operation
  let teamRanking: RankingViewModel | null = null;
  let operationRanking: RankingViewModel | null = null;

  try {
    teamRanking = buildRankingVM('combined', rankingData, 'team', 'c-1');
    operationRanking = buildRankingVM('combined', rankingData, 'operation');
  } catch {
    return (
      <div style={{
        background: 'var(--brm-bg-card)',
        border: '1px solid var(--brm-border)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'var(--brm-text-muted)',
        fontSize: 14,
        textAlign: 'center'
      }}>
        Error al cargar rankings
      </div>
    );
  }

  if (!teamRanking || !operationRanking) {
    return (
      <div style={{
        background: 'var(--brm-bg-card)',
        border: '1px solid var(--brm-border)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'var(--brm-text-muted)',
        fontSize: 14,
        textAlign: 'center'
      }}>
        Error al cargar rankings
      </div>
    );
  }

  const getUserPosition = (ranking: RankingViewModel) => {
    if (!ranking || !ranking.sixRows) return null;
    const userRow = ranking.sixRows.find((row) => row?.isMe === true);
    return userRow ? userRow.position : null;
  };

  const getTotalParticipants = (ranking: RankingViewModel) => {
    return ranking?.total ?? 0;
  };

  const teamPosition = getUserPosition(teamRanking) ?? 0;
  const operationPosition = getUserPosition(operationRanking) ?? 0;
  const teamTotal = getTotalParticipants(teamRanking) ?? 1;
  const operationTotal = getTotalParticipants(operationRanking) ?? 1;

  return (
    <div style={{
      background: 'var(--brm-bg-card)',
      border: '1px solid var(--brm-border)',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      boxShadow: '0 4px 16px var(--brm-shadow)'
    }}>
      <h4 style={{
        color: 'var(--brm-text)',
        fontSize: 16,
        fontWeight: 700,
        margin: '0 0 12px 0',
        letterSpacing: 0.3
      }}>
        Mi Posición
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Team Ranking */}
        <div style={{
          background: 'var(--brm-bg)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid var(--brm-border)'
        }}>
          <div style={{
            color: 'var(--brm-text-secondary)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4
          }}>
            En mi equipo
          </div>
          <div style={{
            color: 'var(--brm-accent)',
            fontSize: 18,
            fontWeight: 800
          }}>
            #{teamPosition} de {teamTotal}
          </div>
        </div>

        {/* Operation Ranking */}
        <div style={{
          background: 'var(--brm-bg)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid var(--brm-border)'
        }}>
          <div style={{
            color: 'var(--brm-text-secondary)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4
          }}>
            En la operación
          </div>
          <div style={{
            color: 'var(--brm-accent)',
            fontSize: 18,
            fontWeight: 800
          }}>
            #{operationPosition} de {operationTotal}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          style={{
            background: 'var(--brm-btn-active-bg)',
            color: 'var(--brm-btn-active-color)',
            border: '1px solid var(--brm-accent)',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 8px var(--brm-shadow)',
            letterSpacing: 0.3,
            width: '100%'
          }}
          onClick={() => (window.location.href = '/brmKeepi/ranking')}
        >
          Ver Rankings Completos
        </button>
      </div>
    </div>
  );
};

export default ProfileRankingCard;