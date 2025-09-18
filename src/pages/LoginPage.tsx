import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginBrand from '../components/LoginBrand';

const isNumeric = (v: string) => /^\d{0,3}$/.test(v);

const LoginPage: React.FC = () => {
  const { login, lockSeconds, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = useMemo(() => username.length === 3 && isNumeric(username) && password.trim().length >= 8 && lockSeconds === 0 && !submitting, [username, password, lockSeconds, submitting]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await login(username, password);
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <section className="op-card" style={{ width: '100%', maxWidth: 420 }}>
        <LoginBrand />
        <h2 className="card-title" style={{ marginBottom: '0.25rem' }}>Iniciar sesión</h2>
        <div className="kpi-subtle" style={{ marginBottom: '1rem' }}>Ingresa con tu usuario y contraseña corporativa.</div>

        <form onSubmit={onSubmit} aria-live="polite">
          <label htmlFor="username">Usuario</label>
          <input id="username" inputMode="numeric" pattern="\d*" placeholder="Número de usuario" value={username} onChange={(e)=>{ if (isNumeric(e.target.value)) setUsername(e.target.value) }} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #1A4DFF', marginBottom: 12 }} />

          <label htmlFor="password">Contraseña</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input id="password" type={show? 'text':'password'} placeholder="Contraseña" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #1A4DFF' }} />
            <button type="button" onClick={()=>setShow(s=>!s)} className="ranking-tab" aria-label={show? 'Ocultar contraseña' : 'Mostrar contraseña'}>{show? 'Ocultar' : 'Mostrar'}</button>
          </div>

          {lockSeconds > 0 && (
            <div className="kpi-subtle" style={{ color: '#f59e0b', marginBottom: 8 }}>Demasiados intentos. Vuelve a intentarlo en {lockSeconds} segundos.</div>
          )}
          {error && lockSeconds === 0 && (
            <div className="kpi-subtle" style={{ color: '#ef4444', marginBottom: 8 }}>Usuario o contraseña no válidos.</div>
          )}

          <button disabled={!canSubmit} className="ranking-tab active" type="submit" style={{ width: '100%', justifyContent: 'center' }}>{submitting? 'Validando…' : 'Iniciar sesión'}</button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;


