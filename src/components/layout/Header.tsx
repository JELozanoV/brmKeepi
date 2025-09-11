import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/_header.scss';
import RetenLogo from '../../assets/images/RETEN.svg';

// Removed modal-based rates view; navigation will take the user to a dedicated page

interface HeaderProps {
  onHome?: () => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHome, onBack }) => {
  const navigate = useNavigate();
  // Rates moved to dedicated route: /tarifas

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
        </div>
        <div className="brm-header__center" aria-label="Logo Reten+">
          <img src={RetenLogo} alt="Reten+ Logo" className="brm-header__logo" />
        </div>
        <div className="brm-header__right">
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
          <button
            className="profile-button"
            aria-label="Perfil"
            tabIndex={0}
            onClick={() => navigate('/perfil')}
            onKeyDown={handleKey(() => navigate('/perfil'))}
          >
            <span className="button-icon" role="img" aria-label="Perfil">👤</span>
            <span className="button-text">Perfil</span>
          </button>
        </div>
      </div>
      {/* Rates modal removed; navigation handles this now */}
    </header>
  );
};

export default Header;
