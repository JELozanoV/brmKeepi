import React from 'react';
import '../../styles/_header.scss';
import BrandLogo from '../BrandLogo';

// Removed modal-based rates view; navigation will take the user to a dedicated route

interface HeaderProps {
  showMenuButton?: boolean;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showMenuButton, onMenuToggle }) => {
  // Handler for keyboard accessibility
  const handleKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <header className="brm-header" role="banner">
      <div className="brm-header__container">
        <div className="brm-header__left">
          {/* Botón de menú para móvil */}
          {showMenuButton && (
            <button
              className="menu-button"
              aria-label="Abrir menú"
              tabIndex={0}
              onClick={onMenuToggle}
              onKeyDown={handleKey(onMenuToggle || (() => {}))}
            >
              <span className="button-icon" role="img" aria-label="Menú">☰</span>
            </button>
          )}
        </div>
        <div className="brm-header__center" aria-label="Logo Reten+">
          <BrandLogo variant="header" />
        </div>
        <div className="brm-header__right">
          {/* Perfil simplificado - logout movido al sidebar */}
          <div className="header-user-info">
            <span className="user-greeting">👤 Asesor</span>
          </div>
        </div>
      </div>
      {/* Rates modal removed; navigation handles this now */}
    </header>
  );
};

export default Header;
