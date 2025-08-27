import React, { useMemo, useState } from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection } from './sections';
import Modal from '../common/Modal';
import Toast from '../Toast/Toast';
import { ALL_SCRIPTS, getRandomScript, ScriptStep } from '../../data/scriptsColgaron';
import { copyText } from '../../utils/clipboard';

interface Props {
  onApplySolution: () => void;
}

// Mapear tipos de guion mock a tipos del ScriptSection
const mapLineType = (t: ScriptStep['type']): 'empathy' | 'solution' | 'benefit' | 'closing' | 'action' => {
  switch (t) {
    case 'empatia':
      return 'empathy';
    case 'accion':
      return 'action';
    case 'oferta':
      return 'benefit';
    case 'cierre':
    default:
      return 'closing';
  }
};

const buildScriptText = (script: ScriptStep[]): string => {
  const typeLabel: Record<ScriptStep['type'], string> = {
    empatia: 'Empatía',
    accion: 'Acción',
    oferta: 'Oferta/Alternativa',
    cierre: 'Cierre'
  };
  return script
    .map((s, idx) => `${idx + 1}. [${typeLabel[s.type]}] ${s.text}`)
    .join('\n');
};

const HogarColgaronSolution: React.FC<Props> = ({ onApplySolution }) => {
  const [currentScript, setCurrentScript] = useState<ScriptStep[]>(() => getRandomScript());
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  // Modal Programar devolución (24h)
  const [openSchedule, setOpenSchedule] = useState(false);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const lines = useMemo(
    () =>
      currentScript.map(s => ({
        text: s.text,
        type: mapLineType(s.type)
      })),
    [currentScript]
  );

  const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'success') => {
    setToastMsg(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleChangeScript = () => {
    // Elegir un guion diferente al actual
    const options = ALL_SCRIPTS.filter(g => g !== currentScript);
    const next = options.length ? options[Math.floor(Math.random() * options.length)] : getRandomScript();
    setCurrentScript(next);
  };

  const handleCopyScript = async () => {
    const ok = await copyText(buildScriptText(currentScript));
    notify(ok ? 'Guion copiado al portapapeles' : 'No se pudo copiar el guion', ok ? 'success' : 'error');
  };

  const handleCopyGTC = async () => {
    const text = `Marcación GTC — "Llamada colgada"\n\nResumen: Cliente indica que en el contacto anterior se cortó la llamada. Se ofrece retomar gestión, priorizando solución en primer contacto.\nAcción del asesor: Revisión de cuenta en RR, se brinda alternativa y se registra marcación correspondiente.\nObservación: Usar GTC solo cuando aplique según lineamientos.`;
    const ok = await copyText(text);
    notify(ok ? 'Marcación GTC copiada (usa solo si aplica)' : 'No se pudo copiar la marcación GTC', ok ? 'success' : 'error');
  };

  const handleCopyCANICS = async () => {
    const text = `Marcación CAN ICS — Retención aceptada\nServicio: Hogar\nMotivo original: Llamada colgada\nDetalle: Cliente acepta alternativa propuesta. Se deja constancia y seguimiento.`;
    const ok = await copyText(text);
    notify(ok ? 'Marcación CAN ICS copiada' : 'No se pudo copiar la marcación CAN ICS', ok ? 'success' : 'error');
  };

  const handleOpenSchedule = () => setOpenSchedule(true);
  const handleCloseSchedule = () => setOpenSchedule(false);

  const handleCopySchedule = async () => {
    if (!date || !time) {
      notify('Selecciona fecha y hora para la devolución', 'warning');
      return;
    }
    const text = `Programación devolución (24h) — Marcación: Llamada colgada\nFecha: ${date}\nHora: ${time}\nNotas: ${notes || 'N/A'}`;
    const ok = await copyText(text);
    notify(ok ? 'Programación copiada al portapapeles' : 'No se pudo copiar la programación', ok ? 'success' : 'error');
    if (ok) {
      setOpenSchedule(false);
      // reset optional
      // setDate(''); setTime(''); setNotes('');
    }
  };

  const sections = [
    {
      id: 1,
      icon: '📝',
      title: 'Guion — Llamada colgada',
      content: (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={handleCopyScript}
              aria-label="Copiar guion activo"
              style={{ background: '#1A4DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              📋 Copiar Guion
            </button>
            <button
              type="button"
              onClick={handleChangeScript}
              aria-label="Cambiar a otro guion"
              style={{ background: '#F2F2F2', color: '#1A4DFF', border: '2px solid #1A4DFF', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              🔄 Cambiar guion
            </button>
            <button
              type="button"
              onClick={handleCopyGTC}
              aria-label="Registrar marcación GTC"
              title="Usar GTC solo cuando aplique según lineamientos"
              style={{ background: '#fffbe6', color: '#222', border: '2px solid #faad14', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              🗂️ Registrar GTC
            </button>
            <button
              type="button"
              onClick={handleOpenSchedule}
              aria-haspopup="dialog"
              aria-expanded={openSchedule}
              style={{ background: '#007BFF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              🗓️ Programar devolución (24h)
            </button>
            <button
              type="button"
              onClick={handleCopyCANICS}
              aria-label="Copiar marcación CAN ICS si retención aceptada"
              style={{ background: '#f6ffed', color: '#222', border: '2px solid #52c41a', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              ✅ Copiar CAN ICS (si retención aceptada)
            </button>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyText('RR — Nota: Cliente reporta llamada colgada. Se retoma gestión con trato empático, se explica alternativa y se deja marcación correspondiente.');
                notify(ok ? 'Nota RR copiada' : 'No se pudo copiar la Nota RR', ok ? 'success' : 'error');
              }}
              aria-label="Generar Nota RR"
              style={{ background: '#e6f7ff', color: '#222', border: '2px solid #1890ff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              📝 Generar Nota RR
            </button>
          </div>

          <ScriptSection title="Guion recomendado" lines={lines} />
        </div>
      )
    },
    {
      id: 2,
      icon: '❓',
      title: 'Preguntas frecuentes',
      content: (
        <FAQSection
          faqs={[
            {
              question: '¿Qué hago si el cliente pide que lo llamemos después?',
              answer: 'Usa “Programar devolución (24h)” para agendar y copiar la marcación correspondiente.'
            },
            {
              question: '¿Debo transferir la llamada?',
              answer: 'Evita transferencias innecesarias. Prioriza solución en primer contacto.'
            },
            {
              question: '¿Qué término usar en el resumen?',
              answer: 'Usa siempre “marcación”, nunca “ticket”.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <>
      <BaseSolution
        title="Solución — Llamada colgada"
        icon="📞"
        sections={sections}
        onSolutionApplied={onApplySolution}
        acceptButtonText="Retención aceptada"
        rejectButtonText="Proceder con otra gestión"
      />

      {/* Modal Programar devolución */}
      <Modal open={openSchedule} onClose={handleCloseSchedule}>
        <div style={{ padding: 12, maxWidth: 520 }}>
          <h3 style={{ marginTop: 0, color: '#1A4DFF' }}>Programar devolución (24h)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 600, color: '#222' }}>
              Fecha
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginTop: 6, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 600, color: '#222' }}>
              Hora
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ marginTop: 6, padding: 8, borderRadius: 8, border: '1.5px solid #1A4DFF' }} />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, fontWeight: 600, color: '#222' }}>
            Notas (opcional)
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #1A4DFF' }} />
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button type="button" onClick={handleCopySchedule} style={{ background: '#1A4DFF', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}>Copiar marcación</button>
            <button type="button" onClick={handleCloseSchedule} style={{ background: '#F2F2F2', color: '#1A4DFF', border: '2px solid #1A4DFF', borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      </Modal>

      {/* Toast local */}
      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} duration={4500} onClose={() => setToastVisible(false)} />
    </>
  );
};

export default HogarColgaronSolution;
