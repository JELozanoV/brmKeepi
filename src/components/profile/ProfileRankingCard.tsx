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
        background: '#111',
        border: '1px solid #1A4DFF',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'rgba(255,255,255,0.75)',
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
        background: '#111',
        border: '1px solid #333',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'rgba(255,255,255,0.5)',
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
    return null;
  }

  if (!teamRanking || !operationRanking) {
    return (
      <div style={{
        background: '#111',
        border: '1px solid #333',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        color: 'rgba(255,255,255,0.5)',
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
      background: '#111',
      border: '1px solid #1A4DFF',
      borderRadius: 12,
      padding: 16,
      marginTop: 16
    }}>
      <h4 style={{
        color: 'rgba(255,255,255,0.95)',
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
          background: 'rgba(26,77,255,0.08)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid rgba(26,77,255,0.2)'
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4
          }}>
            En mi equipo
          </div>
          <div style={{
            color: '#1A4DFF',
            fontSize: 18,
            fontWeight: 800
          }}>
            #{teamPosition} de {teamTotal}
          </div>
        </div>

        {/* Operation Ranking */}
        <div style={{
          background: 'rgba(26,77,255,0.08)',
          borderRadius: 8,
          padding: 12,
          border: '1px solid rgba(26,77,255,0.2)'
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 4
          }}>
            En la operación
          </div>
          <div style={{
            color: '#1A4DFF',
            fontSize: 18,
            fontWeight: 800
          }}>
            #{operationPosition} de {operationTotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRankingCard;