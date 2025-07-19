import React, { useState } from 'react';
import { MapPin, Plus, Eye, Trash2 } from 'lucide-react';
import { useCharacterMapIntegration } from '@/hooks/useCharacterMapIntegration';
import { useMapsData } from '@/hooks/useMapsData';

interface Character {
  id: string;
  worldId: string;
  name: string;
  birthPlace: string;
  status: string;
  image?: string;
  description: string;
}

interface CharacterLocationSyncProps {
  character: Character;
  onNavigateToMap?: (mapId: string, markerId?: string) => void;
}

export const CharacterLocationSync: React.FC<CharacterLocationSyncProps> = ({
  character,
  onNavigateToMap
}) => {
  const { 
    findRelevantMapsForCharacter, 
    getMarkersForCharacter, 
    createCharacterMarker,
    removeCharacterMarkers
  } = useCharacterMapIntegration(character.worldId);
  
  const { maps } = useMapsData(character.worldId);
  const [selectedMapId, setSelectedMapId] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ x: 50, y: 50 });

  const relevantMaps = findRelevantMapsForCharacter(character);
  const characterMarkers = getMarkersForCharacter(character.id);

  const handleCreateMarker = () => {
    if (!selectedMapId) {
      alert('Оберіть карту для створення маркера');
      return;
    }

    createCharacterMarker(
      character,
      selectedMapId,
      markerPosition.x,
      markerPosition.y
    );
  };

  const handleRemoveAllMarkers = () => {
    if (confirm(`Видалити всі маркери персонажа "${character.name}" з карт?`)) {
      removeCharacterMarkers(character.id);
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h4 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <MapPin size={20} style={{ color: 'var(--fantasy-primary)' }} />
        Локації на картах
      </h4>

      {/* Поточні маркери */}
      {characterMarkers.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem'
          }}>
            Персонаж присутній на картах ({characterMarkers.length}):
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {characterMarkers.map(marker => {
              const map = maps.find(m => m.id === marker.mapId);
              return (
                <div
                  key={marker.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: marker.color,
                        borderRadius: '50%',
                        border: '1px solid white',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    />
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-primary)'
                    }}>
                      {map?.name || 'Невідома карта'}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      ({marker.x.toFixed(1)}%, {marker.y.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {onNavigateToMap && (
                      <button
                        className="btn btn-ghost"
                        onClick={() => onNavigateToMap(marker.mapId, marker.id)}
                        style={{ padding: '0.25rem', fontSize: '0.75rem' }}
                        title="Переглянути на карті"
                      >
                        <Eye size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {characterMarkers.length > 1 && (
            <button
              className="btn btn-danger"
              onClick={handleRemoveAllMarkers}
              style={{
                fontSize: '0.75rem',
                padding: '0.5rem 1rem',
                marginTop: '0.75rem'
              }}
            >
              <Trash2 size={14} style={{ marginRight: '0.25rem' }} />
              Видалити всі маркери
            </button>
          )}
        </div>
      )}

      {/* Рекомендовані карти */}
      {relevantMaps.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem'
          }}>
            Рекомендовані карти для "{character.birthPlace}":
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {relevantMaps.map(map => {
              const hasMarker = characterMarkers.some(marker => marker.mapId === map.id);
              
              return (
                <div
                  key={map.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: hasMarker ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: hasMarker ? '1px solid var(--success)' : '1px solid var(--border-primary)'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)'
                    }}>
                      {map.name}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      {map.description}
                    </div>
                  </div>
                  
                  {hasMarker ? (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--success)',
                      fontWeight: '500'
                    }}>
                      ✓ Додано
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const x = 30 + Math.random() * 40;
                        const y = 30 + Math.random() * 40;
                        createCharacterMarker(character, map.id, x, y);
                      }}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.5rem 0.75rem'
                      }}
                    >
                      <Plus size={12} style={{ marginRight: '0.25rem' }} />
                      Додати
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ручне додавання на карту */}
      <div>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem'
        }}>
          Додати на іншу карту:
        </div>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1 }}>
            <select
              className="input"
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(e.target.value)}
              style={{ fontSize: '0.875rem' }}
            >
              <option value="">Оберіть карту</option>
              {maps
                .filter(map => !characterMarkers.some(marker => marker.mapId === map.id))
                .map(map => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
            </select>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleCreateMarker}
            disabled={!selectedMapId}
            style={{
              fontSize: '0.875rem',
              padding: '0.75rem 1rem'
            }}
          >
            <Plus size={14} style={{ marginRight: '0.25rem' }} />
            Додати
          </button>
        </div>
        
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: '0.5rem'
        }}>
          Маркер буде створено в випадковій позиції на карті
        </div>
      </div>
    </div>
  );
};