import React, { useState, useMemo } from 'react';
import { Plus, Search, Package, Wand2 } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import { CreateCharacterModal } from '../Modal/CreateCharacterModal';
import { BulkOperationsPanel } from '../Tools/BulkOperationsPanel';
import { NameGeneratorModal } from '../Tools/NameGeneratorModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCharacterMapIntegration } from '@/hooks/useCharacterMapIntegration';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();
  const { autoCreateCharacterMarkers, syncCharacterMarkers } = useCharacterMapIntegration(currentWorldId || '');
  const [characters, setCharacters] = useLocalStorage<Character[]>('fantasyWorldBuilder_characters', []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'race' | 'class' | 'created'>('name');
  const [filterBy, setFilterBy] = useState('');
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [showNameGenerator, setShowNameGenerator] = useState(false);

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

    // Автоматично створюємо маркери на картах
    setTimeout(() => {
      autoCreateCharacterMarkers();
    }, 100);
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
    
    // Синхронізуємо маркери після редагування
    setTimeout(() => {
      syncCharacterMarkers();
    }, 100);
    
    setEditingCharacter(null);
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(prev => prev.filter(char => char.id !== characterId));
    
    // Маркери видаляться автоматично через syncCharacterMarkers
    setTimeout(() => {
      syncCharacterMarkers();
    }, 100);
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
        {t('messages.select_world_first', { section: t('sidebar.characters').toLowerCase() })}
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
          {t('characters.title')}
        </h1>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowNameGenerator(true)}
            title="Генератор імен"
          >
            <Wand2 size={18} />
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => setShowBulkOperations(true)}
            title="Масові операції"
          >
            <Package size={18} />
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            {t('characters.create_character')}
          </button>
        </div>
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
            placeholder={t('characters.search_placeholder')}
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
          <option value="name">{t('characters.sort_by_name')}</option>
          <option value="race">{t('characters.sort_by_race')}</option>
          <option value="class">{t('characters.sort_by_class')}</option>
          <option value="created">{t('characters.sort_by_created')}</option>
        </select>

        {/* Фільтрування */}
        <input
          type="text"
          className="input"
          placeholder={t('characters.filter_placeholder')}
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
                {t('characters.characters_not_found')}
              </h3>
              <p>Try changing search or filter criteria</p>
            </div>
          ) : (
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                {t('characters.no_characters')}
              </h3>
              <p>Create the first character for your fantasy world</p>
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
            Characters found: {worldCharacters.length}
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

      {/* Інструменти */}
      <BulkOperationsPanel
        isOpen={showBulkOperations}
        onClose={() => setShowBulkOperations(false)}
        entityType="character"
        availableEntities={worldCharacters.map(char => ({ id: char.id, name: char.name }))}
        currentWorldId={currentWorldId}
      />

      <NameGeneratorModal
        isOpen={showNameGenerator}
        onClose={() => setShowNameGenerator(false)}
        generationType="character"
      />
    </div>
  );
};

import { useTagsSystem } from '@/hooks/useTagsSystem';