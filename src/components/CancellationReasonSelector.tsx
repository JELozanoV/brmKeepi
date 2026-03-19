import { ServiceType, PlanType, CancellationReason } from '../types';

interface Props {
  serviceType: ServiceType;
  planType: PlanType;
  onSelect: (reason: CancellationReason) => void;
}

const CancellationReasonSelector = ({ serviceType, planType, onSelect }: Props) => {
  // Lista actualizada para servicios hogar
  const homeReasons = [
    { id: 'costo', text: 'Costo', icon: '💰' },
    { id: 'competencia', text: 'Competencia', icon: '🔄' },
    { id: 'fallas', text: 'Fallas', icon: '🔧' },
    { id: 'viaje', text: 'Viaje fuera del país', icon: '✈️' },
    { id: 'servicio-cliente', text: 'Servicio al cliente', icon: '👥' },
    { id: 'demora-activacion', text: 'Demora en la activación', icon: '⏳' },
    { id: 'cliente-reincidente', text: 'Cliente reincidente', icon: '🔁' }
  ];

  // Lista para servicios móviles pospago (mantenemos la existente)
  const mobileReasons = [
    { id: 'costo', text: 'Costo', icon: '💰' },
    { id: 'competencia', text: 'Competencia', icon: '🔄' },
    { id: 'fallas', text: 'Fallas', icon: '🔧' },
    { id: 'viaje', text: 'Viaje fuera del país', icon: '✈️' },
    { id: 'servicio-cliente', text: 'Servicio al cliente', icon: '👥' },
    { id: 'demora-activacion', text: 'Demora en la activación', icon: '⏳' },
    { id: 'cliente-reincidente', text: 'Cliente reincidente', icon: '🔁' }
  ];

  // Filter out 'competencia' from the reasons list
  const reasons = (serviceType === 'movil' ? mobileReasons : homeReasons).filter(r => r.id !== 'competencia');
  const title = serviceType === 'movil' 
    ? 'Motivo de cancelación - Plan Pospago'
    : 'Motivo de cancelación - Hogar';

  return (
    <div className="selector-container">
      <h2 className="section-title">{title}</h2>
      
      <div className="options-container">
        {reasons.map(reason => (
          <button 
            key={reason.id}
            className="option-button"
            onClick={() => onSelect(reason.id as CancellationReason)}
          >
            <div className="button-content">
              <span className="button-icon">{reason.icon}</span>
              <span className="button-text">{reason.text}</span>
            </div>
            <span className="arrow-icon">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CancellationReasonSelector;
