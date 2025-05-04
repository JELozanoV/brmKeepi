import React from 'react';
import SolutionStep from '../SolutionStep';
import { SolutionProps } from '../../types';

const HomeNavigatorFailureSolution: React.FC<SolutionProps> = () => {
  return (
    <div className="solution-container">
      <h2>Solución para Fallas con el Navegador</h2>
      
      <SolutionStep
        title="Condiciones Necesarias"
        content={
          <ul className="conditions-list">
            <li>Es necesario que la cuenta esté activa y sin afectación de falla masiva en la zona.</li>
            <li>El cliente necesita estar conectado al servicio de Claro hogar (WiFi o cable).</li>
            <li>El titular o un tercero que proporcione los datos necesarios de la cuenta puede solicitar soporte del servicio.</li>
          </ul>
        }
      />

      <SolutionStep
        title="1. Verificar el tipo de afectación"
        content={
          <ul>
            <li>Las páginas no cargan</li>
            <li>Se muestra un error como "Sin conexión" o "no se puede acceder a este sitio"</li>
            <li>Solo una página específica presenta fallas</li>
            <li>Lentitud al abrir sitios web</li>
          </ul>
        }
      />

      <SolutionStep
        title="2. Prueba en modo incógnito"
        content={
          <div>
            <p>Solicite al cliente abrir una ventana en modo incógnito:</p>
            <ul>
              <li>Chrome/Edge: Ctrl + Shift + N</li>
              <li>Firefox: Ctrl + Shift + P</li>
            </ul>
          </div>
        }
      />

      <SolutionStep
        title="3. Borrar caché, cookies e historial"
        content={
          <ol>
            <li>Ingresar a configuración o preferencias del navegador</li>
            <li>Buscar la opción "privacidad y seguridad"</li>
            <li>Seleccionar "Borrar datos de navegación"</li>
            <li>Elegir las opciones de caché, cookies e historial</li>
            <li>Confirmar la acción y cerrar el navegador</li>
          </ol>
        }
      />

      <SolutionStep
        title="4. Probar desde otro navegador"
        content={
          <p>
            Solicitar que intente acceder desde un navegador distinto al habitual 
            (por ejemplo, si usa Chrome, probar en Firefox o Edge).
          </p>
        }
      />

      <SolutionStep
        title="5. Soporte por T&D"
        content={
          <ol>
            <li>Acceder a T&D y hacer clic en el botón internet</li>
            <li>Validar si el cliente tiene el servicio de Ultra Wifi</li>
            <li>Seleccionar el síntoma "Acceso a Páginas Específicas"</li>
            <li>Seguir el árbol de diagnóstico completo</li>
            <li>Registrar notas claras sobre el proceso realizado</li>
          </ol>
        }
      />

      <SolutionStep
        title="6. Aprovisionamiento (si es necesario)"
        content={
          <ol>
            <li>Ingresar a la plataforma de Agendamiento</li>
            <li>Acceder al Módulo de Gestión</li>
            <li>Seleccionar Aprovisionamiento de Servicios</li>
            <li>Ingresar el número de cuenta</li>
            <li>Seleccionar servicio de Internet y ejecutar 'Reset Modem'</li>
          </ol>
        }
      />

      <div className="important-note">
        <h3>Nota Importante</h3>
        <p>
          Recuerde que es necesario validar la titularidad y el estado de la cuenta en RR 
          antes de proceder con el soporte técnico. El servicio debe estar activo y sin 
          afectación de falla masiva en la zona.
        </p>
      </div>
    </div>
  );
};

export default HomeNavigatorFailureSolution; 