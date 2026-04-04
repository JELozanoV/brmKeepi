import React, { useMemo, useState } from 'react';
import { calcularCambioDeCiclo, calcularCambioPlanInmediato, formatCOP } from '../utils/prorrateo';
import '../styles/_proporcionales.scss';

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
  const [resCiclo, setResCiclo] = useState<{ diasProrrateo: number; cargo: number; totalFactura: number; descripcion: string } | null>(null);
  const [resInmediato, setResInmediato] = useState<{ diasConsumidos: number; diasRestantes: number; cargo: number; totalFactura: number; descripcion: string } | null>(null);

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
        const nActual = Number(diaActual);
        const nNuevo = Number(nuevoDia);
        const proporcional = out.cargoProporcional;
        let totalFactura = 0;
        let descripcion = '';
        if (nNuevo === nActual || proporcional === 0) {
          descripcion = 'No habrá cobro de ajuste en tu próxima factura. Tu siguiente factura será solo por el cargo mensual correspondiente.';
          totalFactura = proporcional;
        } else {
          const haciaAdelante = nNuevo > nActual;
          if (haciaAdelante && validarValor(valorPlan)) {
            const valorMensualActual = Number(cleanPrice(valorPlan));
            totalFactura = valorMensualActual + proporcional;
            descripcion = `Incluye tu cargo mensual (${formatCOP(valorMensualActual)}) + el ajuste único (${formatCOP(proporcional)}).`;
          } else {
            totalFactura = proporcional;
            descripcion = 'Incluye únicamente el ajuste de ciclo. En esta próxima factura no se cobrará el cargo mensual completo.';
          }
        }
        setResCiclo({ diasProrrateo: out.diasProrrateo, cargo: out.cargoProporcional, totalFactura, descripcion });
      } else {
        const out = calcularCambioPlanInmediato({
          planActual: Number(cleanPrice(planActual)),
          planNuevo: Number(cleanPrice(planNuevo)),
          diaCorte: Number(diaCorte),
          diaCambio: Number(diaCambio),
          base: BASE,
        });
        const proporcional = out.cargoProporcional;
        let totalFactura = proporcional;
        let descripcion = '';
        if (proporcional === 0) {
          descripcion = 'No habrá cobro de ajuste en tu próxima factura. Tu siguiente factura será solo por el valor mensual correspondiente.';
        } else {
          descripcion = 'Incluye únicamente el ajuste único por el cambio inmediato.';
        }
        setResInmediato({ diasConsumidos: out.diasConsumidos, diasRestantes: out.diasRestantes, cargo: out.cargoProporcional, totalFactura, descripcion });
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
      <div className="proporcionales-page">
        {/* Header */}
        <div className="proporcionales-header">
          <h2 className="proporcionales-title">Calculadora de Proporcionales</h2>
          <p className="proporcionales-subtitle">Simula cobros por cambio de ciclo o cambio de plan inmediato.</p>
        </div>

        {/* Tabs: Servicio + Tipo de cálculo */}
        <div className="proporcionales-tabs">
          <div className="tab-group" role="tablist" aria-label="Tipo de servicio">
            <span className="tab-group-label">Servicio</span>
            <button type="button" role="tab" aria-selected={service === 'hogar'}
              className={`tab-btn ${service === 'hogar' ? 'active' : ''}`}
              onClick={() => setService('hogar')}>Hogar</button>
            <button type="button" role="tab" aria-selected={service === 'movil'}
              className={`tab-btn ${service === 'movil' ? 'active' : ''}`}
              onClick={() => setService('movil')}>Móvil</button>
          </div>
          <div className="tab-group" role="tablist" aria-label="Tipo de cálculo">
            <span className="tab-group-label">Tipo de cálculo</span>
            <button type="button" role="tab" aria-selected={tab === 'ciclo'}
              className={`tab-btn ${tab === 'ciclo' ? 'active' : ''}`}
              onClick={() => setTab('ciclo')}>Cambio de ciclo</button>
            <button type="button" role="tab" aria-selected={tab === 'inmediato'}
              className={`tab-btn ${tab === 'inmediato' ? 'active' : ''}`}
              onClick={() => setTab('inmediato')}>Cambio inmediato</button>
          </div>
        </div>

        {/* Form Card: Cambio de ciclo — Hogar */}
        {tab === 'ciclo' && service === 'hogar' && (
          <div className="proporcionales-card">
            <div className="proporcionales-fields">
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="valor-plan">Valor mensual (COP)</label>
                <input id="valor-plan" className="prop-field__input" aria-label="Valor mensual (COP)" placeholder="Ej: 90.000" value={valorPlan} onChange={e => { const cleaned = cleanPrice(e.target.value); setValorPlan(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="dia-actual">Día de facturación actual</label>
                <input id="dia-actual" className="prop-field__input" aria-label="Día de facturación actual" placeholder="Ej: 1" value={diaActual} onChange={e => setDiaActual(e.target.value)} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="nuevo-dia">Nuevo día de facturación</label>
                <input id="nuevo-dia" className="prop-field__input" aria-label="Nuevo día de facturación" placeholder="Ej: 17" value={nuevoDia} onChange={e => setNuevoDia(e.target.value)} inputMode="numeric" disabled={submitting} />
              </div>
            </div>
          </div>
        )}

        {/* Form Card: Cambio de ciclo — Móvil */}
        {tab === 'ciclo' && service === 'movil' && (
          <div className="proporcionales-card">
            <div className="proporcionales-fields">
              <div className="prop-field prop-field--full">
                <label className="prop-field__label" htmlFor="valor-plan-m">Valor mensual (COP)</label>
                <input id="valor-plan-m" className="prop-field__input" aria-label="Valor mensual (COP)" placeholder="Ej: 90.000" value={valorPlan} onChange={e => { const cleaned = cleanPrice(e.target.value); setValorPlan(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field prop-field--full">
                <label className="prop-field__label" htmlFor="region-select">Región</label>
                <select id="region-select" className="prop-field__select" aria-label={`Región seleccionada: ${region || 'ninguna'}`} value={region} onChange={e => { setRegion(e.target.value); setDiaActual(''); setNuevoDia(''); }} disabled={submitting}>
                  <option value="">Selecciona región…</option>
                  {['Oriente','Occidente','Costa'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="dia-ciclo-actual">Día de ciclo actual</label>
                <select id="dia-ciclo-actual" className="prop-field__select" aria-label="Día de ciclo actual" value={diaActual} onChange={e => setDiaActual(e.target.value)} disabled={submitting || !region}>
                  <option value="">—</option>
                  {region && MOBILE_REGION_DAYS[region]?.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="prop-field__hint">Día válido según la política de la región.</span>
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="nuevo-dia-ciclo">Nuevo día de ciclo</label>
                <select id="nuevo-dia-ciclo" className="prop-field__select" aria-label="Nuevo día de ciclo" value={nuevoDia} onChange={e => setNuevoDia(e.target.value)} disabled={submitting || !region}>
                  <option value="">—</option>
                  {region && MOBILE_REGION_DAYS[region]?.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <span className="prop-field__hint">Día válido según la política de la región.</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Card: Cambio inmediato */}
        {tab === 'inmediato' && (
          <div className="proporcionales-card">
            <div className="proporcionales-fields">
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="plan-actual">Valor plan actual (COP)</label>
                <input id="plan-actual" className="prop-field__input" aria-label="Valor plan actual (COP)" placeholder="Ej: 38.900" value={planActual} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanActual(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="plan-nuevo">Valor plan nuevo (COP)</label>
                <input id="plan-nuevo" className="prop-field__input" aria-label="Valor plan nuevo (COP)" placeholder="Ej: 54.900" value={planNuevo} onChange={e => { const cleaned = cleanPrice(e.target.value); setPlanNuevo(cleaned ? formatNumber(Number(cleaned)) : ''); }} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="dia-corte">Día de corte</label>
                <input id="dia-corte" className="prop-field__input" aria-label="Día de corte" placeholder="Ej: 1" value={diaCorte} onChange={e => setDiaCorte(e.target.value)} inputMode="numeric" disabled={submitting} />
              </div>
              <div className="prop-field">
                <label className="prop-field__label" htmlFor="dia-cambio">Día del cambio</label>
                <input id="dia-cambio" className="prop-field__input" aria-label="Día del cambio" placeholder="Ej: 21" value={diaCambio} onChange={e => setDiaCambio(e.target.value)} inputMode="numeric" disabled={submitting} />
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="proporcionales-calculate">
          <button className="calculate-btn" onClick={handleCalcular} disabled={!canCalculate}>
            {submitting ? 'Calculando…' : 'Calcular'}
          </button>
        </div>

        {/* Results Card */}
        <div role="region" aria-live="polite">
          <div className="proporcionales-result">
            <h3 className="result-title">
              📊 {tab === 'ciclo' ? 'Resultado — Cambio de ciclo' : 'Resultado — Cambio inmediato'}
            </h3>

            {errorMsg && (
              <div className="result-error">{errorMsg}</div>
            )}

            {!errorMsg && !resCiclo && !resInmediato && (
              <div className="result-empty">Calcula para ver el resultado aquí.</div>
            )}

            {tab === 'ciclo' && resCiclo && (
              <div>
                <div className="result-value">Cobro proporcional: {formatCOP(resCiclo.cargo)}</div>
                {!errorMsg && (
                  <p className="result-explanation">
                    {Number.isFinite(resCiclo.diasProrrateo)
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
                <div className="result-total">
                  {resCiclo.totalFactura === 0 ? (
                    <div className="result-total__desc">{resCiclo.descripcion}</div>
                  ) : (
                    <>
                      <div className="result-total__value">Total estimado de la próxima factura: {formatCOP(resCiclo.totalFactura)}</div>
                      <div className="result-total__desc">{resCiclo.descripcion}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tab === 'inmediato' && resInmediato && (
              <div>
                <div className="result-value">Cargo proporcional del mes: {formatCOP(resInmediato.cargo)}</div>
                {!errorMsg && (
                  <p className="result-explanation">
                    {(Number.isFinite(resInmediato.diasConsumidos) && Number.isFinite(resInmediato.diasRestantes))
                      ? (
                        <>En tu próxima factura verás una sola vez un cargo de {formatCOP(resInmediato.cargo)}. Reconoce lo que ya usaste con tu plan anterior ({resInmediato.diasConsumidos} días) y lo que falta del mes con tu plan nuevo ({resInmediato.diasRestantes} días). Después de este ajuste, seguirás pagando únicamente el valor mensual de tu plan vigente.</>
                      ) : (
                        <>Este ajuste aparecerá una sola vez en la próxima factura. Corresponde al periodo de transición entre ciclos/planes de este mes.</>
                      )}
                  </p>
                )}
                <div className="result-total">
                  {resInmediato.totalFactura === 0 ? (
                    <div className="result-total__desc">{resInmediato.descripcion}</div>
                  ) : (
                    <>
                      <div className="result-total__value">Total estimado de la próxima factura: {formatCOP(resInmediato.totalFactura)}</div>
                      <div className="result-total__desc">{resInmediato.descripcion}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProporcionalesPage;


