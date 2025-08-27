import React, { useState } from 'react';
import BaseSolution from './BaseSolution';
import { ScriptSection, FAQSection, BenefitsSection } from './sections';
import Modal from '../common/Modal';
import Toast from '../Toast/Toast';
import { copyText } from '../../utils/clipboard';

interface Props {
  onApplySolution: () => void;
}

const HogarServicioClienteLargasEsperasSolution: React.FC<Props> = ({ onApplySolution }) => {
  // Script base
  const scriptLines: { text: string; type: 'empathy' | 'action' | 'solution' | 'closing' }[] = [
    {
      text:
        'Lamento sinceramente el tiempo de espera que tuviste. Tu tiempo es valioso y estoy aquí para ayudarte de inmediato.',
      type: 'empathy',
    },
    {
      text: 'Permíteme priorizar tu caso ahora mismo y resolver la razón de tu contacto sin más demoras.',
      type: 'action',
    },
    {
      text:
        'Si te parece, avanzamos con la solución propuesta o te presento alternativas claras para cerrar el requerimiento en esta llamada.',
      type: 'solution',
    },
    {
      text:
        'Te acompañaré hasta dejar la marcación correspondiente y un resumen claro de lo acordado. ¿Continuamos?',
      type: 'closing',
    },
  ];

  // Toast local
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'success') => {
    setToastMsg(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Modal Programar devolución (24h)
  const [openSchedule, setOpenSchedule] = useState(false);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const buildScriptText = (): string => {
    const typeLabel: Record<'empathy' | 'action' | 'solution' | 'closing', string> = {
      empathy: 'Empatía',
      action: 'Acción',
      solution: 'Solución/Alternativa',
      closing: 'Cierre',
    };
    return scriptLines.map((s, i) => `${i + 1}. [${typeLabel[s.type]}] ${s.text}`).join('\n');
  };

  const handleCopyScript = async () => {
    const ok = await copyText(buildScriptText());
    notify(ok ? 'Guion copiado al portapapeles' : 'No se pudo copiar el guion', ok ? 'success' : 'error');
  };

  const handleCopyGTC = async () => {
    const text = `Marcación GTC — "Largas esperas"\n\nResumen: Cliente reporta tiempos de espera prolongados. Se prioriza gestión y resolución en primer contacto.\nAcción del asesor: Resolver en línea, mantener informado y registrar marcación.\nObservación: Usar GTC solo si aplica según lineamientos.`;
    const ok = await copyText(text);
    notify(ok ? 'Marcación GTC copiada (usa solo si aplica)' : 'No se pudo copiar la marcación GTC', ok ? 'success' : 'error');
  };

  const handleCopyCANICS = async () => {
    const text = `Marcación CAN ICS — Retención aceptada\nServicio: Hogar\nMotivo original: Largas esperas\nDetalle: Cliente acepta alternativa y continuidad del servicio.`;
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
    const text = `Programación devolución (24h) — Marcación: Largas esperas\nFecha: ${date}\nHora: ${time}\nNotas: ${notes || 'N/A'}`;
    const ok = await copyText(text);
    notify(ok ? 'Programación copiada al portapapeles' : 'No se pudo copiar la programación', ok ? 'success' : 'error');
    if (ok) setOpenSchedule(false);
  };

  const sections = [
    {
      id: 1,
      icon: '🕰️',
      title: 'Guión de Retención — Largas esperas',
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
                const ok = await copyText('RR — Nota: Cliente experimentó largas esperas. Se prioriza gestión, se mantiene informado y se deja marcación correspondiente.');
                notify(ok ? 'Nota RR copiada' : 'No se pudo copiar la Nota RR', ok ? 'success' : 'error');
              }}
              aria-label="Generar Nota RR"
              style={{ background: '#e6f7ff', color: '#222', border: '2px solid #1890ff', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}
            >
              📝 Generar Nota RR
            </button>
          </div>

          <ScriptSection title="Guión recomendado" lines={scriptLines} />
        </div>
      )
    },
    {
      id: 2,
      icon: '📋',
      title: 'Acciones del Asesor',
      content: (
        <BenefitsSection
          benefits={[
            {
              icon: '⚡',
              title: 'Priorizar gestión en primer contacto',
              features: []
            },
            {
              icon: '🔄',
              title: 'Mantener informado al cliente del avance',
              features: []
            },
            {
              icon: '📝',
              title: 'Dejar marcación clara y completa en RR',
              features: []
            }
          ]}
        />
      )
    },
    {
      id: 3,
      icon: '❓',
      title: 'Preguntas Frecuentes',
      content: (
        <FAQSection
          faqs={[
            {
              question: '¿Debo transferir la llamada?',
              answer: 'Evita transferencias innecesarias. Prioriza solución en primer contacto.'
            },
            {
              question: '¿Qué término usar en el resumen?',
              answer: 'Usa siempre “marcación”, nunca “ticket”.'
            },
            {
              question: '¿Qué hacer si el cliente prefiere ser contactado más tarde?',
              answer: 'Ofrece programar devolución en 24h y dejar la marcación correspondiente en RR.'
            }
          ]}
        />
      )
    }
  ];

  return (
    <>
      <BaseSolution
        title="Solución — Largas esperas"
        icon="⏳"
        sections={sections}
        onSolutionApplied={onApplySolution}
        acceptButtonText="Cliente acepta continuar la gestión"
        rejectButtonText="Proceder con otra alternativa"
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

      <Toast message={toastMsg} type={toastType} isVisible={toastVisible} duration={4500} onClose={() => setToastVisible(false)} />
    </>
  );
};

export default HogarServicioClienteLargasEsperasSolution;
