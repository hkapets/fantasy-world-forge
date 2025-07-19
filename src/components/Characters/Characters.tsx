import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import { CreateCharacterModal } from '../Modal/CreateCharacterModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Character {
  id: string;
  worldId: string;
  image?: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  race: string;
  ethnicity: string;
  status: string;
  relatives: string;
  characterClass: string;
  description: string;
  tags?: string[];
  createdAt: string;
  lastModified: string;
}

interface CharactersProps {
  currentWorldId: string | null;
  onViewCharacter: (character: Character) => void;
}

export const Characters: React.FC<CharactersProps> = ({
  currentWorldId,
  onViewCharacter
}) => {
  const { createAutoRelationships } = useTagsSystem(currentWorldId || '');
  const [characters, setCharacters] = useLocalStorage<Character[]>('fantasyWorldBuilder_characters', []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'race' | 'class' | 'created'>('name');
  const [filterBy, setFilterBy] = useState('');

  // Фільтруємо персонажів поточного світу
  const worldCharacters = useMemo(() => {
    if (!currentWorldId) return [];
    
    return characters
      .filter(char => char.worldId === currentWorldId)
      .filter(char => {
        const matchesSearch = searchQuery === '' || 
          char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.race.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.characterClass.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesFilter = filterBy === '' ||
          char.race.toLowerCase().includes(filterBy.toLowerCase()) ||
          char.characterClass.toLowerCase().includes(filterBy.toLowerCase()) ||
          char.status.toLowerCase().includes(filterBy.toLowerCase());
          
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name, 'uk');
          case 'race':
            return a.race.localeCompare(b.race, 'uk');
          case 'class':
            return a.characterClass.localeCompare(b.characterClass, 'uk');
          case 'created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [characters, currentWorldId, searchQuery, sortBy, filterBy]);

  const handleCreateCharacter = (characterData: Omit<Character, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (!currentWorldId) return;

    const newCharacter: Character = {
      ...characterData,
      id: Date.now().toString(),
      worldId: currentWorldId,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setCharacters(prev => [...prev, newCharacter]);

    // Створюємо автоматичні зв'язки на основі тегів
    if (characterData.tags && characterData.tags.length > 0) {
      createAutoRelationships(
        newCharacter.id,
        'character',
        newCharacter.name,
        characterData.tags
      );
    }
  };

  const handleEditCharacter = (characterData: Omit<Character, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (!editingCharacter) return;

    setCharacters(prev => 
      prev.map(char => 
        char.id === editingCharacter.id 
          ? { ...char, ...characterData, lastModified: new Date().toISOString() }
          : char
      )
    );
    setEditingCharacter(null);
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(prev => prev.filter(char => char.id !== characterId));
  };

  const openEditModal = (character: Character) => {
    setEditingCharacter(character);
    setIsCreateModalOpen(true);
  };

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи з персонажами
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Заголовок та кнопка створення */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-primary)'
        }}>
          Персонажі
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити персонажа
        </button>
      </div>

      {/* Пошук та фільтри */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Пошук */}
        <div style={{ 
          position: 'relative',
          flex: '1',
          minWidth: '250px'
        }}>
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="input"
            placeholder="Пошук персонажів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        {/* Сортування */}
        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{ minWidth: '150px' }}
        >
          <option value="name">За іменем</option>
          <option value="race">За расою</option>
          <option value="class">За класом</option>
          <option value="created">За датою створення</option>
        </select>

        {/* Фільтрування */}
        <input
          type="text"
          className="input"
          placeholder="Фільтр (раса, клас, статус)..."
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          style={{ minWidth: '200px' }}
        />
      </div>

      {/* Список персонажів */}
      {worldCharacters.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery || filterBy ? (
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Персонажів не знайдено
              </h3>
              <p>Спробуйте змінити критерії пошуку або фільтрування</p>
            </div>
          ) : (
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                У цьому світі ще немає персонажів
              </h3>
              <p>Створіть першого персонажа для вашого фентезійного світу</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Статистика */}
          <div style={{
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Знайдено персонажів: {worldCharacters.length}
          </div>

          {/* Грід з персонажами */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {worldCharacters.map(character => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => onViewCharacter(character)}
                onEdit={() => openEditModal(character)}
                onDelete={() => handleDeleteCharacter(character.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Модальне вікно створення/редагування */}
      <CreateCharacterModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCharacter(null);
        }}
        onSave={editingCharacter ? handleEditCharacter : handleCreateCharacter}
        editingCharacter={editingCharacter}
        currentWorldId={currentWorldId}
      />
    </div>
  );
};

import { useTagsSystem } from '@/hooks/useTagsSystem';