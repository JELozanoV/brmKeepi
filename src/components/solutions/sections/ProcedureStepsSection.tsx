import React, { useState } from 'react';
import './ProcedureStepsSection.scss';

// Importar las imágenes de T&D
import tdPaso1 from '../../../assets/images/Procedimiento/t&d/paso1.png';
import tdPaso2 from '../../../assets/images/Procedimiento/t&d/paso2.png';
import tdPaso3 from '../../../assets/images/Procedimiento/t&d/paso3.png';
import tdPaso4 from '../../../assets/images/Procedimiento/t&d/paso4.png';
import tdPaso5 from '../../../assets/images/Procedimiento/t&d/paso5.png';

// Importar las imágenes de Aprovisionamiento
import aprovPaso1 from '../../../assets/images/Procedimiento/aprovisionamiento/paso1.png';
import aprovPaso2 from '../../../assets/images/Procedimiento/aprovisionamiento/paso2.png';
import aprovPaso3 from '../../../assets/images/Procedimiento/aprovisionamiento/paso3.png';
import aprovPaso4 from '../../../assets/images/Procedimiento/aprovisionamiento/paso4.png';
import aprovPaso5 from '../../../assets/images/Procedimiento/aprovisionamiento/paso5.png';

interface Props {
  type: 'pruebas' | 'soporte' | 'aprovisionamiento' | 'marcacion';
  onBack: () => void;
}

const ProcedureStepsSection: React.FC<Props> = ({ type, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const introTexts = {
    pruebas: "Este procedimiento tiene como objetivo identificar si la causa de la falla está relacionada con el navegador del cliente y ofrecer orientación sobre cómo restablecer la navegación de manera adecuada.",
    soporte: "Cuando el cliente continúa presentando inconvenientes tras haber descartado falla de su equipo o configuración, se procede a realizar soporte utilizando T&D. A continuación, se detallan los pasos a seguir:",
    aprovisionamiento: "Cuando no se puede encontrar una solución al problema del navegador, o cuando el diagnóstico realizado en T&D indica que se debe aprovisionar el servicio, es necesario hacerlo a través de la aplicación de Agendamiento. Sigue la siguiente guía para gestionar este proceso.",
    marcacion: "Al finalizar cualquier proceso en T&D, la herramienta genera una marcación automática en RR que deja registrada la interacción o gestión técnica que se realizó en la cuenta. Es importante que se genere el cierre de la marcación para no tener ninguna afectación con las herramientas."
  };

  const procedures = {
    pruebas: [
      {
        title: "Paso 1: Verificar el tipo de afectación",
        description: [
          "Solicitar al cliente que indique con claridad cual es el problema. Ejemplos comunes:",
          "· Las paginas no cargan",
          "· Se muestra un error como 'Sin conexión' o 'no se puede acceder a este sitio'",
          "· Solo una página específica presenta fallas",
          "· Lentitud al abrir sitios web",
          "Preguntar si el problema ocurre en todos los sitios o solo en algunos, y si es intermitente o constante."
        ]
      },
      {
        title: "Paso 2: Solicitar prueba en modo incógnito o privado",
        description: [
          "Indicar al cliente como abrir una ventana en modo incógnito o navegación privada:",
          "· (Ctrl + Shift + N) en Chrome/Edge",
          "· (Ctrl + Shift + P) en Firefox e intentar acceder al sitio desde allí",
          "· Si funciona correctamente, la falla está relacionada con el historial o configuración del navegador",
          "· Si el error persiste continúa con el siguiente paso"
        ]
      },
      {
        title: "Paso 3: Borrar caché, cookies e historial",
        description: [
          "Guiar al cliente para limpiar los datos del navegador:",
          "· Ingresar a configuración o preferencias del navegador",
          "· Buscar la opción 'privacidad y seguridad'",
          "· Seleccionar 'Borrar datos de navegación'",
          "· Elegir las opciones de caché, cookies e historial",
          "· Confirmar la acción y cerrar el navegador",
          "Luego, pedir que lo vuelva a abrir e intente ingresar nuevamente al sitio web"
        ]
      },
      {
        title: "Paso 4: Probar desde otro navegador",
        description: [
          "Solicitar que intente acceder desde un navegador distinto al habitual (por ejemplo, si usa Chrome, probar en Firefox o Edge)",
          "· Si el sitio funciona en otro navegador, se recomienda restablecer el navegador principal o utilizar uno alternativo",
          "· Si el fallo persiste en todos los navegadores, continúa con la prueba desde otro dispositivo"
        ]
      }
    ],
    soporte: [
      {
        title: "Paso 1: Acceder a T&D",
        description: [
          "Ya estando en T&D, en la pantalla vista integrada da clic en el botón internet"
        ],
        image: tdPaso1
      },
      {
        title: "Paso 2: Validar Ultra WiFi",
        description: [
          "Valida si el cliente tiene el servicio de Ultra Wifi contratado en su servicio"
        ],
        image: tdPaso2
      },
      {
        title: "Paso 3: Seleccionar síntoma",
        description: [
          "Selecciona el síntoma que presenta el servicio y por el cual se comunica el cliente, en este caso 'Acceso a Páginas Específicas', y luego, continúa con todo el árbol de diagnóstico para encontrar una solución al inconveniente que está presentando el cliente"
        ],
        image: tdPaso3
      },
      {
        title: "Paso 4: Registrar notas",
        description: [
          "Cuando se haya completado el árbol de T&D y se haya realizado el diagnóstico correspondiente, es importante en la pantalla de cierre se registren notas claras que indiquen el motivo de contacto del cliente, las validaciones efectuadas y el resultado del proceso, ya sea que se haya identificado una solución o que se requiera seguimiento adicional"
        ],
        image: tdPaso4
      },
      {
        title: "Paso 5: Cerrar sesión",
        description: [
          "Por último, en la sección de 'Resumen de sesión', selecciona la opción de 'cerrar sesión'. Se abrirá una ventana emergente que te preguntará si el problema se ha resuelto. Elige la respuesta adecuada y proporciona las notas necesarias. Luego, vuelve a hacer clic en 'Cerrar sesión'"
        ],
        image: tdPaso5
      }
    ],
    aprovisionamiento: [
      {
        title: "Paso 1: Ingresar a Agendamiento",
        description: [
          "Ingresa a la plataforma de Agendamiento utilizando tu usuario y contraseña asignados"
        ],
        image: aprovPaso1
      },
      {
        title: "Paso 2: Acceder al Módulo",
        description: [
          "Da clic en 'Módulo de Gestión' para visualizar el menú"
        ],
        image: aprovPaso2
      },
      {
        title: "Paso 3: Seleccionar Aprovisionamiento",
        description: [
          "En el menú selecciona 'Aprovisionamiento de Servicios' y luego 'Ingresar'"
        ],
        image: aprovPaso3
      },
      {
        title: "Paso 4: Consultar cuenta",
        description: [
          "Digita el número de la cuenta y da clic en Consultar"
        ],
        image: aprovPaso4
      },
      {
        title: "Paso 5: Reset del Modem",
        description: [
          "En la pantalla de aprovisionamiento, selecciona el servicio de Internet. Luego, en el menú desplegable COMANDO, elige 'Reset Modem'. Este paso garantiza que aprovisionamos correctamente el servicio de Internet y minimizamos la posibilidad de errores en el sistema"
        ],
        image: aprovPaso5
      }
    ],
    marcacion: [
      {
        title: "Paso 1: Acceder al LOG",
        description: [
          "En la pantalla 'CONSULTA DE SUSCRIPTORES', utiliza el comando F22 (Shift + F10) para acceder al 'LOG DE LLAMADAS TELEFONICAS'"
        ]
      }
    ]
  };

  const steps = procedures[type];

  return (
    <div className="procedure-steps">
      <button 
        className="back-to-procedures-button"
        onClick={onBack}
      >
        <span className="button-icon">←</span>
        <span className="button-text">Volver a Procedimientos</span>
      </button>

      <div className="step-card">
        {currentStep === 0 && (
          <div className="intro-text">
            {introTexts[type]}
          </div>
        )}

        <div className="step-content">
          <h3>{steps[currentStep].title}</h3>
          <div className="step-description">
            {steps[currentStep].description.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>

          {steps[currentStep].image && (
            <div className="step-image">
              <img 
                src={steps[currentStep].image} 
                alt={`${steps[currentStep].title}`}
                className="step-image-content"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  console.error('Error al cargar la imagen:', steps[currentStep].image);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="step-navigation">
            <button 
              className="nav-button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Atrás
            </button>
            <div className="step-indicator">
              Paso {currentStep + 1} de {steps.length}
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

export default ProcedureStepsSection; 