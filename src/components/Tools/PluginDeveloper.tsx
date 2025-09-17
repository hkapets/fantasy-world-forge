import React, { useState } from 'react';
import { Code, Play, Bug, Download, Upload, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePluginDevelopment } from '@/hooks/usePluginIntegration';
import { usePluginSystem } from '@/lib/pluginSystem';
import { Modal } from '../Modal/Modal';

export const PluginDeveloper: React.FC = () => {
  const { 
    isDebugging, 
    setIsDebugging, 
    pluginLogs, 
    clearLogs, 
    exportLogs, 
    validatePluginCode 
  } = usePluginDevelopment();
  
  const { loadPlugin } = usePluginSystem();
  
  const [pluginCode, setPluginCode] = useState('');
  const [pluginManifest, setPluginManifest] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const defaultPluginTemplate = `// Шаблон плагіну для Fantasy World Builder
exports.activate = async (api) => {
  // Ініціалізація плагіну
  console.log('Плагін активовано!');
  
  // Показуємо сповіщення
  api.ui.showNotification('Мій плагін запущено!', 'success');
  
  // Додаємо кнопку в тулбар
  api.ui.addToolbarButton({
    id: 'my-plugin-button',
    label: 'Моя кнопка',
    icon: '🚀',
    position: 'right',
    tooltip: 'Натисніть для тестування',
    onClick: async () => {
      const currentWorld = await api.data.getCurrentWorld();
      if (currentWorld) {
        api.ui.showNotification(\`Поточний світ: \${currentWorld.name}\`, 'info');
      } else {
        api.ui.showNotification('Світ не обрано', 'warning');
      }
    }
  });
  
  // Слухаємо події
  api.events.onCharacterCreated((character) => {
    api.ui.showNotification(\`Створено персонажа: \${character.name}\`, 'info');
  });
  
  // Зберігаємо налаштування
  await api.storage.set('initialized', true);
};

exports.deactivate = async () => {
  console.log('Плагін деактивовано');
};

// Експорт додаткових функцій
exports.getInfo = () => {
  return {
    name: 'Мій тестовий плагін',
    features: ['Сповіщення', 'Кнопка тулбару', 'Обробка подій']
  };
};`;

  const defaultManifestTemplate = {
    id: 'my.test.plugin',
    name: 'Мій тестовий плагін',
    version: '1.0.0',
    description: 'Тестовий плагін для демонстрації можливостей',
    author: 'Розробник',
    homepage: 'https://example.com',
    license: 'MIT',
    keywords: ['тест', 'демо', 'приклад'],
    apiVersion: '1.0.0',
    minAppVersion: '1.0.0',
    extensionPoints: [
      {
        id: 'toolbar-button',
        type: 'component',
        target: 'toolbar',
        priority: 1
      }
    ],
    permissions: [
      {
        type: 'storage',
        description: 'Збереження налаштувань плагіну',
        required: true
      },
      {
        type: 'notifications',
        description: 'Показ сповіщень користувачу',
        required: false
      }
    ],
    config: {
      defaults: {
        enabled: true,
        notificationLevel: 'info'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  React.useEffect(() => {
    if (!pluginCode) {
      setPluginCode(defaultPluginTemplate);
    }
    if (!pluginManifest) {
      setPluginManifest(JSON.stringify(defaultManifestTemplate, null, 2));
    }
  }, []);

  const handleValidateCode = () => {
    const result = validatePluginCode(pluginCode);
    setValidationResult(result);
  };

  const handleTestPlugin = async () => {
    try {
      const manifest = JSON.parse(pluginManifest);
      const validation = validatePluginCode(pluginCode);
      
      if (!validation.isValid) {
        alert('Код містить помилки:\n' + validation.errors.join('\n'));
        return;
      }

      setIsTestMode(true);
      
      // Створюємо тестовий плагін з унікальним ID
      const testManifest = {
        ...manifest,
        id: `test.${manifest.id}.${Date.now()}`
      };

      const success = await loadPlugin({ manifest: testManifest, code: pluginCode });
      
      if (success) {
        alert('Плагін успішно протестовано!');
      } else {
        alert('Помилка тестування плагіну');
      }
    } catch (error) {
      alert('Помилка в маніфесті або коді: ' + error.message);
    } finally {
      setIsTestMode(false);
    }
  };

  const handleExportPlugin = () => {
    try {
      const manifest = JSON.parse(pluginManifest);
      
      const pluginData = {
        manifest,
        code: pluginCode,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(pluginData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `${manifest.id}.plugin.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert('Помилка експорту: ' + error.message);
    }
  };

  const handleImportPlugin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const pluginData = JSON.parse(e.target?.result as string);
        
        if (pluginData.manifest && pluginData.code) {
          setPluginManifest(JSON.stringify(pluginData.manifest, null, 2));
          setPluginCode(pluginData.code);
          alert('Плагін імпортовано успішно!');
        } else {
          alert('Невірний формат файлу плагіну');
        }
      } catch (error) {
        alert('Помилка читання файлу: ' + error.message);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Розробка плагінів
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Створюйте власні розширення для Fantasy World Builder
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setIsDebugging(!isDebugging)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Bug size={18} />
            {isDebugging ? 'Вимкнути дебаг' : 'Увімкнути дебаг'}
          </button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportPlugin}
              style={{ display: 'none' }}
              id="import-plugin-dev"
            />
            <label
              htmlFor="import-plugin-dev"
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Upload size={18} />
              Імпорт
            </label>
          </div>
        </div>
      </div>

      {/* Редактор маніфесту */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Маніфест плагіну (plugin.json)
          </h4>
          
          <button
            className="btn btn-secondary"
            onClick={handleValidateCode}
            style={{
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Eye size={16} />
            Валідувати
          </button>
        </div>
        
        <textarea
          className="input"
          value={pluginManifest}
          onChange={(e) => setPluginManifest(e.target.value)}
          rows={12}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            resize: 'vertical',
            background: 'var(--bg-secondary)'
          }}
        />
      </div>

      {/* Редактор коду */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Код плагіну (plugin.js)
        </h4>
        
        <textarea
          className="input"
          value={pluginCode}
          onChange={(e) => setPluginCode(e.target.value)}
          rows={20}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            resize: 'vertical',
            background: 'var(--bg-secondary)'
          }}
        />
      </div>

      {/* Результат валідації */}
      {validationResult && (
        <div style={{
          padding: '1rem',
          background: validationResult.isValid ? 'var(--bg-success)' : 'var(--bg-danger)',
          border: `1px solid ${validationResult.isValid ? 'var(--success)' : 'var(--danger)'}`,
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: validationResult.errors.length > 0 ? '0.75rem' : 0
          }}>
            {validationResult.isValid ? (
              <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            ) : (
              <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
            )}
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: validationResult.isValid ? 'var(--success)' : 'var(--danger)'
            }}>
              {validationResult.isValid ? 'Код валідний' : 'Знайдено помилки'}
            </span>
          </div>
          
          {validationResult.errors.length > 0 && (
            <ul style={{
              fontSize: '0.75rem',
              color: 'var(--danger)',
              paddingLeft: '1rem',
              margin: 0
            }}>
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Дії */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}>
        <button
          className="btn btn-primary"
          onClick={handleTestPlugin}
          disabled={isTestMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Play size={18} />
          {isTestMode ? 'Тестування...' : 'Тестувати плагін'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleValidateCode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Eye size={18} />
          Валідувати код
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={handleExportPlugin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Download size={18} />
          Експортувати
        </button>
      </div>

      {/* Логи дебагу */}
      {isDebugging && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Логи дебагу ({pluginLogs.length})
            </h4>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary"
                onClick={exportLogs}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                Експорт логів
              </button>
              <button
                className="btn btn-secondary"
                onClick={clearLogs}
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
              >
                Очистити
              </button>
            </div>
          </div>
          
          <div style={{
            maxHeight: '300px',
            overflow: 'auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }}>
            {pluginLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                Логи порожні
              </div>
            ) : (
              pluginLogs.map((log, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '0.25rem',
                    color: log.level === 'error' ? 'var(--danger)' : 
                           log.level === 'warn' ? 'var(--warning)' : 'var(--text-secondary)'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span style={{ color: 'var(--fantasy-primary)', marginLeft: '0.5rem' }}>
                    [{log.pluginId}]
                  </span>
                  <span style={{ marginLeft: '0.5rem' }}>
                    {log.level.toUpperCase()}: {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Документація API */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)'
      }}>
        <h5 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          📚 Документація Plugin API
        </h5>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          fontSize: '0.875rem'
        }}>
          <div>
            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              api.storage
            </h6>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0 }}>
              <li>get(key) - отримати дані</li>
              <li>set(key, value) - зберегти дані</li>
              <li>remove(key) - видалити дані</li>
              <li>clear() - очистити все</li>
            </ul>
          </div>
          
          <div>
            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              api.ui
            </h6>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0 }}>
              <li>showNotification() - сповіщення</li>
              <li>showModal() - модальне вікно</li>
              <li>addMenuItem() - пункт меню</li>
              <li>addToolbarButton() - кнопка</li>
            </ul>
          </div>
          
          <div>
            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              api.data
            </h6>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0 }}>
              <li>getWorlds() - список світів</li>
              <li>getCurrentWorld() - поточний світ</li>
              <li>getCharacters() - персонажі</li>
              <li>createCharacter() - створити</li>
            </ul>
          </div>
          
          <div>
            <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              api.events
            </h6>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0 }}>
              <li>on() - слухати подію</li>
              <li>emit() - викликати подію</li>
              <li>onWorldChanged() - зміна світу</li>
              <li>onCharacterCreated() - новий персонаж</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};