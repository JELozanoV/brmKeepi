import { useCallback, useEffect, useRef, useState } from 'react';
import { getMonthlyHistory, MonthHistoryResponse } from '../services/kpisHistoryService';

type Cache = Map<string, MonthHistoryResponse>; // key: YYYY-MM

export function useKpiHistory(userId: string | null) {
  const cacheRef = useRef<Cache>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [data, setData] = useState<MonthHistoryResponse | null>(null);

  // limpiar cache al cambiar usuario
  useEffect(() => {
    cacheRef.current.clear();
  }, [userId]);

  const loadMonth = useCallback(async (monthIso: string) => {
    setCurrentMonth(monthIso);
    setError(null);
    const cached = cacheRef.current.get(monthIso);
    if (cached) {
      setData(cached);
      return;
    }
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await getMonthlyHistory(monthIso);
      if (!controller.signal.aborted) {
        cacheRef.current.set(monthIso, res);
        setData(res);
      }
    } catch (e: any) {
      if (!controller.signal.aborted) setError('No se pudo cargar el histórico del mes.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  return { data, loading, error, loadMonth, currentMonth };
}


