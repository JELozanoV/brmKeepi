import { ClientMoodType } from '../types';

interface MoodRecommendation {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const getMoodRecommendation = (mood: ClientMoodType): MoodRecommendation => {
  switch (mood) {
    case 'feliz':
      return {
        title: 'Cliente Feliz',
        message: 'Mantén la energía positiva. Aprovecha para ofrecer servicios adicionales que puedan mejorar su experiencia.',
        type: 'success'
      };
    case 'neutral':
      return {
        title: 'Cliente Neutral',
        message: 'Sé claro y directo. Enfócate en los beneficios concretos de las soluciones que ofreces.',
        type: 'info'
      };
    case 'molesto':
      return {
        title: 'Cliente Molesto',
        message: 'Mantén la calma, escucha activamente y ofrece soluciones claras. Reconoce su frustración y muestra empatía.',
        type: 'warning'
      };
    case 'triste':
      return {
        title: 'Cliente Triste',
        message: 'Muestra empatía y comprensión. Habla con un tono cálido y asegúrale que encontrarán una solución juntos.',
        type: 'info'
      };
    case 'satisfecho':
      return {
        title: 'Cliente Satisfecho',
        message: 'Refuerza su satisfacción. Es un buen momento para agradecer su lealtad y mencionar programas de fidelización.',
        type: 'success'
      };
    default:
      return {
        title: 'Recomendación General',
        message: 'Escucha atentamente las necesidades del cliente y ofrece soluciones personalizadas.',
        type: 'info'
      };
  }
};
