## Calculadora de Proporcionales

Fuentes: `src/pages/ProporcionalesPage.tsx`, `src/utils/prorrateo.ts`.

### Casos soportados
- Cambio de ciclo (base 30 días por defecto)
- Cambio de plan inmediato (mes mixto)

### Motor (funciones puras)
```ts
calcularCambioDeCiclo({ valorPlan, diaActual, nuevoDia, base=30 })
 => { diasProrrateo, cargoProporcional }

calcularCambioPlanInmediato({ planActual, planNuevo, diaCorte, diaCambio, base=30 })
 => { diasConsumidos, diasRestantes, cargoProporcional, comparativos }
```
Validaciones: números > 0, días 1..31, `diaCambio >= diaCorte`. Redondeo a centavos; `formatCOP()` formatea con separador local.

### Ejemplos (Prorrateos.xlsx)
- Cambio de ciclo: plan 90.000, día 1→17, base=30 → `diasProrrateo=16`, cobro `$48.000`.
- Cambio inmediato: 38.900/54.900, corte 1, cambio 21 → `$44.233,33`.

### UI y estilo
- Misma card dark de Tarifas Conectados (borde `#1A4DFF`).
- Chips: “Cambio de ciclo” / “Cambio de plan inmediato”, “30 días” / “Días del mes (disabled)”.
- Línea de estado (aria-live):
  - Ciclo: `Método: 30 días | Días a prorratear: N | Cobro proporcional: $X`
  - Inmediato: `Método: 30 días | Días consumidos: n | Días restantes: m | Cargo proporcional del mes: $Y`

### Entradas y formato
- Los inputs de montos aceptan y muestran separador de miles en es-CO (ej. `90.000`, `38.900`).
- La lógica de cálculo limpia los separadores antes de computar.

### Contrato sugerido (backend - TODO)
`POST /api/v1/prorrateo/simular`
```json
{
  "case": "cambio_ciclo" | "cambio_inmediato",
  "payload": { ... }
}
```
Respuestas 200 con `cargoProporcional`, 400 por validación, 500 error interno.

### Cómo probar
1) Cambio de ciclo
   - Valor mensual: `90.000`
   - Día actual: `1`
   - Nuevo día: `17`
   - Resultado esperado: `Días a prorratear: 16` y `Cobro proporcional: $48.000`.
2) Cambio de plan inmediato
   - Plan actual: `38.900`
   - Plan nuevo: `54.900`
   - Día de corte: `1`
   - Día de cambio: `21`
   - Resultado esperado: `Días consumidos: 20`, `Días restantes: 10`, `Cargo proporcional del mes: $44.233,33`.

