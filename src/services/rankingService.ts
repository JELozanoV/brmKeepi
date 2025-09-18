import { RankingDataset } from '../types/ranking';
import { CURRENT_USER } from '../config/constants';

// TODO back: reemplazar por fetch('/api/ranking?timeframe=...')
export async function fetchRankingMock(timeframe: 'today'|'week'|'month'): Promise<RankingDataset> {
  await new Promise(r => setTimeout(r, 80));
  const currentUserId = CURRENT_USER.id;
  const participants = [
    { id: CURRENT_USER.id, name: CURRENT_USER.displayName || 'Asesor', coordinatorId: CURRENT_USER.coordinatorId, tmoSec: 400, transfersPct: 50, npsPct: 92 },
    { id: 'p-2', name: 'Camila R.', coordinatorId: 'c-1', tmoSec: 399, transfersPct: 38, npsPct: 90 },
    { id: 'p-3', name: 'Jorge M.', coordinatorId: 'c-1', tmoSec: 418, transfersPct: 42, npsPct: 88 },
    { id: 'p-4', name: 'Ana S.', coordinatorId: 'c-2', tmoSec: 405, transfersPct: 44, npsPct: 89 },
    { id: 'p-5', name: 'Luis T.', coordinatorId: 'c-2', tmoSec: 410, transfersPct: 41, npsPct: 87 },
    { id: 'p-6', name: 'Rosa K.', coordinatorId: 'c-1', tmoSec: 420, transfersPct: 53, npsPct: 85 },
    { id: 'p-7', name: 'Marco D.', coordinatorId: 'c-3', tmoSec: 395, transfersPct: 39, npsPct: 91 },
  ];
  return { timeframe, currentUserId, participants };
}


