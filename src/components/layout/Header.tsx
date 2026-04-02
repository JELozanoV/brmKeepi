import React from 'react';
import '../../styles/_header.scss';
import BrandLogo from '../BrandLogo';
import KpiHeaderBar from './KpiHeaderBar';

// Removed modal-based rates view; navigation will take the user to a dedicated route

interface HeaderProps {
  showMenuButton?: boolean;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenuButton, onMenuToggle, menuOpen }) => {
  return (
    <header className="brm-header" role="banner">
      <div className="brm-header__container">
        <div className="brm-header__left">
          {showMenuButton && (
            <button
              className="menu-button"
              aria-label="Abrir menú"
              aria-controls="brm-sidebar"
              aria-expanded={menuOpen ? true : false}
              onClick={onMenuToggle}
            >
              ☰
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
      <KpiHeaderBar />
      {/* Rates modal removed; navigation handles this now */}
    </header>
  );
};

export default Header;
