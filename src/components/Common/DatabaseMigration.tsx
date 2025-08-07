import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { DatabaseManager, initializeDatabase } from '@/lib/database';
import { useDatabaseStats, useBackupSystem } from '@/hooks/useIndexedDB';

export const DatabaseMigration: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'checking' | 'needed' | 'completed' | 'error'>('checking');
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [showMigrationPanel, setShowMigrationPanel] = useState(false);
  const { stats } = useDatabaseStats();
  const { createBackup, exportToFile } = useBackupSystem();

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      // Перевіряємо чи є дані в localStorage
      const hasLocalStorageData = localStorage.getItem('fantasyWorldBuilder_worlds');
      
      // Перевіряємо чи є дані в IndexedDB
      const hasIndexedDBData = stats && stats.worlds > 0;

      if (hasLocalStorageData && !hasIndexedDBData) {
        setMigrationStatus('needed');
        setShowMigrationPanel(true);
      } else if (hasIndexedDBData) {
        setMigrationStatus('completed');
      } else {
        setMigrationStatus('completed'); // Немає даних для міграції
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
      setMigrationStatus('error');
    }
  };

  const performMigration = async () => {
    try {
      setMigrationProgress(10);
      
      // Створюємо резервну копію localStorage перед міграцією
      await createBackupFromLocalStorage();
      setMigrationProgress(30);

      // Виконуємо міграцію
      const success = await DatabaseManager.migrateFromLocalStorage();
      setMigrationProgress(80);

      if (success) {
        setMigrationProgress(100);
        setMigrationStatus('completed');
        
        // Показуємо повідомлення про успіх
        setTimeout(() => {
          setShowMigrationPanel(false);
          alert('✅ Міграція завершена успішно! Ваші дані тепер зберігаються в IndexedDB для кращої продуктивності.');
        }, 1000);
      } else {
        setMigrationStatus('error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
    }
  };

  const createBackupFromLocalStorage = async () => {
    try {
      const allData: any = {};
      
      // Збираємо всі дані з localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('fantasyWorldBuilder_')) {
          allData[key] = localStorage.getItem(key);
        }
      });

      const jsonData = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating localStorage backup:', error);
    }
  };

  const skipMigration = () => {
    setShowMigrationPanel(false);
    localStorage.setItem('fantasyWorldBuilder_migrationSkipped', 'true');
  };

  if (!showMigrationPanel) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid var(--border-secondary)',
        boxShadow: 'var(--shadow-modal)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={28} style={{ color: 'white' }} />
          </div>
          
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Покращення бази даних
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Переходимо на IndexedDB для кращої продуктивності
            </p>
          </div>
        </div>

        {migrationStatus === 'needed' && (
          <>
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-primary)'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                Що це означає?
              </h4>
              
              <ul style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                paddingLeft: '1rem',
                margin: 0
              }}>
                <li>Ваші дані будуть перенесені в сучасну базу даних</li>
                <li>Покращиться швидкість роботи з великими обсягами даних</li>
                <li>Додасться підтримка складних запитів та пошуку</li>
                <li>Автоматично створюється резервна копія</li>
                <li>Старі дані в localStorage залишаться як резерв</li>
              </ul>
            </div>

            {migrationProgress > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  <span>Прогрес міграції</span>
                  <span>{migrationProgress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${migrationProgress}%`,
                    height: '100%',
                    background: 'var(--gradient-primary)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                className="btn btn-secondary"
                onClick={skipMigration}
                disabled={migrationProgress > 0}
              >
                Пропустити
              </button>
              <button
                className="btn btn-primary"
                onClick={performMigration}
                disabled={migrationProgress > 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {migrationProgress > 0 ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Міграція...
                  </>
                ) : (
                  <>
                    <Database size={18} />
                    Почати міграцію
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {migrationStatus === 'completed' && (
          <div style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              База даних готова!
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem'
            }}>
              Ваші дані успішно перенесені в IndexedDB
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowMigrationPanel(false)}
            >
              Продовжити
            </button>
          </div>
        )}

        {migrationStatus === 'error' && (
          <div style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <AlertTriangle size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Помилка міграції
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem'
            }}>
              Не вдалося перенести дані. Ваші дані в localStorage залишаються безпечними.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMigrationPanel(false)}
              >
                Продовжити з localStorage
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setMigrationStatus('needed');
                  setMigrationProgress(0);
                }}
              >
                Спробувати знову
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};