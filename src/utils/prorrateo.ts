// Utilidades puras para cálculos de prorrateo (preparadas para migrar a backend)

export type ProrrateoMetodo = '30' | 'reales';

export interface CambioDeCicloInput {
  valorPlan: number; // COP/mes
  diaActual: number; // 1..31
  nuevoDia: number; // 1..31
  base?: number; // 30 o días reales
}

export interface CambioDeCicloOutput {
  diasProrrateo: number;
  cargoProporcional: number; // COP
}

export interface CambioPlanInmediatoInput {
  planActual: number; // COP/mes
  planNuevo: number; // COP/mes
  diaCorte: number; // 1..31
  diaCambio: number; // 1..31, debe ser >= diaCorte en el mismo mes
  base?: number; // 30 o días reales
}

export interface CambioPlanInmediatoOutput {
  diasConsumidos: number;
  diasRestantes: number;
  cargoProporcional: number; // COP
  comparativos: {
    mensualAnterior: number; // planActual
    diferencia: number; // cargoProporcional - mensualAnterior
  };
}

function assertPositiveNumber(value: number, name: string) {
  if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
    throw new Error(`${name} debe ser un número positivo`);
  }
}

function assertDia(value: number, name: string) {
  if (!Number.isFinite(value) || value < 1 || value > 31) {
    throw new Error(`${name} debe estar entre 1 y 31`);
  }
}

function roundToCents(value: number): number {
  // Redondeo a 2 decimales para coincidir con ejemplos tipo 44.233,33
  return Math.round(value * 100) / 100;
}

export function calcularCambioDeCiclo(input: CambioDeCicloInput): CambioDeCicloOutput {
  const { valorPlan, diaActual, nuevoDia } = input;
  const base = input.base ?? 30; // por defecto 30 días (como el Excel)

  assertPositiveNumber(valorPlan, 'Valor del plan mensual');
  assertDia(diaActual, 'Día de facturación actual');
  assertDia(nuevoDia, 'Nuevo día de facturación');
  assertPositiveNumber(base, 'Base de prorrateo');

  let diasProrrateo = nuevoDia - diaActual;
  if (diasProrrateo <= 0) diasProrrateo += base;

  const cargoProporcional = roundToCents(valorPlan * (diasProrrateo / base));

  return { diasProrrateo, cargoProporcional };
}

export function calcularCambioPlanInmediato(input: CambioPlanInmediatoInput): CambioPlanInmediatoOutput {
  const { planActual, planNuevo, diaCorte, diaCambio } = input;
  const base = input.base ?? 30; // por defecto 30 días

  assertPositiveNumber(planActual, 'Valor del plan actual');
  assertPositiveNumber(planNuevo, 'Valor del nuevo plan');
  // Validaciones de rango únicamente (1..31)
  assertDia(diaCorte, 'El día de corte');
  assertDia(diaCambio, 'El día del cambio');
  assertPositiveNumber(base, 'Base de prorrateo');

  // Cálculo con wrap del ciclo vigente
  // c = diaCorte, d = diaCambio, B = base
  const c = diaCorte;
  const d = diaCambio;
  let diasConsumidos = 0;
  if (d >= c) {
    diasConsumidos = d - c;
  } else {
    diasConsumidos = (base - c) + d;
  }
  const diasRestantes = base - diasConsumidos;

  const cargoProporcional = roundToCents(
    (planActual * diasConsumidos) / base + (planNuevo * diasRestantes) / base
  );

  const mensualAnterior = planActual;
  const diferencia = roundToCents(cargoProporcional - mensualAnterior);

  return {
    diasConsumidos,
    diasRestantes,
    cargoProporcional,
    comparativos: { mensualAnterior, diferencia },
  };
}

export function formatCOP(value: number): string {
  // Si prácticamente es entero, muestra sin decimales; si no, muestra 2 decimales
  const isInt = Math.abs(value - Math.round(value)) < 0.005;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2,
  }).format(value);
}


