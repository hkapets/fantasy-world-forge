import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useMapsData, WorldMap } from '@/hooks/useMapsData';
import { CreateMapModal } from '../Modal/CreateMapModal';
import { MapCard } from './MapCard';
import { MapView } from './MapView';

interface MapsProps {
  currentWorldId: string | null;
}

export const Maps: React.FC<MapsProps> = ({ currentWorldId }) => {
  const { maps, markers, addMap, updateMap, deleteMap, getMarkersByMap, searchMaps } = useMapsData(currentWorldId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<WorldMap | null>(null);
  const [viewingMap, setViewingMap] = useState<WorldMap | null>(null);

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи з картами
      </div>
    );
  }

  const filteredMaps = searchQuery 
    ? searchMaps(searchQuery)
    : maps;

  const totalMarkers = markers.length;
  const publicMaps = maps.filter(map => map.isPublic).length;

  const handleCreateMap = (mapData: Omit<WorldMap, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    addMap(mapData);
  };

  const handleEditMap = (mapData: Omit<WorldMap, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (editingMap) {
      updateMap(editingMap.id, mapData);
      setEditingMap(null);
    }
  };

  const openEditModal = (map: WorldMap) => {
    setEditingMap(map);
    setIsCreateModalOpen(true);
  };

  const handleDeleteMap = (mapId: string) => {
    if (confirm('Видалити карту? Це також видалить всі маркери на ній.')) {
      deleteMap(mapId);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Заголовок */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Карти світу
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Створюйте та керуйте картами вашого фентезійного світу
          </p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити карту
        </button>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--fantasy-primary)' }}>
            {maps.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Всього карт
          </div>
        </div>
        
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
            {totalMarkers}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Маркерів на картах
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
            {publicMaps}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Публічних карт
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
          placeholder="Пошук карт..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Список карт */}
      {filteredMaps.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery ? 'Карт не знайдено' : 'Немає створених карт'}
          <br />
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Створити першу карту
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMaps.map(map => (
            <MapCard
              key={map.id}
              map={map}
              markers={getMarkersByMap(map.id)}
              onView={setViewingMap}
              onEdit={openEditModal}
              onDelete={handleDeleteMap}
            />
          ))}
        </div>
      )}

      <CreateMapModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMap(null);
        }}
        onSave={editingMap ? handleEditMap : handleCreateMap}
        editingMap={editingMap}
        currentWorldId={currentWorldId}
      />
      
      {viewingMap && (
        <MapView
          map={viewingMap}
          onClose={() => setViewingMap(null)}
          currentWorldId={currentWorldId}
        />
      )}
    </div>
  );
};