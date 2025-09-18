## Arquitectura técnica

Este documento describe la arquitectura del frontend actual (fuente de verdad: el código del repositorio). Cuando falte información de backend se marca como TODO.

### Mapa de carpetas (alto nivel)

```mermaid
flowchart TB
  src((src))
  subgraph components[components]
    profile[profile/*]
    layout[layout/Header.tsx]
    solutions[solutions/*]
    common[common/*]
    brand[BrandLogo.tsx]
  end
  pages[pages/*]
  services[services/*]
  utils[utils/*]
  hooks[hooks/*]
  styles[styles/*]
  config[config/constants.ts]
  types[types/*]

  src --> components
  src --> pages
  src --> services
  src --> utils
  src --> hooks
  src --> styles
  src --> config
  src --> types
```

Referencias clave:
- `src/App.tsx`: rutas, Guard de autenticación y montaje de `Header`.
- `src/context/AuthContext.tsx`: proveedor de autenticación mock.
- `src/components/profile/ProfilePage.tsx`: orquesta KPIs, KpiCoach, Ranking.
- `src/utils/kpiSelector.ts`: única fuente de estado para KPI/KpiCoach.
- `src/utils/rankingUtils.ts`: view-model y reglas del ranking.
- `src/pages/ProporcionalesPage.tsx` + `src/utils/prorrateo.ts`: calculadora de proporcionales.
- `src/components/solutions/FilteredRatesSection.tsx`: “Tarifas Conectados”.

### Flujo de datos y navegación

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant R as Router (App.tsx)
  participant G as Guard
  participant H as Header
  participant P as ProfilePage
  participant K as KPI/KpiCoach
  participant Rk as RankingCard
  participant Pr as ProporcionalesPage

  U->>R: Visita /login o /
  R->>G: Evalúa isAuthenticated (AuthContext)
  alt no autenticado
    G-->>R: Redirect a /login
  else autenticado
    G-->>R: Renderiza DashboardApp
    R->>H: Header con menú (Perfil/Salir)
    U->>R: Navega a /perfil
    R->>P: Render Perfil
    P->>K: Calcula VM con computeKpiViewModels()
    P->>Rk: buildRankingVM() (equipo / operación)
    U->>R: Navega a /proporcionales
    R->>Pr: Render Calculadora (utils/prorrateo)
  end
```

### Estado global y proveedores
- `AuthProvider` (`src/context/AuthContext.tsx`): expone `user`, `isAuthenticated`, `login`, `logout`, `lockSeconds`, `error`, `loading`, `isLoggingOut`.
- Persistencia: `localStorage` con expiración de 8 horas.
- TODO backend: sustituir mock por cookies httpOnly + CSRF y endpoints reales.

### Única fuente de verdad KPI ↔ KpiCoach
`ProfilePage` calcula una vez el view-model de KPIs con `computeKpiViewModels()` y lo pasa tal cual a las tarjetas superiores y a KpiCoach. No se recalcula en hijos.

```12:36:src/utils/kpiSelector.ts
export interface KpiSelectorOutput {
  tmo: KpiViewModel;
  transfers: KpiViewModel;
  nps: KpiViewModel;
}
```

### Rutas y protección
- Definidas en `src/App.tsx` con `react-router-dom`.
- Guard simple que bloquea `/` y rutas privadas si no hay sesión; redirige a `/login`.

```297:306:src/App.tsx
<Routes>
  <Route path="/" element={<div className="app-content">{renderCurrentStep()}</div>} />
  <Route path="/perfil" element={<ProfilePage />} />
  <Route path="/tarifas" element={<RatesPage />} />
  <Route path="/proporcionales" element={<ProporcionalesPage />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Estilos y patrones
- Sass; UI oscura con borde azul `#1A4DFF` en cards y controles.
- Chips/segmentos reutilizan el mismo patrón de botones con borde azul y fondo activo.

### TODOs
- Integración real de auth y prorrateo (contratos en `docs/API_CONTRACTS/`).
- Pruebas automáticas (unitarias para utils y de integración para flujos). 
# Arquitectura de la Aplicación

## 🎯 Objetivos de Diseño
- Separación clara entre UI y datos
- Componentes reutilizables
- Fácil mantenimiento y escalabilidad
- Tipado fuerte con TypeScript

## 📱 Componentes Principales

### Solutions
Los componentes de soluciones manejan casos específicos de atención:

```typescript
// Ejemplo de estructura de una solución
interface Solution {
  id: string;
  type: SolutionType;
  sections: Section[];
}
```

### Sections
Componentes reutilizables para mostrar diferentes tipos de información:

- `ScriptSection`: Muestra guiones de atención
- `BenefitsSection`: Muestra beneficios de planes
- `RatesSection`: Muestra tarifas y planes
- `FAQSection`: Muestra preguntas frecuentes

## 🔄 Flujo de Datos

### Actual (Local)
```mermaid
graph TD
    A[Archivos TS/JSON] --> B[Componentes]
    B --> C[UI]
```

### Futuro (Backend)
```mermaid
graph TD
    A[API Backend] --> B[Services]
    B --> C[Components]
    C --> D[UI]
```

3. Documentación de servicios (para la futura integración con backend):

```markdown:docs/SERVICES.md
# Servicios de la Aplicación

## 🌐 API Services

### ScriptService
```typescript
interface ScriptService {
  getScriptByType(type: SolutionType): Promise<Script>;
  getAllScripts(): Promise<Script[]>;
}
```

### RatesService
```typescript
interface RatesService {
  getRatesByPlan(planType: PlanType): Promise<Rate[]>;
  getCurrentPromotions(): Promise<Promotion[]>;
}
```

## 🔐 Autenticación
Por implementar - Integración con sistema de autenticación de Claro
```

4. Documentación de tipos:

```markdown:docs/TYPES.md
# Tipos y Interfaces

## 📝 Modelos de Datos

### Script
```typescript
interface Script {
  id: string;
  title: string;
  lines: ScriptLine[];
}

interface ScriptLine {
  text: string;
  type: 'empathy' | 'solution' | 'benefit' | 'closing';
}
```

### Rate
```typescript
interface Rate {
  id: string;
  planName: string;
  price: number;
  features: string[];
  isPromotional: boolean;
}
```
```

5. Agregar documentación en los componentes:

```typescript:src/components/solutions/sections/ScriptSection.tsx
/**
 * @component ScriptSection
 * @description Componente que renderiza un guión de atención estructurado
 * 
 * @example
 * ```tsx
 * <ScriptSection
 *   title="Guión de Retención"
 *   lines={[
 *     { text: "Entiendo su preocupación", type: "empathy" },
 *     { text: "Podemos ofrecerle...", type: "solution" }
 *   ]}
 * />
 * ```
 */
interface ScriptSectionProps {
  /** Título del guión */
  title: string;
  /** Array de líneas del guión */
  lines: ScriptLine[];
}
```

6. Crear un archivo de configuración para constantes:

```typescript:src/config/constants.ts
/**
 * @constant SOLUTION_TYPES
 * @description Tipos de soluciones disponibles en la aplicación
 */
export const SOLUTION_TYPES = {
  HOGAR_COSTOS: 'hogar_costos',
  INTERNET_LENTO: 'internet_lento',
  // ... más tipos
} as const;

/**
 * @constant API_ENDPOINTS
 * @description Endpoints de la API (para futura implementación)
 */
export const API_ENDPOINTS = {
  SCRIPTS: '/api/scripts',
  RATES: '/api/rates',
  // ... más endpoints
} as const;
```

7. Crear un archivo de convenciones para el equipo:

```markdown:docs/CONVENTIONS.md
# Convenciones de Código

## 📝 Nombrado
- Componentes: PascalCase (ej: `ScriptSection`)
- Funciones: camelCase (ej: `getFeaturedRates`)
- Constantes: SNAKE_CASE (ej: `MAX_RETRY_ATTEMPTS`)

## 🎨 Estilos
- Usar variables SCSS para colores y medidas
- BEM para nombrado de clases CSS
- Mobile-first en media queries

## 🔄 Git
- Commits: usar prefijos (feat:, fix:, docs:, etc.)
- Branches: feature/, hotfix/, release/
```

Esta estructura de documentación:
1. Facilita el onboarding de nuevos desarrolladores
2. Mantiene el código mantenible y escalable
3. Proporciona una referencia clara para futuras implementaciones
4. Ayuda a mantener consistencia en el código
5. Facilita la transición a una arquitectura con backend

¿Te gustaría que profundicemos en alguna parte específica de la documentación o que agreguemos alguna sección adicional? 