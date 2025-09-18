import { useEffect, useState } from 'react';
import { makeTransparentLogo } from '../utils/transparentLogo';

interface UseTransparentLogoArgs {
  src: string;
  tolerance?: number;
  fallbackSrc?: string;
}

export function useTransparentLogo({ src, tolerance = 20, fallbackSrc }: UseTransparentLogoArgs) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fallback, setFallback] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined') return;

    setLoading(true);
    makeTransparentLogo(src, tolerance)
      .then((u) => {
        if (!cancelled) {
          setUrl(u);
          setFallback(false);
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('Logo transparente fallback:', e);
        if (!cancelled) {
          setUrl(fallbackSrc || src);
          setFallback(true);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [src, tolerance, fallbackSrc]);

  return { url, loading, fallback };
}


