## Autenticación (mock) y migración

Fuente: `src/context/AuthContext.tsx`.

### Credenciales mock actuales
- Usuario: `001`
- Contraseña: `contraseña`

La verificación se hace en frontend comparando `sha256(password + PEPPER)` de forma tiempo-constante con el hash almacenado (`MOCK_PASSWORD_HASH`).

```31:38:src/context/AuthContext.tsx
const PEPPER = 'brm_pepper_v1';
const MOCK_USERNAME = '001';
const MOCK_PASSWORD_HASH = '78d242d5b572b051f04c87ad61f003e6b3fa293a3476aafd251ac580fb121613';
async function sha256(text: string): Promise<string> { /* ... */ }
```

### Bloqueo por intentos y persistencia
- 5 intentos erróneos → 30 segundos de bloqueo.
- Sesión en `localStorage` con expiración de 8 horas: `{ user, token: { expiresAt } }`.

### Guard de rutas
- Definido en `src/App.tsx`. Si no hay sesión válida y no es `/login`, redirige a `/login`.

### Logout
- Limpia storage, reinicia estado y emite evento `brm-logout` (usado para toasts).

### Migración a backend (TODO)
- Reemplazar mock por endpoints reales:
  - `POST /api/auth/login` (credenciales) → set cookie httpOnly + CSRF token
  - `POST /api/auth/logout` (invalidación server-side)
  - `GET /api/me` (perfil actual)
- Seguridad:
  - Cookies httpOnly + SameSite strict
  - CSRF token por cabecera
  - Rate-limit server-side y lock por IP/usuario
  - Rotación de sesión y expiración absoluta

### Cómo probar
1) Iniciar sesión en `/login` con `001` / `contraseña`.
2) Probar bloqueo: ingresa 5 veces una contraseña incorrecta → verás el mensaje de espera y el contador.
3) Verifica persistencia: refresca la página y confirma que sigues autenticado hasta 8h.
4) Cerrar sesión desde el menú de perfil; debes ir a `/login` y no poder acceder a rutas protegidas.

