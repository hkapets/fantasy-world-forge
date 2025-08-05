import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  small: 20,
  medium: 32,
  large: 48
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Завантаження...',
  fullScreen = false
}) => {
  const spinnerSize = sizeMap[size];

  const spinner = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      ...(fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-modal)',
        zIndex: 9999
      } : {
        padding: '2rem'
      })
    }}>
      <div
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          border: `3px solid var(--bg-tertiary)`,
          borderTop: `3px solid var(--fantasy-primary)`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          {text}
        </p>
      )}
    </div>
  );

  return spinner;
};

// Додаємо анімацію спінера в CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);