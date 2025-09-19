import React, { useMemo, useState } from 'react';
import { calcularCambioDeCiclo, calcularCambioPlanInmediato, formatCOP } from '../utils/prorrateo';

type Tab = 'ciclo' | 'inmediato';
type ServiceType = 'hogar' | 'movil';

const ProporcionalesPage: React.FC = () => {
  const MOBILE_REGION_DAYS: Record<string, number[]> = {
    'Oriente': [2, 4, 8, 11, 14, 17, 18, 20, 22, 24, 26],
    'Occidente': [3, 5, 7, 10, 15, 19, 25, 28],
    'Costa': [12, 16, 27],
  };
  const [tab, setTab] = useState<Tab>('ciclo');
  const [service, setService] = useState<ServiceType>('hogar');
  // Base fija 30 días (igual al Excel)
  const BASE = 30;

  // Cambio de ciclo
  const [valorPlan, setValorPlan] = useState<string>('');
  const [diaActual, setDiaActual] = useState<string>('');
  const [nuevoDia, setNuevoDia] = useState<string>('');
  // Móvil: región y reglas
  const [region, setRegion] = useState<string>('');
  // Nota: dejamos preparado estado para futura carga dinámica desde Excel/JSON si se requiere
  // const [rules, setRules] = useState<RegionRules | null>(null); // Eliminado

  // Cambio inmediato
  const [planActual, setPlanActual] = useState<string>('');
  const [planNuevo, setPlanNuevo] = useState<string>('');
  const [diaCorte, setDiaCorte] = useState<string>('');
  const [diaCambio, setDiaCambio] = useState<string>('');

  // Estado de resultado y errores
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resCiclo, setResCiclo] = useState<{ diasProrrateo: number; cargo: number } | null>(null);
  const [resInmediato, setResInmediato] = useState<{ diasConsumidos: number; diasRestantes: number; cargo: number } | null>(null);

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

  const canCalculate = useMemo(() => {
    if (tab === 'ciclo') {
      if (service === 'hogar') {
        return validarValor(valorPlan) && validarDia(diaActual) && validarDia(nuevoDia) && !submitting;
      }
      // móvil: habilitar solo con valor + región + ambos días
      return validarValor(valorPlan) && !!region && !!diaActual && !!nuevoDia && !submitting;
    }
    return validarValor(planActual) && validarValor(planNuevo) && validarDia(diaCorte) && validarDia(diaCambio) && !submitting;
  }, [tab, valorPlan, diaActual, nuevoDia, planActual, planNuevo, diaCorte, diaCambio, submitting, service, region]);

  const handleCalcular = async () => {
    setErrorMsg(null);
    setResCiclo(null);
    setResInmediato(null);
    if (!canCalculate) {
      setErrorMsg('Completa los campos con valores válidos.');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 150));
      if (tab === 'ciclo') {
        const out = calcularCambioDeCiclo({
          valorPlan: Number(cleanPrice(valorPlan)),
          diaActual: Number(diaActual),
          nuevoDia: Number(nuevoDia),
          base: BASE,
        });
        setResCiclo({ diasProrrateo: out.diasProrrateo, cargo: out.cargoProporcional });
      } else {
        const out = calcularCambioPlanInmediato({
          planActual: Number(cleanPrice(planActual)),
          planNuevo: Number(cleanPrice(planNuevo)),
          diaCorte: Number(diaCorte),
          diaCambio: Number(diaCambio),
          base: BASE,
        });
        setResInmediato({ diasConsumidos: out.diasConsumidos, diasRestantes: out.diasRestantes, cargo: out.cargoProporcional });
      }
    } catch (e: any) {
      const msg = e?.message || 'No se pudo calcular. Verifica los datos.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Cargar reglas de región (Móvil)
  // Sincronización futura con backend/Excel: preparado para activar carga dinámica si se requiere.

  return (
    <div className="app-content">
      <div className="filtered-rates-section" style={{ background: '#222', color: 'rgba(255,255,255,0.96)', padding: 20, borderRadius: 12, maxWidth: 800, margin: '0 auto', border: '1px solid #1A4DFF', boxShadow: '0 1px 8px rgba(26,77,255,0.08)' }}>
        <h2 style={{color: 'rgba(255,255,255,0.98)', fontWeight: 700, marginBottom: 6, fontSize: 22, letterSpacing: 0.3}}>Calculadora de Proporcionales</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: 0, marginBottom: 14, fontSize: 14 }}>Simula cobros por cambio de ciclo o cambio de plan inmediato.</p>

        {/* Paso 0: Tipo de servicio */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }} role="tablist" aria-label="Tipo de servicio">
          <button type="button" role="tab" aria-selected={service === 'hogar'}
            style={{ background: service === 'hogar' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: service === 'hogar' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            onClick={() => setService('hogar')}>Hogar</button>
          <button type="button" role="tab" aria-selected={service === 'movil'}
            style={{ background: service === 'movil' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: service === 'movil' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '6px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            onClick={() => setService('movil')}>Móvil</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }} role="tablist" aria-label="Tipo de cálculo">
            <button type="button" role="tab" aria-selected={tab === 'ciclo'}
              style={{ background: tab === 'ciclo' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: tab === 'ciclo' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', outline: 'none', boxShadow: tab === 'ciclo' ? '0 2px 8px #1A4DFF33' : 'none', transition: 'all .2s' }}
              onClick={() => setTab('ciclo')}>Cambio de ciclo</button>
            <button type="button" role="tab" aria-selected={tab === 'inmediato'}
              style={{ background: tab === 'inmediato' ? '#1A4DFF' : 'rgba(255,255,255,0.08)', color: tab === 'inmediato' ? '#fff' : '#8db0ff', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', outline: 'none', boxShadow: tab === 'inmediato' ? '0 2px 8px #1A4DFF33' : 'none', transition: 'all .2s' }}
              onClick={() => setTab('inmediato')}>Cambio de plan inmediato</button>
          </div>
          <div />
        </div>

        {tab === 'ciclo' && service === 'hogar' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))', gap: 12 }}>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor mensual (COP)
              <input aria-label="Valor mensual (COP)" placeholder="Ej: 90.000" value={valorPlan} onChange={e => { const cleaned = cleanPrice(e.target.value); setValorPlan(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día de facturación actual
              <input aria-label="Día de facturación actual" placeholder="Ej: 1" value={diaActual} onChange={e => setDiaActual(e.target.value)} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Nuevo día de facturación
              <input aria-label="Nuevo día de facturación" placeholder="Ej: 17" value={nuevoDia} onChange={e => setNuevoDia(e.target.value)} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
          </div>
        )}

        {tab === 'ciclo' && service === 'movil' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))', gap: 12 }}>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor mensual (COP)
              <input aria-label="Valor mensual (COP)" placeholder="Ej: 90.000" value={valorPlan} onChange={e => { const cleaned = cleanPrice(e.target.value); setValorPlan(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 180, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <div />
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Región
              <select aria-label={`Región seleccionada: ${region || 'ninguna'}`} value={region} onChange={e => { setRegion(e.target.value); setDiaActual(''); setNuevoDia(''); }} disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 220, fontSize: 15, color: 'rgba(255,255,255,0.95)', background: '#111' }}>
                <option value="">Selecciona región…</option>
                {['Oriente','Occidente','Costa'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <div />
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día de ciclo actual
              <select aria-label="Día de ciclo actual"
                value={diaActual}
                onChange={e => setDiaActual(e.target.value)}
                disabled={submitting || !region}
                style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 15, color: 'rgba(255,255,255,0.95)', background: '#111' }}>
                <option value="">—</option>
                {region && MOBILE_REGION_DAYS[region]?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="kpi-subtle" style={{ marginTop: 6, color: 'rgba(255,255,255,0.7)' }}>Selecciona un día válido según la política de la región.</div>
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Nuevo día de ciclo
              <select aria-label="Nuevo día de ciclo"
                value={nuevoDia}
                onChange={e => setNuevoDia(e.target.value)}
                disabled={submitting || !region}
                style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 15, color: 'rgba(255,255,255,0.95)', background: '#111' }}>
                <option value="">—</option>
                {region && MOBILE_REGION_DAYS[region]?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div className="kpi-subtle" style={{ marginTop: 6, color: 'rgba(255,255,255,0.7)' }}>Selecciona un día válido según la política de la región.</div>
            </label>
            {/* Validación implícita por opciones filtradas; sin alertas rojas */}
          </div>
        )}

        {tab === 'inmediato' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))', gap: 12 }}>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor plan actual (COP)
              <input aria-label="Valor plan actual (COP)" placeholder="Ej: 38.900" value={planActual} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanActual(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Valor plan nuevo (COP)
              <input aria-label="Valor plan nuevo (COP)" placeholder="Ej: 54.900" value={planNuevo} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanNuevo(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día de corte
              <input aria-label="Día de corte" placeholder="Ej: 1" value={diaCorte} onChange={e => setDiaCorte(e.target.value)} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
            <label style={{fontWeight: 600, color: 'rgba(255,255,255,0.95)', fontSize: 15}}>
              Día del cambio
              <input aria-label="Día del cambio" placeholder="Ej: 21" value={diaCambio} onChange={e => setDiaCambio(e.target.value)} inputMode="numeric" disabled={submitting} style={{ marginLeft: 12, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF', width: 160, fontSize: 16, color: 'rgba(255,255,255,0.95)', background: '#111' }} />
            </label>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            style={{
              background: canCalculate ? '#1A4DFF' : 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid #1A4DFF',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 16,
              cursor: canCalculate ? 'pointer' : 'not-allowed',
              boxShadow: canCalculate ? '0 2px 8px #1A4DFF33' : 'none',
              letterSpacing: 0.3
            }}
            onClick={handleCalcular}
            disabled={!canCalculate}
          >
            {submitting ? 'Calculando…' : 'Calcular'}
          </button>
        </div>

        {/* Resultados */}
        <div role="region" aria-live="polite" style={{ marginTop: 16 }}>
          <div className="rate-card" style={{ background: '#111', border: '1.5px solid #1A4DFF', borderRadius: 12, padding: 16, color: 'white' }}>
            <h3 style={{ marginTop: 0, marginBottom: 8, color: 'white' }}>
              {tab === 'ciclo' ? 'Resultado — Cambio de ciclo' : 'Resultado — Cambio inmediato'}
            </h3>
            {errorMsg && (
              <div style={{ background: '#3b0d0d', border: '1px solid #ef4444', color: '#fecaca', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
                {errorMsg}
              </div>
            )}

            {!errorMsg && !resCiclo && !resInmediato && (
              <div className="kpi-subtle" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Calcula para ver el resultado aquí.
              </div>
            )}

            {tab === 'ciclo' && resCiclo && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Cobro proporcional: {formatCOP(resCiclo.cargo)}</div>
                {!errorMsg && (
                  <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45 }}>
                    {Number.isFinite(resCiclo.diasProrrateo as any)
                      ? (
                        service === 'movil'
                          ? (
                            <>Este ajuste aparecerá una sola vez en tu próxima factura. Corresponde a {formatCOP(resCiclo.cargo)} por el periodo de ajuste entre tu ciclo actual y el nuevo en la región {region}. A partir del próximo corte, tus facturas volverán a ser solo por el valor mensual habitual.</>
                          )
                          : (
                            <>Este ajuste aparecerá una sola vez en tu próxima factura. Corresponde a {formatCOP(resCiclo.cargo)} por el periodo de ajuste entre tu ciclo actual y el nuevo, equivalente a {resCiclo.diasProrrateo} días de servicio. A partir del próximo corte, tus facturas volverán a ser solo por el valor mensual habitual{Number(nuevoDia) === 17 ? '. Para programar el cambio de ciclo al 17, usa la marcación FAC OCL en RR.' : ''}.</>
                          )
                      ) : (
                        <>Este ajuste aparecerá una sola vez en la próxima factura. Corresponde al periodo de transición entre ciclos/planes de este mes.</>
                      )}
                  </p>
                )}
              </div>
            )}

            {tab === 'inmediato' && resInmediato && (
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Cargo proporcional del mes: {formatCOP(resInmediato.cargo)}</div>
                {!errorMsg && (
                  <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45 }}>
                    {(Number.isFinite(resInmediato.diasConsumidos as any) && Number.isFinite(resInmediato.diasRestantes as any))
                      ? (
                        <>En tu próxima factura verás una sola vez un cargo de {formatCOP(resInmediato.cargo)}. Reconoce lo que ya usaste con tu plan anterior ({resInmediato.diasConsumidos} días) y lo que falta del mes con tu plan nuevo ({resInmediato.diasRestantes} días). Después de este ajuste, seguirás pagando únicamente el valor mensual de tu plan vigente.</>
                      ) : (
                        <>Este ajuste aparecerá una sola vez en la próxima factura. Corresponde al periodo de transición entre ciclos/planes de este mes.</>
                      )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProporcionalesPage;


