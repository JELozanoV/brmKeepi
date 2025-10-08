import { MetricKey, Participant, RankingViewModel, RankingRowVM } from '../types/ranking';
import { KPI_TARGETS } from '../config/constants';

function formatSec(sec?: number): string {
  if (sec == null) return '—';
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const r = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
}
function round1(n: number): number { return Math.round(n * 10) / 10; }

function normalize(arr: number[], higherIsBetter: boolean): number[] {
  const vals = arr.filter(v => typeof v === 'number') as number[];
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  if (!isFinite(min) || !isFinite(max) || max - min === 0) return arr.map(() => 0.5);
  return arr.map(v => {
    if (v == null) return 0.5;
    return higherIsBetter ? (v - min) / (max - min) : (max - v) / (max - min);
  });
}

function buildRows(metric: MetricKey, list: Participant[], meId: string): RankingRowVM[] {
  return list.map(p => ({
    id: p.id,
    name: p.name,
    valueLabel: metric === 'tmo' ? formatSec(p.tmoSec) : `${round1(metric === 'transfers' ? (p.transfersPct ?? 0) : (p.npsPct ?? 0))}%`,
    isMe: p.id === meId,
  }));
}

export function buildRankingVM(metric: MetricKey, dataset: { participants: Participant[]; currentUserId: string }, scope: 'team'|'operation', coordinatorId?: string): RankingViewModel {
  console.log('🔨 [buildRankingVM] Iniciando construcción para métrica:', metric, 'alcance:', scope);
  const startTime = performance.now();

  const people = scope === 'team' && coordinatorId ? dataset.participants.filter(p => p.coordinatorId === coordinatorId) : dataset.participants.slice();
  const me = dataset.participants.find(p => p.id === dataset.currentUserId);
  const list = people.slice();

  console.log(`📊 [buildRankingVM] Procesando ${list.length} participantes`);

  // Ordenamiento por métrica
  if (metric === 'tmo') {
    list.sort((a,b) => (a.tmoSec ?? Infinity) - (b.tmoSec ?? Infinity) || (a.transfersPct ?? Infinity) - (b.transfersPct ?? Infinity) || a.name.localeCompare(b.name));
  } else if (metric === 'transfers') {
    list.sort((a,b) => (a.transfersPct ?? Infinity) - (b.transfersPct ?? Infinity) || (a.tmoSec ?? Infinity) - (b.tmoSec ?? Infinity) || a.name.localeCompare(b.name));
  } else if (metric === 'nps') {
    list.sort((a,b) => (b.npsPct ?? -Infinity) - (a.npsPct ?? -Infinity) || (a.tmoSec ?? Infinity) - (b.tmoSec ?? Infinity) || a.name.localeCompare(b.name));
  } else {
    // combined: score compuesto anclado a metas
    const hasComposite = list.every(p => typeof p.compositeScore === 'number');
    const USE_HYBRID = false; // activar modo híbrido percentil/meta si se requiere
    const ALPHA = 0.7;

    // percentiles por KPI si hybrid
    const arrTmo = list.map(p => p.tmoSec ?? Infinity);
    const arrTr = list.map(p => p.transfersPct ?? Infinity);
    const arrNps = list.map(p => p.npsPct ?? -Infinity);
    const sortedTmo = [...arrTmo].sort((a,b)=>a-b);
    const sortedTr = [...arrTr].sort((a,b)=>a-b);
    const sortedNps = [...arrNps].sort((a,b)=>a-b);
    const percentile = (value: number, sorted: number[]) => {
      if (!isFinite(value)) return 0;
      const idx = sorted.findIndex(v => v >= value);
      const rank = idx < 0 ? sorted.length - 1 : idx;
      return sorted.length <= 1 ? 1 : rank / (sorted.length - 1);
    };

    const meta = KPI_TARGETS;
    const weightsBase = { tmo: 0.4, tr: 0.4, nps: 0.2 };

    (list as any).forEach((p: Participant) => {
      let scoreComb = 0;
      if (hasComposite && typeof p.compositeScore === 'number') {
        scoreComb = p.compositeScore as number;
      } else {
        const hasTmo = typeof p.tmoSec === 'number' && p.tmoSec! > 0;
        const hasTr = typeof p.transfersPct === 'number' && p.transfersPct! >= 0;
        const hasNps = typeof p.npsPct === 'number' && p.npsPct! >= 0;
        const present = [hasTmo, hasTr, hasNps];
        const sumW = (hasTmo?weightsBase.tmo:0) + (hasTr?weightsBase.tr:0) + (hasNps?weightsBase.nps:0) || 1;
        const wTmo = (hasTmo?weightsBase.tmo:0) / sumW;
        const wTr = (hasTr?weightsBase.tr:0) / sumW;
        const wNps = (hasNps?weightsBase.nps:0) / sumW;

        // scores por meta
        const scoreTmoMeta = hasTmo ? Math.min(1, (meta.tmoSec) / (p.tmoSec as number)) : 0;
        const scoreTrMeta = hasTr ? Math.min(1, (meta.transfersPct) / ((p.transfersPct as number) || 1e-9)) : 0;
        const scoreNpsMeta = hasNps ? Math.min(1, ((p.npsPct as number) || 0) / (meta.npsPct || 1)) : 0;

        let sT = scoreTmoMeta, sR = scoreTrMeta, sN = scoreNpsMeta;
        if (USE_HYBRID) {
          const pT = 1 - percentile(p.tmoSec as number, sortedTmo);
          const pR = 1 - percentile(p.transfersPct as number, sortedTr);
          const pN = percentile(p.npsPct as number, sortedNps);
          sT = ALPHA * scoreTmoMeta + (1 - ALPHA) * pT;
          sR = ALPHA * scoreTrMeta + (1 - ALPHA) * pR;
          sN = ALPHA * scoreNpsMeta + (1 - ALPHA) * pN;
        }

        scoreComb = wTmo * sT + wTr * sR + wNps * sN;
      }
      (p as any).__combined = scoreComb;
      // metas cumplidas para desempate
      const cumplidas =
        (typeof p.tmoSec === 'number' && (p.tmoSec as number) <= meta.tmoSec ? 1 : 0) +
        (typeof p.transfersPct === 'number' && (p.transfersPct as number) <= meta.transfersPct ? 1 : 0) +
        (typeof p.npsPct === 'number' && (p.npsPct as number) >= meta.npsPct ? 1 : 0);
      (p as any).__metas = cumplidas;
    });

    list.sort((a,b) => {
      const da = (a as any).__combined ?? 0;
      const db = (b as any).__combined ?? 0;
      if (db !== da) return db - da;
      const ca = (a as any).__metas ?? 0;
      const cb = (b as any).__metas ?? 0;
      if (cb !== ca) return cb - ca;
      const ta = a.transfersPct ?? Infinity;
      const tb = b.transfersPct ?? Infinity;
      if (ta !== tb) return ta - tb;
      const ma = a.tmoSec ?? Infinity;
      const mb = b.tmoSec ?? Infinity;
      if (ma !== mb) return ma - mb;
      const na = a.npsPct ?? -Infinity;
      const nb = b.npsPct ?? -Infinity;
      if (nb !== na) return nb - na;
      return a.name.localeCompare(b.name);
    });
  }

  const total = list.length || 1;
  const position = Math.max(1, list.findIndex(p => p.id === dataset.currentUserId) + 1);
  const topPercent = Math.round((1 - (position - 1) / total) * 100);
  const headerMessage = topPercent >= 75 ? 'Vas por buen camino en este periodo.' : topPercent >= 40 ? 'Tienes margen para subir con las acciones sugeridas.' : 'Prioriza bajar TMO y reducir transferencias; el NPS puede darte un impulso.';

  // Gap vs promedio del grupo
  const avgTmo = list.reduce((s,p)=> s + (p.tmoSec ?? 0), 0) / total;
  const avgTr = list.reduce((s,p)=> s + (p.transfersPct ?? 0), 0) / total;
  const avgNps = list.reduce((s,p)=> s + (p.npsPct ?? 0), 0) / total;

  let gapText = '';
  if (metric === 'tmo') {
    const meVal = me?.tmoSec ?? 0;
    const diff = Math.round(Math.abs(meVal - avgTmo));
    const dir = meVal <= avgTmo ? 'por debajo' : 'por encima';
    gapText = `Tu TMO está ${diff} segundos ${dir} del promedio del ${scope === 'team' ? 'equipo' : 'grupo'}.`;
  } else if (metric === 'transfers') {
    const meVal = me?.transfersPct ?? 0;
    const diff = round1(Math.abs(meVal - avgTr));
    const dir = meVal <= avgTr ? 'por debajo' : 'por encima';
    gapText = `Tu tasa de transferencias está ${diff} puntos ${dir} del promedio de la ${scope === 'team' ? 'equipo' : 'operación'}.`;
  } else if (metric === 'nps') {
    const meVal = me?.npsPct ?? 0;
    const diff = round1(Math.abs(meVal - avgNps));
    const dir = meVal >= avgNps ? 'por encima' : 'por debajo';
    gapText = `Tu NPS está ${diff} puntos ${dir} del promedio de la ${scope === 'team' ? 'equipo' : 'operación'}.`;
  } else {
    gapText = 'Índice combinado calculado en base a TMO, transferencias y NPS.';
  }

  // Mini lista: me y cercanos (max 5) o top 3 si no se encuentra
  // calcular índice del usuario para vecinos
  const meIndex = list.findIndex(p => p.id === dataset.currentUserId);

  // Construir 6 filas sin duplicados, en orden vertical
  const baseMetric = metric === 'combined' ? 'tmo' : metric;
  const podium = list.slice(0, 3);
  const rows: RankingRowVM[] = podium.map((p, i) => ({
    id: p.id,
    name: p.id === dataset.currentUserId ? p.name : p.name,
    position: i + 1,
    valueLabel: baseMetric === 'tmo' ? formatSec(p.tmoSec ?? 0) : (baseMetric === 'transfers' ? `${round1(p.transfersPct ?? 0)}%` : baseMetric === 'nps' ? `${round1(p.npsPct ?? 0)}%` : `Índice ${round1(((p as any).__combined ?? 0)*100)/100}`),
    isMe: p.id === dataset.currentUserId,
    medal: i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze',
    ariaLabel: `Puesto ${i+1} de ${total} en ${metric.toUpperCase()}`,
  }));

  const used = new Set(rows.map(r => r.id));

  const isMeInTop3 = used.has(dataset.currentUserId);
  let meRow: RankingRowVM | null = null;
  if (!isMeInTop3) {
    const meIdx = list.findIndex(p => p.id === dataset.currentUserId);
    const meP = list[meIdx];
    if (meP) {
      const combinedLabel = baseMetric === 'combined' ? `Índice ${round1(((meP as any).__combined ?? 0)*100)/100}` : undefined;
      meRow = {
        id: meP.id,
        name: meP.name,
        position: meIdx + 1,
        valueLabel: baseMetric === 'tmo' ? formatSec(meP.tmoSec ?? 0) : (baseMetric === 'transfers' ? `${round1(meP.transfersPct ?? 0)}%` : baseMetric === 'nps' ? `${round1(meP.npsPct ?? 0)}%` : (combinedLabel as string)),
        isMe: true,
        ariaLabel: `Puesto ${meIdx+1} de ${total} en ${metric.toUpperCase()}`,
      };
      // Subtítulo con KPIs de apoyo
      meRow.secondary = `TMO ${formatSec(meP.tmoSec ?? 0)} · Trans ${round1(meP.transfersPct ?? 0)}% · NPS ${round1(meP.npsPct ?? 0)}%`;
    }
  }

  // Cercanos: dos posiciones alrededor de "me"
  const addIfNotUsed = (p?: Participant) => {
    if (!p || used.has(p.id)) return null;
    used.add(p.id);
    const idx = list.indexOf(p);
    const valLbl = baseMetric === 'tmo' ? formatSec(p.tmoSec ?? 0) : (baseMetric === 'transfers' ? `${round1(p.transfersPct ?? 0)}%` : baseMetric === 'nps' ? `${round1(p.npsPct ?? 0)}%` : `Índice ${round1(((p as any).__combined ?? 0)*100)/100}`);
    const row: RankingRowVM = {
      id: p.id,
      name: p.name,
      position: idx + 1,
      valueLabel: valLbl,
      isMe: p.id === dataset.currentUserId,
      ariaLabel: `Puesto ${idx+1} de ${total} en ${metric.toUpperCase()}`,
    };
    if (baseMetric === 'combined') {
      row.secondary = `TMO ${formatSec(p.tmoSec ?? 0)} · Trans ${round1(p.transfersPct ?? 0)}% · NPS ${round1(p.npsPct ?? 0)}%`;
    }
    return row as RankingRowVM;
  };

  const neighbors: RankingRowVM[] = [];
  if (!isMeInTop3) {
    if (meIndex >= 0) {
      if (meIndex === total - 1) {
        // último: dos arriba
        const a1 = addIfNotUsed(list[meIndex - 1]);
        const a2 = addIfNotUsed(list[meIndex - 2]);
        if (a1) neighbors.push(a1);
        if (a2) neighbors.push(a2);
      } else if (meIndex === total - 2) {
        // penúltimo: una arriba y último
        const a1 = addIfNotUsed(list[meIndex - 1]);
        const a2 = addIfNotUsed(list[meIndex + 1]);
        if (a1) neighbors.push(a1);
        if (a2) neighbors.push(a2);
      } else {
        const up = addIfNotUsed(list[meIndex - 1]);
        const down = addIfNotUsed(list[meIndex + 1]);
        if (up) neighbors.push(up);
        if (down) neighbors.push(down);
      }
    }
  } else {
    // me en top3: completar con 4,5,6
    const rest = [list[3], list[4], list[5]].map(addIfNotUsed).filter(Boolean) as RankingRowVM[];
    neighbors.push(...rest);
  }

  // Completar 6 filas: top3 + (meRow si aplica) + vecinos y resto
  const six: RankingRowVM[] = [];
  six.push(...rows);
  if (meRow) six.push(meRow);
  six.push(...neighbors);
  // completar con siguientes puestos si faltan, sin duplicar
  let idxFill = 3;
  while (six.length < 6 && idxFill < list.length) {
    const add = addIfNotUsed(list[idxFill]);
    if (add) six.push(add);
    idxFill++;
  }

  // marcar medallas en top3
  six.forEach(r => {
    if (r.position === 1) r.medal = 'gold';
    else if (r.position === 2) r.medal = 'silver';
    else if (r.position === 3) r.medal = 'bronze';
  });

  const smallNote = list.length < 6 ? 'Grupo pequeño; los cambios pueden mover mucho tu posición.' : undefined;

  const endTime = performance.now();
  console.log(`✅ [buildRankingVM] Construcción completa en ${Math.round(endTime - startTime)}ms`);

  return {
    metric,
    position,
    total,
    topPercent,
    headerMessage,
    gapText,
    sixRows: six,
    smallNote,
  };
}


