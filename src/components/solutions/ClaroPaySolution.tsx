import React, { useState } from 'react';
import claroPay from '../../assets/images/claro-pay-logo.png'; // Asegúrate de que la imagen esté en esta ruta

interface Props {
  onSolutionApplied: () => void;
}

const ClaroPaySolution = ({ onSolutionApplied }: Props) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  return (
    <div className="solution-container">
      <h2 className="solution-title">
        💰 Claro Pay como solución
      </h2>

      <div className="sections-navigation">
        <button 
          className={`section-tab ${activeSection === 1 ? 'active' : ''}`}
          onClick={() => setActiveSection(1)}
        >
          <span className="button-icon">📝</span>
          <span className="button-text">Guión Sugerido</span>
        </button>
        <button 
          className={`section-tab ${activeSection === 2 ? 'active' : ''}`}
          onClick={() => setActiveSection(2)}
        >
          <span className="button-icon">🎯</span>
          <span className="button-text">Beneficios Clave</span>
        </button>
        <button 
          className={`section-tab ${activeSection === 3 ? 'active' : ''}`}
          onClick={() => setActiveSection(3)}
        >
          <span className="button-icon">❓</span>
          <span className="button-text">Preguntas Frecuentes</span>
        </button>
      </div>

      <div className="section-content">
        {activeSection === 1 && (
          <div className="script-section">
            <div className="script-card">
              <h3>Guión de Empatía y Solución</h3>
              <div className="script-text">
                <p className="solution-line">
                  "Yo también estaría preocupado en tu lugar. Por eso, antes de cancelar, te cuento que Claro ofrece cashback con Claro Pay."
                </p>
                <p className="solution-line">
                  "Eso quiere decir que si pagas con esta app, una parte de tu dinero vuelve a ti. No te puedo cambiar el valor del plan, pero sí puedo ayudarte a que al menos recuperes algo mes a mes."
                </p>
                <p className="solution-line">
                  "¿Te gustaría probarlo?"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 2 && (
          <div className="benefits-section">
            <div className="benefits-grid">
              <div className="benefit-card">
                <span className="benefit-icon">💸</span>
                <h4>Cashback Inmediato</h4>
                <ul>
                  <li>Devolución de dinero en cada transacción</li>
                  <li>Disponibilidad inmediata del cashback</li>
                  <li>Sin montos mínimos de compra</li>
                  <li>Acumulación ilimitada de beneficios</li>
                </ul>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">📱</span>
                <h4>Fácil de Usar</h4>
                <ul>
                  <li>App intuitiva y sin complicaciones</li>
                  <li>Registro sencillo y rápido</li>
                  <li>Compatible con todos los dispositivos</li>
                  <li>Soporte técnico 24/7</li>
                </ul>
              </div>
              <div className="benefit-card">
                <span className="benefit-icon">🔄</span>
                <h4>Uso Flexible</h4>
                <ul>
                  <li>El dinero devuelto puede usarse en cualquier compra</li>
                  <li>Transferencias entre usuarios Claro Pay</li>
                  <li>Pago de servicios Claro</li>
                  <li>Retiro en cajeros automáticos</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 3 && (
          <div className="faq-section">
            <div className="faq-list">
              <div className="faq-item">
                <h4>¿Cuánto cashback recibe el cliente?</h4>
                <p>El porcentaje varía según el tipo de transacción y promociones vigentes. En servicios Claro, el cashback puede llegar hasta el 10% del valor de la factura.</p>
              </div>
              <div className="faq-item">
                <h4>¿Cómo se activa Claro Pay?</h4>
                <p>La activación es simple: descarga la app desde la tienda de aplicaciones, regístrate con tus datos básicos y comienza a disfrutar de los beneficios inmediatamente.</p>
              </div>
              <div className="faq-item">
                <h4>¿Cuándo puede usar el cashback?</h4>
                <p>El dinero está disponible inmediatamente después de cada transacción. No hay períodos de espera ni montos mínimos para utilizar el cashback acumulado.</p>
              </div>
              <div className="faq-item">
                <h4>¿Tiene algún costo usar Claro Pay?</h4>
                <p>No, la aplicación es completamente gratuita. No hay costos de apertura, mantenimiento ni por transacciones entre usuarios Claro Pay.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="solution-buttons">
        <button 
          className="solution-button accept"
          onClick={onSolutionApplied}
        >
          <span className="button-icon">✅</span>
          <span className="button-text">Cliente aceptó Claro Pay</span>
        </button>
        <button 
          className="solution-button reject"
        >
          <span className="button-icon">❌</span>
          <span className="button-text">Cliente no aceptó el beneficio</span>
        </button>
      </div>
    </div>
  );
};

export default ClaroPaySolution; 