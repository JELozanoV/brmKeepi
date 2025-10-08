import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/_header.scss';
import BrandLogo from '../BrandLogo';
import { useAuth } from '../../context/AuthContext';

// Removed modal-based rates view; navigation will take the user to a dedicated page

interface HeaderProps {
  onHome?: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onBack }) => {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Rates moved to dedicated route: /tarifas

  // Handler for keyboard accessibility
  const handleKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <header className="brm-header" role="banner">
      <div className="brm-header__container">
        <div className="brm-header__left">
          <button
            className="home-button"
            aria-label="Ir al inicio"
            tabIndex={0}
            onClick={() => (onHome ? onHome() : navigate('/'))}
            onKeyDown={handleKey(() => (onHome ? onHome() : navigate('/')))}
          >
            <span className="button-icon" role="img" aria-label="Inicio">🏠</span>
            <span className="button-text">Inicio</span>
          </button>
          <button
            className="back-button"
            aria-label="Volver atrás"
            tabIndex={0}
            onClick={() => (onBack ? onBack() : window.history.back())}
            onKeyDown={handleKey(() => (onBack ? onBack() : window.history.back()))}
          >
            <span className="button-icon" role="img" aria-label="Atrás">🔙</span>
            <span className="button-text">Atrás</span>
          </button>
          <button
            className="section-tab"
            aria-label="Facturación RR"
            tabIndex={0}
            onClick={() => navigate('/facturacion-rr')}
            onKeyDown={handleKey(() => navigate('/facturacion-rr'))}
          >
            <span className="tab-icon" role="img" aria-label="Facturación">📄</span>
            <span className="tab-text">Facturación RR</span>
          </button>
        </div>
        <div className="brm-header__center" aria-label="Logo Reten+">
          <BrandLogo variant="header" />
        </div>
        <div className="brm-header__right">
          <button
            className="section-tab"
            aria-label="Calculadora de proporcionales"
            tabIndex={0}
            onClick={() => navigate('/proporcionales')}
            onKeyDown={handleKey(() => navigate('/proporcionales'))}
          >
            <span className="tab-icon" role="img" aria-label="Calculadora">🧮</span>
            <span className="tab-text">Proporcionales</span>
          </button>
          <button
            className="section-tab"
            aria-label="Tarifas de Conectados"
            tabIndex={0}
            onClick={() => navigate('/tarifas')}
            onKeyDown={handleKey(() => navigate('/tarifas'))}
          >
            <span className="tab-icon" role="img" aria-label="Tarifas">💰</span>
            <span className="tab-text">Tarifas Conectados</span>
          </button>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              className="profile-button"
              aria-label="Abrir menú de perfil"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="profile-menu"
              tabIndex={0}
              onClick={() => setOpen(o => !o)}
              onKeyDown={handleKey(() => setOpen(o => !o))}
            >
              <span className="button-icon" role="img" aria-label="Perfil">👤</span>
              <span className="button-text">Perfil</span>
            </button>
            {open && (
              <div id="profile-menu" role="menu" className="profile-menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)' }}>
                <button role="menuitem" className="profile-menu__item" onClick={() => { setOpen(false); navigate('/perfil'); }}>
                  Ver perfil
                </button>
                <button role="menuitem" aria-label="Cerrar sesión" className="profile-menu__item profile-menu__item--danger" disabled={isLoggingOut} onClick={() => { setOpen(false); logout(); navigate('/login', { replace: true }); window.dispatchEvent(new CustomEvent('brm-toast', { detail: { message: 'Sesión cerrada', type: 'success' } })); }}>
                  {isLoggingOut ? 'Cerrando…' : 'Cerrar sesión'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Rates modal removed; navigation handles this now */}
    </header>
  );
};

export default Header;
