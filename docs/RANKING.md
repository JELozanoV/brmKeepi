## Ranking — reglas y view-model

Fuente: `src/utils/rankingUtils.ts` y componentes en `src/components/profile/RankingCard.tsx`.

### Métricas y vistas
- Vistas: “Mi equipo” (por coordinador) y “Operación”.
- Métricas: TMO (menor mejor), Transferencia (menor mejor), NPS (mayor mejor), Combinado.

### Regla de 6 filas
- Top 3 con medallas (oro/plata/bronce).
- Fila del usuario (si no está en Top 3) con resaltado.
- Dos vecinos cercanos (arriba/abajo, con casos borde: último/penúltimo).

### Score combinado (40/40/20)
Anclado a metas (cap a 1.0):
```ts
scoreTmo = min(1, metaTmoSec / tmoSec)
scoreTrans = min(1, metaTransfersPct / transfersPct)
scoreNps = min(1, npsPct / metaNpsPct)
scoreComb = 0.4*scoreTmo + 0.4*scoreTrans + 0.2*scoreNps
```
Desempates: metas cumplidas → menor transfers → menor tmo → mayor nps → alfabético.

```100:125:src/utils/rankingUtils.ts
list.sort((a,b) => {
  const da = (a as any).__combined ?? 0;
  const db = (b as any).__combined ?? 0;
  if (db !== da) return db - da;
  const ca = (a as any).__metas ?? 0;
  const cb = (b as any).__metas ?? 0;
  if (cb !== ca) return cb - ca;
  const ta = a.transfersPct ?? Infinity;
  const tb = b.transfersPct ?? Infinity;
  if (ta !== tb) return ta - tb;
  const ma = a.tmoSec ?? Infinity;
  const mb = b.tmoSec ?? Infinity;
  if (ma !== mb) return ma - mb;
  const na = a.npsPct ?? -Infinity;
  const nb = b.npsPct ?? -Infinity;
  if (nb !== na) return nb - na;
  return a.name.localeCompare(b.name);
});
```

### Copy natural
- “Tu TMO está 18 segundos por debajo del promedio del equipo.”
- “Tu tasa está 2.5 puntos por encima del promedio de la operación.”

### Edge cases
- Grupo < 6: se muestra nota “Grupo pequeño…”.
- Usuario en Top 3: no se duplica su fila; se completa con puestos 4–6.

