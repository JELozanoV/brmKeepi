import React, { useMemo } from 'react';
import { Range } from '../../types/profile';
import { KPI_TARGETS, EXPECTED_CALLS, EXPECTED_SURVEYS, GOALS_WARN_THRESHOLD } from '../../config/constants';
import { computeKpiStatus } from '../../utils/kpiStatus';

function round1(n: number): number { return Math.round(n * 10) / 10; }

type CoachInput = {
  range: Range;
  callsHandled: number;
  totalHandleTimeSec: number;
  transfers: number;
  npsPct: number; // porcentaje entero 0-100
};

type CoachResult = {
  tmo: { gapText: string; requiredText: string };
  transfers: { gapText: string; requiredText: string };
  nps: { gapText: string; requiredText: string };
};

type CoachStatus = {
  tmo: 'good' | 'warn' | 'bad';
  transfers: 'good' | 'warn' | 'bad';
  nps: 'good' | 'warn' | 'bad';
};

function computeCoach({ range, callsHandled, totalHandleTimeSec, transfers, npsPct }: CoachInput): { result: CoachResult; status: CoachStatus; context: { tmoActualSec: number; transfersPct: number; npsPct: number; targets: typeof KPI_TARGETS; n: number; N: number; remaining: number } } {
  const targets = KPI_TARGETS;
  const N = EXPECTED_CALLS[range];
  const n = callsHandled || 0;

  const tmoActualSec = n ? totalHandleTimeSec / n : 0;
  const transfersPct = n ? (transfers / n) * 100 : 0;

  // Nivel 2 (si hay remanente)
  const remaining = Math.max(0, N - n);
  const result: CoachResult = {
    tmo: { gapText: '', requiredText: '' },
    transfers: { gapText: '', requiredText: '' },
    nps: { gapText: '', requiredText: '' },
  };

  // Funciones auxiliares para mensajes de coaching
  const getTimeframeText = () => range === 'today' ? 'hoy' : range === 'week' ? 'esta semana' : 'este mes';

  const getVolumeContext = () => {
    if (range === 'today') {
      return `Recuerda que el promedio esperado es de 40 llamadas al día.`;
    } else if (range === 'week') {
      return `Esta semana laboral (6 días) esperas manejar alrededor de 240 llamadas.`;
    } else if (range === 'month') {
      return `Este mes laboral esperas manejar alrededor de 1.032 llamadas.`;
    }
    return '';
  };

  // TMO - Mensajes mejorados y más accionables
  const tmoActualMin = Math.floor(tmoActualSec / 60);
  const tmoTargetMin = Math.floor(targets.tmoSec / 60);
  const gapTmoSec = tmoActualSec - targets.tmoSec;

  if (gapTmoSec <= 0) {
    // Está cumpliendo o mejorando la meta
    const improvement = gapTmoSec < 0 ? `¡Estás ${Math.floor(Math.abs(gapTmoSec) / 60)} minutos por debajo de la meta! ` : '';
    result.tmo.gapText = `${improvement}Estás manejando cada llamada en promedio ${tmoActualMin} minutos, cuando la meta es ${tmoTargetMin} minutos. ¡Excelente ritmo!`;

    if (remaining > 0) {
      const totalTimeNeeded = targets.tmoSec * N;
      const currentTotalTime = totalHandleTimeSec;
      const remainingTimeBudget = Math.max(0, totalTimeNeeded - currentTotalTime);

      if (remainingTimeBudget <= 0) {
        result.tmo.requiredText = `¡Excelente! Ya has alcanzado el tiempo total esperado ${getTimeframeText()}. Mantén tu eficiencia y calidad de servicio. ${getVolumeContext()}`;
      } else {
        const neededSec = remainingTimeBudget / remaining;
        const neededMin = Math.floor(neededSec / 60);
        result.tmo.requiredText = `Para mantener este excelente rendimiento, procura no exceder ${neededMin} minutos por llamada en las próximas ${remaining} llamadas. ${getVolumeContext()}`;
      }
    } else {
      result.tmo.requiredText = `¡Perfecto! Has cumplido la meta de tiempo de manejo ${getTimeframeText()}. Mantén este ritmo eficiente.`;
    }
  } else {
    // Está sobre la meta
    result.tmo.gapText = `Estás tardando ${tmoActualMin} minutos promedio por llamada, cuando la meta es ${tmoTargetMin} minutos. Necesitas ser más eficiente.`;

    if (remaining > 0) {
      const neededSec = Math.max(0, (targets.tmoSec * N - totalHandleTimeSec) / remaining);
      const neededMin = Math.floor(neededSec / 60);
      result.tmo.requiredText = `Para recuperar, debes bajar a máximo ${neededMin} minutos por llamada en las próximas ${remaining} llamadas. Consejo: identifica los puntos donde puedes ser más directo y reduce las pausas innecesarias.`;
    } else {
      result.tmo.requiredText = `Necesitas mejorar tu eficiencia en el manejo de llamadas. Para la próxima jornada, enfócate en ser más directo y reducir tiempos muertos.`;
    }
  }

  // Transferencias - Mensajes mejorados
  if (transfersPct <= targets.transfersPct) {
    // Está cumpliendo o mejorando la meta
    const improvement = transfersPct < targets.transfersPct ? `¡Estás ${Math.floor(targets.transfersPct - transfersPct)} puntos por debajo de la meta! ` : '';
    result.transfers.gapText = `${improvement}Solo has transferido el ${round1(transfersPct)}% de tus llamadas, cuando la meta es máximo ${targets.transfersPct}%. ¡Estás resolviendo muy bien!`;

    if (remaining > 0) {
      const maxAllowedTotal = (targets.transfersPct / 100) * N;
      const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);

      if (remainingAllowed <= 0) {
        result.transfers.requiredText = `¡Excelente! Ya alcanzaste el límite óptimo de transferencias ${getTimeframeText()}. Sigue resolviendo directamente con los clientes. Mantén tu enfoque en brindar soluciones completas.`;
      } else {
        const allowedCount = Math.max(0, Math.floor(remainingAllowed));
        result.transfers.requiredText = `Puedes transferir hasta ${allowedCount} llamadas más (${Math.round((remainingAllowed/remaining)*100)}% de las restantes). Mantén tu enfoque en resolver directamente con el cliente.`;
      }
    } else {
      result.transfers.requiredText = `¡Excelente trabajo! Has mantenido las transferencias muy bajas ${getTimeframeText()}. Sigue resolviendo directamente.`;
    }
  } else {
    // Está sobre la meta
    result.transfers.gapText = `Has transferido el ${round1(transfersPct)}% de tus llamadas, cuando la meta es máximo ${targets.transfersPct}%. Necesitas reducir las transferencias.`;

    if (remaining > 0) {
      const maxAllowedTotal = (targets.transfersPct / 100) * N;
      const remainingAllowed = Math.max(0, maxAllowedTotal - transfers);
      const allowedCount = Math.max(0, Math.floor(remainingAllowed));
      const allowedPct = remaining > 0 ? Math.round((remainingAllowed / remaining) * 100) : 0;
      result.transfers.requiredText = `Solo puedes transferir máximo ${allowedCount} llamadas más (${allowedPct}% de las restantes). Consejo: antes de transferir, intenta una solución rápida o consulta con un compañero cercano.`;
    } else {
      result.transfers.requiredText = `Necesitas reducir las transferencias para la próxima jornada. Recuerda: siempre intenta resolver directamente primero.`;
    }
  }

  // NPS - Mensajes mejorados con contexto de encuestas
  const expectedSurveysTotal = EXPECTED_SURVEYS[range];
  const currentSurveys = Math.floor((npsPct / 100) * n); // Estimado basado en llamadas manejadas
  const neededSurveys = expectedSurveysTotal - currentSurveys;

  if (npsPct >= targets.npsPct) {
    // Está cumpliendo o mejorando la meta
    const improvement = npsPct > targets.npsPct ? `¡Estás ${Math.floor(npsPct - targets.npsPct)} puntos por encima de la meta! ` : '';
    result.nps.gapText = `${improvement}Tu NPS es del ${round1(npsPct)}%, cuando la meta es ${targets.npsPct}%. ¡Los clientes están muy satisfechos contigo!`;

    if (remaining > 0) {
      // Si ya excedió las encuestas esperadas, dar mensaje motivacional sin números negativos
      if (neededSurveys <= 0) {
        result.nps.requiredText = `¡Excelente! Ya superaste las encuestas esperadas ${getTimeframeText()}. Mantén tu calidad de servicio y sigue enfocándote en la satisfacción del cliente. Consejo: enfócate en el cierre positivo y pregunta "¿Cómo te sientes con la solución?"`;
      } else {
        const neededPositive = Math.ceil(neededSurveys * 0.6);
        result.nps.requiredText = `Para mantener este excelente nivel, necesitas ${neededPositive} respuestas positivas más de ${neededSurveys} encuestas restantes (mantén mínimo 2.5 promotores por cada detractor). Consejo: enfócate en el cierre positivo y pregunta "¿Cómo te sientes con la solución?"`;
      }
    } else {
      result.nps.requiredText = `¡Felicitaciones! Has mantenido un NPS excelente ${getTimeframeText()}. Los clientes reconocen tu buen trabajo.`;
    }
  } else {
    // Está bajo la meta
    result.nps.gapText = `Tu NPS es del ${round1(npsPct)}%, cuando la meta es ${targets.npsPct}%. Necesitas mejorar la satisfacción del cliente.`;

    if (remaining > 0) {
      const neededPosRate = Math.max(0.6, ((targets.npsPct / 100) * N - (npsPct / 100) * n) / remaining);
      const neededPct = Math.max(0, Math.min(1, neededPosRate)) * 100;
      const minPromoters = Math.ceil(neededSurveys * 0.4); // Mínimo 40% promotores para mantener 2.5:1 ratio

      result.nps.requiredText = `Necesitas que al menos el ${round1(neededPct)}% de tus próximas ${neededSurveys} encuestas sean positivas (mínimo ${minPromoters} promotores para mantener la proporción 2.5:1). Consejo: mejora tu tono de voz, sé más empático y asegúrate de que el cliente entienda completamente la solución.`;
    } else {
      result.nps.requiredText = `Para mejorar tu NPS, enfócate en ser más empático, explica mejor las soluciones y termina siempre preguntando si el cliente quedó satisfecho.`;
    }
  }

  // Semáforo simple para el bloque (agrega una clase para borde/fondo)
  const status = {
    tmo: tmoActualSec <= targets.tmoSec ? 'good' : (tmoActualSec <= targets.tmoSec * (1 + GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
    transfers: transfersPct <= targets.transfersPct ? 'good' : (transfersPct <= targets.transfersPct * (1 + GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
    nps: npsPct >= targets.npsPct ? 'good' : (npsPct >= targets.npsPct * (1 - GOALS_WARN_THRESHOLD) ? 'warn' : 'bad'),
  } as const;

  return { result, status, context: { tmoActualSec, transfersPct, npsPct, targets, n, N, remaining } };
}

export interface KpiCoachProps {
  range: Range;
  callsHandled: number;
  totalHandleTimeSec: number;
  transfers: number;
  npsPct: number;
  vm?: {
    tmo: ReturnType<typeof computeKpiStatus>;
    transfers: ReturnType<typeof computeKpiStatus>;
    nps: ReturnType<typeof computeKpiStatus>;
  };
}

const KpiCoach: React.FC<KpiCoachProps> = (props) => {
  const { result, status, context } = useMemo(() => computeCoach(props), [props]);
  const tmoStatus = props.vm ? props.vm.tmo : computeKpiStatus('tmo', context?.tmoActualSec || 0, KPI_TARGETS.tmoSec);
  const transStatus = props.vm ? props.vm.transfers : computeKpiStatus('transfers', context?.transfersPct || 0, KPI_TARGETS.transfersPct);
  const npsStatus = props.vm ? props.vm.nps : computeKpiStatus('nps', context?.npsPct || 0, KPI_TARGETS.npsPct);

  const toClass = (s: string) => (s === 'ok' ? 'good' : s);
  return (
    <section className="op-card" style={{ marginTop: '1rem' }} aria-label="KpiCoach">
      <div className="card-title">KpiCoach</div>
      <div className="kpi-coach-grid">
        <div className={`kpi-coach-item kpi-${toClass(tmoStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(tmoStatus.status)}`}>{tmoStatus.chipText}</span>
          <div className="kpi-subtle">TMO</div>
          <div>{result.tmo.gapText}</div>
          <div>{result.tmo.requiredText}</div>
        </div>
        <div className={`kpi-coach-item kpi-${toClass(transStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(transStatus.status)}`}>{transStatus.chipText}</span>
          <div className="kpi-subtle">Transferencia</div>
          <div>{result.transfers.gapText}</div>
          <div>{result.transfers.requiredText}</div>
        </div>
        <div className={`kpi-coach-item kpi-${toClass(npsStatus.status)}`}>
          <span className={`kpi-chip kpi-chip-${toClass(npsStatus.status)}`}>{npsStatus.chipText}</span>
          <div className="kpi-subtle">NPS</div>
          <div>{result.nps.gapText}</div>
          <div>{result.nps.requiredText}</div>
        </div>
      </div>
    </section>
  );
};

export default KpiCoach;


