import React from 'react';

export interface ScriptLine {
  text: string;
  type?: 'empathy' | 'solution' | 'benefit' | 'closing';
}

/**
 * @component ScriptSection
 * @description Componente que renderiza un guión de atención estructurado
 * 
 * @example
 * ```tsx
 * <ScriptSection
 *   title="Guión de Retención"
 *   lines={[
 *     { text: "Entiendo su preocupación", type: "empathy" },
 *     { text: "Podemos ofrecerle...", type: "solution" }
 *   ]}
 * />
 * ```
 */
interface ScriptSectionProps {
  /** Título del guión */
  title: string;
  /** Array de líneas del guión */
  lines: ScriptLine[];
}

const ScriptSection: React.FC<ScriptSectionProps> = ({ title, lines }) => (
  <div className="script-section">
    <div className="script-card">
      <h3>{title}</h3>
      <div className="script-text">
        {lines.map((line, index) => (
          <p key={index} className={`solution-line ${line.type || ''}`}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default ScriptSection; 