/**
 * Carga y ofrece utilidades para reglas de cambio de ciclo por región (Móvil).
 * Fuente prevista: Excel "ciclos_fact (17).cleaned.xls" extraído a JSON en /public/assets/data/region_rules.json.
 * Fecha de extracción: TODO Operación.
 */

export type RegionName = string;

export interface RegionTransitions {
  transitions?: Record<string, number[]>; // clave: día actual → lista de destinos permitidos
  allowedCurrentDays?: number[];          // alternativa si hay listas globales
  allowedTargetDays?: number[];           // alternativa si hay listas globales
}

export interface RegionRules {
  version?: string;
  regions: Record<RegionName, RegionTransitions>;
}

let cache: RegionRules | null = null;

export async function loadRegionRules(): Promise<RegionRules> {
  if (cache) return cache;
  try {
    const resp = await fetch('/assets/data/region_rules.json', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = (await resp.json()) as RegionRules;
    cache = normalizeRules(data);
    return cache;
  } catch (e) {
    // Fallback mínimo vacío; UI deberá manejarlo con mensajes y deshabilitar cálculo móvil.
    cache = { regions: {} };
    return cache;
  }
}

function normalizeRules(rules: RegionRules): RegionRules {
  const out: RegionRules = { version: rules.version, regions: {} };
  for (const [region, cfg] of Object.entries(rules.regions || {})) {
    const clean: RegionTransitions = {};
    if (cfg.transitions) {
      const t: Record<string, number[]> = {};
      for (const [k, arr] of Object.entries(cfg.transitions)) {
        t[String(Number(k))] = uniqNums(arr);
      }
      clean.transitions = t;
    }
    if (cfg.allowedCurrentDays) clean.allowedCurrentDays = uniqNums(cfg.allowedCurrentDays);
    if (cfg.allowedTargetDays) clean.allowedTargetDays = uniqNums(cfg.allowedTargetDays);
    out.regions[region] = clean;
  }
  return out;
}

function uniqNums(arr: number[]): number[] {
  return Array.from(new Set(arr.filter(n => Number.isFinite(n as any)).map(n => Number(n)))).sort((a, b) => a - b);
}

export function getAllowedCurrentDays(rules: RegionRules, region: RegionName): number[] {
  const cfg = rules.regions[region];
  if (!cfg) return [];
  if (cfg.allowedCurrentDays && cfg.allowedCurrentDays.length) return cfg.allowedCurrentDays;
  if (cfg.transitions) return uniqNums(Object.keys(cfg.transitions).map(Number));
  return [];
}

export function getAllowedTargetDays(rules: RegionRules, region: RegionName, current?: number): number[] {
  const cfg = rules.regions[region];
  if (!cfg) return [];
  if (cfg.transitions) {
    if (current == null) return [];
    const list = cfg.transitions[String(current)] || [];
    return uniqNums(list);
  }
  if (cfg.allowedTargetDays) return cfg.allowedTargetDays;
  return [];
}

export function isValidTransition(rules: RegionRules, region: RegionName, current: number, next: number): boolean {
  const allowedCurr = getAllowedCurrentDays(rules, region);
  if (!allowedCurr.includes(current)) return false;
  const targets = getAllowedTargetDays(rules, region, current);
  return targets.includes(next);
}


