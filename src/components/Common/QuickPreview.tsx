import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Clock, MapPin, FileText, Film, Calendar, Eye } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface QuickPreviewProps {
  entityType: 'character' | 'lore' | 'chronology' | 'event' | 'note' | 'map' | 'scenario';
  entityId: string;
  worldId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: () => void;
  position?: { x: number; y: number };
}

const entityTypeIcons = {
  character: Users,
  lore: BookOpen,
  chronology: Clock,
  event: Calendar,
  note: FileText,
  map: MapPin,
  scenario: Film
};

const entityTypeLabels = {
  character: 'Персонаж',
  lore: 'Лор',
  chronology: 'Хронологія',
  event: 'Подія',
  note: 'Нотатка',
  map: 'Карта',
  scenario: 'Сценарій'
};

export const QuickPreview: React.FC<QuickPreviewProps> = ({
  entityType,
  entityId,
  worldId,
  isOpen,
  onClose,
  onNavigate,
  position
}) => {
  const [entityData, setEntityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !entityId) return;

    setLoading(true);
    
    const loadEntityData = async () => {
      try {
        let data = null;

        switch (entityType) {
          case 'character':
            const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
            data = characters.find((char: any) => char.id === entityId && char.worldId === worldId);
            break;

          case 'lore':
            const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
            data = loreItems.find((item: any) => item.id === entityId);
            break;

          case 'chronology':
            const chronologies = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_chronologies_${worldId}`) || '[]');
            data = chronologies.find((chron: any) => chron.id === entityId);
            break;

          case 'event':
            const events = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${worldId}`) || '[]');
            data = events.find((event: any) => event.id === entityId);
            break;

          case 'note':
            const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
            data = notes.find((note: any) => note.id === entityId);
            break;

          case 'map':
            const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
            data = maps.find((map: any) => map.id === entityId);
            break;

          case 'scenario':
            const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
            data = scenarios.find((scenario: any) => scenario.id === entityId && scenario.worldId === worldId);
            break;
        }

        setEntityData(data);
      } catch (error) {
        console.error('Error loading entity data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntityData();
  }, [entityType, entityId, worldId, isOpen]);

  if (!isOpen || !entityData) return null;

  const Icon = entityTypeIcons[entityType];
  const label = entityTypeLabels[entityType];

  const getEntityTitle = () => {
    switch (entityType) {
      case 'character':
        return entityData.name;
      case 'lore':
        return entityData.name;
      case 'chronology':
        return entityData.name;
      case 'event':
        return entityData.name;
      case 'note':
        return entityData.title;
      case 'map':
        return entityData.name;
      case 'scenario':
        return entityData.title;
      default:
        return 'Невідомо';
    }
  };

  const getEntityDescription = () => {
    switch (entityType) {
      case 'character':
        return `${entityData.race || ''} ${entityData.characterClass || ''}`.trim() || entityData.description;
      case 'lore':
        return entityData.description;
      case 'chronology':
        return entityData.description;
      case 'event':
        return `${entityData.date} рік: ${entityData.description}`;
      case 'note':
        return entityData.content;
      case 'map':
        return entityData.description;
      case 'scenario':
        return entityData.description;
      default:
        return '';
    }
  };

  const getEntityImage = () => {
    return entityData.image || entityData.imageUrl || entityData.imageFile;
  };

  const getEntityMetadata = () => {
    switch (entityType) {
      case 'character':
        return [
          { label: 'Статус', value: entityData.status },
          { label: 'Місце народження', value: entityData.birthPlace },
          { label: 'Дата народження', value: entityData.birthDate }
        ].filter(item => item.value);

      case 'event':
        return [
          { label: 'Рік', value: entityData.date?.toString() },
          { label: 'Тип', value: entityData.type },
          { label: 'Локації', value: entityData.relatedLocations },
          { label: 'Персонажі', value: entityData.relatedCharacters }
        ].filter(item => item.value);

      case 'map':
        return [
          { label: 'Розмір', value: `${entityData.width} × ${entityData.height}` },
          { label: 'Публічна', value: entityData.isPublic ? 'Так' : 'Ні' }
        ];

      case 'scenario':
        return [
          { label: 'Тип', value: entityData.type },
          { label: 'Складність', value: entityData.difficulty },
          { label: 'Статус', value: entityData.status },
          { label: 'Тривалість', value: entityData.estimatedDuration },
          { label: 'Гравці', value: entityData.playerCount }
        ].filter(item => item.value);

      default:
        return [];
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-secondary)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-modal)',
    padding: '1.5rem',
    maxWidth: '400px',
    width: '90vw',
    maxHeight: '80vh',
    overflow: 'auto',
    zIndex: 1001,
    animation: 'modalIn 0.2s ease',
    ...(position ? {
      left: Math.min(position.x, window.innerWidth - 420),
      top: Math.min(position.y, window.innerHeight - 300)
    } : {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    })
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}
        onClick={onClose}
      />

      {/* Preview content */}
      <div style={containerStyle}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: 'var(--text-muted)'
          }}>
            Завантаження...
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Icon size={20} style={{ color: 'var(--fantasy-primary)' }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {label}
                </span>
              </div>
              
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Image */}
            {getEntityImage() && (
              <div style={{
                width: '100%',
                height: '150px',
                background: `url(${getEntityImage()}) center/cover`,
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-primary)'
              }} />
            )}

            {/* Title */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              lineHeight: '1.3'
            }}>
              {getEntityTitle()}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
              marginBottom: '1rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical'
            }}>
              {getEntityDescription()}
            </p>

            {/* Metadata */}
            {getEntityMetadata().length > 0 && (
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}>
                {getEntityMetadata().map((meta, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: index < getEntityMetadata().length - 1 ? '0.5rem' : 0,
                      fontSize: '0.75rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>
                      {meta.label}:
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {meta.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {entityData.tags && entityData.tags.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Теги
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem'
                }}>
                  {entityData.tags.slice(0, 6).map((tag: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '0.625rem',
                        padding: '0.25rem 0.5rem',
                        background: 'var(--fantasy-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {entityData.tags.length > 6 && (
                    <span style={{
                      fontSize: '0.625rem',
                      padding: '0.25rem 0.5rem',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      +{entityData.tags.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-primary)'
            }}>
              {onNavigate && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onNavigate();
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <Eye size={16} />
                  Детальний перегляд
                </button>
              )}
              
              <button
                className="btn btn-secondary"
                onClick={onClose}
                style={{
                  fontSize: '0.875rem',
                  padding: '0.75rem 1rem'
                }}
              >
                Закрити
              </button>
            </div>

            {/* Creation date */}
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '0.75rem'
            }}>
              Створено {new Date(entityData.createdAt).toLocaleDateString('uk-UA')}
            </div>
          </>
        )}
      </div>
    </>
  );
};