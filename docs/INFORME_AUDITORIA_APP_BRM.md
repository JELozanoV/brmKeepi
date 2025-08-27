# INFORME DE AUDITORÍA – App BRM (Keepi)

Fecha: 2025-08-15

## 1) Resumen ejecutivo
- La aplicación es un asistente web para asesores que guía el flujo de atención y retención de clientes.
- Frontend en React + Vite + TypeScript + Sass; enrutamiento con React Router.
- Flujo principal orquestado desde `src/App.tsx`: selección de servicio → ánimo → motivo → componentes de solución → marcación correspondiente.
- Estado es local en `App.tsx` (sin store global). Navegación consolidada en `Header`.
- Rutas actuales: `/` (flujo principal), `/tarifas` (Tarifas Conectados), `/perfil` (stub), `*` → `/`.
- Integración con backend (Express, sup.) en `src/services/api.ts` y con IA en `src/services/iaService.ts`.
- Módulo de tarifas filtradas (`FilteredRatesSection`) respeta regla de retención: sugerir ≥ precio actual del cliente.
- Estilos Sass con variables de marca (azules, gris, blanco, negro). Se requiere revisión de breakpoints.
- Hallazgos: tipados coherentes en `src/types/`, datos locales en `src/data/`, riesgo de rutas huérfanas mitigado con redirect.
- Recomendaciones: capa de servicios tipada, manejo de errores unificado, checklist de marcación, accesibilidad y telemetría.

---

## 2) Arquitectura y árbol de carpetas
Raíz del frontend: `src/`

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── common/
│   │   └── Modal.tsx (si existía antes; actualmente no usado desde Header)
│   ├── Chatbot/
│   ├── Toast/
│   ├── ServiceSelector.tsx
│   ├── PlanTypeSelector.tsx
│   ├── CancellationReasonSelector.tsx
│   ├── CostReasonSelector.tsx
│   ├── FailureTypeSelector.tsx
│   ├── HomeFailureSelector.tsx
│   ├── TravelTypeSelector.tsx
│   ├── CustomerServiceTypeSelector.tsx
│   ├── SolutionCard.tsx
│   ├── SummaryScreen.tsx
│   ├── solutions/
│   │   ├── HogarCostosSolution.tsx
│   │   ├── HogarMejorOfertaSolution.tsx
│   │   ├── HogarInternetLentoSolution.tsx
│   │   ├── HogarFallasIntermitentesSolution.tsx
│   │   ├── HogarCortesFrecuentesSolution.tsx
│   │   ├── HogarFallasNavegadorSolution.tsx
│   │   ├── HogarWifiInestableSolution.tsx
│   │   ├── HogarViajeTrabajoSolution.tsx
│   │   ├── HogarViajeVacacionesSolution.tsx
│   │   ├── HogarViajeMudanzaSolution.tsx
│   │   ├── ClaroPaySolution.tsx
│   │   ├── CompetitorSolution.tsx
│   │   ├── ReincidentClientSolution.tsx
│   │   ├── BaseSolution.tsx
│   │   ├── FilteredRatesSection.tsx
│   │   ├── DynamicRatesSection.tsx
│   │   ├── DynamicScriptSection.tsx
│   │   └── sections/
│   │       ├── RatesSection.tsx
│   │       ├── ScriptSection.tsx
│   │       ├── BenefitsSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── ProcedureSection.tsx
│   │       └── (otras secciones .tsx + .scss)
├── pages/
│   ├── RatesPage.tsx
│   └── ProfilePage.tsx
├── services/
│   ├── api.ts
│   ├── iaService.ts
│   └── moodRecommendations.ts
├── data/
│   ├── rates.ts
│   ├── benefits.ts
│   ├── faqs.ts
│   ├── scripts.ts
│   ├── solutions.ts
│   └── (otros .ts dominiales)
├── hooks/
│   └── useRandomCancelacionCostosScript.ts
├── styles/
│   ├── App.scss
│   ├── _header.scss
│   ├── _variables.scss
│   ├── _variables-module.scss
│   └── (otros .scss por features)
├── types/
│   └── index.ts
└── config/ (si aplica)
```

Puntos de entrada:
- `src/main.tsx`: render de `<App />` dentro de `<BrowserRouter basename="/brmKeepi">`.
- `src/App.tsx`: orquestación del flujo y rutas.

Rutas (React Router):
- `/` → flujo principal (`renderCurrentStep()`), arranca en `ServiceSelector`.
- `/tarifas` → `pages/RatesPage.tsx` → `components/solutions/FilteredRatesSection.tsx`.
- `/perfil` → `pages/ProfilePage.tsx` (stub informativo).
- `*` → redirect a `/`.

Estado:
- Local en `App.tsx` (`useState`) para: `serviceType`, `planType`, `cancellationReason`, `costReason`, `failureType`, `travelType`, `customerServiceType`, `competitorType`, `homeFailureType`, `activationDelayType`, `reincidentClientType`, `clientMood`, `solutionApplied`, `toast`.
- No se detecta `Context` ni store global (Redux/Zustand).

Hooks personalizados:
- `src/hooks/useRandomCancelacionCostosScript.ts` (sugiere utilidades para scripts dinámicos).

Providers:
- React Router (BrowserRouter). No se observan otros providers globales.

---

## 3) Inventario de componentes clave
A continuación, resumen de responsabilidades y props relevantes. Para componentes no listados en detalle, tomar este patrón como guía.

### Selección y flujo (UI de orquestación)
- **`components/ServiceSelector.tsx`**
  - Rol: elegir tipo de servicio (`'hogar' | 'movil'`).
  - Props: `onSelect: (service: ServiceType) => void`.
  - Uso: `App.tsx` en `renderCurrentStep()` cuando no hay `serviceType`.

- **`components/PlanTypeSelector.tsx`**
  - Rol: elegir tipo de plan (prepago/pospago) cuando `serviceType === 'movil'`.
  - Props: `onSelect: (plan: PlanType) => void`.
  - Uso: `App.tsx`.

- **`components/CancellationReasonSelector.tsx`**
  - Rol: motivo de cancelación (costo, fallas, viaje, servicio-cliente, competencia, etc.).
  - Props: `serviceType`, `planType`, `onSelect`.
  - Uso: `App.tsx`.

- **`components/CostReasonSelector.tsx`** / **`FailureTypeSelector.tsx`** / **`HomeFailureSelector.tsx`** / **`TravelTypeSelector.tsx`** / **`CustomerServiceTypeSelector.tsx`**
  - Rol: refinar causa dentro del motivo (p. ej., tipo de falla, viaje, servicio al cliente).
  - Props: `onSelect` del tipo específico.
  - Uso: `App.tsx`.

- **`components/MoodSelector.tsx`**
  - Rol: capturar estado de ánimo del cliente y disparar recomendaciones (`moodRecommendations`).
  - Props: `onSelect`, `initialMood`.
  - Uso: `App.tsx`.

- **`components/SolutionCard.tsx`**, **`components/SummaryScreen.tsx`**
  - Rol: presentar soluciones y resumen final (disparan `onApplySolution` y `onReset`).
  - Uso: `App.tsx`.

### Layout / navegación
- **`components/layout/Header.tsx`**
  - Rol: botones de navegación “Inicio” y “Atrás”; acceso a “Tarifas Conectados”.
  - Props: `onHome?`, `onBack?` (si no se proveen, fallback a `navigate('/')` y `history.back()`).
  - Navega a `/tarifas` desde el botón “Tarifas Conectados”.

### Soluciones y secciones reutilizables
- **Soluciones (`components/solutions/*.tsx`)**
  - Ejemplos: `HogarCostosSolution`, `HogarMejorOfertaSolution`, `ClaroPaySolution`, `CompetitorSolution`, `ReincidentClientSolution`, `...`.
  - Props comunes: `onApplySolution: () => void`.
  - Uso: `App.tsx`, según combinaciones de `serviceType` + `cancellationReason` + refinadores.

- **Secciones (`components/solutions/sections/*.tsx`)**
  - `RatesSection.tsx`: lista de planes (props: `title: string`, `rates: { title; price; features[]; isHighlighted? }[]`).
  - `ScriptSection.tsx`: guiones sugeridos.
  - `BenefitsSection.tsx`: beneficios destacados.
  - `FAQSection.tsx`: preguntas frecuentes.
  - `ProcedureSection.tsx` y otras: pasos/procesos.

- **Tarifas Conectados**
  - `components/solutions/FilteredRatesSection.tsx`: UI para filtrar por tecnología (HFC/FTTH), tipo de servicio y precio actual del cliente; consume `getTarifas()`.
  - Pinta resultados con `RatesSection` y resalta la opción más cercana por encima del precio actual.
  - Vista dedicada en `pages/RatesPage.tsx` (ruta `/tarifas`).

### Chat y notificaciones
- **`components/Chatbot/*`**: chat auxiliar.
- **`components/Toast/*`**: toasts centralizados; en `App.tsx` se maneja `showToast`, `toastMessage`, `toastType`.

---

## 4) Estilos y diseño (Sass)
- Variables principales (paleta): ver `src/styles/_variables.scss` y `_variables-module.scss`.
  - Azul principal: `#1A4DFF` (`$BRM-Colors-1-hex`).
  - Azul claro: `#007BFF` (`$BRM-Colors-2-hex`).
  - Gris claro: `#F2F2F2`.
  - Blanco: `#FFFFFF`.
  - Negro suave: `#222222`.
- Organización: estilos por feature (`styles/solutions/*`), layout (`_header.scss`), y global (`App.scss`).
- Botones: consistencia visual en Header y secciones; mantener misma forma y aplicar hover/transiciones suaves (~0.2–0.3s). Confirmar en `App.scss`/`_header.scss` que no hay cambios de border-radius entre estados.
- Responsive: revisar media queries en `App.scss` y secciones. Recomendado validar en Galaxy S20, iPhone 15 Pro Max y desktop ≥1440px. Ajustar paddings y grid de `RatesSection`.

---

## 5) Datos y tipado
- Tipos centrales: `src/types/index.ts` (p. ej., `ServiceType`, `PlanType`, `CancellationReason`, `CostReason`, `FailureType`, `TravelType`, `CustomerServiceType`, `HomeFailureType`, `ActivationDelayType`, `ReincidentClientType`, `ClientMoodType`).
- Datos locales: `src/data/` (ej. `rates.ts`, `benefits.ts`, `faqs.ts`, `scripts.ts`, `solutions.ts`).
- Enlace datos→UI:
  - `FilteredRatesSection` consume backend y mapea a `RatesSection` (`features[]`, `isHighlighted`).
  - Otras soluciones consumen datos locales (`data/*`) y/o texto de guiones.
- Recomendación: estandarizar `src/data/` por dominio y exponer tipos TS para cada dataset.

---

## 6) Integraciones (backend/IA) y variables de entorno
- `src/services/api.ts`
  - `BASE_URL = 'http://localhost:3000/api'` (hardcodeado; mover a env).
  - Métodos: `getTarifas()`, `getGuiones()`, `getComplementos()`.
- `src/services/iaService.ts`
  - `askIA(text, sessionId)` vía `POST http://localhost:3000/api/ia` con `{ sessionId, prompt }`.
  - Rol esperado: soporte conversacional, guiones dinámicos, memoria por sesión.
- Variables de entorno sugeridas:
  - `VITE_API_BASE_URL` para backend.
  - `VITE_IA_API_URL` si se separa del backend general.
  - Describir en README `how-to-run` (no se modifica código en este informe).

---

## 7) Flujos de negocio (retención)
- Reglas clave (terminología “marcación” obligatoria):
  - No ofrecer planes por debajo del actual; solo iguales o superiores (≥ +$1).
  - “Creer en el Cliente”: ajuste interno, con reglas de elegibilidad; no se comunica explícitamente.
  - Suspensión temporal: solo si el cliente lo solicita.
  - Si el cliente acepta retención, la marcación a dejar es **CAN ICS**.
- Implementación y guía al asesor:
  - Selección de servicio → motivo → secciones de soporte (guiones, beneficios VAS, Claro Club, Claro Pay/cashback, etc.).
  - “Tarifas de Conectados” (`/tarifas`) filtra por tecnología y precio actual del cliente, y presenta opciones ≥ precio actual; resalta la más cercana hacia arriba.
  - Toasters (`Toast`) para recomendaciones de ánimo del cliente (`moodRecommendations`).

---

## 8) Problemas detectados y riesgos
- **Rutas huérfanas**: mitigado con redirect `* → /`, pero verificar enlaces antiguos (ej. `/perfil`).
- **Tipado/readonly**: cuidado al mapear datasets inmutables a props mutables (caso `RatesSection.features: string[]`).
- **Dependencia de backend**: `BASE_URL` hardcodeado; si el backend no está activo, `FilteredRatesSection` muestra error. Mejor manejo de estados `loading/error` y reintentos.
- **Terminología**: garantizar uso exclusivo de “marcación” en UI/mensajes.
- **Z-index/overlays**: al retirar modal de tarifas del Header, riesgo reducido; revisar otros modales y dropdowns del Header (perfil) y su foco/accesibilidad.
- **Navegación**: botón “Atrás” mezcla `onBack` (estado interno) con `history.back()` como fallback; documentar comportamiento esperado por ruta.

---

## 9) Mejoras priorizadas (Backlog)
### Quick wins (1–2 días)
- Centralizar `BASE_URL` en `.env` y un wrapper `httpClient` (axios/fetch) con interceptores.
- Carpeta `data/` estandarizada por dominio + tipos TS.
- Unificar componentes base (Button, Modal, Card) y tokens de diseño (espaciados, radios, sombras).
- Header persistente con accesibilidad (roles/aria, foco) y pruebas de teclado.
- Validación extra en Tarífas: señalizar cuando no hay resultados ≥ precio actual.

### Medio plazo (1–2 semanas)
- Capa de servicios tipada (io-ts/zod para parsing), manejo de errores unificado y retries.
- Hook de IA con memoria de sesión, resúmenes y guardarraíles de negocio.
- Persistencia de estado de flujo (sessionStorage) y deep-linking seguro.
- Filtros de tarifas con precio mínimo del cliente y comparativas visuales.

### Largo plazo
- Telemetría: TMO, aceptación de retención, uso de marcaciones, conversiones.
- Tests e2e (Playwright/Cypress) para flujos críticos.
- i18n (es/co), accesibilidad AA (navegación por teclado, lecturas de pantalla).

---

## 10) Checklist de verificación (QA/UX/Accesibilidad)
- [ ] Inicio carga en `/` y muestra `ServiceSelector`.
- [ ] Botones de servicio (Hogar/Móvil) visibles y táctiles en móviles.
- [ ] Navegación desde Header: Inicio → `/`, Tarífas → `/tarifas`, Atrás → estado previo.
- [ ] `FilteredRatesSection`: solo muestra planes ≥ precio actual; resalta el más cercano.
- [ ] Uso consistente de “marcación” en textos.
- [ ] Toasts aparecen con recomendaciones al registrar el ánimo.
- [ ] Responsive correcto en Galaxy S20, iPhone 15 Pro Max, desktop ≥1440px.
- [ ] Sin overlays bloqueando clics (z-index correcto).
- [ ] Errores de red gestionados con mensajes claros.

---

## 11) Preguntas abiertas
- ¿Se requiere persistir la marcación (CAN ICS) en backend con auditoría (quién/cuándo)?
- ¿Existen reglas detalladas de elegibilidad para “Creer en el Cliente” (montos, límites, tipos de casos)?
- ¿Cuál es el SLA esperado para respuestas del endpoint de IA y las tarifas?
- ¿Se debe soportar multiruta para móviles (PWA) o modo offline?
- ¿Hay lineamientos de accesibilidad corporativos (Claro) para colores/contraste?

---

Enlaces relativos útiles:
- Flujo principal: [`src/App.tsx`](../src/App.tsx)
- Enrutador: [`src/main.tsx`](../src/main.tsx)
- Header: [`src/components/layout/Header.tsx`](../src/components/layout/Header.tsx)
- Tarífas: [`src/components/solutions/FilteredRatesSection.tsx`](../src/components/solutions/FilteredRatesSection.tsx) y [`src/pages/RatesPage.tsx`](../src/pages/RatesPage.tsx)
- Servicios: [`src/services/api.ts`](../src/services/api.ts), [`src/services/iaService.ts`](../src/services/iaService.ts)
- Tipos: [`src/types/index.ts`](../src/types/index.ts)
- Estilos: [`src/styles/`](../src/styles/)
