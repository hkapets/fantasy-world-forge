import React, { useState } from 'react';
import { Shuffle, Copy, Download, Wand2, Users, MapPin, Crown } from 'lucide-react';
import { Modal } from '../Modal/Modal';
import { NameGenerator, useNameGenerator } from '@/lib/nameGenerator';

interface NameGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectName?: (name: string) => void;
  generationType?: 'character' | 'location' | 'organization';
}

export const NameGeneratorModal: React.FC<NameGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectName,
  generationType = 'character'
}) => {
  const { generatedNames, isGenerating, generateNames, generateLocationNames, generateOrganizationNames } = useNameGenerator();
  
  const [settings, setSettings] = useState({
    race: 'human',
    gender: 'male' as 'male' | 'female',
    includeTitle: false,
    includeNickname: false,
    count: 8,
    locationType: 'city' as 'city' | 'village' | 'forest' | 'mountain' | 'river',
    organizationType: 'guild' as 'guild' | 'order' | 'clan' | 'house'
  });

  const handleGenerate = () => {
    switch (generationType) {
      case 'character':
        generateNames(
          settings.count,
          settings.race,
          settings.gender,
          settings.includeTitle,
          settings.includeNickname
        );
        break;
      case 'location':
        generateLocationNames(settings.count, settings.locationType);
        break;
      case 'organization':
        generateOrganizationNames(settings.count, settings.organizationType);
        break;
    }
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      // Можна додати toast повідомлення
    });
  };

  const exportNames = () => {
    const data = generatedNames.join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-${generationType}-names.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderCharacterSettings = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Раса
          </label>
          <select
            className="input"
            value={settings.race}
            onChange={(e) => setSettings(prev => ({ ...prev, race: e.target.value }))}
          >
            {NameGenerator.getAvailableRaces().map(race => (
              <option key={race} value={race}>
                {race === 'human' ? 'Людина' :
                 race === 'elf' ? 'Ельф' :
                 race === 'dwarf' ? 'Дворф' :
                 race === 'orc' ? 'Орк' : race}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Стать
          </label>
          <select
            className="input"
            value={settings.gender}
            onChange={(e) => setSettings(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
          >
            <option value="male">Чоловіча</option>
            <option value="female">Жіноча</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
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
            checked={settings.includeTitle}
            onChange={(e) => setSettings(prev => ({ ...prev, includeTitle: e.target.checked }))}
          />
          Включати титули (Сер, Лорд, тощо)
        </label>

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
            checked={settings.includeNickname}
            onChange={(e) => setSettings(prev => ({ ...prev, includeNickname: e.target.checked }))}
          />
          Включати прізвиська ("Хоробрий", "Мудрий")
        </label>
      </div>
    </>
  );

  const renderLocationSettings = () => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
        color: 'var(--text-primary)'
      }}>
        Тип локації
      </label>
      <select
        className="input"
        value={settings.locationType}
        onChange={(e) => setSettings(prev => ({ ...prev, locationType: e.target.value as any }))}
      >
        <option value="city">Місто</option>
        <option value="village">Село</option>
        <option value="forest">Ліс</option>
        <option value="mountain">Гора</option>
        <option value="river">Річка</option>
      </select>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.5rem',
        color: 'var(--text-primary)'
      }}>
        Тип організації
      </label>
      <select
        className="input"
        value={settings.organizationType}
        onChange={(e) => setSettings(prev => ({ ...prev, organizationType: e.target.value as any }))}
      >
        <option value="guild">Гільдія</option>
        <option value="order">Орден</option>
        <option value="clan">Клан</option>
        <option value="house">Дім</option>
      </select>
    </div>
  );

  const getIcon = () => {
    switch (generationType) {
      case 'character': return Users;
      case 'location': return MapPin;
      case 'organization': return Crown;
      default: return Wand2;
    }
  };

  const getTitle = () => {
    switch (generationType) {
      case 'character': return 'Генератор імен персонажів';
      case 'location': return 'Генератор назв локацій';
      case 'organization': return 'Генератор назв організацій';
      default: return 'Генератор імен';
    }
  };

  const Icon = getIcon();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      maxWidth="600px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Іконка та опис */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)'
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
            <Icon size={24} style={{ color: 'white' }} />
          </div>
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '0.25rem'
            }}>
              {getTitle()}
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Генеруйте унікальні імена для вашого фентезійного світу
            </p>
          </div>
        </div>

        {/* Налаштування */}
        <div>
          <h5 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Налаштування генерації
          </h5>

          {generationType === 'character' && renderCharacterSettings()}
          {generationType === 'location' && renderLocationSettings()}
          {generationType === 'organization' && renderOrganizationSettings()}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Кількість імен: {settings.count}
            </label>
            <input
              type="range"
              min="3"
              max="20"
              value={settings.count}
              onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Кнопка генерації */}
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem'
          }}
        >
          <Shuffle size={20} />
          {isGenerating ? 'Генерую...' : 'Згенерувати імена'}
        </button>

        {/* Результати */}
        {generatedNames.length > 0 && (
          <div>
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
                Згенеровані імена ({generatedNames.length})
              </h5>
              
              <button
                className="btn btn-secondary"
                onClick={exportNames}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Download size={14} />
                Експорт
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.5rem',
              maxHeight: '300px',
              overflow: 'auto',
              padding: '0.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)'
            }}>
              {generatedNames.map((name, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-primary)',
                    cursor: onSelectName ? 'pointer' : 'default'
                  }}
                  onClick={() => onSelectName?.(name)}
                >
                  <span style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {name}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(name);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginLeft: '0.5rem'
                    }}
                    title="Копіювати"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>

            {onSelectName && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: '0.75rem'
              }}>
                Клікніть на ім'я щоб вибрати його
              </div>
            )}
          </div>
        )}

        {/* Підказки */}
        <div style={{
          padding: '1rem',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <strong>Підказки:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
            <li>Генератор використовує офлайн словники</li>
            <li>Імена адаптовані під українську мову</li>
            <li>Можна експортувати список для подальшого використання</li>
            <li>Кожна раса має унікальний стиль імен</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};