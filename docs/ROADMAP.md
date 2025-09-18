## Roadmap

### Corto plazo
- Migrar autenticación a backend (cookies httpOnly + CSRF; endpoints `/api/auth/*`).
- Backend para prorrateo (`/api/v1/prorrateo/simular`), mover lógica de `utils/prorrateo.ts`.
- Pruebas unitarias para `utils` y pruebas de integración básicas.

### Medio plazo
- Sesiones en Redis y rotación de tokens.
- Métricas de uso y performance (front y back).
- Contratos para IA (OpenAI gpt-4o/4.1) si se requiere asistencia contextual.

### Largo plazo
- Telemetría y auditoría centralizada.
- Theming (dark/light) y diseño de sistemas.

