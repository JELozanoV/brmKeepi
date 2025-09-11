import { OperationalProfile, OperationalTimeframe, TrendSeries, KpiGoal } from '../types/operational';

/**
 * Servicio mock de perfil operativo.
 * TODO back: reemplazar por fetch('/api/profile/operational?timeframe=…') cuando esté disponible.
 */
export async function fetchOperationalProfile(timeframe: OperationalTimeframe = 'today'): Promise<OperationalProfile> {
  // Simula latencia
  await new Promise(r => setTimeout(r, 80));

  // Valores base (mock)
  const tmoSec = 6 * 60 + 40; // 06:40 => 400s
  const transfersPct = 40; // % Transferencias actual
  const npsPct = 70; // NPS % actual

  const target = {
    tmo: { comparator: '≤' as const, value: 7 * 60, display: '≤ 07:00' },
    transfers: { comparator: '≤' as const, value: 40, display: '≤ 40%' },
    nps: { comparator: '≥' as const, value: 60, display: '≥ 60%' },
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const goals: KpiGoal[] = [
    { key: 'tmo', label: 'TMO', value: tmoSec, displayValue: formatSec(tmoSec), target: target.tmo },
    { key: 'transfers', label: '% Transferencias', value: transfersPct, displayValue: `${transfersPct}%`, target: target.transfers },
    { key: 'nps', label: 'NPS', value: npsPct, displayValue: `${npsPct}%`, target: target.nps },
  ];

  // Series de tendencia: 7-10 puntos, variando por timeframe
  const numPoints = timeframe === 'month' ? 10 : 7;
  const today = new Date();
  const mkDate = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (numPoints - 1 - offset));
    return d.toISOString().slice(0, 10);
  };

  const jitter = (base: number, amplitude: number, i: number) => {
    const factor = timeframe === 'today' ? 0.5 : timeframe === 'week' ? 1 : 1.2;
    const delta = (Math.sin(i * 1.1) + Math.cos(i * 0.7)) * amplitude * factor;
    return Math.max(0, Math.round(base + delta));
  };

  const tmoBase = tmoSec; // en segundos
  const transfersBase = transfersPct;
  const npsBase = npsPct;

  const tmoSeries: TrendSeries = {
    key: 'tmo',
    label: 'TMO',
    points: Array.from({ length: numPoints }).map((_, i) => ({
      date: mkDate(i),
      value: jitter(tmoBase, 20, i), // +- ~20s
      display: formatSec(jitter(tmoBase, 20, i)),
    })),
  };

  const transfersSeries: TrendSeries = {
    key: 'transfers',
    label: '% Transferencias',
    points: Array.from({ length: numPoints }).map((_, i) => ({
      date: mkDate(i),
      value: jitter(transfersBase, 3, i),
      display: `${jitter(transfersBase, 3, i)}%`,
    })),
  };

  const npsSeries: TrendSeries = {
    key: 'nps',
    label: 'NPS',
    points: Array.from({ length: numPoints }).map((_, i) => ({
      date: mkDate(i),
      value: jitter(npsBase, 4, i),
      display: `${jitter(npsBase, 4, i)}%`,
    })),
  };

  const trends = [tmoSeries, transfersSeries, npsSeries];

  const benchmark = {
    position: 7,
    total: 35,
    percentile: Math.round((1 - 7 / 35) * 100),
    teamAvg: { tmoSec: 7 * 60 + 5, retentionPct: 0, npsPct: 65 },
    deltas: {
      tmoSec: tmoSec - (7 * 60 + 5),
      retentionPct: 0,
      npsPct: npsPct - 65,
    },
  } as const;

  const alerts = [
    { severity: 'high', text: 'Transferencias por encima de meta (p.ej. 45% vs ≤40%). Revisa derivaciones.' },
    { severity: 'medium', text: 'TMO cercano a meta (06:40 vs ≤07:00). Mantén el ritmo.' },
    { severity: 'low', text: 'Buen NPS (70% vs ≥60%). ¡Sigue así!' },
  ] as const;

  return {
    timeframe,
    goals,
    trends,
    benchmark,
    alerts: alerts.slice(),
  };
}


