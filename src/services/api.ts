// src/services/api.ts
// Funciones para consumir el backend Express de tarifas, guiones y complementos

const BASE_URL = 'http://localhost:3000/api';

export async function getTarifas() {
  const res = await fetch(`${BASE_URL}/tarifas`);
  if (!res.ok) throw new Error('Error al obtener tarifas');
  return await res.json();
}

export async function getGuiones() {
  const res = await fetch(`${BASE_URL}/guiones`);
  if (!res.ok) throw new Error('Error al obtener guiones');
  return await res.json();
}

export async function getComplementos() {
  const res = await fetch(`${BASE_URL}/complementos`);
  if (!res.ok) throw new Error('Error al obtener complementos');
  return await res.json();
}
