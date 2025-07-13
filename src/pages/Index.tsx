import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CreateWorldModal } from '@/components/Modal/CreateWorldModal';
import { Characters } from '@/components/Characters/Characters';
import { CharacterView } from '@/components/Characters/CharacterView';
import { Lore } from '@/components/Lore/Lore';
import { Chronology } from '@/components/Chronology/Chronology';
import { Notes } from '@/components/Notes/Notes';
import { Maps } from '@/components/Maps/Maps';
import { Relationships } from '@/components/Relationships/Relationships';
import { Scenarios } from '@/components/Scenarios/Scenarios';
import { useWorldsData } from '@/hooks/useLocalStorage';

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
  createdAt: string;
  lastModified: string;
}

const Index = () => {
  const {
    worlds,
    currentWorldId,
    setCurrentWorldId,
    addWorld,
    getCurrentWorld
  } = useWorldsData();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCreateWorldModalOpen, setIsCreateWorldModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const handleCreateWorld = () => {
    setIsCreateWorldModalOpen(true);
  };

  const handleSaveWorld = (worldData: { name: string; description: string }) => {
    addWorld(worldData);
  };

  const handleSelectWorld = (worldId: string) => {
    setCurrentWorldId(worldId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Реалізувати пошук
  };

  const handleSave = () => {
    // TODO: Реалізувати збереження
    alert('Дані збережено!');
  };

  const handleExport = () => {
    // TODO: Реалізувати експорт
    alert('Експорт буде реалізовано пізніше');
  };

  const handleHomeClick = () => {
    setActiveSection('dashboard');
    setViewingCharacter(null);
  };

  const handleViewCharacter = (character: Character) => {
    setViewingCharacter(character);
  };

  const handleBackFromCharacter = () => {
    setViewingCharacter(null);
  };

  const handleSaveCharacter = (character: Character) => {
    // Оновити персонажа в localStorage через хук
    const updatedCharacter = {
      ...character,
      lastModified: new Date().toISOString()
    };
    setCharacters(prev => 
      prev.map(char => 
        char.id === character.id ? updatedCharacter : char
      )
    );
  };

  const handleDeleteCharacterFromView = (characterId: string) => {
    setCharacters(prev => prev.filter(char => char.id !== characterId));
  };

  const currentWorld = getCurrentWorld();
  const showSidebar = worlds.length > 0 && currentWorldId;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: 'var(--bg-primary)'
    }}>
      <Header
        onSearch={handleSearch}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onSave={handleSave}
        onExport={handleExport}
        onHomeClick={handleHomeClick}
      />

      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {showSidebar && (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            currentWorld={currentWorldId}
            worlds={worlds}
            onWorldChange={setCurrentWorldId}
          />
        )}

        <main style={{ 
          flex: 1, 
          overflow: 'auto',
          background: 'var(--bg-primary)'
        }}>
          {activeSection === 'dashboard' && (
            <Dashboard
              worlds={worlds}
              onCreateWorld={handleCreateWorld}
              onSelectWorld={handleSelectWorld}
              selectedWorld={currentWorldId}
            />
          )}

          {activeSection === 'characters' && showSidebar && (
            viewingCharacter ? (
              <CharacterView
                character={viewingCharacter}
                onBack={handleBackFromCharacter}
                onEdit={(char) => setViewingCharacter(char)}
                onDelete={handleDeleteCharacterFromView}
                onSave={handleSaveCharacter}
              />
            ) : (
              <Characters
                currentWorldId={currentWorldId}
                onViewCharacter={handleViewCharacter}
              />
            )
          )}

          {activeSection === 'lore' && showSidebar && (
            <Lore currentWorldId={currentWorldId} />
          )}

          {activeSection === 'chronology' && showSidebar && (
            <Chronology currentWorldId={currentWorldId} />
          )}

          {activeSection === 'notes' && showSidebar && (
            <Notes currentWorldId={currentWorldId} />
          )}

          {activeSection === 'maps' && showSidebar && (
            <Maps currentWorldId={currentWorldId} />
          )}

          {activeSection === 'relationships' && showSidebar && (
            <Relationships currentWorldId={currentWorldId} />
          )}

          {activeSection === 'relationships' && showSidebar && (
            <Relationships currentWorldId={currentWorldId} />
          )}

          {activeSection === 'scenarios' && showSidebar && (
            <Scenarios currentWorldId={currentWorldId} />
          )}
        </main>
      </div>

      <CreateWorldModal
        isOpen={isCreateWorldModalOpen}
        onClose={() => setIsCreateWorldModalOpen(false)}
        onSave={handleSaveWorld}
      />
    </div>
  );
};

export default Index;
