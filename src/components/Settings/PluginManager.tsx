import React, { useState } from 'react';
import { 
  Puzzle, 
  Plus, 
  Download, 
  Upload, 
  Power, 
  PowerOff, 
  Trash2, 
  Settings as SettingsIcon,
  Search,
  Star,
  Shield,
  AlertTriangle,
  CheckCircle,
  Code,
  Package
} from 'lucide-react';
import { usePluginSystem, Plugin, PluginManifest, builtInPlugins } from '@/lib/pluginSystem';
import { Modal } from '../Modal/Modal';

export const PluginManager: React.FC = () => {
  const {
    plugins,
    loading,
    loadPlugin,
    unloadPlugin,
    togglePlugin,
    searchPlugins,
    exportPlugins,
    importPlugins
  } = usePluginSystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showPluginDetails, setShowPluginDetails] = useState<Plugin | null>(null);
  const [pluginCode, setPluginCode] = useState('');
  const [pluginManifest, setPluginManifest] = useState('');

  const filteredPlugins = searchQuery ? searchPlugins(searchQuery) : plugins;

  const handleInstallBuiltIn = async (pluginKey: string) => {
    const pluginData = builtInPlugins[pluginKey as keyof typeof builtInPlugins];
    if (pluginData) {
      const success = await loadPlugin(pluginData);
      if (success) {
        alert(`Плагін "${pluginData.manifest.name}" встановлено успішно!`);
      } else {
        alert('Помилка встановлення плагіну');
      }
    }
  };

  const handleInstallCustom = async () => {
    try {
      const manifest = JSON.parse(pluginManifest);
      const success = await loadPlugin({ manifest, code: pluginCode });
      
      if (success) {
        setShowInstallModal(false);
        setPluginCode('');
        setPluginManifest('');
        alert(`Плагін "${manifest.name}" встановлено успішно!`);
      } else {
        alert('Помилка встановлення плагіну');
      }
    } catch (error) {
      alert('Помилка в маніфесті або коді плагіну');
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importPlugins(file).then(success => {
        if (success) {
          alert('Плагіни імпортовано успішно!');
        } else {
          alert('Помилка імпорту плагінів');
        }
      });
      event.target.value = '';
    }
  };

  const getStatusColor = (plugin: Plugin) => {
    if (!plugin.isLoaded) return 'var(--danger)';
    if (!plugin.isActive) return 'var(--text-muted)';
    if (plugin.errorCount > 0) return 'var(--warning)';
    return 'var(--success)';
  };

  const getStatusLabel = (plugin: Plugin) => {
    if (!plugin.isLoaded) return 'Помилка';
    if (!plugin.isActive) return 'Вимкнено';
    if (plugin.errorCount > 0) return 'Попередження';
    return 'Активний';
  };

  const formatPermissions = (permissions: any[]) => {
    const labels: Record<string, string> = {
      storage: 'Локальне сховище',
      network: 'Мережевий доступ',
      filesystem: 'Файлова система',
      notifications: 'Сповіщення',
      clipboard: 'Буфер обміну'
    };
    
    return permissions.map(p => labels[p.type] || p.type).join(', ');
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
            <Puzzle size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              Менеджер плагінів
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Розширюйте функціональність додатку
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowInstallModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus size={18} />
            Встановити
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={exportPlugins}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={18} />
            Експорт
          </button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
              id="import-plugins"
            />
            <label
              htmlFor="import-plugins"
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

      {/* Пошук */}
      <div style={{
        position: 'relative',
        marginBottom: '2rem',
        maxWidth: '400px'
      }}>
        <Search 
          size={20} 
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input
          type="text"
          placeholder="Пошук плагінів..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Вбудовані плагіни */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Package size={18} />
          Вбудовані плагіни
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(builtInPlugins).map(([key, pluginData]) => {
            const isInstalled = plugins.some(p => p.manifest.id === pluginData.manifest.id);
            
            return (
              <div
                key={key}
                className="card"
                style={{
                  padding: '1.5rem',
                  border: isInstalled ? '2px solid var(--success)' : '1px solid var(--border-primary)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <h5 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {pluginData.manifest.name}
                  </h5>
                  
                  {isInstalled && (
                    <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  )}
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                  marginBottom: '1rem'
                }}>
                  {pluginData.manifest.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    v{pluginData.manifest.version}
                  </div>
                  
                  <button
                    className={isInstalled ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => handleInstallBuiltIn(key)}
                    disabled={isInstalled || loading}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {isInstalled ? 'Встановлено' : 'Встановити'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Встановлені плагіни */}
      <div>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Puzzle size={18} />
          Встановлені плагіни ({filteredPlugins.length})
        </h4>

        {filteredPlugins.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }}>
            {searchQuery ? 'Плагінів не знайдено' : 'Немає встановлених плагінів'}
            <br />
            <button
              className="btn btn-primary"
              onClick={() => setShowInstallModal(true)}
              style={{ marginTop: '1rem' }}
            >
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Встановити перший плагін
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredPlugins.map(plugin => (
              <div
                key={plugin.manifest.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  border: `2px solid ${getStatusColor(plugin)}`,
                  position: 'relative'
                }}
              >
                {/* Статус індикатор */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(plugin)
                  }} />
                  <span style={{
                    fontSize: '0.75rem',
                    color: getStatusColor(plugin),
                    fontWeight: '500'
                  }}>
                    {getStatusLabel(plugin)}
                  </span>
                </div>

                {/* Інформація про плагін */}
                <div style={{ marginBottom: '1rem', paddingRight: '5rem' }}>
                  <h5 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {plugin.manifest.name}
                  </h5>
                  
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4',
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}>
                    {plugin.manifest.description}
                  </p>

                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem'
                  }}>
                    <div>Автор: {plugin.manifest.author}</div>
                    <div>Версія: {plugin.manifest.version}</div>
                    <div>Дозволи: {formatPermissions(plugin.manifest.permissions)}</div>
                  </div>

                  {/* Ключові слова */}
                  {plugin.manifest.keywords.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.25rem',
                      marginBottom: '0.5rem'
                    }}>
                      {plugin.manifest.keywords.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: '0.625rem',
                            padding: '0.125rem 0.375rem',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-muted)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-primary)'
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                      {plugin.manifest.keywords.length > 3 && (
                        <span style={{
                          fontSize: '0.625rem',
                          color: 'var(--text-muted)'
                        }}>
                          +{plugin.manifest.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Статистика використання */}
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <div>Активацій: {plugin.usageStats.activations}</div>
                  <div>Останнє використання: {new Date(plugin.usageStats.lastUsed).toLocaleDateString('uk-UA')}</div>
                  {plugin.loadTime && (
                    <div>Час завантаження: {plugin.loadTime.toFixed(2)}мс</div>
                  )}
                </div>

                {/* Дії */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-icon btn-icon-sm"
                      onClick={() => setShowPluginDetails(plugin)}
                      title="Деталі плагіну"
                    >
                      <SettingsIcon size={14} />
                    </button>
                    
                    <button
                      className="btn-icon btn-icon-sm"
                      onClick={() => togglePlugin(plugin.manifest.id)}
                      title={plugin.isActive ? 'Вимкнути' : 'Увімкнути'}
                      style={{
                        background: plugin.isActive ? 'var(--warning)' : 'var(--success)',
                        color: 'white'
                      }}
                    >
                      {plugin.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                    </button>
                  </div>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (confirm(`Видалити плагін "${plugin.manifest.name}"?`)) {
                        unloadPlugin(plugin.manifest.id);
                      }
                    }}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.5rem 0.75rem'
                    }}
                  >
                    <Trash2 size={12} style={{ marginRight: '0.25rem' }} />
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальне вікно встановлення */}
      <Modal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        title="Встановити плагін"
        maxWidth="700px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)'
          }}>
            <h5 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Shield size={18} />
              Безпека плагінів
            </h5>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Встановлюйте тільки плагіни з довірених джерел. Плагіни мають доступ до ваших даних.
            </p>
          </div>

          {/* Маніфест */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Маніфест плагіну (JSON) *
            </label>
            <textarea
              className="input"
              value={pluginManifest}
              onChange={(e) => setPluginManifest(e.target.value)}
              placeholder={JSON.stringify({
                id: 'my.plugin',
                name: 'Мій плагін',
                version: '1.0.0',
                description: 'Опис плагіну',
                author: 'Ваше ім\'я',
                apiVersion: '1.0.0',
                minAppVersion: '1.0.0',
                keywords: ['тег1', 'тег2'],
                extensionPoints: [],
                permissions: [
                  { type: 'storage', description: 'Збереження налаштувань', required: true }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }, null, 2)}
              rows={8}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Код плагіну */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Код плагіну (JavaScript) *
            </label>
            <textarea
              className="input"
              value={pluginCode}
              onChange={(e) => setPluginCode(e.target.value)}
              placeholder={`// Приклад плагіну
exports.activate = (api) => {
  api.ui.showNotification('Плагін активовано!', 'success');
  
  // Додаємо кнопку в тулбар
  api.ui.addToolbarButton({
    id: 'my-button',
    label: 'Моя кнопка',
    icon: '🔥',
    position: 'right',
    onClick: () => {
      api.ui.showNotification('Кнопка натиснута!', 'info');
    }
  });
};

exports.deactivate = () => {
  console.log('Плагін деактивовано');
};`}
              rows={12}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowInstallModal(false)}
            >
              Скасувати
            </button>
            <button
              className="btn btn-primary"
              onClick={handleInstallCustom}
              disabled={!pluginManifest.trim() || !pluginCode.trim() || loading}
            >
              Встановити плагін
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальне вікно деталей плагіну */}
      {showPluginDetails && (
        <Modal
          isOpen={!!showPluginDetails}
          onClose={() => setShowPluginDetails(null)}
          title={`Деталі: ${showPluginDetails.manifest.name}`}
          maxWidth="600px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Основна інформація */}
            <div>
              <h5 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem'
              }}>
                Основна інформація
              </h5>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <strong>ID:</strong> {showPluginDetails.manifest.id}
                </div>
                <div>
                  <strong>Версія:</strong> {showPluginDetails.manifest.version}
                </div>
                <div>
                  <strong>Автор:</strong> {showPluginDetails.manifest.author}
                </div>
                <div>
                  <strong>API версія:</strong> {showPluginDetails.manifest.apiVersion}
                </div>
              </div>
            </div>

            {/* Дозволи */}
            <div>
              <h5 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem'
              }}>
                Дозволи
              </h5>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {showPluginDetails.manifest.permissions.map((permission, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Shield size={14} style={{ 
                      color: permission.required ? 'var(--warning)' : 'var(--success)' 
                    }} />
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {permission.type}
                        {permission.required && (
                          <span style={{ color: 'var(--warning)', marginLeft: '0.25rem' }}>
                            (обов'язковий)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {permission.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Статистика */}
            <div>
              <h5 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem'
              }}>
                Статистика використання
              </h5>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--fantasy-primary)' }}>
                    {showPluginDetails.usageStats.activations}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Активацій</div>
                </div>
                
                <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                    {showPluginDetails.errorCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Помилок</div>
                </div>
                
                {showPluginDetails.loadTime && (
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--info)' }}>
                      {showPluginDetails.loadTime.toFixed(0)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>мс</div>
                  </div>
                )}
              </div>
            </div>

            {/* Дії */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <button
                className="btn btn-secondary"
                onClick={() => togglePlugin(showPluginDetails.manifest.id)}
              >
                {showPluginDetails.isActive ? 'Вимкнути' : 'Увімкнути'}
              </button>
              
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm(`Видалити плагін "${showPluginDetails.manifest.name}"?`)) {
                    unloadPlugin(showPluginDetails.manifest.id);
                    setShowPluginDetails(null);
                  }
                }}
              >
                Видалити
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};