import { RawKpis } from '../../types/profile';

export const kpisMock: Record<'today' | 'week' | 'month', RawKpis> = {
  today: { callsHandled: 18, totalHandleTimeSec: 7500, transfers: 9,  retentionAccepted: 7,  qa: 92, csat: 4.6, cancellationIntents: 40 },
  week:  { callsHandled: 95, totalHandleTimeSec: 37200, transfers: 50, retentionAccepted: 41, qa: 91, csat: 4.5, cancellationIntents: 60 },
  month: { callsHandled: 380,totalHandleTimeSec: 151200, transfers: 100, retentionAccepted: 165,qa: 90, csat: 4.4, cancellationIntents: 240 }
};
