import { ServiceType } from '../types';

interface Props {
  onSelect: (service: ServiceType) => void;
}

export const ServiceSelection = ({ onSelect }: Props) => {
  return (
    <>
      <p className="accent-text">Selecciona el tipo de servicio</p>
      <div className="options-container">
        <button 
          className="option-button"
          onClick={() => onSelect('hogar')}
        >
          <span className="button-text">Hogar</span>
          <span className="button-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('movil')}
        >
          <span className="button-text">Móvil</span>
          <span className="button-icon">→</span>
        </button>
      </div>
    </>
  );
}; 