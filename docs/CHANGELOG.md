## Unreleased

### Añadido
- Login mock con bloqueo y sesión persistente.
- Logo procesado a PNG con fondo transparente (BrandLogo + useTransparentLogo).
- KPIs con lógica unificada y KpiCoach sincronizado.
- Ranking con Top 3, fila del usuario y vecinos; métrica Combinado.
- Calculadora de Proporcionales (Cambio de ciclo / Cambio inmediato).
- Documentación inicial (README, ARCHITECTURE, FRONTEND, AUTH, KPI_LOGIC, RANKING, PROPORCIONALES, STYLEGUIDE, ACCESSIBILITY, SECURITY, API_CONTRACTS/prorrateo_v1).
 - Inputs monetarios de la calculadora con separador de miles (es-CO) y limpieza antes del cálculo.

### Cambiado
- Estilo de toda la aplicación a paleta Navy Blue/Beige profesional CRM.
- Cards oscuras Navy con bordes Sky Blue y textos Beige.
- Gradientes Navy/Black en botones y elementos interactivos.
- Consistencia visual en Tarifas, Proporcionales, Rankings, Profile, y Chatbot.

### Corregido
- Ranking combinado: uso de `wNps` correcto y no duplicación del usuario.
- Eliminado botón de “Cerrar sesión” en la tarjeta de perfil (queda en header).
