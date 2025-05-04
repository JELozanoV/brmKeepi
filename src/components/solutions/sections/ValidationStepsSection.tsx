import React, { useState } from 'react';

// Importar las imágenes de titularidad
import titularidadPaso1 from '../../../assets/images/Validaciones/Titularidad/Paso1.png';
import titularidadPaso2 from '../../../assets/images/Validaciones/Titularidad/Paso2.png';
import titularidadPaso3 from '../../../assets/images/Validaciones/Titularidad/Paso3.png';
import titularidadPaso4 from '../../../assets/images/Validaciones/Titularidad/Paso4.png';
import titularidadPaso5y6 from '../../../assets/images/Validaciones/Titularidad/Paso5y6.png';

// Importar las imágenes de TD
import tdPaso1 from '../../../assets/images/Validaciones/T&D/paso1.png';
import tdPaso2 from '../../../assets/images/Validaciones/T&D/paso2.png';
import tdPaso3 from '../../../assets/images/Validaciones/T&D/paso3.png';
import tdPaso4 from '../../../assets/images/Validaciones/T&D/paso4.png';
import tdPaso5 from '../../../assets/images/Validaciones/T&D/paso5.png';

interface Props {
  type: 'titularidad' | 'td';
  onBack: () => void;
}

const ValidationStepsSection: React.FC<Props> = ({ type, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const introTexts = {
    titularidad: "Es necesario que se valide la titularidad y el estado de la cuenta en RR para verificar que el servicio esté activo. Solicita los datos necesarios al cliente como: Número de documento de identidad y nombre completo. Sigue la guía a continuación para que puedas realizar el proceso.",
    td: "Al acceder a RR y verificar el número de cuenta, revisa su estado en T&D para asegurarte de que no presenta fallas y así poder proporcionar el soporte necesario. A continuación, encontrarás una guía detallada."
  };

  const titularidadSteps = [
    {
      title: "Paso 1",
      description: "Desde la pantalla principal de RR, ingresa utilizando el usuario y la contraseña asignados.",
      image: titularidadPaso1
    },
    {
      title: "Paso 2",
      description: 'En la pantalla del "Menú Principal del Sistema de Administración", ingresa el número 1 correspondiente a la opción "Búsqueda o consulta del suscriptor" y luego presiona Enter.',
      image: titularidadPaso2
    },
    {
      title: "Paso 3",
      description: 'Al llegar a la pantalla "Búsqueda y consulta de suscriptores", es necesario ir a la opción para buscar al cliente por número de cédula. Para ello, presiona el comando F21 (Shift + F9).',
      image: titularidadPaso3
    },
    {
      title: "Paso 4",
      description: 'Ingresa primero las siglas "cc" (cédula de ciudadanía) o "ce" (cédula de extranjería), dependiendo del tipo de documento del usuario, seguido del número correspondiente. Para finalizar, presiona el comando F15 (Shift + F3).',
      image: titularidadPaso4
    },
    {
      title: "Pasos 5 y 6",
      description: [
        '¡Perfecto! Has llegado a la pantalla Consulta de Suscriptores. En esta sección podrás validar la información correspondiente a los nombres, dirección y ciudad del cliente.',
        'En esta pantalla también puedes verificar el estado del servicio. Es necesario asegurarse que el estado sea ACTIVO para continuar con el proceso de soporte.'
      ],
      image: titularidadPaso5y6
    }
  ];

  const tdSteps = [
    {
      title: "Paso 1",
      description: "Ingresa tu usuario y contraseña de T&D.",
      image: tdPaso1
    },
    {
      title: "Paso 2",
      description: 'Busca la opción "Iniciar sesión" y da clic.',
      image: tdPaso2
    },
    {
      title: "Paso 3",
      description: 'Selecciona el tipo de soporte solicitado, en este caso "Residencial".',
      image: tdPaso3
    },
    {
      title: "Paso 4",
      description: 'A continuación en la casilla "Número de cuenta" digita el número correspondiente de la cuenta a consultar.',
      image: tdPaso4
    },
    {
      title: "Paso 5",
      description: 'Es necesario verificar que en la cuenta no haya ningún tipo de falla. En la pantalla que ves a continuación, asegúrate de que el botón de incidentes esté en gris y así asegurar que el servicio no presente una falla masiva.',
      image: tdPaso5
    }
  ];

  const steps = type === 'titularidad' ? titularidadSteps : tdSteps;

  return (
    <div className="validation-steps">
      <button 
        className="back-to-validations-button"
        onClick={onBack}
      >
        <span className="button-icon">←</span>
        <span className="button-text">Volver a Validaciones</span>
      </button>

      <div className="step-card">
        <div className="intro-text">
          {introTexts[type]}
        </div>

        <div className="step-content">
          <h3>{steps[currentStep].title}</h3>
          {Array.isArray(steps[currentStep].description) ? (
            <div className="multi-step-description">
              {steps[currentStep].description.map((desc, index) => (
                <p key={index} className="step-description">
                  <strong>{index === 0 ? 'Paso 5: ' : 'Paso 6: '}</strong>
                  {desc}
                </p>
              ))}
            </div>
          ) : (
            <p className="step-description">{steps[currentStep].description}</p>
          )}
          <div className="step-image">
            <img 
              src={steps[currentStep].image} 
              alt={Array.isArray(steps[currentStep].description) 
                ? "Pasos 5 y 6 - Consulta de Suscriptores y verificación de estado"
                : `${steps[currentStep].title} - ${steps[currentStep].description}`}
              className={`step-image-content ${type === 'td' && currentStep === 0 ? 'td-first-image' : ''}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                console.error('Error al cargar la imagen:', steps[currentStep].image);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="step-navigation">
            <button 
              className="nav-button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Atrás
            </button>
            <div className="step-indicator">
              {type === 'titularidad' 
                ? `Paso ${currentStep === 4 ? '5 y 6' : currentStep + 1} de 6`
                : `Paso ${currentStep + 1} de ${steps.length}`}
            </div>
            <button 
              className="nav-button"
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  onBack();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationStepsSection; 