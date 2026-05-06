import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  type?: 'error' | 'success' | 'info';
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, type = 'info', children }) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'error':
        return { header: '#d32f2f', icon: '✕' };
      case 'success':
        return { header: '#2e7d32', icon: '✓' };
      default:
        return { header: '#1976d2', icon: 'ℹ' };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          minWidth: '350px',
          maxWidth: '500px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            backgroundColor: colors.header,
            color: 'white',
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{colors.icon}</span>
          <h3 style={{ margin: 0, fontSize: '18px' }}>{title}</h3>
        </div>
        <div style={{ padding: '20px' }}>
          {children ? (
            children
          ) : (
            <p style={{ margin: 0, fontSize: '16px', color: '#333', lineHeight: '1.5' }}>
              {message}
            </p>
          )}
        </div>
        <div
          style={{
            padding: '15px 20px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: colors.header,
              color: 'white',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
