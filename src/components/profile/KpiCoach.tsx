import React, { useMemo } from 'react';
import { Range } from '../../types/profile';
import { KPI_TARGETS, EXPECTED_CALLS, GOALS_WARN_THRESHOLD } from '../../config/constants';
import { computeKpiStatus } from '../../utils/kpiStatus';

function formatSec(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const mPart = Math.floor(s / 60).toString().padStart(2, '0');
  const sPart = Math.floor(s % 60).toString().padStart(2, '0');
  return `${mPart}:${sPart}`;
}

function describeTimeDiff(sec: number): string {
  const above = sec > 0;
  return `${formatSec(Math.abs(sec))} ${above ? 'por encima' : 'por debajo'}`;
}

function round1(n: number): number { return Math.round(n * 10) / 10; }

type CoachInput = {
  range: Range;
  callsHandled: number;
  totalHandleTimeSec: number;
  transfers: number;
  npsPct: number; // porcentaje entero 0-100
};

function computeCoach({ range, callsHandled, totalHandleTimeSec, transfers, npsPct }: CoachInput) {
  const targets = KPI_TARGETS;
  const N = EXPECTED_CALLS[range];
  const n = callsHandled || 0;

  const tmoActualSec = n ? totalHandleTimeSec / n : 0;
  const transfersPct = n ? (transfers / n) * 100 : 0;

  // Nivel 1 (gaps directos)
  const gapTmoSec = tmoActualSec - targets.tmoSec;               // >0 está sobre la meta
  const gapTransfersPct = transfersPct - targets.transfersPct;   // >0 está sobre la meta
  const gapNpsPct = targets.npsPct - npsPct;                     // >0 está bajo la meta

  // Nivel 2 (si hay remanente)
  const remaining = Math.max(0, N - n);
  const result: any = {
    tmo: { gapText: '', requiredText: '' },
    transfers: { gapText: '', requiredText: '' },
    nps: { gapText: '', requiredText: '' },
  };

  // TMO
  const tmoGapText = gapTmoSec > 0
    ? `Tu promedio ${formatSec(tmoActualSec)} · Meta ${formatSec(targets.tmoSec)} · Diferencia ${describeTimeDiff(gapTmoSec)}`
    : `Tu promedio ${formatSec(tmoActualSec)} · Meta ${formatSec(targets.tmoSec)} · Diferencia ${describeTimeDiff(gapTmoSec)}`;
  let tmoReqText = 'Meta cumplida. Mantén este nivel durante ' + (range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes') + '.';
  if (remaining > 0) {
    const needed = (targets.tmoSec * N - totalHandleTimeSec) / remaining;
    const neededClamped = Math.max(0, needed);
    tmoReqText = `Promedio restante ${formatSec(neededClamped)} o menos en ${remaining} llamadas pendientes.`;
  }
  result.tmo.gapText = tmoGapText;
  result.tmo.requiredText = tmoReqText;

  // Transferencias
  const transDiff = transfersPct - targets.transfersPct;
  const transGapText = `Tu tasa ${round1(transfersPct)}% · Meta ${targets.transfersPct}% · Diferencia ${Math.abs(round1(transDiff))} puntos ${transDiff >= 0 ? 'por encima' : 'por debajo'}`;
  let transReqText = 'Meta cumplida. Mantén este nivel durante ' + (range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes') + '.';
  if (remaining > 0) {
    const maxAllowedTotal = (targets.transfersPct / 100) * N;
    const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);
    const neededRate = remaining > 0 ? remainingAllowed / remaining : 0;
    const neededPct = Math.max(0, Math.min(1, neededRate)) * 100;
    const allowedCount = Math.max(0, Math.floor(remainingAllowed));
    transReqText = `Como máximo ${allowedCount} transferencias en ${remaining} llamadas restantes; esto es alrededor de ${round1(neededPct)} por ciento.`;
  } else if (transfersPct <= targets.transfersPct) {
    const maxAllowedTotal = (targets.transfersPct / 100) * N;
    const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);
    const allowedCount = Math.max(0, Math.floor(remainingAllowed));
    transReqText = `Aún puedes transferir hasta ${allowedCount} llamadas sin salirte de la meta.`;
  }
  result.transfers.gapText = transGapText;
  result.transfers.requiredText = transReqText;

  // NPS (modelo simple por % positivo)
  const npsDiff = npsPct - targets.npsPct;
  const npsGapText = `Tu NPS ${round1(npsPct)}% · Meta ${targets.npsPct}% · Diferencia ${Math.abs(round1(npsDiff))} puntos ${npsDiff >= 0 ? 'por encima' : 'por debajo'}`;
  let npsReqText = 'Meta cumplida. Mantén este nivel durante ' + (range === 'today' ? 'hoy' : range === 'week' ? 'la semana' : 'el mes') + '.';
  if (remaining > 0) {
    const neededPosRate = ((targets.npsPct / 100) * N - (npsPct / 100) * n) / remaining;
    const neededPct = Math.max(0, Math.min(1, neededPosRate)) * 100;
    npsReqText = `Al menos ${round1(neededPct)} por ciento de las encuestas restantes deben ser positivas.`;
  }
  result.nps.gapText = npsGapText;
  result.nps.requiredText = npsReqText;

  // Semáforo simple para el bloque (agrega una clase para borde/fondo)
  const status = {
    tmo: tmoActualSec <= targets.tmoSec ? 'good' : (tmoActualSec <= targets.tmoSec * (1 + GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
    transfers: transfersPct <= targets.transfersPct ? 'good' : (transfersPct <= targets.transfersPct * (1 + GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
    nps: npsPct >= targets.npsPct ? 'good' : (npsPct >= targets.npsPct * (1 - GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
  } as const;

  return { result, status, context: { tmoActualSec, transfersPct, npsPct, targets, n, N, remaining } };
}

export interface KpiCoachProps {
  range: Range;
  callsHandled: number;
  totalHandleTimeSec: number;
  transfers: number;
  npsPct: number;
  vm?: {
    tmo: ReturnType<typeof computeKpiStatus>;
    transfers: ReturnType<typeof computeKpiStatus>;
    nps: ReturnType<typeof computeKpiStatus>;
  };
}

const KpiCoach: React.FC<KpiCoachProps> = (props) => {
  const { result, status } = useMemo(() => computeCoach(props), [props]);
  const tmoStatus = props.vm ? props.vm.tmo : computeKpiStatus('tmo', result?.context?.tmoActualSec || 0, KPI_TARGETS.tmoSec);
  const transStatus = props.vm ? props.vm.transfers : computeKpiStatus('transfers', result?.context?.transfersPct || 0, KPI_TARGETS.transfersPct);
  const npsStatus = props.vm ? props.vm.nps : computeKpiStatus('nps', result?.context?.npsPct || 0, KPI_TARGETS.npsPct);

  const toClass = (s: any) => (s === 'ok' ? 'good' : s);
  return (
    <section className="op-card" style={{ marginTop: '1rem' }} aria-label="KpiCoach">
      <div className="card-title">KpiCoach</div>
      <div className="kpi-coach-grid">
        <div className={`kpi-coach-item kpi-${toClass(tmoStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(tmoStatus.status)}`}>{tmoStatus.chipText}</span>
          <div className="kpi-subtle">TMO</div>
          <div>{result.tmo.gapText}</div>
          <div>{result.tmo.requiredText}</div>
        </div>
        <div className={`kpi-coach-item kpi-${toClass(transStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(transStatus.status)}`}>{transStatus.chipText}</span>
          <div className="kpi-subtle">% Transferencias</div>
          <div>{result.transfers.gapText}</div>
          <div>{result.transfers.requiredText}</div>
        </div>
        <div className={`kpi-coach-item kpi-${toClass(npsStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(npsStatus.status)}`}>{npsStatus.chipText}</span>
          <div className="kpi-subtle">NPS</div>
          <div>{result.nps.gapText}</div>
          <div>{result.nps.requiredText}</div>
        </div>
      </div>
    </section>
  );
};

export default KpiCoach;


