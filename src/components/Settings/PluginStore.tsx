import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Download, 
  Star, 
  Shield, 
  Clock, 
  Users,
  Package,
  Filter,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';
import { usePluginStore, PluginStoreItem, PluginCategory } from '@/lib/pluginStore';
import { usePluginSystem } from '@/lib/pluginSystem';
import { Modal } from '../Modal/Modal';

export const PluginStore: React.FC = () => {
  const { 
    plugins, 
    categories, 
    loading, 
    loadPlugins, 
    searchPlugins, 
    downloadPlugin 
  } = usePluginStore();
  
  const { loadPlugin: installPlugin } = usePluginSystem();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeatured, setShowFeatured] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<PluginStoreItem | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchPlugins(query);
    } else {
      loadPlugins(selectedCategory === 'all' ? undefined : selectedCategory, showFeatured);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadPlugins(category === 'all' ? undefined : category, showFeatured);
  };

  const handleInstallPlugin = async (plugin: PluginStoreItem) => {
    setInstalling(plugin.id);
    
    try {
      const pluginData = await downloadPlugin(plugin.id);
      if (pluginData) {
        const success = await installPlugin(pluginData);
        if (success) {
          alert(`Плагін "${plugin.name}" встановлено успішно!`);
        } else {
          alert('Помилка встановлення плагіну');
        }
      } else {
        alert('Помилка завантаження плагіну');
      }
    } catch (error) {
      alert('Помилка встановлення плагіну');
    } finally {
      setInstalling(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Безкоштовно';
    return `${(price / 100).toFixed(2)} ₴`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
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
          <Store size={24} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            Магазин плагінів
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Розширюйте можливості Fantasy World Builder
          </p>
        </div>
      </div>

      {/* Пошук та фільтри */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          flex: '1',
          minWidth: '300px'
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
            onChange={(e) => handleSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="input"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">Всі категорії</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={showFeatured}
            onChange={(e) => {
              setShowFeatured(e.target.checked);
              loadPlugins(selectedCategory === 'all' ? undefined : selectedCategory, e.target.checked);
            }}
          />
          <Award size={16} />
          Тільки рекомендовані
        </label>
      </div>

      {/* Категорії */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            style={{
              padding: '1rem',
              background: selectedCategory === category.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
              border: selectedCategory === category.id ? '2px solid var(--fantasy-primary)' : '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem'
            }}>
              {category.icon}
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.25rem'
            }}>
              {category.name}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              {category.description}
            </div>
          </div>
        ))}
      </div>

      {/* Список плагінів */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          Завантаження плагінів...
        </div>
      ) : plugins.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery ? 'Плагінів не знайдено' : 'Немає доступних плагінів'}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {plugins.map(plugin => (
            <div
              key={plugin.id}
              className="card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => setSelectedPlugin(plugin)}
            >
              {/* Бейджі */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.25rem'
              }}>
                {plugin.featured && (
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    background: 'var(--warning)',
                    color: 'white',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.625rem',
                    fontWeight: '500'
                  }}>
                    <Award size={10} style={{ marginRight: '0.25rem' }} />
                    Рекомендований
                  </div>
                )}
                
                {plugin.verified && (
                  <div style={{
                    padding: '0.25rem',
                    background: 'var(--success)',
                    color: 'white',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <Shield size={12} />
                  </div>
                )}
              </div>

              {/* Скріншот */}
              {plugin.screenshots.length > 0 && (
                <div style={{
                  width: '100%',
                  height: '150px',
                  background: `url(${plugin.screenshots[0]}) center/cover`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }} />
              )}

              {/* Інформація */}
              <div style={{ paddingRight: '6rem' }}>
                <h5 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {plugin.name}
                </h5>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4',
                  margin: 0,
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {plugin.description}
                </p>

                {/* Метадані */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={12} />
                    {plugin.rating.toFixed(1)}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Download size={12} />
                    {plugin.downloadCount.toLocaleString()}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Package size={12} />
                    {formatSize(plugin.size)}
                  </div>
                </div>

                {/* Теги */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  {plugin.tags.slice(0, 3).map((tag, index) => (
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
                      {tag}
                    </span>
                  ))}
                  {plugin.tags.length > 3 && (
                    <span style={{
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)'
                    }}>
                      +{plugin.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Ціна та кнопка */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: plugin.price === 0 ? 'var(--success)' : 'var(--text-primary)'
                  }}>
                    {formatPrice(plugin.price)}
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInstallPlugin(plugin);
                    }}
                    disabled={installing === plugin.id}
                    style={{
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Download size={14} />
                    {installing === plugin.id ? 'Встановлення...' : 'Встановити'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальне вікно деталей плагіну */}
      {selectedPlugin && (
        <Modal
          isOpen={!!selectedPlugin}
          onClose={() => setSelectedPlugin(null)}
          title={selectedPlugin.name}
          maxWidth="700px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Скріншоти */}
            {selectedPlugin.screenshots.length > 0 && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.5rem'
                }}>
                  {selectedPlugin.screenshots.map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Скріншот ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-primary)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Опис */}
            <div>
              <h5 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem'
              }}>
                Опис
              </h5>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                {selectedPlugin.description}
              </p>
            </div>

            {/* Метадані */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--fantasy-primary)'
                }}>
                  {selectedPlugin.rating.toFixed(1)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}>
                  <Star size={12} />
                  Рейтинг
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--success)'
                }}>
                  {selectedPlugin.downloadCount.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}>
                  <Download size={12} />
                  Завантажень
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--info)'
                }}>
                  {formatSize(selectedPlugin.size)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}>
                  <Package size={12} />
                  Розмір
                </div>
              </div>
            </div>

            {/* Changelog */}
            {selectedPlugin.changelog && (
              <div>
                <h5 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem'
                }}>
                  Останні зміни
                </h5>
                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace'
                }}>
                  {selectedPlugin.changelog}
                </div>
              </div>
            )}

            {/* Дії */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: selectedPlugin.price === 0 ? 'var(--success)' : 'var(--text-primary)'
              }}>
                {formatPrice(selectedPlugin.price)}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedPlugin(null)}
                >
                  Закрити
                </button>
                
                <button
                  className="btn btn-primary"
                  onClick={() => handleInstallPlugin(selectedPlugin)}
                  disabled={installing === selectedPlugin.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Download size={16} />
                  {installing === selectedPlugin.id ? 'Встановлення...' : 'Встановити'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};