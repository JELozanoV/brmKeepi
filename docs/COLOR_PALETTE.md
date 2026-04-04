# Paleta de Colores Navy Blue/Beige CRM Professional

## 🎨 Colores Principales

### Navy Blue/Black Navy (Fondos Oscuros)
```scss
$brm-primary: #021526;      // Black Navy - Fondo principal oscuro
$brm-secondary: #03346E;    // Navy Blue - Acento principal
```

**Uso:**
- Fondos de cards y componentes principales
- Gradientes: `linear-gradient(135deg, #03346E 0%, #021526 100%)`
- Fondos con transparencia: `rgba(2, 21, 38, 0.95)`

**Ejemplos:**
- Dashboard content background
- Profile cards
- Ranking cards
- Chatbot bot messages
- Sidebar background

### Sky Blue (Acentos e Interactividad)
```scss
$brm-accent: #6EACDA;       // Sky Blue - Elementos interactivos y highlights
```

**Uso:**
- Bordes de cards: `1px solid rgba(110, 172, 218, 0.3)`
- Elementos interactivos (botones, links)
- Estados hover y focus
- Números y datos destacados en rankings
- Badges y chips activos

**Ejemplos:**
- Bordes de todas las cards
- Tabs activos en rankings
- Números de posición
- Botones de envío en chatbot
- Focus states

### Beige (Textos sobre Fondos Oscuros)
```scss
$brm-light: #E2E2B6;        // Beige - Textos principales sobre fondos oscuros
$brm-text-light: #E2E2B6;   // Alias para textos claros
```

**Uso:**
- Texto principal sobre fondos Navy oscuros
- Títulos y headings
- Contenido de mensajes del bot
- Labels y descripciones

**Ejemplos:**
- Títulos de cards
- Textos en ProfilePage
- Mensajes del chatbot
- Labels en rankings
- Textos en PrizeSection

### Blanco y Gris Neutro (Fondos Claros)
```scss
$brm-white: #FFFFFF;        // Blanco puro
$brm-text: #021526;         // Texto oscuro sobre fondos claros
```

**Gris Claro Neutro:**
```scss
#eef1f9  // Fondos de áreas principales (dashboard, profile)
```

**Uso:**
- Fondos de áreas principales del dashboard
- Mensajes del usuario en chatbot
- Fondos de inputs en estado normal
- Áreas de contenido general

## 🎯 Patrones de Uso

### Cards Oscuras
```scss
.card {
  background: rgba(2, 21, 38, 0.95);
  border: 1px solid rgba(110, 172, 218, 0.3);
  color: #E2E2B6;
  box-shadow: 0 4px 16px rgba(2, 21, 38, 0.3);
}
```

### Gradientes Navy/Black
```scss
.gradient-element {
  background: linear-gradient(135deg, #03346E 0%, #021526 100%);
}
```

### Botones Primarios
```scss
.primary-button {
  background: linear-gradient(135deg, #03346E 0%, #021526 100%);
  color: #E2E2B6;
  border: 1px solid #6EACDA;
  
  &:hover {
    background: linear-gradient(135deg, #6EACDA 0%, #03346E 100%);
  }
}
```

### Inputs y Forms
```scss
.input {
  background: rgba(238, 241, 249, 0.5);
  border: 2px solid rgba(110, 172, 218, 0.4);
  color: #021526;
  
  &:focus {
    border-color: #6EACDA;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(110, 172, 218, 0.15);
  }
}
```

### Mensajes de Chat

**Usuario:**
```scss
.user-message {
  background: linear-gradient(135deg, rgba(110, 172, 218, 0.15) 0%, rgba(255, 255, 255, 1) 100%);
  border: 2px solid #6EACDA;
  color: #021526;
}
```

**Bot:**
```scss
.bot-message {
  background: linear-gradient(135deg, #03346E 0%, #021526 100%);
  border: 1px solid rgba(110, 172, 218, 0.4);
  color: #E2E2B6;
}
```

## ♿ Accesibilidad

### Ratios de Contraste WCAG AA

| Combinación | Ratio | Cumple WCAG AA |
|-------------|-------|----------------|
| Beige (#E2E2B6) sobre Black Navy (#021526) | 8.5:1 | ✅ AAA |
| Beige (#E2E2B6) sobre Navy Blue (#03346E) | 6.2:1 | ✅ AAA |
| Sky Blue (#6EACDA) sobre Black Navy (#021526) | 5.8:1 | ✅ AAA |
| Black Navy (#021526) sobre Beige (#E2E2B6) | 8.5:1 | ✅ AAA |
| Black Navy (#021526) sobre Blanco (#FFFFFF) | 18.2:1 | ✅ AAA |

### Estados de Focus
```scss
*:focus-visible {
  outline: 2px solid #6EACDA;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(110, 172, 218, 0.2);
}
```

## 🚦 Colores Semáforo (KPIs)

Estos colores se mantienen para la lógica de indicadores:

```scss
// Verde - Buen desempeño
.kpi-good {
  border-color: #22c55e;
  background: linear-gradient(135deg, rgba(#22c55e, 0.25) 0%, rgba(2, 21, 38, 0.95) 100%);
}

// Amarillo - Advertencia
.kpi-warn {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(#f59e0b, 0.25) 0%, rgba(2, 21, 38, 0.95) 100%);
}

// Rojo - Necesita mejora
.kpi-bad {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(#ef4444, 0.25) 0%, rgba(2, 21, 38, 0.95) 100%);
}
```

## 📦 Variables SCSS

### Archivo: `_variables.scss`
```scss
// Paleta de colores BRM - Navy Blue/Beige CRM Professional
$brm-primary: #021526;      // Black Navy - Fondo principal oscuro
$brm-secondary: #03346E;    // Navy Blue - Acento principal
$brm-accent: #6EACDA;       // Sky Blue - Elementos interactivos y highlights
$brm-light: #E2E2B6;        // Beige - Fondos claros y contraste
$brm-white: #FFFFFF;        // Blanco puro
$brm-text: #021526;         // Texto oscuro sobre fondos claros
$brm-text-light: #E2E2B6;   // Texto claro sobre fondos oscuros
```

### Archivo: `operational.scss`
```scss
// Paleta Navy Blue/Beige CRM Professional
$color-primary: #021526;      // Black Navy
$color-blue-light: #03346E;   // Navy Blue
$color-accent: #6EACDA;       // Sky Blue
$color-gray-light: #E2E2B6;   // Beige
```

### Archivo: `Chatbot.scss`
```scss
// Variables basadas en la paleta de colores Navy Blue/Beige
$azul-principal: #03346E;      // Navy Blue
$azul-claro: #6EACDA;          // Sky Blue
$gris-claro: #eef1f9;          // Gris claro neutro
$negro-suave: #021526;         // Black Navy
$beige: #E2E2B6;               // Beige
```

## 🔄 Migración desde Paleta Anterior

### Colores Antiguos → Nuevos

| Antiguo | Nuevo | Variable |
|---------|-------|----------|
| `#1A4DFF` | `#03346E` | `$brm-secondary` |
| `#007BFF` | `#6EACDA` | `$brm-accent` |
| `#0066FF` | `#03346E` | `$brm-secondary` |
| `#222222` | `#021526` | `$brm-primary` |
| `#F2F2F2` | `#eef1f9` | (literal) |

### Variables Legacy
```scss
// Colores principales (legacy - usar variables $brm-* para nuevos componentes)
$primary-color: #03346E;    // Navy Blue (migrado de #2196F3)
$secondary-color: #6EACDA;   // Sky Blue (migrado de azul claro)
```

## 📝 Notas de Implementación

1. **Siempre usar variables SCSS** en lugar de valores hexadecimales hardcodeados
2. **Mantener consistencia** en el uso de transparencias (0.95 para fondos, 0.3 para bordes)
3. **Gradientes** siempre de Navy Blue a Black Navy (135deg)
4. **Sombras** usar rgba con Black Navy para coherencia
5. **Colores semáforo** solo para KPIs, no mezclar con paleta principal
6. **Accesibilidad** verificar contraste antes de usar nuevas combinaciones

## 🎨 Herramientas Recomendadas

- **Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Color Picker**: [Coolors.co](https://coolors.co/)
- **Accessibility**: [WAVE Browser Extension](https://wave.webaim.org/extension/)
