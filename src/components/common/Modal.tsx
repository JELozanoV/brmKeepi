import React, { useEffect } from 'react';
import '../../styles/_header.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="brm-modal" role="dialog" aria-modal="true">
      <div className="brm-modal__backdrop" onClick={onClose} />
      <div className="brm-modal__content">
        <button className="brm-modal__close" aria-label="Cerrar" onClick={onClose}>Cerrar</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
