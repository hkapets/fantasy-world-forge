import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, MapPin, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { WorldMap, MapMarker, useMapsData } from '@/hooks/useMapsData';
import { CreateMarkerModal } from '../Modal/CreateMarkerModal';

interface MapViewProps {
  map: WorldMap;
  onClose: () => void;
  currentWorldId: string;
}

export const MapView: React.FC<MapViewProps> = ({ map, onClose, currentWorldId }) => {
  const { markers, addMarker, updateMarker, deleteMarker, getMarkersByMap } = useMapsData(currentWorldId);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isCreateMarkerModalOpen, setIsCreateMarkerModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState<MapMarker | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<Set<string>>(new Set());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapMarkers = getMarkersByMap(map.id);

  // Ініціалізуємо всі маркери як видимі
  useEffect(() => {
    setVisibleMarkers(new Set(mapMarkers.map(m => m.id)));
  }, [mapMarkers]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker || !mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });
    setIsCreateMarkerModalOpen(true);
    setIsAddingMarker(false);
  };

  const handleCreateMarker = (markerData: Omit<MapMarker, 'id' | 'mapId' | 'createdAt' | 'lastModified'>) => {
    if (clickPosition) {
      const newMarker = addMarker({
        ...markerData,
        mapId: map.id,
        x: clickPosition.x,
        y: clickPosition.y
      });
      setVisibleMarkers(prev => new Set([...prev, newMarker.id]));
      setClickPosition(null);
    }
  };

  const handleEditMarker = (markerData: Omit<MapMarker, 'id' | 'mapId' | 'createdAt' | 'lastModified'>) => {
    if (editingMarker) {
      updateMarker(editingMarker.id, markerData);
      setEditingMarker(null);
    }
  };

  const handleDeleteMarker = (markerId: string) => {
    if (confirm('Видалити маркер?')) {
      deleteMarker(markerId);
      setVisibleMarkers(prev => {
        const newSet = new Set(prev);
        newSet.delete(markerId);
        return newSet;
      });
    }
  };

  const toggleMarkerVisibility = (markerId: string) => {
    setVisibleMarkers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(markerId)) {
        newSet.delete(markerId);
      } else {
        newSet.add(markerId);
      }
      return newSet;
    });
  };

  const getMarkerStyle = (marker: MapMarker) => {
    const isVisible = visibleMarkers.has(marker.id);
    const sizeMap = { small: 8, medium: 12, large: 16 };
    
    return {
      position: 'absolute' as const,
      left: `${marker.x}%`,
      top: `${marker.y}%`,
      transform: 'translate(-50%, -50%)',
      width: `${sizeMap[marker.size]}px`,
      height: `${sizeMap[marker.size]}px`,
      backgroundColor: marker.color,
      borderRadius: '50%',
      border: '2px solid white',
      cursor: 'pointer',
      opacity: isVisible ? 1 : 0.3,
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease'
    };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--background)',
        borderRadius: '12px',
        maxWidth: '95vw',
        maxHeight: '95vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Заголовок */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {map.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {map.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className={`btn ${isAddingMarker ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsAddingMarker(!isAddingMarker)}
              style={{ fontSize: '0.875rem' }}
            >
              <Plus size={16} style={{ marginRight: '0.25rem' }} />
              {isAddingMarker ? 'Скасувати' : 'Додати маркер'}
            </button>
            
            <button
              className="btn btn-ghost"
              onClick={onClose}
              style={{ padding: '0.5rem' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Контейнер карти */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Карта */}
          <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
            <div
              ref={mapContainerRef}
              onClick={handleMapClick}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '400px',
                cursor: isAddingMarker ? 'crosshair' : 'default',
                backgroundImage: map.imageUrl ? `url(${map.imageUrl})` : 
                               map.imageFile ? `url(${map.imageFile})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: 'var(--muted)'
              }}
            >
              {/* Маркери */}
              {mapMarkers.map(marker => (
                <div
                  key={marker.id}
                  style={getMarkerStyle(marker)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(marker);
                  }}
                  title={marker.title}
                />
              ))}

              {/* Інструкція для додавання маркерів */}
              {isAddingMarker && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  zIndex: 20
                }}>
                  Клікніть на карту щоб додати маркер
                </div>
              )}
            </div>
          </div>

          {/* Бічна панель з маркерами */}
          <div style={{
            width: '300px',
            borderLeft: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            overflow: 'auto'
          }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                Маркери ({mapMarkers.length})
              </h3>
              
              {mapMarkers.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Немає маркерів на карті
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mapMarkers.map(marker => {
                    const isVisible = visibleMarkers.has(marker.id);
                    return (
                      <div
                        key={marker.id}
                        className="card"
                        style={{
                          padding: '0.75rem',
                          border: selectedMarker?.id === marker.id ? '2px solid var(--primary)' : undefined
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: marker.color,
                              borderRadius: '50%',
                              border: '1px solid white',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                              flexShrink: 0,
                              marginTop: '0.25rem'
                            }}
                          />
                          
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                              {marker.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                              {marker.type} • {marker.entityName}
                            </div>
                            {marker.description && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {marker.description}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '0.25rem', 
                          marginTop: '0.5rem',
                          justifyContent: 'flex-end'
                        }}>
                          <button
                            className="btn btn-ghost"
                            onClick={() => toggleMarkerVisibility(marker.id)}
                            style={{ padding: '0.25rem', fontSize: '0.75rem' }}
                            title={isVisible ? 'Приховати' : 'Показати'}
                          >
                            {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button
                            className="btn btn-ghost"
                            onClick={() => {
                              setEditingMarker(marker);
                              setIsCreateMarkerModalOpen(true);
                            }}
                            style={{ padding: '0.25rem', fontSize: '0.75rem' }}
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            className="btn btn-ghost"
                            onClick={() => handleDeleteMarker(marker.id)}
                            style={{ padding: '0.25rem', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateMarkerModal
        isOpen={isCreateMarkerModalOpen}
        onClose={() => {
          setIsCreateMarkerModalOpen(false);
          setEditingMarker(null);
          setClickPosition(null);
        }}
        onSave={editingMarker ? handleEditMarker : handleCreateMarker}
        editingMarker={editingMarker}
        currentWorldId={currentWorldId}
      />
    </div>
  );
};