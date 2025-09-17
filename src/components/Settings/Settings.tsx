import React, { useState, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Download, Upload, Trash2, RefreshCw, Globe, Palette, Package } from 'lucide-react';
import { DatabaseSettings } from './DatabaseSettings';
import { ExportWizard } from '../Export/ExportWizard';
import { useWorldsData } from '@/hooks/useLocalStorage';
import { PluginManager } from './PluginManager';
import { PluginStore } from './PluginStore';

interface SettingsProps {
  currentWorldId: string | null;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  language: 'uk' | 'en' | 'pl';
  autoSave: boolean;
  autoSaveInterval: number; // в хвилинах
  showAnimations: boolean;
  compactMode: boolean;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  soundEnabled: true,
  language: 'uk',
  autoSave: true,
  autoSaveInterval: 5,
  showAnimations: true,
  compactMode: false
};

export const Settings: React.FC<SettingsProps> = ({ currentWorldId }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showExportWizard, setShowExportWizard] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'plugins' | 'store'>('general');
  const { getCurrentWorld } = useWorldsData();

  // Завантаження налаштувань з localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('fantasyWorldBuilder_settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Збереження налаштувань
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('fantasyWorldBuilder_settings', JSON.stringify(newSettings));
    
    // Застосування теми
    applyTheme(newSettings.theme);
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const allData = {
        worlds: JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]'),
        characters: JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]'),
        settings: settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Додаємо дані з усіх світів
      const worlds = allData.worlds;
      for (const world of worlds) {
        allData[`lore_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${world.id}`) || '[]');
        allData[`chronologies_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_chronologies_${world.id}`) || '[]');
        allData[`events_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${world.id}`) || '[]');
        allData[`notes_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${world.id}`) || '[]');
        allData[`relationships_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${world.id}`) || '[]');
        allData[`maps_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${world.id}`) || '[]');
        allData[`markers_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_markers_${world.id}`) || '[]');
        allData[`scenarios_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_scenarios`) || '[]').filter((s: any) => s.worldId === world.id);
      }

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `fantasy-world-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка при експорті даних');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (confirm('Це замінить всі поточні дані. Ви впевнені?')) {
          // Відновлюємо всі дані
          Object.keys(importedData).forEach(key => {
            if (key.startsWith('fantasyWorldBuilder_') || 
                key.includes('lore_') || 
                key.includes('chronologies_') || 
                key.includes('events_') ||
                key.includes('notes_') ||
                key.includes('relationships_') ||
                key.includes('maps_') ||
                key.includes('markers_') ||
                key.includes('scenarios_')) {
              localStorage.setItem(key, JSON.stringify(importedData[key]));
            }
          });

          // Відновлюємо налаштування
          if (importedData.settings) {
            saveSettings(importedData.settings);
          }

          alert('Дані успішно імпортовано! Перезавантажте сторінку.');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('Помилка при імпорті даних. Перевірте файл.');
      } finally {
        setIsImporting(false);
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('Це видалить ВСІ дані застосунку назавжди. Ви впевнені?')) {
      if (confirm('Останнє попередження! Всі світи, персонажі та дані будуть втрачені!')) {
        // Очищаємо localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('fantasyWorldBuilder_')) {
            localStorage.removeItem(key);
          }
        });
        
        // Скидаємо налаштування
        setSettings(defaultSettings);
        localStorage.setItem('fantasyWorldBuilder_settings', JSON.stringify(defaultSettings));
        
        alert('Всі дані очищено! Перезавантажте сторінку.');
      }
    }
  };

  const handleResetSettings = () => {
    if (confirm('Скинути всі налаштування до значень за замовчуванням?')) {
      saveSettings(defaultSettings);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Заголовок */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}>
          ⚙️ Налаштування
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Персоналізуйте ваш досвід роботи з Fantasy World Builder
        </p>
      </div>

      {/* Вкладки */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        {[
          { id: 'general', label: 'Загальні', icon: '⚙️' },
          { id: 'database', label: 'База даних', icon: '🗄️' },
          { id: 'plugins', label: 'Плагіни', icon: '🧩' },
          { id: 'store', label: 'Магазин', icon: '🏪' }
        ].map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              fontSize: '0.875rem',
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      {activeTab === 'general' && (
        <>
      {/* Розділ Зовнішній вигляд */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Palette size={24} />
          Зовнішній вигляд
        </h2>

        {/* Тема */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)'
          }}>
            Тема інтерфейсу
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { value: 'dark', label: 'Темна', icon: Moon },
              { value: 'light', label: 'Світла', icon: Sun },
              { value: 'auto', label: 'Автоматично', icon: RefreshCw }
            ].map(theme => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.value}
                  className={settings.theme === theme.value ? 'btn btn-primary' : 'btn btn-secondary'}
                  onClick={() => handleSettingChange('theme', theme.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: '120px'
                  }}
                >
                  <Icon size={16} />
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Анімації */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={settings.showAnimations}
              onChange={(e) => handleSettingChange('showAnimations', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Показувати анімації та переходи
          </label>
        </div>

        {/* Компактний режим */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Компактний режим (менші відступи)
          </label>
        </div>
      </div>

      {/* Розділ Звук */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Volume2 size={24} />
          Звукові ефекти
        </h2>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            Увімкнути звукові ефекти
          </label>
        </div>
      </div>

      {/* Розділ Мова */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Globe size={24} />
          Мова інтерфейсу
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { value: 'uk', label: '🇺🇦 Українська' },
            { value: 'en', label: '🇺🇸 English' },
            { value: 'pl', label: '🇵🇱 Polski' }
          ].map(lang => (
            <button
              key={lang.value}
              className={settings.language === lang.value ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => handleSettingChange('language', lang.value)}
              style={{ minWidth: '140px' }}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          marginTop: '0.75rem'
        }}>
          Наразі доступна лише українська мова. Інші мови будуть додані в майбутніх оновленнях.
        </p>
      </div>

      {/* Розділ Автозбереження */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          💾 Автозбереження
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            Увімкнути автоматичне збереження
          </label>

          {settings.autoSave && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)'
              }}>
                Інтервал збереження: {settings.autoSaveInterval} хв
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.autoSaveInterval}
                onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: '300px'
                }}
              />
            </div>
          )}
        
        </div>
      </div>

      {/* Розділ База даних */}
      <DatabaseSettings />

      {/* Розділ Дані */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        
        }}>
          📁 Управління даними
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Експорт */}
          <button
            className="btn btn-primary"
            onClick={() => setShowExportWizard(true)}
            disabled={isExporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}
          >
            <Package size={20} />
            {isExporting ? 'Експортування...' : 'Розширений експорт'}
          </button>

          {/* Імпорт */}
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
              id="import-file"
              disabled={isImporting}
            />
            <label
              htmlFor="import-file"
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                cursor: isImporting ? 'not-allowed' : 'pointer',
                opacity: isImporting ? 0.6 : 1
              }}
            >
              <Upload size={20} />
              {isImporting ? 'Імпортування...' : 'Імпортувати дані'}
            </label>
          </div>

          {/* Скидання налаштувань */}
          <button
            className="btn btn-secondary"
            onClick={handleResetSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={20} />
            Ск
            инути налаштування
          </button>

          {/* Очищення всіх даних */}
          <button
            className="btn btn-danger"
            onClick={handleClearAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}
          >
            
            <Trash2 size={20} />
            Очистити всі дані
          </button>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <strong>Примітка:</strong> Експорт включає всі світи, персонажів, лор, хронології, нотатки, зв'язки, карти та налаштування. 
          Рекомендуємо регулярно створювати резервні копії ваших даних.
        </div>
      </div>

      {/* Інформація про версію */}
      <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}>
          Fantasy World Builder
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Версія 1.0.0 • Створено з ❤️ для фентезійних світів
        </p>
      </div>
        </>
      )}

      {activeTab === 'database' && <DatabaseSettings />}
      {activeTab === 'plugins' && <PluginManager />}
      {activeTab === 'store' && <PluginStore />}

      {/* Експорт візард */}
      {showExportWizard && currentWorldId && (
        <ExportWizard
          isOpen={showExportWizard}
          onClose={() => setShowExportWizard(false)}
          worldId={currentWorldId}
          worldName={getCurrentWorld()?.name || 'Невідомий світ'}
        />
      )}
    </div>
  );
};