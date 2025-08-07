import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, HardDrive, Zap } from 'lucide-react';
import { useDatabaseStats, useBackupSystem } from '@/hooks/useIndexedDB';
import { DatabaseManager } from '@/lib/database';

export const DatabaseSettings: React.FC = () => {
  const { stats, loading: statsLoading, refreshStats } = useDatabaseStats();
  const { 
    backups, 
    loading: backupLoading, 
    createBackup, 
    restoreBackup, 
    deleteBackup, 
    exportToFile, 
    importFromFile 
  } = useBackupSystem();
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [backupName, setBackupName] = useState('');

  const handleCreateBackup = async () => {
    try {
      const name = backupName.trim() || undefined;
      await createBackup(name);
      setBackupName('');
      alert('✅ Резервну копію створено успішно!');
    } catch (error) {
      alert('❌ Помилка створення резервної копії');
    }
  };

  const handleRestoreBackup = async (backupId: number, backupName: string) => {
    if (confirm(`Відновити дані з резервної копії "${backupName}"? Це замінить всі поточні дані.`)) {
      try {
        await restoreBackup(backupId);
      } catch (error) {
        alert('❌ Помилка відновлення резервної копії');
      }
    }
  };

  const handleDeleteBackup = async (backupId: number, backupName: string) => {
    if (confirm(`Видалити резервну копію "${backupName}"?`)) {
      try {
        await deleteBackup(backupId);
      } catch (error) {
        alert('❌ Помилка видалення резервної копії');
      }
    }
  };

  const handleOptimizeDatabase = async () => {
    setIsOptimizing(true);
    try {
      await DatabaseManager.optimizeDatabase();
      await refreshStats();
      alert('✅ База даних оптимізована!');
    } catch (error) {
      alert('❌ Помилка оптимізації бази даних');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (confirm('Імпорт замінить всі поточні дані. Продовжити?')) {
        importFromFile(file).then(success => {
          if (success) {
            alert('✅ Дані імпортовано успішно!');
          } else {
            alert('❌ Помилка імпорту даних');
          }
        });
      }
      event.target.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Статистика бази даних */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Database size={24} />
          Статистика бази даних
        </h3>

        {statsLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Завантаження статистики...
          </div>
        ) : stats ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--fantasy-primary)' }}>
                {stats.worlds}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Світи</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                {stats.characters}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Персонажі</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
                {stats.notes}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Нотатки</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--info)' }}>
                {stats.relationships}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Зв'язки</div>
            </div>
          </div>
        ) : null}

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            className="btn btn-secondary"
            onClick={refreshStats}
            disabled={statsLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw size={16} />
            Оновити
          </button>
          
          <button
            className="btn btn-primary"
            onClick={handleOptimizeDatabase}
            disabled={isOptimizing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Zap size={16} />
            {isOptimizing ? 'Оптимізація...' : 'Оптимізувати'}
          </button>
        </div>

        {stats && stats.totalSize > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            <HardDrive size={16} style={{ marginRight: '0.5rem' }} />
            Розмір бази даних: {formatBytes(stats.totalSize)}
          </div>
        )}
      </div>

      {/* Резервні копії */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Download size={24} />
          Резервні копії
        </h3>

        {/* Створення нової резервної копії */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Назва резервної копії (опціонально)
            </label>
            <input
              type="text"
              className="input"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="Автоматична назва з датою"
            />
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleCreateBackup}
            disabled={backupLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
            Створити
          </button>
        </div>

        {/* Список резервних копій */}
        {backups.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            {backups.slice(0, 5).map(backup => (
              <div
                key={backup.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {backup.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {new Date(backup.createdAt).toLocaleString('uk-UA')} • {formatBytes(backup.size)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleRestoreBackup(backup.id!, backup.name)}
                    style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                  >
                    Відновити
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBackup(backup.id!, backup.name)}
                    style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            
            {backups.length > 5 && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center'
              }}>
                Показано 5 з {backups.length} резервних копій
              </div>
            )}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            Немає резервних копій
          </div>
        )}

        {/* Експорт/Імпорт */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            className="btn btn-primary"
            onClick={exportToFile}
            disabled={backupLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} />
            Експорт у файл
          </button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
              id="import-database-file"
            />
            <label
              htmlFor="import-database-file"
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} />
              Імпорт з файлу
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};