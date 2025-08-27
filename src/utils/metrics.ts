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
  // TMO meta: good ≤ 08:00; warn 08:01–09:30; bad > 09:30
  if (typeof k.tmoSec === 'number') {
    st.tmo = k.tmoSec <= 480 ? 'good' : k.tmoSec <= 570 ? 'warn' : 'bad';
  }
  // Transferencias: good ≤ 15%; warn 15–25%; bad > 25%
  if (typeof k.transPct === 'number') {
    st.trans = k.transPct <= 15 ? 'good' : k.transPct <= 25 ? 'warn' : 'bad';
  }
  // Retención: good ≥ 35%; warn 25–34%; bad < 25%
  if (typeof k.retPct === 'number') {
    st.ret = k.retPct >= 35 ? 'good' : k.retPct >= 25 ? 'warn' : 'bad';
  }
  // QA: good ≥ 90; warn 80–89; bad < 80
  if (typeof k.qa === 'number') {
    st.qa = k.qa >= 90 ? 'good' : k.qa >= 80 ? 'warn' : 'bad';
  }
  // CSAT: good ≥ 4.5; warn 4.0–4.49; bad < 4.0
  if (typeof k.csat === 'number') {
    st.csat = k.csat >= 4.5 ? 'good' : k.csat >= 4.0 ? 'warn' : 'bad';
  }
  return st;
}
