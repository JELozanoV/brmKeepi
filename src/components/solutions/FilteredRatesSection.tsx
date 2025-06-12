import React, { useEffect, useState } from 'react';
import { getTarifas } from '../../services/api';
import RatesSection from './sections/RatesSection';

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
  // Los siguientes campos pueden no existir en la respuesta real
  // description?: string;
  // currency?: string;
  // period?: string;
  // isActive?: boolean;
}

interface BackendTarifa {
  id: number;
  name: string;
  price: number;
  codigoTarifa: string[];
  // Los siguientes campos pueden no existir en la respuesta real
  // description?: string;
  // currency?: string;
  // period?: string;
  // isActive?: boolean;
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
        const tipos = Array.from(new Set(data.map(r => r.tipoServicio).filter(Boolean)));
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
    const numRate = parseFloat(clientRate.replace(/[^\d.]/g, ''));
    if (isNaN(numRate)) {
      setFilteredRates([]);
      setHighlightedId(null);
      return;
    }
    // Filtrar por tecnología, tipo de servicio (si aplica) y precio
    let validRates = rates.filter(r =>
      r.tipoTech === technology &&
      r.price > numRate &&
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

  if (loading) return <div>Cargando tarifas...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div className="filtered-rates-section" style={{background: '#fff', padding: 28, borderRadius: 16, maxWidth: 650, margin: '0 auto', boxShadow: '0 2px 16px rgba(26,77,255,0.10)'}}>
      <h2 style={{color: '#1A4DFF', fontWeight: 700, marginBottom: 10, fontSize: 24, letterSpacing: 0.5}}>Filtrar tarifas por tecnología y precio</h2>
      <p style={{color: '#222', fontSize: 16, marginBottom: 26}}>
        Selecciona la <span style={{color: '#007BFF', fontWeight: 600}}>tecnología</span> y coloca el <span style={{color: '#007BFF', fontWeight: 600}}>precio actual del cliente</span> para ver solo las tarifas que puedes ofrecer.
      </p>
      <div style={{marginBottom: 22, display: 'flex', gap: 18, alignItems: 'center'}}>
        <span style={{fontWeight: 600, color: '#222'}}>Tecnología:</span>
        <button
          type="button"
          style={{
            background: technology === 'HFC' ? '#1A4DFF' : '#F2F2F2',
            color: technology === 'HFC' ? '#fff' : '#1A4DFF',
            border: '2px solid #1A4DFF',
            borderRadius: 8,
            padding: '8px 28px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            outline: 'none',
            boxShadow: technology === 'HFC' ? '0 2px 8px #1A4DFF33' : 'none',
            transition: 'all .2s'
          }}
          onClick={() => setTechnology('HFC')}
        >
          HFC
        </button>
        <button
          type="button"
          style={{
            background: technology === 'FTTH' ? '#1A4DFF' : '#F2F2F2',
            color: technology === 'FTTH' ? '#fff' : '#1A4DFF',
            border: '2px solid #1A4DFF',
            borderRadius: 8,
            padding: '8px 28px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            outline: 'none',
            boxShadow: technology === 'FTTH' ? '0 2px 8px #1A4DFF33' : 'none',
            transition: 'all .2s'
          }}
          onClick={() => setTechnology('FTTH')}
        >
          FTTH
        </button>
      </div>
      <div style={{marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16}}>
        <label style={{fontWeight: 600, color: '#222', fontSize: 15, minWidth: 120}}>
          Tipo de servicio:
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            style={{
              marginLeft: 12,
              padding: '8px 18px',
              borderRadius: 8,
              border: '1.5px solid #1A4DFF',
              fontSize: 16,
              color: '#222',
              background: '#F2F2F2',
              minWidth: 170,
              fontWeight: 600
            }}
          >
            <option value="">Todos</option>
            {serviceTypeOptions.map((type, idx) => (
              <option value={type} key={idx}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{marginBottom: 18}}>
        <label style={{fontWeight: 600, color: '#222', fontSize: 15}}>
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
            style={{
              marginLeft: 12,
              padding: 8,
              borderRadius: 8,
              border: '1.5px solid #1A4DFF',
              width: 140,
              fontSize: 16,
              color: '#222'
            }}
          />
        </label>
      </div>
      <button
        style={{
          background: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 38px',
          fontWeight: 700,
          fontSize: 18,
          cursor: 'pointer',
          marginBottom: 24,
          boxShadow: '0 2px 8px #007BFF22',
          letterSpacing: 0.5
        }}
        onClick={handleBuscar}
      >
        Buscar
      </button>
      <div style={{marginBottom: 8, fontSize: 14, color: '#888'}}>
        Tarifas recibidas: {rates.length} | Tecnología: {technology || 'No seleccionada'} | Valor ingresado: {clientRate} | numRate: {parseFloat(clientRate.replace(/[^\d.]/g, ''))} | Tarifas válidas: {filteredRates.length}
      </div>
      {showResults && (
        !technology || clientRate === '' ? (
          <div style={{marginTop: 16, color: '#d9534f', fontWeight: 500}}>
            Por favor, selecciona una tecnología y coloca el precio del cliente antes de buscar.
          </div>
        ) : filteredRates.length === 0 ? (
          <div style={{marginTop: 16, color: '#d9534f', fontWeight: 500}}>
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
