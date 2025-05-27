import React, { useEffect, useState } from 'react';
import './Toast.scss';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  isVisible
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className={`toast-container ${visible ? 'visible' : ''}`}>
      <div className={`toast toast-${type}`}>
        <div className="toast-content">
          <p>{message}</p>
        </div>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
