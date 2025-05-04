import React, { useState } from 'react';
import BaseSolution from './BaseSolution';
import ValidationSection from './sections/ValidationSection';
import ValidationStepsSection from './sections/ValidationStepsSection';
import ProcedureSection from './sections/ProcedureSection';
import ProcedureStepsSection from './sections/ProcedureStepsSection';
import FAQSection from './sections/FAQSection';
import '../../styles/App.scss';

interface Props {
  onSolutionApplied: () => void;
}

const HogarFallasNavegadorSolution: React.FC<Props> = ({ onSolutionApplied }) => {
  const [selectedValidation, setSelectedValidation] = useState<'titularidad' | 'td' | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<'pruebas' | 'soporte' | 'aprovisionamiento' | 'marcacion' | null>(null);

  return (
    <BaseSolution
      title="Fallas con el Navegador"
      subtitle="Consulta aquí los pasos para ofrecer un soporte ágil y preciso frente a las fallas del cliente."
      icon="🌐"
      sections={[
        {
          id: 1,
          icon: '📋',
          title: 'Condiciones',
          content: (
            <div className="conditions-section">
              <div className="conditions-card">
                <ul className="conditions-list">
                  <li>Es necesario que la cuenta esté activa y sin afectación de falla masiva en la zona.</li>
                  <li>El cliente necesita estar conectado al servicio de Claro hogar (WiFi o cable).</li>
                  <li>El titular o un tercero que proporcione los datos necesarios de la cuenta puede solicitar soporte del servicio.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: 2,
          icon: '🔍',
          title: 'Validaciones',
          content: selectedValidation 
            ? <ValidationStepsSection type={selectedValidation} onBack={() => setSelectedValidation(null)} />
            : <ValidationSection onSelectValidation={setSelectedValidation} />
        },
        {
          id: 3,
          icon: '🔧',
          title: 'Procedimiento',
          content: selectedProcedure
            ? <ProcedureStepsSection type={selectedProcedure} onBack={() => setSelectedProcedure(null)} />
            : <ProcedureSection onSelectProcedure={setSelectedProcedure} />
        },
        {
          id: 4,
          icon: '❓',
          title: 'Preguntas Frecuentes',
          content: (
            <FAQSection
              faqs={[
                {
                  question: '¿Qué pasa si el cliente menciona que solo una página no le abre, pero todo lo demás funciona?',
                  answer: 'Puede tratarse de un bloqueo local del navegador o de un error del sitio. Se recomienda probar en otro navegador, borrar cache y cookies, o usar modo incognito.'
                },
                {
                  question: '¿Qué hacer si el problema persiste después de borrar el caché y las cookies?',
                  answer: 'Si el problema continúa después de limpiar los datos del navegador, se debe proceder con pruebas en otro navegador. Si el problema persiste en todos los navegadores, se debe realizar un diagnóstico más profundo usando T&D.'
                },
                {
                  question: '¿Cuándo es necesario realizar un aprovisionamiento del servicio?',
                  answer: 'El aprovisionamiento es necesario cuando el diagnóstico en T&D indica problemas de configuración del servicio, o cuando las pruebas básicas y el soporte por T&D no resuelven el problema.'
                },
                {
                  question: '¿Por qué es importante usar el modo incógnito para las pruebas?',
                  answer: 'El modo incógnito permite navegar sin la influencia de extensiones, caché o cookies almacenadas. Esto ayuda a determinar si el problema está relacionado con la configuración del navegador o es un problema del servicio.'
                },
                {
                  question: '¿Qué información debe incluirse en las notas de cierre de T&D?',
                  answer: 'Las notas deben incluir el motivo de contacto del cliente, las validaciones realizadas, los resultados de las pruebas efectuadas y la solución aplicada o si se requiere seguimiento adicional.'
                }
              ]}
            />
          )
        }
      ]}
      onSolutionApplied={onSolutionApplied}
      acceptButtonText="Problema resuelto"
      rejectButtonText="Requiere soporte adicional"
    />
  );
};

export default HogarFallasNavegadorSolution;