// Stub de servicio para futura integración con backend
// POST /api/prorrateo/simular (no implementado aún)

import { calcularCambioDeCiclo, calcularCambioPlanInmediato, CambioDeCicloInput, CambioPlanInmediatoInput } from '../utils/prorrateo';

export async function simularCambioDeCicloLocal(input: CambioDeCicloInput) {
  return calcularCambioDeCiclo(input);
}

export async function simularCambioPlanInmediatoLocal(input: CambioPlanInmediatoInput) {
  return calcularCambioPlanInmediato(input);
}

// En el futuro:
// export async function simularCambioDeCiclo(input: CambioDeCicloInput) { ...fetch hacia backend... }
// export async function simularCambioPlanInmediato(input: CambioPlanInmediatoInput) { ... }


