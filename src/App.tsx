import { useState } from 'react'
import './styles/App.scss'
import { ServiceType, PlanType, CancellationReason, CostReason, FailureType, TravelType, CustomerServiceType, CompetitorType, HomeFailureType, ActivationDelayType, ReincidentClientType } from './types'
import ServiceSelector from './components/ServiceSelector'
import PlanTypeSelector from './components/PlanTypeSelector'
import CancellationReasonSelector from './components/CancellationReasonSelector'
import CostReasonSelector from './components/CostReasonSelector'
import FailureTypeSelector from './components/FailureTypeSelector'
import TravelTypeSelector from './components/TravelTypeSelector'
import SolutionCard from './components/SolutionCard'
import SummaryScreen from './components/SummaryScreen'
import CustomerServiceTypeSelector from './components/CustomerServiceTypeSelector'
import HogarServicioClienteAsesorInapropiadoSolution from './components/solutions/HogarServicioClienteAsesorInapropiadoSolution'
import HomeFailureSelector from './components/HomeFailureSelector'
import ActivationDelaySelector from './components/ActivationDelaySelector'
import Logo from './components/Logo'
import ReincidentClientSelector from './components/ReincidentClientSelector'
import ClaroPaySolution from './components/solutions/ClaroPaySolution'
import HogarCostosSolution from './components/solutions/HogarCostosSolution'
import HogarMejorOfertaSolution from './components/solutions/HogarMejorOfertaSolution'
import HogarInternetLentoSolution from './components/solutions/HogarInternetLentoSolution'
import HogarFallasIntermitentesSolution from './components/solutions/HogarFallasIntermitentesSolution'
import HogarCortesFrecuentesSolution from './components/solutions/HogarCortesFrecuentesSolution'
import HogarFallasNavegadorSolution from './components/solutions/HogarFallasNavegadorSolution'
import HogarWifiInestableSolution from './components/solutions/HogarWifiInestableSolution'
import HogarViajeTrabajoSolution from './components/solutions/HogarViajeTrabajoSolution'
import HogarViajeVacacionesSolution from './components/solutions/HogarViajeVacacionesSolution'
import HogarViajeMudanzaSolution from './components/solutions/HogarViajeMudanzaSolution'
import CompetitorSolution from './components/solutions/CompetitorSolution'
import ReincidentClientSolution from './components/solutions/ReincidentClientSolution'

function App() {
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [planType, setPlanType] = useState<PlanType>(null)
  const [cancellationReason, setCancellationReason] = useState<CancellationReason>(null)
  const [costReason, setCostReason] = useState<CostReason>(null)
  const [failureType, setFailureType] = useState<FailureType>(null)
  const [travelType, setTravelType] = useState<TravelType>(null)
  const [customerServiceType, setCustomerServiceType] = useState<CustomerServiceType>(null)
  const [solutionApplied, setSolutionApplied] = useState(false)
  const [competitorType, setCompetitorType] = useState<CompetitorType>(null)
  const [homeFailureType, setHomeFailureType] = useState<HomeFailureType>(null)
  const [activationDelayType, setActivationDelayType] = useState<ActivationDelayType>(null)
  const [reincidentClientType, setReincidentClientType] = useState<ReincidentClientType>(null)

  const handleReset = () => {
    setServiceType(null)
    setPlanType(null)
    setCancellationReason(null)
    setCostReason(null)
    setFailureType(null)
    setTravelType(null)
    setCustomerServiceType(null)
    setSolutionApplied(false)
    setCompetitorType(null)
    setHomeFailureType(null)
    setActivationDelayType(null)
    setReincidentClientType(null)
  }

  const handleBack = () => {
    if (reincidentClientType) {
      setReincidentClientType(null)
      return
    }
    if (solutionApplied) {
      setSolutionApplied(false)
    } else if (activationDelayType) {
      setActivationDelayType(null)
    } else if (homeFailureType) {
      setHomeFailureType(null)
    } else if (competitorType) {
      setCompetitorType(null)
    } else if (customerServiceType) {
      setCustomerServiceType(null)
    } else if (travelType) {
      setTravelType(null)
    } else if (failureType) {
      setFailureType(null)
    } else if (costReason) {
      setCostReason(null)
    } else if (cancellationReason) {
      setCancellationReason(null)
    } else if (planType) {
      setPlanType(null)
    } else if (serviceType) {
      setServiceType(null)
    }
  }

  const handleHome = () => {
    handleReset();
  }

  const renderCurrentStep = () => {
    if (!serviceType) {
      return <ServiceSelector onSelect={setServiceType} />
    }

    if (serviceType === 'movil' && !planType) {
      return <PlanTypeSelector onSelect={setPlanType} />
    }

    if (serviceType === 'movil' && planType === 'pospago' && !cancellationReason) {
      return (
        <CancellationReasonSelector 
          serviceType={serviceType}
          planType={planType}
          onSelect={setCancellationReason}
        />
      )
    }

    if (serviceType === 'movil' && cancellationReason === 'fallas' && !failureType) {
      return <FailureTypeSelector onSelect={setFailureType} />
    }

    if (serviceType === 'hogar' && !cancellationReason) {
      return (
        <CancellationReasonSelector 
          serviceType={serviceType}
          planType={null}
          onSelect={setCancellationReason}
        />
      )
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && !homeFailureType) {
      return <HomeFailureSelector onSelect={setHomeFailureType} />
    }

    if (cancellationReason === 'costo' && !costReason) {
      return <CostReasonSelector onSelect={setCostReason} />
    }

    if (cancellationReason === 'viaje' && !travelType) {
      return <TravelTypeSelector onSelect={setTravelType} />
    }

    if (cancellationReason === 'servicio-cliente' && !customerServiceType) {
      return <CustomerServiceTypeSelector onSelect={setCustomerServiceType} />
    }

    if (cancellationReason === 'competencia') {
      return (
        <CompetitorSolution
          competitor={competitorType}
          onSolutionApplied={() => {
            if (!competitorType) {
              setCompetitorType('movistar'); // Valor por defecto, se cambiará cuando el usuario seleccione
            } else {
              setSolutionApplied(true);
            }
          }}
        />
      );
    }

    if (cancellationReason === 'demora-activacion' && !activationDelayType) {
      return <ActivationDelaySelector onSelect={setActivationDelayType} />
    }

    if (cancellationReason === 'cliente-reincidente' && !reincidentClientType) {
      return <ReincidentClientSelector onSelect={setReincidentClientType} />
    }

    if (cancellationReason === 'cliente-reincidente' && reincidentClientType) {
      return <ReincidentClientSolution onSolutionApplied={() => setSolutionApplied(true)} />;
    }

    console.log('Debug estado:', {
      serviceType,
      cancellationReason,
      homeFailureType,
      solutionApplied
    });

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'costo' && 
        costReason === 'plan-alto') {
      return (
        <HogarCostosSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        cancellationReason === 'costo' && 
        costReason === 'falta-trabajo') {
      return (
        <ClaroPaySolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'costo' && 
        costReason === 'mejor-oferta') {
      return (
        <HogarMejorOfertaSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'fallas' && 
        homeFailureType === 'internet-lento') {
      return (
        <HogarInternetLentoSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'fallas' && 
        homeFailureType === 'fallas-intermitentes') {
      return (
        <HogarFallasIntermitentesSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'fallas' && 
        homeFailureType === 'cortes-frecuentes') {
      return (
        <HogarCortesFrecuentesSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'fallas' && 
        homeFailureType === 'fallas-navegador') {
      return (
        <HogarFallasNavegadorSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'fallas' && 
        homeFailureType === 'wifi-inestable') {
      return (
        <HogarWifiInestableSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && cancellationReason === 'competencia' && competitorType) {
      return (
        <CompetitorSolution
          competitor={competitorType}
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'viaje' && 
        travelType === 'trabajo') {
      return (
        <HogarViajeTrabajoSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'viaje' && 
        travelType === 'vacaciones') {
      return (
        <HogarViajeVacacionesSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && 
        serviceType === 'hogar' &&
        cancellationReason === 'viaje' && 
        travelType === 'mudanza') {
      return (
        <HogarViajeMudanzaSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      );
    }

    if (!solutionApplied && cancellationReason === 'servicio-cliente' && customerServiceType === 'asesor-inapropiado') {
      return (
        <HogarServicioClienteAsesorInapropiadoSolution
          onSolutionApplied={() => setSolutionApplied(true)}
        />
      )
    }

    if (!solutionApplied) {
      const shouldShowSolution = 
        (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType) ||
        (serviceType === 'movil' && cancellationReason === 'fallas' && failureType) ||
        (cancellationReason === 'demora-activacion' && activationDelayType) ||
        (!['fallas', 'demora-activacion'].includes(cancellationReason))

      if (shouldShowSolution) {
        return (
          <SolutionCard
            serviceType={serviceType}
            planType={planType}
            reason={cancellationReason}
            costReason={costReason}
            failureType={failureType}
            travelType={travelType}
            customerServiceType={customerServiceType}
            competitorType={competitorType}
            homeFailureType={homeFailureType}
            activationDelayType={activationDelayType}
            onSolutionApplied={() => setSolutionApplied(true)}
          />
        )
      }
    }

    if (solutionApplied) {
      return (
        <SummaryScreen
          serviceType={serviceType}
          planType={planType}
          reason={cancellationReason}
          costReason={costReason}
          failureType={failureType}
          travelType={travelType}
          onReset={handleReset}
        />
      )
    }
  }

  return (
    <div className="app-container">
      <div className="logo-container">
        <Logo />
      </div>
      <div className="navigation-buttons">
        {(serviceType || planType || cancellationReason || costReason || 
          failureType || travelType || customerServiceType || competitorType) && (
          <>
        <button className="back-button" onClick={handleBack}>
          <span className="button-icon">←</span>
          <span className="button-text">Volver</span>
        </button>

            <button className="home-button" onClick={handleHome}>
              <span className="button-icon">🏠</span>
              <span className="button-text">Inicio</span>
            </button>
          </>
        )}
      </div>

      {renderCurrentStep()}
    </div>
  )
}

export default App
