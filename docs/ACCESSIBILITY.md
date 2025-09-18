## Accesibilidad (A11y)

### Prácticas actuales
- Labels claros en inputs (calculadora, tarifas).
- `aria-live` en resultados de la calculadora para anunciar cambios.
- Menú de perfil con `aria-haspopup`, `aria-expanded`, `role="menu"`/`menuitem`.
- Navegación por teclado en botones del header (Enter/Espacio manejados).

### Recomendaciones
- Mantener contraste en dark UI (texto ~`rgba(255,255,255,0.95)`).
- En tooltips/ayuda, incluir nombres del usuario (ej. ranking: “Puesto X para Pepito Pérez”).
- TODO: añadir focus visible consistente y orden lógico de tabulación.

