# App BRM — Aplicación para Asesores de Claro

Aplicación web interactiva para asesores de Claro en servicios móviles y Call Center, enfocada en el área de filtro. Guía a los asesores en procesos de gestión de atención y retención de clientes, filtrando por tipo de servicio, motivo de llamada y proporcionando soluciones personalizadas para fidelizar al cliente y evitar cancelaciones.

## 🎯 Objetivos Generales
- Guiar a asesores nuevos en el trato con clientes.
- Filtrar llamadas por: tipo de servicio (hogar/móvil), motivo (facturación, soporte técnico, cancelación).
- Proporcionar soluciones según el motivo: soporte técnico para fallas, beneficios VAS para costos, etc.
- Prevenir cancelaciones transfiriendo a retención cuando sea posible.

## ✨ Funcionalidades Principales
- **Flujo de Atención**: Selección de servicio → ánimo del cliente → motivo → soluciones (guiones, beneficios, tarifas, procedimientos).
- **Indicadores (KPIs)**: Sincronizados con coaching (KpiCoach), semáforo unificado (ok/warn/bad), microcopy natural.
- **Ranking**: "Mi equipo" / "Operación" con TMO, Transferencia, NPS y métrica "Combinado" (40/40/20).
- **Tarifas Conectados**: Filtro por tecnología (HFC/FTTH), precio actual del cliente; sugiere planes ≥ precio actual.
- **Calculadora de Proporcionales**: Cambio de ciclo / Cambio de plan inmediato (base 30 días).
- **Autenticación Mock**: Login con hash SHA-256 + pepper, bloqueo por intentos, sesión persistente (8h en localStorage).
- **Chatbot y Toasts**: Soporte conversacional y recomendaciones basadas en ánimo del cliente.

## 🏗️ Arquitectura Técnica
Basada en separación clara entre UI y datos, componentes reutilizables, tipado fuerte con TypeScript.

### Mapa de Carpetas (Alto Nivel)
```
src/
├── App.tsx                 # Orquestación de rutas y flujo principal
├── components/             # UI: perfil, ranking, layout/header, soluciones, etc.
│   ├── profile/            # KPIs, KpiCoach, Ranking
│   ├── solutions/          # Soluciones específicas (HogarCostos, etc.)
│   ├── layout/Header.tsx   # Navegación y menú
│   └── common/             # Reutilizables: Modal, Toast
├── pages/                  # Páginas: LoginPage, RatesPage, ProporcionalesPage, ProfilePage
├── services/               # Integraciones: api.ts (backend), iaService.ts (IA)
├── utils/                  # Lógica pura: kpiSelector, rankingUtils, prorrateo
├── hooks/                  # useTransparentLogo
├── styles/                 # Sass: dark UI, variables de color
├── config/                 # constants.ts (metas, mocks)
├── types/                  # index.ts (tipos compartidos)
└── data/                   # Datos locales: rates.ts, benefits.ts, scripts.ts
```

### Flujo de Datos y Navegación
- Estado local en `App.tsx` (sin store global).
- Rutas protegidas con Guard; persistencia en localStorage.
- Integración futura con backend (Express) y IA (OpenAI).

### Servicios y Integraciones
- **API Backend**: `src/services/api.ts` (BASE_URL: localhost:3000/api) para tarifas, guiones, complementos.
- **IA Service**: `src/services/iaService.ts` para soporte conversacional y guiones dinámicos.
- **Autenticación**: Mock actual; TODO migrar a cookies httpOnly + CSRF.

## 🛠️ Tecnologías y Librerías
- **Frontend Stack**: React 19 + Vite 6 + TypeScript + Sass.
- **Enrutamiento**: React Router DOM 7.
- **Estilos**: Sass con variables; UI oscura Navy Blue con acentos Sky Blue y textos Beige.
- **Librerías Adicionales**: Ninguna externa principal; lógica pura en utils.
- **Herramientas**: ESLint, TypeScript compiler.

## 🎨 Paleta de Colores y Estilos
- **Navy Blue (Principal)**: `#03346E` (fondos oscuros, gradientes).
- **Black Navy**: `#021526` (fondos muy oscuros, gradientes).
- **Sky Blue (Acento)**: `#6EACDA` (bordes, acentos, elementos interactivos).
- **Beige**: `#E2E2B6` (textos principales sobre fondos oscuros).
- **Blanco**: `#FFFFFF` (fondos claros, textos sobre oscuro).
- **Gris Claro Neutro**: `#eef1f9` (fondos de áreas principales).
- **Patrones UI**: Cards oscuras Navy con bordes Sky Blue, gradientes Navy/Black, textos Beige, chips/botones con gradientes, microcopy natural, alto contraste accesible.

## 📋 Requisitos
- Node.js 18+

## 🚀 Instalación y Ejecución
```bash
npm install
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Build de producción
npm run preview      # Previsualización del build
```

### Scripts Útiles
```bash
npm run typecheck    # Verificación de tipos TypeScript
npm run lint         # Linting del repositorio
npm run docs:open    # Abre docs/ARCHITECTURE.md (macOS)
```

## 🧪 Cómo Probar Rápidamente
- **Login**: Ir a `/login`, autenticar con usuario `001` y contraseña `contraseña`.
- **Dashboard**: Tras login, flujo principal en `/`.
- **Perfil**: Menú en header → "Ver perfil" (`/perfil`: KPIs + KpiCoach + Ranking).
- **Tarifas**: Botón "Tarifas Conectados" en header (`/tarifas`).
- **Proporcionales**: Botón "Proporcionales" en header (`/proporcionales`).
  - Cambio de ciclo: Valor 90.000, día 1→17 → `$48.000`.
  - Cambio inmediato: 38.900/54.900, corte 1, cambio 21 → `$44.233,33`.

## 🛣️ Rutas Principales
- `/login`: Acceso mock con bloqueo por intentos.
- `/`: Flujo principal de soluciones.
- `/perfil`: Mi Perfil (KPIs + KpiCoach + Ranking).
- `/tarifas`: Tarifas Conectados.
- `/proporcionales`: Calculadora de Proporcionales.

## 📚 Documentación Completa
Consulta `docs/` para detalles:
- `ARCHITECTURE.md`: Arquitectura técnica (diagramas Mermaid).
- `FRONTEND.md`: Stack, patrones UI, rutas, estados.
- `AUTH.md`: Autenticación mock y migración a backend.
- `KPI_LOGIC.md`: Lógica de KPIs y KpiCoach.
- `RANKING.md`: Reglas de ranking y view-model.
- `PROPORCIONALES.md`: Calculadora de proporcionales.
- `STYLEGUIDE.md`: Guía de estilos y paleta.
- `ACCESSIBILITY.md`: Prácticas de accesibilidad (A11y).
- `SECURITY.md`: Seguridad actual y plan de migración.
- `SERVICES.md`: Servicios API e interfaces.
- `TYPES.md`: Tipos e interfaces de datos.
- `API_CONTRACTS/prorrateo_v1.md`: Contrato API para prorrateo.
- `INFORME_AUDITORIA_APP_BRM.md`: Auditoría completa (arquitectura, componentes, mejoras).
- `CHANGELOG.md`: Historial de cambios.
- `ROADMAP.md`: Plan de desarrollo.
- `CONVENTIONS.md`: Convenciones de código.

## 🔄 Estado Actual y TODOs
- **Funcionalidades Implementadas**: Flujo completo, KPIs, ranking, calculadora, auth mock.
- **TODOs**: Integrar backend real para auth y prorrateo; pruebas unitarias; telemetría; i18n; PWA.
- **Reglas de Negocio**: "Marcación" obligatoria (ej. CAN ICS para retención); no ofrecer planes < precio actual; "Creer en el Cliente" con ajustes internos.

## 🤝 Contribuciones
Sigue `docs/CONVENTIONS.md` para nombrado, estilos y Git (commits con prefijos: feat:, fix:, docs:).

## 📄 Licencia
Propiedad de Claro. Consulta términos internos.
