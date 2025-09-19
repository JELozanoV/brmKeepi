import { TIMEZONE, KPI_TARGETS, CALENDAR_WARN_ABSOLUTE } from '../config/constants';

export interface DayKpi {
  date: string; // YYYY-MM-DD
  tmoSec?: number;
  transfersPct?: number;
  npsPct?: number;
}

export type DayStatus = 'green' | 'yellow' | 'red' | 'gray';

export interface MonthHistoryResponse {
  month: string; // YYYY-MM
  days: Record<string, DayKpi>; // key: YYYY-MM-DD
}

export function evaluateDayStatus(day?: DayKpi): DayStatus {
  if (!day || (day.tmoSec == null && day.transfersPct == null && day.npsPct == null)) return 'gray';
  const { tmoSec = Infinity, transfersPct = Infinity, npsPct = -Infinity } = day;
  const green = tmoSec <= KPI_TARGETS.tmoSec && transfersPct <= KPI_TARGETS.transfersPct && npsPct >= KPI_TARGETS.npsPct;
  if (green) return 'green';
  // yellow if near thresholds
  const nearTmo = tmoSec <= KPI_TARGETS.tmoSec + CALENDAR_WARN_ABSOLUTE.tmoSeconds;
  const nearTransfers = transfersPct <= KPI_TARGETS.transfersPct + CALENDAR_WARN_ABSOLUTE.transfersPoints;
  const nearNps = npsPct >= KPI_TARGETS.npsPct - CALENDAR_WARN_ABSOLUTE.npsPoints;
  if (nearTmo || nearTransfers || nearNps) return 'yellow';
  return 'red';
}

export async function getMonthlyHistory(monthIso: string): Promise<MonthHistoryResponse> {
  // TODO backend real: GET /kpi/historico?month=YYYY-MM
  try {
    const resp = await fetch(`/kpi/historico?month=${monthIso}`, { method: 'GET' });
    if (!resp.ok) throw new Error('API not ready');
    const data = (await resp.json()) as MonthHistoryResponse;
    return data;
  } catch {
    // Mock simple: genera datos plausibles para el mes
    const days: Record<string, DayKpi> = {};
    const [y, m] = monthIso.split('-').map(Number);
    const daysInMonth = 30; // simplificado para mock; UI usa base 30 visualmente
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, '0');
      const date = `${monthIso}-${dd}`;
      // aleatorio acotado para demo
      const tmoSec = 360 + Math.floor(Math.random() * 240); // 6:00 a 10:00
      const transfersPct = 30 + Math.floor(Math.random() * 30); // 30-60
      const npsPct = 50 + Math.floor(Math.random() * 50); // 50-100
      days[date] = { date, tmoSec, transfersPct, npsPct };
    }
    return { month: monthIso, days };
  }
}


