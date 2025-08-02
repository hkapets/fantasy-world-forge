import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Plus, MapPin, Edit, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, Maximize, RotateCcw, Move } from 'lucide-react';
import { WorldMap, MapMarker, useMapsData } from '@/hooks/useMapsData';
import { CreateMarkerModal } from '../Modal/CreateMarkerModal';
import { useCharacterMapIntegration } from '@/hooks/useCharacterMapIntegration';
import { QuickLinksPanel } from '../Common/QuickLinksPanel';

interface MapViewProps {
  map: WorldMap;
  onClose: () => void;
  currentWorldId: string;
}

export const MapView: React.FC<MapViewProps> = ({ map, onClose, currentWorldId }) => {
  const { markers, addMarker, updateMarker, deleteMarker, getMarkersByMap } = useMapsData(currentWorldId);
  const { syncCharacterMarkers, getCharacterColor } = useCharacterMapIntegration(currentWorldId);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isCreateMarkerModalOpen, setIsCreateMarkerModalOpen] = useState(false);
  const [editingMarker, setEditingMarker] = useState<MapMarker | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLDivElement>(null);

  const mapMarkers = getMarkersByMap(map.id);

  // Зум функції
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.2));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handleFitToScreen = () => {
    if (!mapContainerRef.current || !mapImageRef.current) return;
    
    const container = mapContainerRef.current;
    const containerRatio = container.clientWidth / container.clientHeight;
    const imageRatio = map.width / map.height;
    
    let newZoom;
    if (containerRatio > imageRatio) {
      newZoom = container.clientHeight / map.height * 0.9;
    } else {
      newZoom = container.clientWidth / map.width * 0.9;
    }
    
    setZoom(Math.max(0.2, Math.min(5, newZoom)));
    setPan({ x: 0, y: 0 });
  };

  // Панування
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAddingMarker) return;
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isAddingMarker]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Оновлення позиції миші для координат
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left - pan.x) / zoom / rect.width) * 100;
      const y = ((e.clientY - rect.top - pan.y) / zoom / rect.height) * 100;
      setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }

    // Панування
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, pan, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Колесо миші для зуму
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.2, Math.min(5, prev * zoomFactor)));
  }, []);

  // Ініціалізуємо всі маркери як видимі
  useEffect(() => {
    setVisibleMarkers(new Set(mapMarkers.map(m => m.id)));
    // Синхронізуємо маркери персонажів при відкритті карти
    syncCharacterMarkers();
  }, [mapMarkers]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker || !mapContainerRef.current || isPanning) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left - pan.x) / zoom / rect.width) * 100;
    const y = ((event.clientY - rect.top - pan.y) / zoom / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;

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
    
    // Використовуємо розумний колір для персонажів
    let markerColor = marker.color;
    if (marker.type === 'character') {
      // Можемо оновити колір на основі актуального статусу персонажа
      markerColor = marker.color; // Поки що залишаємо як є
    }
    
    return {
      position: 'absolute' as const,
      left: `${marker.x}%`,
      top: `${marker.y}%`,
      transform: `translate(-50%, -50%) scale(${Math.max(0.5, Math.min(2, zoom))})`,
      width: `${sizeMap[marker.size]}px`,
      height: `${sizeMap[marker.size]}px`,
      backgroundColor: markerColor,
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
            {/* Контроли зуму */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                className="btn btn-ghost"
                onClick={handleZoomIn}
                title="Збільшити"
                style={{ padding: '0.5rem' }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleZoomOut}
                title="Зменшити"
                style={{ padding: '0.5rem' }}
              >
                <ZoomOut size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleFitToScreen}
                title="Вмістити на екран"
                style={{ padding: '0.5rem' }}
              >
                <Maximize size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleResetView}
                title="Скинути вигляд"
                style={{ padding: '0.5rem' }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowMiniMap(!showMiniMap)}
                title="Міні-карта"
                style={{ padding: '0.5rem' }}
              >
                <MapPin size={16} />
              </button>
            </div>
            
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
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Координати та зум */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              padding: '0.5rem',
              fontSize: '0.75rem',
              zIndex: 15,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div>Зум: {(zoom * 100).toFixed(0)}%</div>
              <div>X: {mousePosition.x.toFixed(1)}%</div>
              <div>Y: {mousePosition.y.toFixed(1)}%</div>
            </div>

            {/* Міні-карта */}
            {showMiniMap && (
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                width: '150px',
                height: '100px',
                backgroundColor: 'var(--background)',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                zIndex: 15,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: map.imageUrl ? `url(${map.imageUrl})` : 
                                 map.imageFile ? `url(${map.imageFile})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: 'var(--muted)',
                  position: 'relative'
                }}>
                  {/* Viewport indicator */}
                  <div style={{
                    position: 'absolute',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    left: `${50 - (50 / zoom)}%`,
                    top: `${50 - (50 / zoom)}%`,
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`,
                    transform: `translate(${-pan.x / (zoom * 3)}px, ${-pan.y / (zoom * 3)}px)`
                  }} />
                  {/* Міні маркери */}
                  {mapMarkers.filter(m => visibleMarkers.has(m.id)).map(marker => (
                    <div
                      key={marker.id}
                      style={{
                        position: 'absolute',
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                        width: '3px',
                        height: '3px',
                        backgroundColor: marker.type === 'character' ? getCharacterColor(marker.description.split('•')[0]?.trim() || '') : marker.color,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div
              ref={mapContainerRef}
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '400px',
                cursor: isAddingMarker ? 'crosshair' : isPanning ? 'grabbing' : 'grab',
                overflow: 'hidden',
                backgroundColor: 'var(--muted)'
              }}
            >
              <div
                ref={mapImageRef}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                  transformOrigin: 'center',
                  width: '80%',
                  height: '80%',
                  backgroundImage: map.imageUrl ? `url(${map.imageUrl})` : 
                                 map.imageFile ? `url(${map.imageFile})` : 'none',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  transition: isPanning ? 'none' : 'transform 0.2s ease'
                }}
              >
                {/* Маркери */}
                {mapMarkers.map(marker => (
                  <div
                    key={marker.id}
                    style={getMarkerStyle(marker)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPanning) {
                        setSelectedMarker(marker);
                      }
                    }}
                    title={marker.title}
                  />
                ))}
              </div>

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
                              backgroundColor: marker.type === 'character' ? getCharacterColor(marker.description.split('•')[0]?.trim() || '') : marker.color,
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
                              {marker.type === 'character' && (
                                <span style={{
                                  fontSize: '0.75rem',
                                  marginLeft: '0.5rem',
                                  padding: '0.125rem 0.375rem',
                                  background: 'var(--fantasy-primary)',
                                  color: 'white',
                                  borderRadius: 'var(--radius-sm)'
                                }}>
                                  Персонаж
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                              {marker.type === 'character' ? 'Персонаж' : marker.type} • {marker.entityName}
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

      {/* Панель швидких зв'язків */}
      <QuickLinksPanel
        entityId={map.id}
        entityType="map"
        entityName={map.name}
        worldId={currentWorldId}
        onNavigate={(entityType, entityId) => {
          console.log('Navigate to:', entityType, entityId);
        }}
      />
    </div>
  );
};