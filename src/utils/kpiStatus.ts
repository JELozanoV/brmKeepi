import { GOALS_WARN_THRESHOLD } from '../config/constants';
import { formatTmo as formatSec } from './metrics';

export type KpiKey = 'tmo' | 'transfers' | 'nps';
export type KpiStatus = 'good' | 'warn' | 'bad';

interface StatusResult {
  status: KpiStatus;
  chipText: string; // En meta | En meta, pero muy cerca del límite | Necesita atención
  ariaLabel: string;
  diffs: {
    cushionSec?: number; // para tmo cuando está por debajo del máximo
    pointsFromMax?: number; // para transfers cuando está por debajo del máximo
    pointsFromMin?: number; // para nps cuando está por encima del mínimo
  };
}

export function computeKpiStatus(key: KpiKey, current: number, target: number): StatusResult {
  const fivePercent = target * GOALS_WARN_THRESHOLD; // 5% del objetivo

  if (key === 'tmo') {
    if (current > target) {
      return {
        status: 'bad',
        chipText: 'Necesita atención',
        ariaLabel: `Tu promedio es ${formatSec(current)}; la meta para hoy es ${formatSec(target)} o menos; estás por encima del límite.`,
        diffs: {}
      };
    }
    const cushionSec = Math.max(0, Math.round(target - current));
    const warnByCushion = cushionSec <= 30;
    const warnByRelative = current >= target - fivePercent;
    const warn = warnByCushion || warnByRelative;
    return {
      status: warn ? 'warn' : 'good',
      chipText: warn ? 'En meta, pero muy cerca del límite' : 'En meta',
      ariaLabel: `Tu promedio es ${formatSec(current)}; la meta para hoy es ${formatSec(target)} o menos; estás a ${cushionSec} segundos del límite.`,
      diffs: { cushionSec }
    };
  }

  if (key === 'transfers') {
    if (current > target) {
      return {
        status: 'bad',
        chipText: 'Necesita atención',
        ariaLabel: `Tu tasa es ${current.toFixed(1)} por ciento; la meta es ${target.toFixed(1)} por ciento o menos; estás por encima del máximo permitido.`,
        diffs: {}
      };
    }
    const pointsFromMax = +(target - current).toFixed(1);
    const warnByPoints = pointsFromMax <= 2;
    const warnByRelative = current >= target - fivePercent;
    const warn = warnByPoints || warnByRelative;
    return {
      status: warn ? 'warn' : 'good',
      chipText: warn ? 'En meta, pero muy cerca del límite' : 'En meta',
      ariaLabel: `Tu tasa es ${current.toFixed(1)} por ciento; la meta es ${target.toFixed(1)} por ciento o menos; estás a ${Math.abs(pointsFromMax).toFixed(1)} puntos del límite.`,
      diffs: { pointsFromMax }
    };
  }

  // nps
  if (current < target) {
    return {
      status: 'bad',
      chipText: 'Necesita atención',
      ariaLabel: `Tu NPS es ${current.toFixed(1)} por ciento; la meta es ${target.toFixed(1)} por ciento o más; estás por debajo del mínimo.`,
      diffs: {}
    };
  }
  const pointsFromMin = +(current - target).toFixed(1);
  const warnByPoints = pointsFromMin <= 5;
  const warnByRelative = current <= target + fivePercent;
  const warn = warnByPoints || warnByRelative;
  return {
    status: warn ? 'warn' : 'good',
    chipText: warn ? 'En meta, pero muy cerca del límite' : 'En meta',
    ariaLabel: `Tu NPS es ${current.toFixed(1)} por ciento; la meta es ${target.toFixed(1)} por ciento o más; estás ${Math.abs(pointsFromMin).toFixed(1)} puntos ${pointsFromMin >= 0 ? 'por encima' : 'por debajo'} del límite.`,
    diffs: { pointsFromMin }
  };
}


