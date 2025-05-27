import { useState } from 'react'
import './styles/App.scss'
import { ServiceType, PlanType, CancellationReason, CostReason, FailureType, TravelType, CustomerServiceType, CompetitorType, HomeFailureType, ActivationDelayType, ReincidentClientType, ClientMoodType } from './types'
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
import Chatbot from './components/Chatbot/Chatbot'
import MoodSelector from './components/MoodSelector'
import Toast from './components/Toast/Toast'
import { getMoodRecommendation } from './services/moodRecommendations'

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
  const [clientMood, setClientMood] = useState<ClientMoodType>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'error'>('info')

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
    setClientMood(null)
    setShowToast(false)
  }

  const handleBack = () => {
    if (solutionApplied) {
      setSolutionApplied(false)
    } else if (reincidentClientType) {
      setReincidentClientType(null)
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
    } else if (clientMood) {
      setClientMood(null)
    } else if (planType) {
      setPlanType(null)
    } else if (serviceType) {
      setServiceType(null)
    }
  }

  const handleHome = () => {
    handleReset();
  }

  const handleMoodSelect = (mood: ClientMoodType) => {
    setClientMood(mood);
    if (mood) {
      const recommendation = getMoodRecommendation(mood);
      setToastMessage(recommendation.message);
      setToastType(recommendation.type);
      setShowToast(true);
    }
  }

  const renderCurrentStep = () => {
    if (!serviceType) {
      return <ServiceSelector onSelect={setServiceType} />
    }

    if (serviceType && !clientMood) {
      return <MoodSelector onSelect={handleMoodSelect} initialMood={null} />
    }

    if (serviceType === 'movil' && clientMood && !planType) {
      return <PlanTypeSelector onSelect={setPlanType} />
    }

    if (planType && !cancellationReason) {
      return <CancellationReasonSelector 
        serviceType={serviceType}
        planType={planType}
        onSelect={setCancellationReason}
      />
    }

    if (serviceType === 'hogar' && clientMood && !cancellationReason) {
      return <CancellationReasonSelector 
        serviceType={serviceType}
        planType={null}
        onSelect={setCancellationReason}
      />
    }

    if (cancellationReason === 'costo' && !costReason) {
      return <CostReasonSelector onSelect={setCostReason} />
    }

    if (cancellationReason === 'fallas' && serviceType === 'movil' && !failureType) {
      return <FailureTypeSelector onSelect={setFailureType} />
    }

    if (cancellationReason === 'fallas' && serviceType === 'hogar' && !homeFailureType) {
      return <HomeFailureSelector onSelect={setHomeFailureType} />
    }

    if (cancellationReason === 'viaje' && !travelType) {
      return <TravelTypeSelector onSelect={setTravelType} />
    }

    if (cancellationReason === 'servicio-cliente' && !customerServiceType) {
      return <CustomerServiceTypeSelector onSelect={setCustomerServiceType} />
    }

    if (cancellationReason === 'competencia' && !competitorType) {
      return <CompetitorSolution onSelect={setCompetitorType} />
    }

    if (cancellationReason === 'fallas' && serviceType === 'hogar' && homeFailureType === 'activacion-demora' && !activationDelayType) {
      return <ActivationDelaySelector onSelect={setActivationDelayType} />
    }

    if (cancellationReason === 'fallas' && serviceType === 'hogar' && homeFailureType === 'cliente-reincidente' && !reincidentClientType) {
      return <ReincidentClientSelector onSelect={setReincidentClientType} />
    }

    // Render solutions based on selections
    if (serviceType === 'movil' && cancellationReason === 'costo' && costReason === 'claro-pay') {
      return <ClaroPaySolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'costo') {
      return <HogarCostosSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'competencia') {
      return <HogarMejorOfertaSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'internet-lento') {
      return <HogarInternetLentoSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'fallas-intermitentes') {
      return <HogarFallasIntermitentesSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'cortes-frecuentes') {
      return <HogarCortesFrecuentesSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'fallas-navegador') {
      return <HogarFallasNavegadorSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'wifi-inestable') {
      return <HogarWifiInestableSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'viaje' && travelType === 'trabajo') {
      return <HogarViajeTrabajoSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'viaje' && travelType === 'vacaciones') {
      return <HogarViajeVacacionesSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'viaje' && travelType === 'mudanza') {
      return <HogarViajeMudanzaSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'servicio-cliente' && customerServiceType === 'asesor-inapropiado') {
      return <HogarServicioClienteAsesorInapropiadoSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'fallas' && homeFailureType === 'cliente-reincidente') {
      return <ReincidentClientSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (solutionApplied) {
      return <SummaryScreen onReset={handleReset} />
    }

    return <SolutionCard onApplySolution={() => setSolutionApplied(true)} />
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

      <div className="app-content">
        {renderCurrentStep()}
      </div>

      <Chatbot />

      <Toast 
        message={toastMessage} 
        type={toastType} 
        isVisible={showToast} 
        duration={8000}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

export default App
