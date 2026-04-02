import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/_sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCollapseToggle?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onCollapseToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggingOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/',
      description: 'Flujo principal de atención'
    },
    {
      id: 'facturacion',
      label: 'Facturación RR',
      icon: '📄',
      path: '/facturacion-rr',
      description: 'Gestión de facturación'
    },
    {
      id: 'proporcionales',
      label: 'Proporcionales',
      icon: '🧮',
      path: '/proporcionales',
      description: 'Calculadora de proporcionales'
    },
    {
      id: 'tarifas',
      label: 'Tarifas Conectados',
      icon: '💰',
      path: '/tarifas',
      description: 'Consulta de tarifas'
    },
    {
      id: 'perfil',
      label: 'Mi Perfil',
      icon: '👤',
      path: '/perfil',
      description: 'KPIs y métricas'
    }
  ];

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseToggle) {
      onCollapseToggle(newCollapsedState);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Cerrar sidebar en móvil después de navegación
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    window.dispatchEvent(new CustomEvent('brm-toast', { 
      detail: { message: 'Sesión cerrada', type: 'success' } 
    }));
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside id="brm-sidebar" className={`brm-sidebar ${isOpen ? 'brm-sidebar--open' : ''} ${isCollapsed ? 'brm-sidebar--collapsed' : ''}`}>
        {/* Header del Sidebar */}
        <div className="brm-sidebar__header">
          <button
            className="rail-open-button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={onToggle}
          >
            ☰
          </button>
          <div className="brm-sidebar__logo">
            <span className="logo-icon">📱</span>
            <span className="logo-text">BRM</span>
          </div>
          <button
            className="sidebar-collapse-toggle"
            onClick={handleCollapseToggle}
            aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
            aria-expanded={!isCollapsed}
          >
            <span className="collapse-icon">{isCollapsed ? '▶' : '◀'}</span>
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="brm-sidebar__nav" role="navigation" aria-label="Menú principal">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-button ${isActive(item.path) ? 'nav-button--active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  aria-label={item.label}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <span className="nav-icon" role="img" aria-label={item.label}>
                    {item.icon}
                  </span>
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="brm-sidebar__footer">
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Cerrar sesión"
          >
            <span className="logout-icon" role="img" aria-label="Cerrar sesión">
              🚪
            </span>
            <span className="logout-text">
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
