## Guía de estilos (UI)

### Paleta Navy Blue/Beige CRM Professional
- **Navy Blue (Principal)**: `#03346E` - Fondos oscuros, gradientes
- **Black Navy**: `#021526` - Fondos muy oscuros, gradientes profundos
- **Sky Blue (Acento)**: `#6EACDA` - Bordes, acentos, elementos interactivos
- **Beige**: `#E2E2B6` - Textos principales sobre fondos oscuros
- **Blanco**: `#FFFFFF` - Fondos claros, textos sobre oscuro
- **Gris Claro Neutro**: `#eef1f9` - Fondos de áreas principales (dashboard, profile)

### Tipografía y espaciado
- Tipos del sistema (definido por proyecto Vite/React por defecto).
- Espaciados consistentes (`$spacing-*` en Sass).

### Componentes
- **Cards**: Fondo Navy oscuro (`rgba(2, 21, 38, 0.95)`), borde Sky Blue (`rgba(110, 172, 218, 0.3)`), sombra sutil, texto Beige.
- **Chips/botones**: Gradiente Navy/Black, borde Sky Blue, estado activo con gradiente destacado, hover con sombra Sky Blue.
- **Inputs/selects**: Borde Sky Blue, fondo Navy transparente, texto Beige, focus con glow Sky Blue.
- **Botón primario**: Gradiente `linear-gradient(135deg, #03346E 0%, #021526 100%)`, borde Sky Blue, texto Beige.
- **Mensajes usuario (Chatbot)**: Fondo claro con gradiente Sky Blue, borde Sky Blue, texto Navy oscuro.
- **Mensajes bot (Chatbot)**: Gradiente Navy/Black, texto Beige, bordes Sky Blue.

### Microcopy
- Lenguaje natural, sin símbolos técnicos (no ≤ ≥ ±).
- Usar: “o menos”, “o más”, “puntos”, “por encima/por debajo”.

### Accesibilidad visual
- Contraste suficiente en texto sobre fondo oscuro (`rgba(255,255,255,0.95)+`).

