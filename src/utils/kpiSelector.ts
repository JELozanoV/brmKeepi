import { KPI_TARGETS, EXPECTED_CALLS, GOALS_WARN_THRESHOLD } from '../config/constants';

export type KpiState = 'ok' | 'warn' | 'bad';
export type KpiColor = 'green' | 'yellow' | 'red';

export interface Snapshot {
  tmoSec: number;            // promedio actual en segundos
  transfersPct: number;      // porcentaje 0-100
  npsPct: number;            // porcentaje 0-100
}

export interface Progress {
  n: number;                 // llamadas atendidas hasta ahora
  N: number;                 // llamadas esperadas del periodo
  totalTalkSec: number;      // suma de segundos conversados
  transfers: number;         // número de transferencias hechas
}

export interface KpiViewModel {
  status: KpiState;
  color: KpiColor;
  difference: number;           // abs: seg para tmo, puntos para %/NPS
  direction: 'por encima' | 'por debajo';
  chipText: string;             // En meta | En meta, pero muy cerca del límite | Necesita atención
  ariaLabel: string;            // Texto de ayuda accesible
  messages: {
    warnHint?: string;          // aviso corto para tarjetas KPI en WARN
    nowText: string;            // "Tu promedio ... · Meta ... · Diferencia ..."
    actionText: string;         // Qué hacer en lo que queda
  };
}

export interface KpiSelectorOutput {
  tmo: KpiViewModel;
  transfers: KpiViewModel;
  nps: KpiViewModel;
}

const EPS = 1e-9;

function formatSec(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const r = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }

function stateToColor(s: KpiState): KpiColor {
  return s === 'ok' ? 'green' : s === 'warn' ? 'yellow' : 'red';
}

export function computeKpiViewModels(
  range: 'today' | 'week' | 'month',
  snapshot: Snapshot,
  targets = KPI_TARGETS,
  progress?: Partial<Progress>
): KpiSelectorOutput {
  const N = progress?.N ?? EXPECTED_CALLS[range];
  const n = progress?.n ?? 0;
  const totalTalkSec = progress?.totalTalkSec ?? 0;
  const transfers = progress?.transfers ?? 0;

  // --- TMO --- (meta = máximo permitido)
  const tmoCur = snapshot.tmoSec;
  const tmoMeta = targets.tmoSec;
  const tmoOver = tmoCur - tmoMeta; // >0 por encima
  const tmoCushion = Math.max(0, tmoMeta - tmoCur);
  const tmoWarn = (tmoCushion <= 30 + EPS) || (tmoCur >= tmoMeta - tmoMeta * GOALS_WARN_THRESHOLD - EPS);
  const tmoState: KpiState = tmoCur > tmoMeta + EPS ? 'bad' : tmoWarn ? 'warn' : 'ok';
  const tmoDiffAbs = Math.abs(Math.round(tmoOver));
  const tmoDirection: 'por encima' | 'por debajo' = tmoOver > 0 ? 'por encima' : 'por debajo';
  const tmoNow = `Tu promedio ${formatSec(tmoCur)} · Meta ${formatSec(tmoMeta)} · Diferencia ${formatSec(tmoDiffAbs)} ${tmoDirection}`;
  let tmoAction = `Meta cumplida. Mantén este nivel durante ${range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes'}.`;
  if (N - n > 0) {
    const needed = (tmoMeta * N - totalTalkSec) / (N - n);
    const neededClamped = Math.max(0, needed);
    tmoAction = `Promedio restante ${formatSec(neededClamped)} o menos en ${N - n} llamadas pendientes.`;
  }
  const tmoWarnHint = tmoState === 'warn' ? `Estás a ${tmoCushion} segundos del máximo permitido. Cuida tu promedio para no pasarte.` : undefined;
  const tmoVm: KpiViewModel = {
    status: tmoState,
    color: stateToColor(tmoState),
    difference: tmoDiffAbs,
    direction: tmoDirection,
    chipText: tmoState === 'bad' ? 'Necesita atención' : tmoState === 'warn' ? 'En meta, pero muy cerca del límite' : 'En meta',
    ariaLabel: `Tu promedio es ${formatSec(tmoCur)}; la meta para hoy es ${formatSec(tmoMeta)} o menos; estás ${tmoOver > 0 ? 'por encima' : 'por debajo'} del límite por ${formatSec(tmoDiffAbs)}.`,
    messages: { warnHint: tmoWarnHint, nowText: tmoNow, actionText: tmoAction },
  };

  // --- TRANSFERS --- (meta = máximo permitido)
  const trCur = snapshot.transfersPct;
  const trMeta = targets.transfersPct;
  const trOver = trCur - trMeta; // >0 por encima
  const trPointsFromMax = +(trMeta - trCur).toFixed(1);
  const trWarn = (trPointsFromMax <= 2 + EPS) || (trCur >= trMeta - trMeta * GOALS_WARN_THRESHOLD - EPS);
  const trState: KpiState = trCur > trMeta + EPS ? 'bad' : trWarn ? 'warn' : 'ok';
  const trDiffAbs = +Math.abs(trOver).toFixed(1);
  const trDirection: 'por encima' | 'por debajo' = trOver > 0 ? 'por encima' : 'por debajo';
  const trNow = `Tu tasa ${round1(trCur)}% · Meta ${round1(trMeta)}% · Diferencia ${trDiffAbs} puntos ${trDirection}`;
  let trAction = `Meta cumplida. Mantén este nivel durante ${range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes'}.`;
  if (N - n > 0) {
    const maxAllowedTotal = (trMeta / 100) * N;
    const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);
    const neededRate = remainingAllowed / (N - n);
    const neededPct = Math.max(0, Math.min(1, neededRate)) * 100;
    const allowedCount = Math.max(0, Math.floor(remainingAllowed));
    trAction = `Como máximo ${allowedCount} transferencias en ${N - n} llamadas restantes; esto es alrededor de ${round1(neededPct)} por ciento.`;
  } else if (trCur <= trMeta) {
    const maxAllowedTotal = (trMeta / 100) * N;
    const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);
    const allowedCount = Math.max(0, Math.floor(remainingAllowed));
    trAction = `Aún puedes transferir hasta ${allowedCount} llamadas sin salirte de la meta.`;
  }
  const trWarnHint = trState === 'warn' ? `Estás a ${Math.abs(+trPointsFromMax.toFixed(1))} puntos del máximo permitido. Evita transferir de más.` : undefined;
  const transfersVm: KpiViewModel = {
    status: trState,
    color: stateToColor(trState),
    difference: trDiffAbs,
    direction: trDirection,
    chipText: trState === 'bad' ? 'Necesita atención' : trState === 'warn' ? 'En meta, pero muy cerca del límite' : 'En meta',
    ariaLabel: `Tu tasa es ${round1(trCur)} por ciento; la meta es ${round1(trMeta)} por ciento o menos; estás ${trOver > 0 ? 'por encima' : 'por debajo'} del límite por ${trDiffAbs} puntos.`,
    messages: { warnHint: trWarnHint, nowText: trNow, actionText: trAction },
  };

  // --- NPS --- (meta = mínimo requerido)
  const npsCur = snapshot.npsPct;
  const npsMeta = targets.npsPct;
  const npsUnder = npsMeta - npsCur; // >0 por debajo
  const npsPointsFromMin = +(npsCur - npsMeta).toFixed(1);
  const npsWarn = (Math.abs(npsPointsFromMin) <= 5 + EPS) || (npsCur <= npsMeta + npsMeta * GOALS_WARN_THRESHOLD + EPS);
  const npsState: KpiState = npsCur < npsMeta - EPS ? 'bad' : npsWarn ? 'warn' : 'ok';
  const npsDiffAbs = +Math.abs(npsUnder).toFixed(1);
  const npsDirection: 'por encima' | 'por debajo' = npsUnder > 0 ? 'por debajo' : 'por encima';
  const npsNow = `Tu NPS ${round1(npsCur)}% · Meta ${round1(npsMeta)}% · Diferencia ${npsDiffAbs} puntos ${npsDirection}`;
  let npsAction = `Meta cumplida. Mantén este nivel durante ${range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes'}.`;
  if (N - n > 0) {
    const neededPosRate = ((npsMeta / 100) * N - (npsCur / 100) * n) / (N - n);
    const neededPct = Math.max(0, Math.min(1, neededPosRate)) * 100;
    npsAction = `Al menos ${round1(neededPct)} por ciento de las encuestas restantes deben ser positivas.`;
  }
  const npsWarnHint = npsState === 'warn' ? `Estás a ${Math.abs(+npsPointsFromMin.toFixed(1))} puntos del mínimo requerido. Refuerza el cierre para mantenerlo.` : undefined;
  const npsVm: KpiViewModel = {
    status: npsState,
    color: stateToColor(npsState),
    difference: npsDiffAbs,
    direction: npsDirection,
    chipText: npsState === 'bad' ? 'Necesita atención' : npsState === 'warn' ? 'En meta, pero muy cerca del límite' : 'En meta',
    ariaLabel: `Tu NPS es ${round1(npsCur)} por ciento; la meta es ${round1(npsMeta)} por ciento o más; estás ${npsUnder > 0 ? 'por debajo' : 'por encima'} del límite por ${npsDiffAbs} puntos.`,
    messages: { warnHint: npsWarnHint, nowText: npsNow, actionText: npsAction },
  };

  const isDev = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) || (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production');
  if (typeof window !== 'undefined' && isDev) {
    // eslint-disable-next-line no-console
    console.group('KPI STATUS');
    // eslint-disable-next-line no-console
    console.log({ range, snapshot, targets, progress: { N, n, totalTalkSec, transfers } });
    // eslint-disable-next-line no-console
    console.log({ tmo: tmoVm, transfers: transfersVm, nps: npsVm });
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  return { tmo: tmoVm, transfers: transfersVm, nps: npsVm };
}


