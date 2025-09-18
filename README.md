# App BRM — Aplicación para asesores (React + Vite + TypeScript)

Aplicación web para asesoría y retención con:
- Indicadores (KPIs) sincronizados con coaching (KpiCoach)
- Ranking (Mi equipo / Operación) con TMO, Transferencia, NPS y métrica “Combinado”
- Tarifas Conectados (filtro por tecnología y precio)
- Calculadora de Proporcionales (Cambio de ciclo / Cambio de plan inmediato)
- Autenticación mock con guard y sesión persistente

## Requisitos
- Node 18+

## Instalación y ejecución
```bash
npm install
npm run dev
# build de producción
npm run build
# previsualización
npm run preview
```

### Cómo probar rápidamente
- Ir a `/login` y autenticar con usuario `001` y contraseña `contraseña`.
- Tras login, verás el dashboard. Abre el menú Perfil en el header para “Ver perfil” o “Cerrar sesión”.
- Calculadora de Proporcionales: botón “Proporcionales” en el header.
  - Caso Cambio de ciclo: Valor mensual 90.000, día 1 → 17 → resultado `$48.000`.
  - Caso Cambio inmediato: 38.900 / 54.900, corte 1, cambio 21 → `$44.233,33`.

## Scripts útiles
```bash
npm run typecheck   # verificación de tipos
npm run lint        # lint del repositorio
npm run docs:open   # abre docs/ARCHITECTURE.md (macOS)
```

## Rutas principales
- `/login`: acceso (mock) con bloqueo por intentos y sesión persistente
- `/`: flujo principal de soluciones
- `/perfil`: Mi Perfil (KPIs + KpiCoach + Ranking)
- `/tarifas`: Tarifas Conectados
- `/proporcionales`: Calculadora de Proporcionales

## Estructura (alto nivel)
```text
src/
  components/           # UI (perfil, ranking, layout/header, soluciones, etc.)
  pages/                # Páginas: Login, RatesPage, ProporcionalesPage, ProfilePage
  services/             # Servicios mock: api, ranking, prorrateo (stub)
  utils/                # Lógica pura: kpiSelector, rankingUtils, prorrateo, transparentLogo
  hooks/                # useTransparentLogo
  styles/               # Sass (dark UI, borde azul #1A4DFF)
  config/               # constants (metas y mock de usuario actual)
  types/                # tipos compartidos
```

## Funcionalidades clave (estado actual)
- Login mock con hash SHA-256 + pepper, bloqueo por intentos, expiración de 8h (localStorage)
- Guard de rutas y menú de perfil (logout) accesible en el header
- KPIs con semáforo unificado (ok/warn/bad) y microcopy natural (sin símbolos)
- KpiCoach alineado 1:1 con el estado de las tarjetas KPI
- Ranking con Top 3 + tu fila + vecinos (6 filas), selector de métrica y score combinado (40/40/20)
- Calculadora de Proporcionales (base 30 días) y stub de servicio para futura API; entradas de monto con separador de miles (ej. 90.000)
- Logo PNG procesado en cliente para transparencias (cacheado)

## Documentación
Consulta la carpeta `docs/`:
- `ARCHITECTURE.md`: arquitectura técnica (Mermaid)
- `FRONTEND.md`: stack, patrones de UI (dark + borde azul), rutas y estados
- `AUTH.md`: autenticación mock y migración a backend (TODO endpoints reales)
- `KPI_LOGIC.md`, `RANKING.md`, `PROPORCIONALES.md`: lógicas de negocio
- `STYLEGUIDE.md`, `ACCESSIBILITY.md`, `SECURITY.md`
- `CHANGELOG.md`, `ROADMAP.md`

## Notas
- TODO: integrar backend real para auth y prorrateo; contratos en `docs/API_CONTRACTS/`.
