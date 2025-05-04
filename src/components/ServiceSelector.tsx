import { ServiceType } from '../types';

interface Props {
  onSelect: (service: ServiceType) => void;
}

const ServiceSelector = ({ onSelect }: Props) => {
  return (
    <div className="selector-container">
      
      <div className="welcome-message">
        <p className="description">
          Haz que cada intento de cancelación termine en fidelización.
        </p>
      </div>

      <h2 className="section-title">¿Cuál es el servicio?</h2>
      
      <div className="options-container">
        <button 
          className="option-button"
          onClick={() => onSelect('hogar')}
        >
          <span className="button-icon">🏠</span>
          <span className="button-text">Hogar</span>
          <span className="arrow-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('movil')}
        >
          <span className="button-icon">📱</span>
          <span className="button-text">Móvil</span>
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceSelector; 