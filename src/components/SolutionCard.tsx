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
  onSolutionApplied: () => void;
}

const SolutionCard = ({ serviceType, planType, reason, costReason, failureType, homeFailureType, travelType, customerServiceType, competitorType, activationDelayType, onSolutionApplied }: Props) => {
  return (
    <div className="solution-container">
      <h2 className="section-title">Solución Recomendada</h2>
      
      {/* Placeholder - Aquí irá el contenido específico según el motivo */}
      <div className="solution-content">
        <p>Contenido de la solución para: {reason}</p>
      </div>

      <button 
        className="primary-button"
        onClick={onSolutionApplied}
      >
        Solución aplicada
      </button>
    </div>
  );
};

export default SolutionCard; 