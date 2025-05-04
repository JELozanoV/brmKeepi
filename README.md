# App_BRM - Aplicación de Asistencia para Call Center

## 📋 Descripción
Aplicación web para asesores de call center de Claro que proporciona scripts, tarifas y soluciones para la atención al cliente.

## 🏗️ Arquitectura
La aplicación está construida siguiendo una arquitectura de componentes con separación clara entre la capa de presentación y datos:

```tree
src/
├── components/      # Componentes de UI reutilizables
├── services/       # Servicios para comunicación con el backend
├── types/          # Definiciones de TypeScript
├── hooks/          # Custom hooks
└── utils/          # Utilidades y helpers
```

## 🛠️ Stack Tecnológico
- React + TypeScript
- Sass para estilos
- Vite como bundler
- [Backend Stack] (por definir)

## 📦 Instalación y Configuración
```bash
npm install
npm run dev
```

## 🔄 Flujo de Datos
![Diagrama de Flujo](./docs/data-flow.png)

# Keepi

Herramienta para guiar a los asesores cuando un cliente desea cancelar su servicio.

## Características

- Gestión de cancelaciones para servicios Móvil y Hogar
- Flujo intuitivo de toma de decisiones
- Soluciones personalizadas según el motivo de cancelación
- Interfaz amigable y responsive

## Tecnologías

- React
- TypeScript
- Sass
- Vite

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/USER/REPO.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

1. Selecciona el tipo de servicio (Móvil/Hogar)
2. Si es móvil, selecciona el tipo de plan
3. Elige el motivo de cancelación
4. Sigue el flujo según el motivo seleccionado
5. Aplica la solución sugerida

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
