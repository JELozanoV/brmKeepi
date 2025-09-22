import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMonthlyKpis, MonthlyKpiDTO } from '../services/kpiMonthlyProvider';

type Cache = Map<string, MonthlyKpiDTO>; // key: advisorId:YYYY-MM

export function useKpiHistory(advisorId: string | null) {
  const cacheRef = useRef<Cache>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [data, setData] = useState<MonthlyKpiDTO | null>(null);

  // limpiar cache al cambiar usuario
  useEffect(() => {
    cacheRef.current.clear();
  }, [advisorId]);

  const loadMonth = useCallback(async (year: number, month: number) => {
    if (!advisorId) {
      setData(null);
      return;
    }
    const ym = `${year}-${String(month).padStart(2,'0')}`;
    const key = `${advisorId}:${ym}`;
    setCurrentKey(key);
    setError(null);
    const cached = cacheRef.current.get(key);
    if (cached) {
      setData(cached);
      return;
    }
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetchMonthlyKpis({ advisorId, year, month });
      if (!controller.signal.aborted) {
        cacheRef.current.set(key, res);
        setData(res);
      }
    } catch (e: any) {
      if (!controller.signal.aborted) setError('No se pudo cargar el histórico del mes.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [advisorId]);

  return { data, loading, error, loadMonth, currentKey };
}


