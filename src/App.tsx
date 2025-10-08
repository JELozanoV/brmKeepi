import { useEffect, useState } from 'react'
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
import HogarColgaronSolution from './components/solutions/HogarColgaronSolution'
import HogarServicioClienteLargasEsperasSolution from './components/solutions/HogarServicioClienteLargasEsperasSolution'
import HogarServicioClienteSinSolucionPreviaSolution from './components/solutions/HogarServicioClienteSinSolucionPreviaSolution'
import HogarServicioClientePromesasIncumplidasSolution from './components/solutions/HogarServicioClientePromesasIncumplidasSolution'
import HomeFailureSelector from './components/HomeFailureSelector'
import ActivationDelaySelector from './components/ActivationDelaySelector'
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
import HogarActivacionDemoradaSolution from './components/solutions/HogarActivacionDemoradaSolution'
import Chatbot from './components/Chatbot/Chatbot'
import MoodSelector from './components/MoodSelector'
import Toast from './components/Toast/Toast'
import { getMoodRecommendation } from './services/moodRecommendations'

import Header from './components/layout/Header';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RatesPage from './pages/RatesPage';
import ProporcionalesPage from './pages/ProporcionalesPage';
import RankingPage from './pages/RankingPage';
import ProfilePage from './components/profile/ProfilePage';
import FacturacionRRPage from './pages/FacturacionRRPage';

function DashboardApp() {
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

  // Add a ref for header height if needed, or use fixed value
  const headerHeight = 56; // px, should match min-height in _header.scss
  const location = useLocation();
  const navigate = useNavigate();
  const isRatesRoute = location.pathname.includes('/tarifas') || location.pathname.includes('/proporcionales');

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

  const handleHeaderHome = () => {
    handleReset();
    navigate('/');
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

  // Escuchar toasts globales (e.g., logout)
  useEffect(() => {
    const handler = (e: any) => {
      const detail = e?.detail || {};
      if (detail?.message) {
        setToastMessage(detail.message);
        setToastType(detail.type || 'info');
        setShowToast(true);
      }
    };
    window.addEventListener('brm-toast', handler as any);
    return () => window.removeEventListener('brm-toast', handler as any);
  }, []);

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

    if (cancellationReason === 'fallas' && serviceType === 'hogar' && homeFailureType === 'activacion-demora') {
      if (!activationDelayType) {
        return <ActivationDelaySelector onSelect={setActivationDelayType} />
      }
      return <HogarActivacionDemoradaSolution onApplySolution={() => setSolutionApplied(true)} />
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
    
    if (serviceType === 'hogar' && cancellationReason === 'servicio-cliente' && customerServiceType === 'llamada-colgada') {
      return <HogarColgaronSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'servicio-cliente' && customerServiceType === 'largas-esperas') {
      return <HogarServicioClienteLargasEsperasSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'servicio-cliente' && customerServiceType === 'sin-solucion') {
      return <HogarServicioClienteSinSolucionPreviaSolution onApplySolution={() => setSolutionApplied(true)} />
    }

    if (serviceType === 'hogar' && cancellationReason === 'servicio-cliente' && customerServiceType === 'promesas-incumplidas') {
      return <HogarServicioClientePromesasIncumplidasSolution onApplySolution={() => setSolutionApplied(true)} />
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
    <>
      <Header onHome={handleHeaderHome} onBack={!isRatesRoute ? handleBack : undefined} />
      <div className="app-container" style={{ paddingTop: `${headerHeight + 8}px` }}>
        {/* Logo movido a la navbar */}

        <Routes>
          <Route path="/" element={
            <div className="app-content">
              {renderCurrentStep()}
            </div>
          } />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/tarifas" element={<RatesPage />} />
          <Route path="/proporcionales" element={<ProporcionalesPage />} />
          <Route path="/facturacion-rr" element={<FacturacionRRPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Chatbot />

        <Toast 
          message={toastMessage} 
          type={toastType} 
          isVisible={showToast} 
          duration={8000}
          onClose={() => setShowToast(false)}
        />
      </div>
    </>
  )
}

function App() {
  const Guard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const isLogin = location.pathname.endsWith('/login');
    if (loading) return null; // evita parpadeo/bucle mientras se restaura sesión
    if (!isAuthenticated && !isLogin) return <Navigate to="/login" replace />;
    if (isAuthenticated && isLogin) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Guard><DashboardApp /></Guard>} />
      </Routes>
    </AuthProvider>
  );
}

export default App
