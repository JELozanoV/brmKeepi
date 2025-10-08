import { RankingDataset } from '../types/ranking';
import { CURRENT_USER } from '../config/constants';

// TODO back: reemplazar por fetch('/api/ranking?timeframe=...')
export async function fetchRankingMock(timeframe: 'today'|'week'|'month'): Promise<RankingDataset> {
  await new Promise(r => setTimeout(r, 80));
  const currentUserId = CURRENT_USER.id;

  // Nombres comunes para generar datos mock realistas
  const firstNames = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Diego', 'Carmen', 'Alejandro', 'Isabella', 'Miguel', 'Sofia', 'David', 'Valentina', 'José', 'Camila', 'Andrés', 'Lucía', 'Fernando', 'Martina'];
  const lastNames = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Martín', 'Ruiz', 'Hernández', 'Jiménez', 'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres'];

  // Coordinadores para los equipos
  const coordinators = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6', 'c-7', 'c-8', 'c-9', 'c-10', 'c-11', 'c-12', 'c-13'];

  // Generar 300 participantes para la operación completa
  const participants = [];
  const currentUserCoordinator = CURRENT_USER.coordinatorId;

  // Crear usuario actual con métricas excelentes para posición 3 de 300
  participants.push({
    id: currentUserId,
    name: CURRENT_USER.displayName || 'Asesor',
    coordinatorId: currentUserCoordinator,
    tmoSec: 350, // Excelente TMO (mejor que el 97% de los asesores)
    transfersPct: 12, // Muy baja transferencia (mejor que el 95% de los asesores)
    npsPct: 96 // Alto NPS (mejor que el 90% de los asesores)
  });

  // Crear 2 participantes mejores que el usuario actual (posición 1 y 2)
  participants.push({
    id: 'top-1',
    name: 'Carolina M.',
    coordinatorId: 'c-1',
    tmoSec: 320, // Mejor TMO
    transfersPct: 8, // Mejor transferencia
    npsPct: 98 // Mejor NPS
  });

  participants.push({
    id: 'top-2',
    name: 'Roberto L.',
    coordinatorId: 'c-2',
    tmoSec: 335, // Segundo mejor TMO
    transfersPct: 10, // Segunda mejor transferencia
    npsPct: 97 // Segundo mejor NPS
  });

  // Crear otros 297 participantes con métricas variadas pero peores que el usuario
  for (let i = 4; i <= 300; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const coordinatorId = coordinators[Math.floor(Math.random() * coordinators.length)];

    // Generar métricas realistas pero generalmente peores que el usuario actual
    const tmoSec = 380 + Math.floor(Math.random() * 220); // 380-600 seg (peor que 350)
    const transfersPct = 18 + Math.floor(Math.random() * 42); // 18-60% (peor que 12%)
    const npsPct = 70 + Math.floor(Math.random() * 25); // 70-95% (peor que 96%)

    participants.push({
      id: `p-${i}`,
      name,
      coordinatorId,
      tmoSec,
      transfersPct,
      npsPct
    });
  }

  // Asegurar que haya exactamente 24 participantes en el equipo del usuario
  const teamParticipants = participants.filter(p => p.coordinatorId === currentUserCoordinator);
  if (teamParticipants.length < 24) {
    // Agregar participantes al equipo del usuario hasta llegar a 24
    const needed = 24 - teamParticipants.length;
    for (let i = 1; i <= needed; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;

      participants.push({
        id: `team-${currentUserCoordinator}-${i}`,
        name,
        coordinatorId: currentUserCoordinator,
        tmoSec: 360 + Math.floor(Math.random() * 100), // Peor que el usuario pero realista
        transfersPct: 20 + Math.floor(Math.random() * 30), // Peor que el usuario pero realista
        npsPct: 85 + Math.floor(Math.random() * 10) // Peor que el usuario pero realista
      });
    }
  }

  return { timeframe, currentUserId, participants };
}


