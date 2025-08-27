import { Range, RawKpis } from '../types/profile';
import { kpisMock } from '../data/profile/kpisMock';

export async function getMyKpis(range: Range): Promise<RawKpis> {
  try {
    const resp = await fetch(`/api/kpis/me?range=${range}`, { method: 'GET' });
    if (!resp.ok) throw new Error('API not ready');
    const data = await resp.json();
    return data as RawKpis;
  } catch {
    // Fallback a mock mientras no haya backend
    return Promise.resolve(kpisMock[range]);
  }
}
