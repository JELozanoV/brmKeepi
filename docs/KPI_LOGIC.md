## KPIs y KpiCoach — lógica unificada

Fuente de verdad: `src/utils/kpiSelector.ts`.

### Estados y umbrales
- Estados: `ok | warn | bad` → colores `green | yellow | red`.
- Texto del chip:
  - ok: “En meta”
  - warn: “En meta, pero muy cerca del límite”
  - bad: “Necesita atención”

Umbrales WARN (más estrictos):
- TMO (meta = máximo): WARN si colchón ≤ 30 segundos o dentro del 5% de la meta.
- Transferencias (meta = máximo): WARN si ≤ 2 puntos del máximo o 5% relativo.
- NPS (meta = mínimo): WARN si ≤ 5 puntos del mínimo o 5% relativo.

```65:90:src/utils/kpiSelector.ts
const tmoWarn = (tmoCushion <= 30 + EPS) || (tmoCur >= tmoMeta - tmoMeta * GOALS_WARN_THRESHOLD - EPS);
...
const trWarn = (trPointsFromMax <= 2 + EPS) || (trCur >= trMeta - trMeta * GOALS_WARN_THRESHOLD - EPS);
...
const npsWarn = (Math.abs(npsPointsFromMin) <= 5 + EPS) || (npsCur <= npsMeta + npsMeta * GOALS_WARN_THRESHOLD + EPS);
```

### Microcopy (sin símbolos)
- Usar “o menos”, “o más”, “puntos”, “por encima/por debajo”.
- Ejemplos “Ahora” y “Qué hacer” vienen preformateados en el VM (`messages`).

### Única fuente de verdad
`computeKpiViewModels()` devuelve un objeto por KPI que consumen las tarjetas superiores y KpiCoach (mismo reference en runtime).

### Criterios de aceptación
- Con los mismos datos, estado y color coinciden en KPI y KpiCoach.
- Warn siempre muestra: “En meta, pero muy cerca del límite”.

