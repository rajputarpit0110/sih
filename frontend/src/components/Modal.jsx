import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          {subtitle && <div className="modal-subtitle">{subtitle}</div>}
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
