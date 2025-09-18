import React, { useMemo, useState } from 'react';
import { calcularCambioDeCiclo, calcularCambioPlanInmediato, formatCOP } from '../utils/prorrateo';

type Tab = 'ciclo' | 'inmediato';

const ProporcionalesPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('ciclo');
  const [metodo, setMetodo] = useState<'30' | 'reales'>(() => (localStorage.getItem('prorrateo:metodo') as any) || '30');

  // Cambio de ciclo
  const [valorPlan, setValorPlan] = useState<string>('');
  const [diaActual, setDiaActual] = useState<string>('');
  const [nuevoDia, setNuevoDia] = useState<string>('');

  // Cambio inmediato
  const [planActual, setPlanActual] = useState<string>('');
  const [planNuevo, setPlanNuevo] = useState<string>('');
  const [diaCorte, setDiaCorte] = useState<string>('');
  const [diaCambio, setDiaCambio] = useState<string>('');

  const base = useMemo(() => (metodo === '30' ? 30 : 30), [metodo]); // placeholder para días reales

  const handleMetodo = (m: '30' | 'reales') => {
    setMetodo(m);
    localStorage.setItem('prorrateo:metodo', m);
  };

  const validarDia = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 && n <= 31;
  };

  // Formato de moneda es-CO con separador de miles (visual)
  const cleanPrice = (price: string): string => price.replace(/[^0-9]/g, '');
  const formatNumber = (n: number): string => n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const validarValor = (v: string) => {
    const cleaned = cleanPrice(v);
    const n = Number(cleaned);
    return cleaned.length > 0 && Number.isFinite(n) && n > 0;
  };

  const resultadoCiclo = useMemo(() => {
    try {
      const input = {
        valorPlan: Number(cleanPrice(valorPlan)),
        diaActual: Number(diaActual),
        nuevoDia: Number(nuevoDia),
        base,
      };
      if (!validarValor(valorPlan) || !validarDia(diaActual) || !validarDia(nuevoDia)) return null;
      return calcularCambioDeCiclo(input);
    } catch (e) {
      return null;
    }
  }, [valorPlan, diaActual, nuevoDia, base]);

  const resultadoInmediato = useMemo(() => {
    try {
      const input = {
        planActual: Number(cleanPrice(planActual)),
        planNuevo: Number(cleanPrice(planNuevo)),
        diaCorte: Number(diaCorte),
        diaCambio: Number(diaCambio),
        base,
      };
      if (!validarValor(planActual) || !validarValor(planNuevo) || !validarDia(diaCorte) || !validarDia(diaCambio)) return null;
      return calcularCambioPlanInmediato(input);
    } catch (e) {
      return null;
    }
  }, [planActual, planNuevo, diaCorte, diaCambio, base]);

  return (
    <div className="app-content">
      <div className="filtered-rates-section" style={{ background: '#222', color: 'rgba(255,255,255,0.96)', padding: 20, borderRadius: 12, maxWidth: 800, margin: '0 auto', border: '1px solid #1A4DFF', boxShadow: '0 1px 8px rgba(26,77,255,0.08)' }}>
        <h2 style={{color: 'rgba(255,255,255,0.98)', fontWeight: 700, marginBottom: 6, fontSize: 22, letterSpacing: 0.3}}>Calculadora de Proporcionales</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 0, marginBottom: 14, fontSize: 14 }}>Simula cobros por cambio de ciclo o cambio de plan inmediato.</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }} role="tablist" aria-label="Tipo de cálculo">
            <button type="button" role="tab" aria-selected={tab === 'ciclo'}
              style={{ background: tab === 'ciclo' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: tab === 'ciclo' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', outline: 'none', boxShadow: tab === 'ciclo' ? '0 2px 8px #1A4DFF33' : 'none', transition: 'all .2s' }}
              onClick={() => setTab('ciclo')}>Cambio de ciclo</button>
            <button type="button" role="tab" aria-selected={tab === 'inmediato'}
              style={{ background: tab === 'inmediato' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: tab === 'inmediato' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', outline: 'none', boxShadow: tab === 'inmediato' ? '0 2px 8px #1A4DFF33' : 'none', transition: 'all .2s' }}
              onClick={() => setTab('inmediato')}>Cambio de plan inmediato</button>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" aria-pressed={metodo === '30'}
              style={{ background: metodo === '30' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: metodo === '30' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', outline: 'none', boxShadow: metodo === '30' ? '0 2px 8px #1A4DFF33' : 'none', transition: 'all .2s' }}
              onClick={() => handleMetodo('30')}>30 días</button>
            <button type="button" aria-pressed={metodo === 'reales'} disabled
              style={{ background: metodo === 'reales' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: metodo === 'reales' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'not-allowed', outline: 'none', boxShadow: metodo === 'reales' ? '0 2px 8px #1A4DFF33' : 'none', opacity: 0.6, transition: 'all .2s' }}
            >Días del mes</button>
          </div>
        </div>

        {tab === 'ciclo' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))', gap: 12 }}>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor mensual (COP)
              <input aria-label="Valor mensual (COP)" placeholder="90.000" value={valorPlan} onChange={e => { const cleaned = cleanPrice(e.target.value); setValorPlan(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día de facturación actual
              <input aria-label="Día de facturación actual" placeholder="1" value={diaActual} onChange={e => setDiaActual(e.target.value)} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Nuevo día de facturación
              <input aria-label="Nuevo día de facturación" placeholder="17" value={nuevoDia} onChange={e => setNuevoDia(e.target.value)} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
          </div>
        )}

        {tab === 'inmediato' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))', gap: 12 }}>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor plan actual (COP)
              <input aria-label="Valor plan actual (COP)" placeholder="38.900" value={planActual} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanActual(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor plan nuevo (COP)
              <input aria-label="Valor plan nuevo (COP)" placeholder="54.900" value={planNuevo} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanNuevo(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día de corte
              <input aria-label="Día de corte" placeholder="1" value={diaCorte} onChange={e => setDiaCorte(e.target.value)} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día del cambio
              <input aria-label="Día del cambio" placeholder="21" value={diaCambio} onChange={e => setDiaCambio(e.target.value)} inputMode="numeric" style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            style={{
              background: (tab === 'ciclo' ? (resultadoCiclo && validarValor(valorPlan) && validarDia(diaActual) && validarDia(nuevoDia)) : (resultadoInmediato && validarValor(planActual) && validarValor(planNuevo) && validarDia(diaCorte) && validarDia(diaCambio))) ? '#1A4DFF' : 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid #1A4DFF',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 16,
              cursor: (tab === 'ciclo' ? (resultadoCiclo && validarValor(valorPlan) && validarDia(diaActual) && validarDia(nuevoDia)) : (resultadoInmediato && validarValor(planActual) && validarValor(planNuevo) && validarDia(diaCorte) && validarDia(diaCambio))) ? 'pointer' : 'not-allowed',
              boxShadow: (tab === 'ciclo' ? (resultadoCiclo && validarValor(valorPlan) && validarDia(diaActual) && validarDia(nuevoDia)) : (resultadoInmediato && validarValor(planActual) && validarValor(planNuevo) && validarDia(diaCorte) && validarDia(diaCambio))) ? '0 2px 8px #1A4DFF33' : 'none',
              letterSpacing: 0.3
            }}
            onClick={() => {}}
            disabled={!(tab === 'ciclo' ? (resultadoCiclo && validarValor(valorPlan) && validarDia(diaActual) && validarDia(nuevoDia)) : (resultadoInmediato && validarValor(planActual) && validarValor(planNuevo) && validarDia(diaCorte) && validarDia(diaCambio)))}
          >
            Calcular
          </button>
        </div>

        <div style={{marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'}} aria-live="polite">
          <div>
            {tab === 'ciclo' && resultadoCiclo && (
              <>Método: {metodo === '30' ? '30 días' : 'Días del mes'} | Días a prorratear: {resultadoCiclo.diasProrrateo} | Cobro proporcional: {formatCOP(resultadoCiclo.cargoProporcional)}</>
            )}
            {tab === 'inmediato' && resultadoInmediato && (
              <>Método: {metodo === '30' ? '30 días' : 'Días del mes'} | Días consumidos: {resultadoInmediato.diasConsumidos} | Días restantes: {resultadoInmediato.diasRestantes} | Cargo proporcional del mes: {formatCOP(resultadoInmediato.cargoProporcional)}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProporcionalesPage;


