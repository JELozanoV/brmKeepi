## Frontend

Stack y patrones vigentes basados en el código actual.

### Stack
- React 19 + Vite 6 + TypeScript
- Sass (estilos en `src/styles/*` y SCSS locales)
- React Router DOM 7

### Patrones de UI
- **Cards oscuras Navy** con borde Sky Blue `rgba(110, 172, 218, 0.3)` y texto Beige (Tarifas, Proporcionales, Rankings comparten look & feel).
- **Chips/botones segmentados** con gradientes Navy/Black, borde Sky Blue, estado activo destacado (HFC/FTTH, tabs de calculadora).
- **Gradientes profesionales**: `linear-gradient(135deg, #03346E 0%, #021526 100%)` en elementos principales.
- **Microcopy en lenguaje natural** (sin símbolos técnicos) en KPIs/KpiCoach.
- **Alto contraste**: Texto Beige sobre Navy oscuro, Sky Blue para acentos.

### Rutas y páginas
- `/login` (`src/pages/LoginPage.tsx`): acceso mock, muestra el logo procesado.
- `/perfil` (`src/components/profile/ProfilePage.tsx`): KPIs + KpiCoach + Ranking.
- `/tarifas` (`src/pages/RatesPage.tsx`): `FilteredRatesSection`.
- `/proporcionales` (`src/pages/ProporcionalesPage.tsx`): calculadora con `utils/prorrateo`.

### Estado y datos
- Auth: `AuthProvider` (mock) con persistencia y guard en `App.tsx`.
- KPIs: `computeKpiViewModels()` (una sola fuente de verdad) → tarjetas KPI y KpiCoach.
- Ranking: `buildRankingVM()` genera `sixRows` y copy natural.
- Tarifas: `getTarifas()` (mock) + filtros locales.
- Proporcionales: funciones puras en `utils/prorrateo.ts`.

### Manejo de errores
- Auth: mensajes simples en `error` y bloqueo por intentos (`lockSeconds`).
- Tarifas: mensaje “No se pudieron cargar las tarifas” si falla el servicio.
- Calculadora: deshabilita “Calcular” si los datos son inválidos; aria-live para resultado.

### Formateos
- COP: `formatCOP()` (`utils/prorrateo.ts`).
- Porcentajes: 1 decimal (ej. `round1()` en utils).
- Tiempos: mm:ss (`formatSec()` en utils KPI/Ranking).

### Convenciones TS/React
- Componentes funcionales con props tipadas.
- Lógica de negocio en `utils/*` (puras, testeables).
- Hooks para cross-cutting concerns (`useTransparentLogo`).

### TODO
- Tipificar completamente algunos servicios mock.
- Pruebas unitarias para `utils/prorrateo`, `kpiSelector`, `rankingUtils`.

