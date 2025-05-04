import { CustomerServiceType } from '../types';

interface Props {
  onSelect: (serviceType: CustomerServiceType) => void;
}

const CustomerServiceTypeSelector = ({ onSelect }: Props) => {
  const serviceTypes = [
    { 
      id: 'asesor-inapropiado', 
      text: 'Asesor inapropiado', 
      icon: '😤' 
    },
    { 
      id: 'llamada-colgada', 
      text: 'Llamada colgada', 
      icon: '📞' 
    },
    { 
      id: 'largas-esperas', 
      text: 'Largas esperas', 
      icon: '⏳' 
    },
    { 
      id: 'sin-solucion', 
      text: 'Sin solución previa', 
      icon: '❌' 
    },
    { 
      id: 'promesas-incumplidas', 
      text: 'Promesas incumplidas', 
      icon: '🤝' 
    }
  ];

  return (
    <div className="selector-container">
      <h2 className="section-title">¿Qué problema tuvo con el servicio al cliente?</h2>
      
      <div className="options-container">
        {serviceTypes.map(type => (
          <button 
            key={type.id}
            className="option-button"
            onClick={() => onSelect(type.id as CustomerServiceType)}
          >
            <span className="button-icon">{type.icon}</span>
            <span className="button-text">{type.text}</span>
            <span className="arrow-icon">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerServiceTypeSelector; 