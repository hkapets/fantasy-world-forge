import React, { useState } from 'react';
import { Plus, Search, Filter, Users, MapPin, Calendar, BookOpen } from 'lucide-react';
import { RelationshipCard } from './RelationshipCard';
import { CreateRelationshipModal } from '../Modal/CreateRelationshipModal';
import { useRelationshipsData, Relationship } from '@/hooks/useRelationshipsData';

interface RelationshipsProps {
  currentWorldId: string | null;
}

const entityTypeIcons = {
  character: Users,
  location: MapPin,
  event: Calendar,
  lore: BookOpen
};

const entityTypeLabels = {
  character: 'Персонажі',
  location: 'Локації',
  event: 'Події',
  lore: 'Лор'
};

const strengthLabels = {
  weak: 'Слабкий',
  medium: 'Середній',
  strong: 'Сильний'
};

const statusLabels = {
  active: 'Активний',
  inactive: 'Неактивний',
  broken: 'Розірваний'
};

export const Relationships: React.FC<RelationshipsProps> = ({ currentWorldId }) => {
  const { relationships, addRelationship, updateRelationship, deleteRelationship, searchRelationships } = useRelationshipsData(currentWorldId || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи зі зв'язками
      </div>
    );
  }

  const filteredRelationships = relationships.filter(rel => {
    const matchesSearch = searchQuery === '' || 
      rel.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.relationshipType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || 
      `${rel.sourceType}-${rel.targetType}` === filterType ||
      `${rel.targetType}-${rel.sourceType}` === filterType;
    
    const matchesStatus = filterStatus === 'all' || rel.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateRelationship = (relationshipData: Omit<Relationship, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    addRelationship(relationshipData);
  };

  const handleEditRelationship = (relationshipData: Omit<Relationship, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (editingRelationship) {
      updateRelationship(editingRelationship.id, relationshipData);
      setEditingRelationship(null);
    }
  };

  const openEditModal = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setIsCreateModalOpen(true);
  };

  const handleDeleteRelationship = (relationshipId: string) => {
    if (confirm('Видалити зв\'язок?')) {
      deleteRelationship(relationshipId);
    }
  };

  // Групування за типами для статистики
  const relationshipsByType = relationships.reduce((acc, rel) => {
    const key = `${rel.sourceType}-${rel.targetType}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
            Зв'язки
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Управляйте зв'язками між елементами вашого світу
          </p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити зв'язок
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
            {relationships.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Всього зв'язків
          </div>
        </div>
        
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
            {relationships.filter(r => r.status === 'active').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Активних
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
            {relationships.filter(r => r.isSecret).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Секретних
          </div>
        </div>
      </div>

      {/* Фільтри */}
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
            placeholder="Пошук зв'язків..."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          <option value="all">Всі типи</option>
          <option value="character-character">Персонаж-персонаж</option>
          <option value="character-location">Персонаж-локація</option>
          <option value="character-event">Персонаж-подія</option>
          <option value="character-lore">Персонаж-лор</option>
          <option value="location-location">Локація-локація</option>
          <option value="location-event">Локація-подія</option>
          <option value="location-lore">Локація-лор</option>
          <option value="event-event">Подія-подія</option>
          <option value="event-lore">Подія-лор</option>
          <option value="lore-lore">Лор-лор</option>
        </select>

        <select
          className="input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">Всі статуси</option>
          <option value="active">Активні</option>
          <option value="inactive">Неактивні</option>
          <option value="broken">Розірвані</option>
        </select>
      </div>

      {/* Список зв'язків */}
      {filteredRelationships.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery || filterType !== 'all' || filterStatus !== 'all' ? 'Зв\'язків не знайдено' : 'Немає створених зв\'язків'}
          <br />
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Створити перший зв'язок
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredRelationships.map(relationship => (
            <RelationshipCard
              key={relationship.id}
              relationship={relationship}
              onEdit={() => openEditModal(relationship)}
              onDelete={() => handleDeleteRelationship(relationship.id)}
            />
          ))}
        </div>
      )}

      <CreateRelationshipModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRelationship(null);
        }}
        onSave={editingRelationship ? handleEditRelationship : handleCreateRelationship}
        editingRelationship={editingRelationship}
        currentWorldId={currentWorldId}
      />
    </div>
  );
};