import { useEffect, useMemo, useState } from 'react';
import { Range } from '../types/profile';
import { getMyKpis } from '../services/kpisService';
import { computeKpiViewModels } from '../utils/kpiSelector';
import { EXPECTED_CALLS } from '../config/constants';

export function useKpiLiveData(pollMs: number = 30000, range: Range = 'today') {
  const [data, setData] = useState<{
    callsHandled: number;
    totalHandleTimeSec: number;
    transfers: number;
    qa: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const fetchOnce = async () => {
      try {
        if (!cancelled) setLoading(true);
        const res = await getMyKpis(range);
        if (!cancelled) {
          setData({
            callsHandled: res.callsHandled,
            totalHandleTimeSec: res.totalHandleTimeSec,
            transfers: res.transfers,
            qa: res.qa,
          });
          setError(null);
          setLastUpdated(Date.now());
        }
      } catch {
        if (!cancelled) setError('No se pudieron cargar KPIs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOnce();
    timer = window.setInterval(fetchOnce, pollMs);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [pollMs, range]);

  const snapshot = useMemo(() => {
    if (!data) return null;
    const calls = data.callsHandled || 0;
    const tmoSec = calls ? data.totalHandleTimeSec / Math.max(1, calls) : 0;
    const transfersPct = calls ? Math.round((data.transfers / Math.max(1, calls)) * 100) : 0;
    const npsPct = Math.round(data.qa || 0);
    return { tmoSec, transfersPct, npsPct };
  }, [data]);

  const vm = useMemo(() => {
    if (!snapshot) return null;
    const calls = data?.callsHandled || 0;
    return computeKpiViewModels(
      range,
      snapshot,
      undefined,
      {
        n: calls,
        N: EXPECTED_CALLS[range],
        totalTalkSec: data?.totalHandleTimeSec || 0,
        transfers: data?.transfers || 0,
      }
    );
  }, [snapshot, data, range]);

  return { loading, error, lastUpdated, snapshot, vm } as const;
}
