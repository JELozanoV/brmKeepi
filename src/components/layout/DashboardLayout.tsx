import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/_dashboard.scss';

interface DashboardLayoutProps {
  onHome?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onHome, onBack, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar viewport para manejo responsive
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (!mobile) {
        setSidebarOpen(false); // Cerrar sidebar en desktop al resize
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler para botones
  const handleKey = (action: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="brm-dashboard">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Contenido Principal */}
      <div className="brm-dashboard__main">
        {/* Header simplificado - solo logo y menú */}
        <Header 
          showMenuButton={true}
          onMenuToggle={toggleSidebar}
        />

        {/* Área de contenido */}
        <main className="brm-dashboard__content">
          {/* Botones de navegación */}
          <div className="navigation-buttons">
            {/* Botón Inicio */}
            {onHome && (
              <button
                className="home-button"
                aria-label="Ir al inicio"
                tabIndex={0}
                onClick={onHome}
                onKeyDown={handleKey(onHome)}
              >
                <span className="button-icon" role="img" aria-label="Inicio">🏠</span>
                <span className="button-text">Inicio</span>
              </button>
            )}
            
            {/* Botón Atrás */}
            {onBack && (
              <button
                className="back-button"
                aria-label="Volver atrás"
                tabIndex={0}
                onClick={onBack}
                onKeyDown={handleKey(onBack)}
              >
                <span className="button-icon" role="img" aria-label="Atrás">⬅️</span>
                <span className="button-text">Atrás</span>
              </button>
            )}
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
