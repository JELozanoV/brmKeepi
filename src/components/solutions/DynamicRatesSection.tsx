import React, { useEffect, useState } from 'react';
import { getTarifas } from '../../services/api';
import RatesSection from './sections/RatesSection';

interface BackendTarifa {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  period?: string;
  isActive: boolean;
}

const DynamicRatesSection: React.FC = () => {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTarifas()
      .then((data: BackendTarifa[]) => {
        setRates(
          data.filter(t => t.isActive).map(t => ({
            title: t.name,
            
            price: `${t.price} ${t.currency}${t.period ? ` / ${t.period}` : ''}`,
            features: [t.description],
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las tarifas');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando tarifas...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <RatesSection title="Planes Recomendados en 'Conectados'" rates={rates} />
  );
};

export default DynamicRatesSection;
