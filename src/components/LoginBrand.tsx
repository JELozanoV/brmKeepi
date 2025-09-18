import React, { useEffect, useMemo, useState } from 'react';
import Fidex2 from '../assets/images/Fidex2.png';

/** Tolerancia de cercanía al blanco para flood-fill (0-255). Ajustable. */
const TOLERANCE = 20; // TODO diseño: ajustar 10–25 si fuese necesario
const CACHE_KEY = `loginBrand:fidex2:t${TOLERANCE}:v1`;

function isNearWhite(r: number, g: number, b: number): boolean {
  const dr = Math.abs(255 - r);
  const dg = Math.abs(255 - g);
  const db = Math.abs(255 - b);
  return Math.max(dr, dg, db) <= TOLERANCE;
}

const LoginBrand: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Solo en cliente
    if (typeof window === 'undefined') return;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setSrc(cached);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager' as any;
    img.src = Fidex2;

    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        // Canvas offscreen (compatibilidad: usar canvas normal y no OffscreenCanvas)
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2d context');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, w, h);
        const { data } = imageData;
        const visited = new Uint8Array(w * h);

        const queue: number[] = [];
        const pushIf = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= w || y >= h) return;
          const idx = (y * w + x);
          if (visited[idx]) return;
          const i = idx * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) { visited[idx] = 1; return; }
          if (isNearWhite(r, g, b)) {
            visited[idx] = 1;
            queue.push(idx);
          }
        };

        // Semillas en bordes (4 lados)
        for (let x = 0; x < w; x++) {
          pushIf(x, 0);
          pushIf(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          pushIf(0, y);
          pushIf(w - 1, y);
        }

        // BFS para marcar fondo y hacerlo transparente
        while (queue.length) {
          const idx = queue.shift()!;
          const i = idx * 4;
          // set alpha = 0
          data[i + 3] = 0;
          const x = idx % w;
          const y = (idx / w) | 0;
          // vecinos 4-dir
          const n = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
          ];
          for (const [nx, ny] of n) pushIf(nx, ny);
        }

        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL('image/png');
        try { sessionStorage.setItem(CACHE_KEY, url); } catch {}
        setSrc(url);
      } catch (e) {
        // Fallback: usar asset directo
        setSrc(Fidex2);
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      setSrc(Fidex2);
      setLoading(false);
    };
  }, []);

  const style = useMemo<React.CSSProperties>(() => ({
    display: 'block',
    margin: '0 auto 20px',
    width: 'clamp(120px, 22vw, 220px)',
    height: 'auto',
  }), []);

  return (
    <>
      {loading ? (
        <div style={{ ...style, background: '#2a2a2a', borderRadius: 8 }} aria-hidden="true" />
      ) : (
        <img src={src || Fidex2} alt="RETEN+" decoding="async" loading="eager" style={style} />
      )}
    </>
  );
};

export default LoginBrand;


