import { useState } from 'react';

interface Props {

}

export const PriceSolution = ({}: Props) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  return (
    <div className="solution-container">
      <h2 className="solution-title">
        💸 Claro Pay como estrategia de retención
      </h2>

      <div className="sections-navigation">
        <button 
          className={`section-tab ${activeSection === 1 ? 'active' : ''}`}
          onClick={() => setActiveSection(1)}
        >
          🧠 ¿Por qué funciona?
        </button>
        <button 
          className={`section-tab ${activeSection === 2 ? 'active' : ''}`}
          onClick={() => setActiveSection(2)}
        >
          🗣️ Frases sugeridas
        </button>
        <button 
          className={`section-tab ${activeSection === 3 ? 'active' : ''}`}
          onClick={() => setActiveSection(3)}
        >
          💡 Beneficios
        </button>
      </div>

      <div className="section-content">
        {activeSection === 1 && (
          <div className="section-panel">
            <h3>¿Por qué funciona el cashback como retención?</h3>
            <ul className="benefit-list">
              <li className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                  <h4>Reduce el costo percibido</h4>
                  <p>El servicio se percibe más económico al recibir dinero de vuelta</p>
                </div>
              </li>
              <li className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div className="benefit-text">
                  <h4>Ganancia inmediata</h4>
                  <p>Genera la sensación de beneficio instantáneo al permanecer en Claro</p>
                </div>
              </li>
              <li className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-text">
                  <h4>Descuento inteligente</h4>
                  <p>Es una forma sutil de descuento sin modificar el plan base</p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {activeSection === 2 && (
          <div className="section-panel">
            <h3>Frases sugeridas para la llamada</h3>
            <div className="phrases-list">
              <div className="phrase-card">
                <div className="phrase-number">1</div>
                <p>"Si decides quedarte en Claro, puedes empezar a usar Claro Pay, y por cada compra que hagas o servicio que pagues, recibes una parte de tu dinero de vuelta."</p>
              </div>
              <div className="phrase-card">
                <div className="phrase-number">2</div>
                <p>"Muchos clientes que iban a cancelar nos cuentan que con Claro Pay ahora sienten que cada mes reciben algo a cambio. Es como una recompensa por seguir con nosotros."</p>
              </div>
              <div className="phrase-card">
                <div className="phrase-number">3</div>
                <p>"Claro te devuelve dinero en efectivo por usar Claro Pay. Es dinero real que puedes gastar o transferir."</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 3 && (
          <div className="section-panel">
            <h3>Beneficios principales</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🔄</div>
                <h4>Cashback</h4>
                <p>Devolución de dinero en facturas, recargas y compras</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📱</div>
                <h4>Compatibilidad</h4>
                <p>Funciona en todos los teléfonos Android/iOS</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💳</div>
                <h4>Tarjeta Virtual</h4>
                <p>Opera como tarjeta prepago virtual</p>
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}; 