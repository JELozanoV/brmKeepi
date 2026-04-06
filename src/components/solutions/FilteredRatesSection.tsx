import React, { useEffect, useState } from 'react';
import { getTarifas } from '../../services/api';
import RatesSection from './sections/RatesSection';
import './FilteredRatesSection.scss';

// Función para formatear precios con separador de miles
const formatPrice = (price: number): string => {
  return price.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// Función para limpiar el precio ingresado
const cleanPrice = (price: string): string => {
  return price.replace(/[^0-9]/g, '');
};

// Función para validar el precio ingresado
const validatePrice = (price: string): boolean => {
  const cleanedPrice = cleanPrice(price);
  return cleanedPrice.length > 0 && !isNaN(Number(cleanedPrice));
};

interface BackendTarifa {
  id: number;
  name: string;
  price: number;
  codigoTarifa: string[];
  tipoServicio?: string;
  tipoTech?: string;
  complementos?: string | string[];
  estrato?: string | string[];
  ptar?: string;
}

// Props para permitir reutilización en hogar, móvil, etc.
interface FilteredRatesSectionProps {
  title?: string;
  minPriceLabel?: string;
}

const FilteredRatesSection: React.FC<FilteredRatesSectionProps> = ({ title = "Planes Recomendados en 'Conectados'", minPriceLabel = 'Tarifa actual del cliente' }) => {
  const [rates, setRates] = useState<BackendTarifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientRate, setClientRate] = useState<string>('');
  const [technology, setTechnology] = useState<'HFC' | 'FTTH' | ''>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [filteredRates, setFilteredRates] = useState<BackendTarifa[]>([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<string[]>([]);

  useEffect(() => {
    getTarifas()
      .then((data: BackendTarifa[]) => {
        setRates(data);
        // Obtener todas las opciones distintas de tipo de servicio
        const tipos = Array.from(new Set(data.map(r => r.tipoServicio).filter(Boolean))) as string[];
        setServiceTypeOptions(tipos);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las tarifas');
        setLoading(false);
      });
  }, []);

  // Función para filtrar y ordenar tarifas según la tecnología y el precio
  const handleBuscar = () => {
    setShowResults(true);
    if (!technology || clientRate === '') {
      setFilteredRates([]);
      setHighlightedId(null);
      return;
    }
    const numRate = parseFloat(cleanPrice(clientRate));
    if (isNaN(numRate) || numRate === 0) {
      setFilteredRates([]);
      setHighlightedId(null);
      return;
    }
    // Filtrar por tecnología, tipo de servicio (si aplica) y precio estrictamente mayor
    let validRates = rates.filter(r =>
      r.tipoTech === technology &&
      Number(r.price) > numRate &&
      (serviceType ? r.tipoServicio === serviceType : true)
    );
    // Ordenar de menor a mayor precio
    validRates = validRates.sort((a, b) => a.price - b.price);
    setFilteredRates(validRates);
    // Destacar la tarifa más cercana
    if (validRates.length > 0) {
      const closest = validRates.reduce((prev, curr) => Math.abs(curr.price - numRate) < Math.abs(prev.price - numRate) ? curr : prev);
      setHighlightedId(closest.id);
    } else {
      setHighlightedId(null);
    }
  };

  // Oculta resultados si el usuario cambia tecnología o precio
  useEffect(() => {
    setShowResults(false);
  }, [technology, clientRate]);

  const canSearch = validatePrice(clientRate) && parseFloat(cleanPrice(clientRate)) > 0;

  if (loading) return <div className="filtered-rates-section__status">Cargando tarifas...</div>;
  if (error) return <div className="filtered-rates-section__status filtered-rates-section__status--error">{error}</div>;

  return (
    <div className="filtered-rates-section">
      <h2 className="filtered-rates-section__title">Tarifas Conectados</h2>
      <p className="filtered-rates-section__description">
        Selecciona la <span className="filtered-rates-section__accent">tecnología</span> y coloca el <span className="filtered-rates-section__accent">precio actual del cliente</span> para ver solo las tarifas que puedes ofrecer.
      </p>
      <div className="filtered-rates-section__row filtered-rates-section__row--technology">
        <span className="filtered-rates-section__label-text">Tecnología:</span>
        <button
          type="button"
          className={`filtered-rates-section__chip ${technology === 'HFC' ? 'filtered-rates-section__chip--active' : ''}`}
          onClick={() => setTechnology('HFC')}
        >
          HFC
        </button>
        <button
          type="button"
          className={`filtered-rates-section__chip ${technology === 'FTTH' ? 'filtered-rates-section__chip--active' : ''}`}
          onClick={() => setTechnology('FTTH')}
        >
          FTTH
        </button>
      </div>
      <div className="filtered-rates-section__row filtered-rates-section__row--field">
        <label className="filtered-rates-section__field-label">
          Tipo de servicio:
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            className="filtered-rates-section__select"
          >
            <option value="">Todos</option>
            {serviceTypeOptions.map((type, idx) => (
              <option value={type} key={idx}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filtered-rates-section__row filtered-rates-section__row--field">
        <label className="filtered-rates-section__field-label">
          {minPriceLabel}:
          <input
            type="text"
            value={clientRate}
            onChange={e => {
              const value = e.target.value;
              if (validatePrice(value)) {
                setClientRate(formatPrice(Number(cleanPrice(value))));
              } else {
                setClientRate('');
              }
            }}
            placeholder="Ej: 90.000"
            className="filtered-rates-section__input"
          />
        </label>
      </div>
      <button
        className={`filtered-rates-section__search-button ${canSearch ? 'filtered-rates-section__search-button--enabled' : ''}`}
        onClick={handleBuscar}
        disabled={!canSearch}
      >
        Buscar
      </button>
      {showResults && (
        !technology || clientRate === '' ? (
          <div className="filtered-rates-section__feedback filtered-rates-section__feedback--error">
            Por favor, selecciona una tecnología y coloca el precio del cliente antes de buscar.
          </div>
        ) : filteredRates.length === 0 ? (
          <div className="filtered-rates-section__feedback filtered-rates-section__feedback--error">
            No hay tarifas recomendadas para la tecnología y precio ingresados.
          </div>
        ) : (
          <RatesSection
            title={title}
            rates={filteredRates.map(r => ({
              title: r.name,
              price: `${formatPrice(r.price)} COP`,
              features: [
                `Precio: ${formatPrice(r.price)} COP`,
                `Códigos de tarifa: ${r.codigoTarifa.join(', ')}`,
                r.complementos ? `Complementos: ${Array.isArray(r.complementos) ? r.complementos.join(', ') : r.complementos}` : '',
                r.estrato ? `Estrato: ${Array.isArray(r.estrato) ? r.estrato.join(', ') : r.estrato}` : '',
                r.tipoServicio ? `Tipo de servicio: ${r.tipoServicio}` : '',
                r.tipoTech ? `Tecnología: ${r.tipoTech}` : '',
                r.ptar ? `PTAR: ${r.ptar}` : ''
              ].filter(Boolean),
              isHighlighted: r.id === highlightedId
            }))}
          />
        )
      )}
    </div>
  );
};

export default FilteredRatesSection;
