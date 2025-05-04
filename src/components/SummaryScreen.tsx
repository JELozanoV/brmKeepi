import { ServiceType, PlanType, CancellationReason, CostReason, FailureType, TravelType, CustomerServiceType, HomeFailureType, ActivationDelayType, CompetitorType } from '../types';

interface Props {
  serviceType: ServiceType;
  planType: PlanType;
  reason: CancellationReason;
  costReason?: CostReason;
  failureType?: FailureType;
  travelType?: TravelType;
  customerServiceType?: CustomerServiceType;
  competitorType?: CompetitorType;
  homeFailureType?: HomeFailureType;
  activationDelayType?: ActivationDelayType;
  onReset: () => void;
}

const SummaryScreen = ({ 
  serviceType, 
  planType, 
  reason, 
  costReason,
  failureType,
  travelType,
  customerServiceType,
  competitorType,
  homeFailureType,
  activationDelayType,
  onReset 
}: Props) => {
  return (
    <div className="summary-container">
      <h2 className="summary-title">Resumen de la gestión</h2>
      
      <div className="summary-content">
        <div className="summary-item">
          <span className="label">Servicio:</span>
          <span className="value">{serviceType}</span>
        </div>
        
        {planType && (
          <div className="summary-item">
            <span className="label">Tipo de plan:</span>
            <span className="value">{planType}</span>
          </div>
        )}
        
        <div className="summary-item">
          <span className="label">Motivo:</span>
          <span className="value">{reason}</span>
        </div>

        {costReason && (
          <div className="summary-item">
            <span className="label">Tipo de costo:</span>
            <span className="value">{costReason}</span>
          </div>
        )}

        {failureType && (
          <div className="summary-item">
            <span className="label">Tipo de falla:</span>
            <span className="value">{failureType}</span>
          </div>
        )}

        {travelType && (
          <div className="summary-item">
            <span className="label">Tipo de viaje:</span>
            <span className="value">{travelType}</span>
          </div>
        )}

        {customerServiceType && (
          <div className="summary-item">
            <span className="label">Problema con servicio al cliente:</span>
            <span className="value">{customerServiceType}</span>
          </div>
        )}

        {competitorType && (
          <div className="summary-item">
            <span className="label">Operador seleccionado:</span>
            <span className="value">{competitorType}</span>
          </div>
        )}

        {homeFailureType && (
          <div className="summary-item">
            <span className="label">Tipo de falla en hogar:</span>
            <span className="value">{homeFailureType}</span>
          </div>
        )}

        {activationDelayType && (
          <div className="summary-item">
            <span className="label">Tipo de demora en activación:</span>
            <span className="value">{activationDelayType}</span>
          </div>
        )}
      </div>

      <button 
        className="reset-button"
        onClick={onReset}
      >
        Nueva gestión
      </button>
    </div>
  );
};

export default SummaryScreen;