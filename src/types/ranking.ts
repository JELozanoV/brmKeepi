export type MetricKey = 'tmo' | 'transfers' | 'nps' | 'combined';

export interface Participant {
  id: string;
  name: string;
  coordinatorId?: string | null;
  tmoSec?: number;         // menor es mejor
  transfersPct?: number;   // menor es mejor
  npsPct?: number;         // mayor es mejor
  compositeScore?: number; // opcional desde backend
}

export interface RankingDataset {
  timeframe: 'today' | 'week' | 'month';
  currentUserId: string;
  participants: Participant[];
}

export interface RankingRowVM {
  id: string;
  name: string;
  position: number;
  valueLabel: string; // segun métrica seleccionada (mm:ss, %, o Índice)
  isMe: boolean;
  medal?: 'gold'|'silver'|'bronze';
  secondary?: string; // solo para la fila de "Tú"
  ariaLabel?: string;
}

export interface RankingViewModel {
  metric: MetricKey;
  position: number;
  total: number;
  topPercent: number; // 0-100 entero
  headerMessage: string; // texto natural segun posicion
  gapText: string;       // brecha vs promedio del grupo en lenguaje natural
  sixRows: RankingRowVM[]; // lista vertical (6 filas)
  smallNote?: string;      // "Grupo pequeño..." o similares
}


