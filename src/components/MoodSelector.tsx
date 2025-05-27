import React, { useState } from 'react';
import { ClientMoodType } from '../types';
import './MoodSelector.scss';

interface MoodOption {
  value: ClientMoodType;
  emoji: string;
  label: string;
}

interface Props {
  onSelect: (mood: ClientMoodType) => void;
  initialMood?: ClientMoodType;
}

const MoodSelector: React.FC<Props> = ({ onSelect, initialMood = null }) => {
  const [selectedMood, setSelectedMood] = useState<ClientMoodType>(initialMood);

  const moodOptions: MoodOption[] = [
    { value: 'feliz', emoji: '😊', label: 'Feliz' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'molesto', emoji: '😠', label: 'Molesto' },
    { value: 'triste', emoji: '😢', label: 'Triste' },
    { value: 'satisfecho', emoji: '😍', label: 'Satisfecho' },
  ];

  const handleMoodSelect = (mood: ClientMoodType) => {
    setSelectedMood(mood);
    onSelect(mood);
  };

  return (
    <div className="selector-container mood-selector">
      <h2 className="section-title">¿Cuál es el estado de ánimo del cliente?</h2>
      <p className="description">
        Selecciona la emoción que mejor representa cómo se siente el cliente durante la llamada.
      </p>

      <div className="mood-options-container">
        {moodOptions.map((option) => (
          <button
            key={option.value}
            className={`mood-option ${selectedMood === option.value ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(option.value)}
            aria-label={`Estado de ánimo: ${option.label}`}
          >
            <span className="mood-emoji">{option.emoji}</span>
            <span className="mood-label">{option.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-selected-message">
          <p>Has seleccionado: <strong>{moodOptions.find(option => option.value === selectedMood)?.label}</strong></p>
          <p className="mood-tip">
            {selectedMood === 'feliz' && 'El cliente está contento. Aprovecha para reforzar los beneficios del servicio.'}
            {selectedMood === 'neutral' && 'El cliente está receptivo. Enfócate en destacar el valor del servicio.'}
            {selectedMood === 'molesto' && 'El cliente está irritado. Mantén la calma y muestra empatía con su situación.'}
            {selectedMood === 'triste' && 'El cliente está desanimado. Ofrece soluciones concretas y muestra comprensión.'}
            {selectedMood === 'satisfecho' && 'El cliente está muy contento. Excelente momento para ofrecer servicios adicionales.'}
          </p>
        </div>
      )}

      {selectedMood && (
        <button 
          className="continue-button"
          onClick={() => onSelect(selectedMood)}
        >
          Continuar
          <span className="arrow-icon">→</span>
        </button>
      )}
    </div>
  );
};

export default MoodSelector;
