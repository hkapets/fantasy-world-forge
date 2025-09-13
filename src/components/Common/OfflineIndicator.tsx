import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database, Cloud, HardDrive } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    quota: number;
  } | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Показуємо індикатор якщо офлайн при завантаженні
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    // Отримуємо інформацію про сховище
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setStorageInfo({
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: isOnline ? 'var(--success)' : 'var(--warning)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      animation: 'slideDown 0.3s ease'
    }}>
      {isOnline ? (
        <>
          <Wifi size={18} />
          Онлайн режим
          <HardDrive size={16} style={{ marginLeft: '0.5rem', opacity: 0.8 }} />
          {storageInfo && (
            <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>
              {(storageInfo.used / 1024 / 1024).toFixed(1)}MB використано
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff size={18} />
          Офлайн режим
          <HardDrive size={16} style={{ marginLeft: '0.5rem', opacity: 0.8 }} />
          <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>
            Локальне збереження
          </span>
        </>
      )}
    </div>
  );
};