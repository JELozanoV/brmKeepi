import React, { useEffect, useState } from 'react';
import { getGuiones } from '../../services/api';
import ScriptSection, { ScriptLine } from './sections/ScriptSection';

interface BackendGuion {
  id: number;
  serviceId: number;
  title: string;
  content: string;
  reason: string;
  keywords: string[];
  isActive: boolean;
}

const DynamicScriptSection: React.FC = () => {
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGuiones()
      .then((data: BackendGuion[]) => {
        // Filtrar guiones activos con motivo de cancelación (que es lo más cercano a 'costo' en los datos reales)
        const guionesCosto = data.filter(g => g.isActive && g.reason && 
          (g.reason.toLowerCase().includes('cancelacion') || 
           g.reason.toLowerCase().includes('costo') ||
           g.reason.toLowerCase().includes('precio')));
        
        console.log('Guiones disponibles:', guionesCosto); // Para depuración
        
        if (guionesCosto.length > 0) {
          const randomGuion = guionesCosto[Math.floor(Math.random() * guionesCosto.length)];
          
          // Usar el contenido del guion y dividirlo en oraciones para mejor legibilidad
          const content = randomGuion.content || '';
          // Dividir por oraciones terminadas en punto, signo de interrogación o exclamación
          const lines: ScriptLine[] = content
            .split(/(?<=[.!?])\s+/)
            .filter(line => line.trim() !== '')
            .map((line: string, index: number, array: string[]) => {
              // Solo usar tipos válidos definidos en ScriptLine
              let type: 'empathy' | 'solution' | 'benefit' | 'closing' | undefined;
              
              if (index === 0) type = 'empathy';
              else if (index === array.length - 1) type = 'closing';
              else if (index % 2 === 0) type = 'solution';
              else type = 'benefit';
              
              return {
                text: line.trim(),
                type
              };
            });
          
          setScriptLines(lines);
        } else {
          setError('No hay guiones disponibles para mostrar');
        }
        
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los guiones');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando guión recomendado...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (scriptLines.length === 0) return <div>No hay guiones disponibles</div>;

  return (
    <ScriptSection 
      title="Guión de Retención" 
      lines={scriptLines} 
    />
  );
};

export default DynamicScriptSection;
