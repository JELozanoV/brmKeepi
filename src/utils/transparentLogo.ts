/**
 * Utilidad para procesar un PNG y eliminar el fondo blanco conectado a bordes.
 * Cachea el resultado en localStorage para evitar reprocesar.
 */

function keyFromSrc(src: string, tolerance: number): string {
  const id = src.toLowerCase().includes('fidex2') ? 'fidex2' : 'brand';
  return `brand:${id}:v1:t${tolerance}`;
}

function isNearWhite(r: number, g: number, b: number, tolerance: number): boolean {
  const dr = Math.abs(255 - r);
  const dg = Math.abs(255 - g);
  const db = Math.abs(255 - b);
  return Math.max(dr, dg, db) <= tolerance;
}

/**
 * Procesa la imagen indicada, elimina el fondo blanco conectado a bordes y retorna un dataURL PNG con alpha.
 * @param src Ruta del PNG a procesar
 * @param tolerance Tolerancia [10–25] a considerar como "casi blanco"
 */
export async function makeTransparentLogo(src: string, tolerance = 20): Promise<string> {
  if (typeof window === 'undefined') return src;
  const cacheKey = keyFromSrc(src, tolerance);
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {}

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.loading = 'eager' as any;
    img.src = src;
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No 2d context'));
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
          if (isNearWhite(r, g, b, tolerance)) {
            visited[idx] = 1;
            queue.push(idx);
          }
        };

        // Semillas: 4 bordes
        for (let x = 0; x < w; x++) { pushIf(x, 0); pushIf(x, h - 1); }
        for (let y = 0; y < h; y++) { pushIf(0, y); pushIf(w - 1, y); }

        // BFS
        while (queue.length) {
          const idx = queue.shift()!;
          const i = idx * 4;
          data[i + 3] = 0; // alpha a 0
          const x = idx % w;
          const y = (idx / w) | 0;
          pushIf(x + 1, y);
          pushIf(x - 1, y);
          pushIf(x, y + 1);
          pushIf(x, y - 1);
        }

        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL('image/png');
        resolve(url);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Image load error'));
  });

  try { localStorage.setItem(cacheKey, dataUrl); } catch {}
  return dataUrl;
}


