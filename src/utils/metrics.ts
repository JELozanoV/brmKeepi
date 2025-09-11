export function formatTmo(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function toPercent(n: number, d: number): string {
  if (!d) return '0%';
  return `${Math.round((n / d) * 100)}%`;
}

export function getStatusByThresholds(k: { tmoSec?: number; transPct?: number; retPct?: number; qa?: number; csat?: number })
: { tmo?: 'good'|'warn'|'bad'; trans?: 'good'|'warn'|'bad'; ret?: 'good'|'warn'|'bad'; qa?: 'good'|'warn'|'bad'; csat?: 'good'|'warn'|'bad' } {
  const st: any = {};
  // TMO meta: good ≤ 07:00; warn 07:01–08:00; bad > 08:00
  if (typeof k.tmoSec === 'number') {
    st.tmo = k.tmoSec <= 420 ? 'good' : k.tmoSec <= 480 ? 'warn' : 'bad';
  }
  // Transferencias: good ≤ 40%; warn 40–50%; bad > 50%
  if (typeof k.transPct === 'number') {
    st.trans = k.transPct <= 40 ? 'good' : k.transPct <= 50 ? 'warn' : 'bad';
  }
  // QA: good ≥ 60; warn 45–59; bad < 45 (como aproximación para NPS%)
  if (typeof k.qa === 'number') {
    st.qa = k.qa >= 60 ? 'good' : k.qa >= 45 ? 'warn' : 'bad';
  }
  // CSAT: umbrales no definidos por el usuario; mantenemos por defecto
  if (typeof k.csat === 'number') {
    st.csat = k.csat >= 4.5 ? 'good' : k.csat >= 4.0 ? 'warn' : 'bad';
  }
  return st;
}
