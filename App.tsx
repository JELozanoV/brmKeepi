import HogarCortesFrecuentesSolution from './components/solutions/HogarCortesFrecuentesSolution';

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