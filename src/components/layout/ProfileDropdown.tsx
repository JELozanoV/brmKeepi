import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme, THEME_OPTIONS, ThemeId } from '../../context/ThemeContext';
import '../../styles/_profile-dropdown.scss';

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const THEME_SWATCH_BORDER: Record<ThemeId, string> = {
  dark: '#6EACDA',
  light: '#03346E',
  daltonism: '#EE7733',
  'high-contrast': '#FFFF00',
};

const ProfileDropdown: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user ? getInitials(user.displayName) : 'A';
  const displayName = user?.displayName ?? 'Asesor';

  const toggle = () => setOpen(prev => !prev);
  const close = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    close();
  };

  const handleThemeSelect = (id: ThemeId) => {
    setTheme(id);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        className="profile-trigger"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menú de perfil"
      >
        <span className="profile-trigger__avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="profile-trigger__name">{displayName}</span>
        <span className={`profile-trigger__chevron ${open ? 'open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {/* Dropdown Panel */}
      <div
        className={`profile-dropdown ${open ? 'profile-dropdown--open' : ''}`}
        role="menu"
        aria-label="Opciones de perfil"
      >
        {/* 1 — User info */}
        <div className="dropdown-section">
          <div className="dropdown-user">
            <div className="dropdown-user__avatar" aria-hidden="true">{initials}</div>
            <div className="dropdown-user__info">
              <div className="dropdown-user__name">{displayName}</div>
              {user?.coordinatorName && (
                <div className="dropdown-user__role">Coord: {user.coordinatorName}</div>
              )}
            </div>
          </div>
        </div>

        {/* 2 — Navigation */}
        <div className="dropdown-section">
          <button
            className="dropdown-nav-btn"
            role="menuitem"
            onClick={() => handleNavigate('/perfil')}
          >
            <span className="dropdown-nav-btn__icon" aria-hidden="true">📊</span>
            Mi Perfil — KPIs
          </button>
        </div>

        {/* 3 — Appearance */}
        <div className="dropdown-section">
          <p className="dropdown-theme-label">Apariencia</p>
          <div className="dropdown-theme-grid">
            {THEME_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`theme-option ${theme === opt.id ? 'theme-option--active' : ''}`}
                role="menuitemradio"
                aria-checked={theme === opt.id}
                onClick={() => handleThemeSelect(opt.id)}
              >
                <span
                  className="theme-option__swatch"
                  style={{
                    background: opt.swatch,
                    borderColor: THEME_SWATCH_BORDER[opt.id],
                  }}
                  aria-hidden="true"
                />
                <span className="theme-option__info">
                  <span className="theme-option__name">{opt.label}</span>
                  <span className="theme-option__desc">{opt.description}</span>
                </span>
                {theme === opt.id && (
                  <span aria-hidden="true" style={{ fontSize: '0.7rem', marginLeft: 'auto', color: 'var(--brm-accent, #6EACDA)' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4 — Logout */}
        <div className="dropdown-section">
          <button
            className="dropdown-logout"
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <span className="dropdown-logout__icon" aria-hidden="true">🚪</span>
            {isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
