import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { LoreCard } from './LoreCard';
import { CreateLoreModal } from '../Modal/CreateLoreModal';
import { LoreItemView } from './LoreItemView';
import { useLoreData } from '@/hooks/useLoreData';

interface LoreSectionProps {
  type: string;
  currentWorldId: string | null;
  onBack: () => void;
}

const sectionNames: Record<string, string> = {
  races: 'Раси',
  bestiary: 'Бестіарій',
  geography: 'Географія',
  history: 'Історія',
  politics: 'Політика',
  religion: 'Релігія і міфологія',
  languages: 'Писемність, мови і літочислення',
  magic: 'Магія',
  artifacts: 'Артефакти'
};

export const LoreSection: React.FC<LoreSectionProps> = ({
  type,
  currentWorldId,
  onBack
}) => {
  const { loreItems, addLoreItem, updateLoreItem, deleteLoreItem } = useLoreData(currentWorldId || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [viewingItem, setViewingItem] = useState<any>(null);

  const sectionItems = loreItems.filter(item => item.type === type);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = sectionItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.subtype === filterBy);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [sectionItems, searchQuery, sortBy, filterBy]);

  if (viewingItem) {
    return (
      <LoreItemView
        item={viewingItem}
        type={type}
        onBack={() => setViewingItem(null)}
        onSave={(updatedItem) => {
          updateLoreItem(updatedItem.id, updatedItem);
          setViewingItem(updatedItem);
        }}
        onDelete={(itemId) => {
          deleteLoreItem(itemId);
          setViewingItem(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{ marginRight: '1rem' }}
        >
          <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} />
          Назад
        </button>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {sectionNames[type]}
          </h1>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити
        </button>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          position: 'relative', 
          flex: '1', 
          minWidth: '200px' 
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
            placeholder="Пошук..."
            className="input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="name">За назвою</option>
          <option value="date">За датою</option>
        </select>
      </div>

      {/* Items Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery ? 'Нічого не знайдено' : `Немає записів у розділі ${sectionNames[type].toLowerCase()}`}
          <br />
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Створити перший запис
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredAndSortedItems.map(item => (
            <LoreCard
              key={item.id}
              item={item}
              onClick={() => setViewingItem(item)}
            />
          ))}
        </div>
      )}

      <CreateLoreModal
        type={type}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(loreData) => addLoreItem({ ...loreData, type })}
      />
    </div>
  );
};