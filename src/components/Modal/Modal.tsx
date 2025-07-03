import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  saveText = 'Зберегти',
  cancelText = 'Скасувати',
  maxWidth = '600px'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay modal-in" onClick={handleOverlayClick}>
      <div 
        className="modal"
        style={{ maxWidth }}
      >
        <div className="modal-header">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--bg-input)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'none';
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-content">
          {children}
        </div>

        {(onSave || onCancel) && (
          <div className="modal-footer">
            {onCancel && (
              <button 
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            {onSave && (
              <button 
                className="btn btn-primary"
                onClick={onSave}
              >
                {saveText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};