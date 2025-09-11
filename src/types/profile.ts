export type Range = 'today' | 'week' | 'month';

export interface RawKpis {
  callsHandled: number;
  totalHandleTimeSec: number;   // suma de tiempos en segundos
  transfers: number;
  retentionAccepted: number;
  cancellationIntents?: number; // si no viene, usar callsHandled como fallback
  qa: number;                   // 0–100
  csat: number;                 // 0–5
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  coordinator: string;
  email?: string;
  id?: string;
  avatarUrl?: string;
}
