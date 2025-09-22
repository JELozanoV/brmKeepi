import { TIMEZONE, KPI_TARGETS } from '../config/constants';

export type MonthlyKpiDTO = {
  days: Array<{ date: string; tmoSec?: number; transfersPct?: number; npsPct?: number }>;
  meta: { tmoLimitSec: number; transfersMaxPct: number; npsMinPct: number };
};

type FetchArgs = { advisorId: string; year: number; month: number };

function toYm(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function normalizeDateISO(year: number, month: number, day: number): string {
  // Zona horaria fija America/Bogota: generamos fecha local ISO simple YYYY-MM-DD
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function hashStringToSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function generateDeterministicMock(args: FetchArgs): MonthlyKpiDTO {
  const { advisorId, year, month } = args;
  const seed = hashStringToSeed(`${advisorId}-${year}-${String(month).padStart(2, '0')}`);
  const rnd = mulberry32(seed);

  const tmoMin = 330; // 05:30
  const tmoMax = 540; // 09:00
  const transMin = 25;
  const transMax = 55;
  const npsMin = 70;
  const npsMax = 96;

  const meta = {
    tmoLimitSec: KPI_TARGETS.tmoSec,
    transfersMaxPct: KPI_TARGETS.transfersPct,
    npsMinPct: KPI_TARGETS.npsPct,
  };

  // 30 días para mock (suficiente para el histórico visual)
  const days: MonthlyKpiDTO['days'] = [];
  for (let d = 1; d <= 31; d++) {
    // 1/7 días sin datos
    const noData = Math.floor(rnd() * 7) === 0;
    const date = normalizeDateISO(year, month, d);
    if (noData) {
      days.push({ date });
      continue;
    }
    const tmoSec = Math.round(tmoMin + rnd() * (tmoMax - tmoMin));
    const transfersPct = Math.round((transMin + rnd() * (transMax - transMin)) * 10) / 10;
    const npsPct = Math.round((npsMin + rnd() * (npsMax - npsMin)) * 10) / 10;
    days.push({ date, tmoSec, transfersPct, npsPct });
  }

  return { days, meta };
}

async function fetchFromBackend(args: FetchArgs): Promise<MonthlyKpiDTO | null> {
  try {
    const { advisorId, year, month } = args;
    const resp = await fetch(`/api/v1/kpi/historico?advisorId=${encodeURIComponent(advisorId)}&year=${year}&month=${String(month).padStart(2,'0')}`);
    if (!resp.ok) return null;
    const payload = await resp.json();
    // Adapter → MonthlyKpiDTO
    const days = (payload.days || []).map((d: any) => ({
      date: d.date,
      tmoSec: d.tmoSec,
      transfersPct: d.transfersPct,
      npsPct: d.npsPct,
    }));
    const meta = payload.meta && typeof payload.meta === 'object'
      ? {
          tmoLimitSec: Number(payload.meta.tmoLimitSec) || KPI_TARGETS.tmoSec,
          transfersMaxPct: Number(payload.meta.transfersMaxPct) || KPI_TARGETS.transfersPct,
          npsMinPct: Number(payload.meta.npsMinPct) || KPI_TARGETS.npsPct,
        }
      : { tmoLimitSec: KPI_TARGETS.tmoSec, transfersMaxPct: KPI_TARGETS.transfersPct, npsMinPct: KPI_TARGETS.npsPct };
    return { days, meta };
  } catch {
    return null;
  }
}

async function fetchFromAssets(args: FetchArgs): Promise<MonthlyKpiDTO | null> {
  try {
    const { advisorId, year, month } = args;
    const ym = toYm(year, month);
    const resp = await fetch(`/assets/mock/kpi/${encodeURIComponent(advisorId)}/${ym}.json`);
    if (!resp.ok) return null;
    const json = await resp.json();
    const days = (json.days || []).map((d: any) => ({
      date: d.date,
      tmoSec: d.tmoSec,
      transfersPct: d.transfersPct,
      npsPct: d.npsPct,
    }));
    const meta = json.meta && typeof json.meta === 'object'
      ? {
          tmoLimitSec: Number(json.meta.tmoLimitSec) || KPI_TARGETS.tmoSec,
          transfersMaxPct: Number(json.meta.transfersMaxPct) || KPI_TARGETS.transfersPct,
          npsMinPct: Number(json.meta.npsMinPct) || KPI_TARGETS.npsPct,
        }
      : { tmoLimitSec: KPI_TARGETS.tmoSec, transfersMaxPct: KPI_TARGETS.transfersPct, npsMinPct: KPI_TARGETS.npsPct };
    return { days, meta };
  } catch {
    return null;
  }
}

export async function fetchMonthlyKpis(args: FetchArgs): Promise<MonthlyKpiDTO> {
  const useBackend = (import.meta as any).env?.VITE_USE_BACKEND_KPI === 'true';
  if (useBackend) {
    const fromApi = await fetchFromBackend(args);
    if (fromApi) return fromApi;
  }
  const fromAssets = await fetchFromAssets(args);
  if (fromAssets) return fromAssets;
  return generateDeterministicMock(args);
}


