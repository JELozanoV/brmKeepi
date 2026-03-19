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

  return (
    <div className="brm-dashboard">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Contenido Principal */}
      <div className="brm-dashboard__main">
        {/* Header simplificado */}
        <Header 
          onHome={onHome}
          onBack={onBack}
          showMenuButton={true}
          onMenuToggle={toggleSidebar}
        />

        {/* Área de contenido */}
        <main className="brm-dashboard__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
