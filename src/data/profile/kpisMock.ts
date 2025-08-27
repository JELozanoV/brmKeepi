import { RawKpis } from '../../types/profile';

export const kpisMock: Record<'today' | 'week' | 'month', RawKpis> = {
  today: { callsHandled: 18, totalHandleTimeSec: 7200, transfers: 3,  retentionAccepted: 7,  qa: 92, csat: 4.6, cancellationIntents: 12 },
  week:  { callsHandled: 95, totalHandleTimeSec: 37200, transfers: 14, retentionAccepted: 41, qa: 91, csat: 4.5, cancellationIntents: 60 },
  month: { callsHandled: 380,totalHandleTimeSec: 151200, transfers: 63, retentionAccepted: 165,qa: 90, csat: 4.4, cancellationIntents: 240 }
};
