## Seguridad (estado actual y plan)

### Estado actual (mock)
- Hash de contraseña en frontend con `sha256(password + PEPPER)` (solo para demo).
- Comparación tiempo-constante y bloqueo por intentos.
- Sesión persistida en `localStorage` (expiración 8h).

### Riesgos (mock)
- El hash en frontend no reemplaza un backend seguro con cookies httpOnly.
- `localStorage` es accesible por JS (riesgo XSS → robo de sesión).

### Plan de migración (backend)
- Autenticación con cookies httpOnly + SameSite y CSRF.
- Endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/me`.
- Tokens/IDs de sesión rotables y expiraciones absolutas.
- Rate limiting y lock por IP/usuario; logs de auditoría.
