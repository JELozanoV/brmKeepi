import { CancellationReason } from '../types';

interface Props {
  onSelect: (reason: CancellationReason) => void;
}

export const MotiveSelection = ({ onSelect }: Props) => {
  return (
    <>
      <p className="accent-text">¿Cuál es el motivo de la cancelación?</p>
      <div className="options-container">
        <button 
          className="option-button"
          onClick={() => onSelect('precio' as CancellationReason)}
        >
          <span className="button-text">Precio</span>
          <span className="button-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('falla' as CancellationReason)}
        >
          <span className="button-text">Fallas en el servicio</span>
          <span className="button-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('cambio-operador' as CancellationReason)}
        >
          <span className="button-text">Cambio de operador</span>
          <span className="button-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('no-necesita' as CancellationReason)}
        >
          <span className="button-text">Cliente ya no necesita el servicio</span>
          <span className="button-icon">→</span>
        </button>

        <button 
          className="option-button"
          onClick={() => onSelect('viaje' as CancellationReason)}
        >
          <span className="button-text">Viaje fuera del país</span>
          <span className="button-icon">→</span>
        </button>
      </div>
    </>
  );
};