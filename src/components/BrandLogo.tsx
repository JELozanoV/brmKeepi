import React from 'react';
import Fidex2 from '../assets/images/Fidex2.png';
import { useTransparentLogo } from '../hooks/useTransparentLogo';

interface BrandLogoProps {
  variant: 'header' | 'login';
  tolerance?: number;
}

/**
 * BrandLogo: logotipo procesado (PNG con fondo blanco eliminado en cliente).
 * Usa cache localStorage para rendimiento y un fallback visual si falla.
 */
const BrandLogo: React.FC<BrandLogoProps> = ({ variant, tolerance = 20 }) => {
  const { url, loading, fallback } = useTransparentLogo({ src: Fidex2, tolerance, fallbackSrc: Fidex2 });
  const common: React.CSSProperties = variant === 'login'
    ? { display: 'block', margin: '0 auto 20px', width: 'clamp(120px, 22vw, 220px)', height: 'auto' }
    : { height: 28, width: 'auto', display: 'block' };

  if (loading) {
    return <div style={{ ...common, background: '#2a2a2a', borderRadius: 6 }} aria-hidden="true" />;
  }

  return (
    <img
      src={url || Fidex2}
      alt="RETEN+"
      decoding="async"
      loading={variant === 'login' ? 'eager' : 'auto'}
      fetchPriority={variant === 'login' ? ('high' as any) : undefined}
      style={{ ...common, ...(fallback ? { mixBlendMode: 'multiply' as any } : {}) }}
      width={variant === 'login' ? undefined : 100}
      height={variant === 'login' ? undefined : 28}
    />
  );
};

export default BrandLogo;


