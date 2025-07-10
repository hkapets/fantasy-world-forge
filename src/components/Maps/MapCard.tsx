import React from 'react';
import { Map, MapPin, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { WorldMap, MapMarker } from '@/hooks/useMapsData';

interface MapCardProps {
  map: WorldMap;
  markers: MapMarker[];
  onView: (map: WorldMap) => void;
  onEdit: (map: WorldMap) => void;
  onDelete: (mapId: string) => void;
}

export const MapCard: React.FC<MapCardProps> = ({
  map,
  markers,
  onView,
  onEdit,
  onDelete
}) => {
  const handleDeleteClick = () => {
    if (confirm('Видалити карту? Це також видалить всі маркери на ній.')) {
      onDelete(map.id);
    }
  };

  return (
    <div 
      className="card hover-scale animate-fade-in" 
      style={{ 
        padding: '1.5rem',
        transition: 'var(--transition-smooth)'
      }}
    >
      {/* Превью карти */}
      <div 
        className="map-preview"
        style={{
          height: '200px',
          background: map.imageUrl || map.imageFile 
            ? `url(${map.imageFile || map.imageUrl})` 
            : 'var(--bg-secondary)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--border-primary)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!map.imageUrl && !map.imageFile && (
          <Map size={48} style={{ color: 'var(--text-muted)' }} />
        )}
        
        {/* Оверлей з кількістю маркерів */}
        {markers.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <MapPin size={12} />
            {markers.length}
          </div>
        )}

        {/* Індикатор публічності */}
        {map.isPublic && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: 'var(--success)',
            color: 'white',
            padding: '0.25rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={12} />
          </div>
        )}
      </div>

      {/* Інформація про карту */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.3'
        }}>
          {map.name}
        </h3>
        
        {map.description && (
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.875rem',
            marginBottom: '0.75rem',
            lineHeight: '1.4'
          }}>
            {map.description.length > 100 
              ? `${map.description.substring(0, 100)}...` 
              : map.description}
          </p>
        )}

        {/* Метадані */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={12} />
            {markers.length} маркерів
          </div>
          
          <div>
            {map.width} × {map.height} px
          </div>
          
          {map.scale !== 1 && (
            <div>
              Масштаб: {map.scale}x
            </div>
          )}
        </div>

        {/* Дата створення */}
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          Створено: {new Date(map.createdAt).toLocaleDateString('uk-UA')}
        </div>
      </div>

      {/* Теги */}
      {map.tags.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {map.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="animate-scale-in"
              style={{
                padding: '0.25rem 0.5rem',
                background: 'var(--fantasy-primary-subtle)',
                color: 'var(--fantasy-primary)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}
            >
              {tag}
            </span>
          ))}
          {map.tags.length > 3 && (
            <span style={{
              padding: '0.25rem 0.5rem',
              background: 'var(--bg-muted)',
              color: 'var(--text-muted)',
              borderRadius: '0.25rem',
              fontSize: '0.75rem'
            }}>
              +{map.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Дії */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-primary)'
      }}>
        <button
          className="btn btn-primary story-link"
          onClick={() => onView(map)}
          style={{ 
            flex: 1,
            transition: 'var(--transition-smooth)'
          }}
        >
          <Eye size={16} style={{ marginRight: '0.5rem' }} />
          Переглянути
        </button>
        
        <button
          className="btn btn-secondary hover-scale"
          onClick={() => onEdit(map)}
          style={{
            transition: 'var(--transition-smooth)'
          }}
          title="Редагувати карту"
        >
          <Edit size={16} />
        </button>
        
        <button
          className="btn btn-danger hover-scale"
          onClick={handleDeleteClick}
          style={{
            transition: 'var(--transition-smooth)'
          }}
          title="Видалити карту"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};