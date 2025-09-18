## API — Prorrateo v1 (propuesta)

`POST /api/v1/prorrateo/simular`

### Request
```json
{
  "case": "cambio_ciclo" | "cambio_inmediato",
  "payload": {
    "base": 30,
    "valorPlan": 90000,
    "diaActual": 1,
    "nuevoDia": 17,
    "planActual": 38900,
    "planNuevo": 54900,
    "diaCorte": 1,
    "diaCambio": 21
  }
}
```

Notas:
- Para `cambio_ciclo` usar `valorPlan`, `diaActual`, `nuevoDia`.
- Para `cambio_inmediato` usar `planActual`, `planNuevo`, `diaCorte`, `diaCambio`.

### Respuesta (200)
```json
{
  "diasProrrateo": 16,
  "cargoProporcional": 48000,
  "diasConsumidos": 20,
  "diasRestantes": 10,
  "comparativos": { "mensualAnterior": 38900, "diferencia": 5333.33 }
}
```

Campos no aplicables pueden omitirse según el `case`.

### Errores
- 400: validación (días fuera de 1..31, números <= 0, `diaCambio < diaCorte`).
- 500: error interno.

