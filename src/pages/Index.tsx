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
import { Settings } from '@/components/Settings/Settings';

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
    // Глобальний пошук тепер обробляється в GlobalSearchModal
  };

  const handleNavigate = (section: string, subsection?: string, itemId?: string) => {
    setActiveSection(section);
    // Тут можна додати логіку для навігації до конкретного елемента
    // Наприклад, встановити ID елемента для відкриття
    console.log('Navigate to:', { section, subsection, itemId });
  };

  const handleSave = () => {
    // Збереження всіх даних
    try {
      // Дані вже автоматично зберігаються в localStorage через хуки
      // Тут можна додати додаткову логіку збереження
      const timestamp = new Date().toLocaleString('uk-UA');
      localStorage.setItem('fantasyWorldBuilder_lastSave', timestamp);
      alert(`Дані збережено! (${timestamp})`);
    } catch (error) {
      console.error('Save error:', error);
      alert('Помилка при збереженні даних');
    }
  };

  const handleExport = () => {
    // Експорт всіх даних (використовуємо ту ж логіку що в налаштуваннях)
    try {
      const allData = {
        worlds: JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]'),
        characters: JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]'),
        currentWorld: localStorage.getItem('fantasyWorldBuilder_currentWorld'),
        settings: JSON.parse(localStorage.getItem('fantasyWorldBuilder_settings') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Додаємо дані з усіх світів
      const worlds = allData.worlds;
      for (const world of worlds) {
        allData[`lore_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${world.id}`) || '[]');
        allData[`chronologies_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_chronologies_${world.id}`) || '[]');
        allData[`events_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${world.id}`) || '[]');
        allData[`notes_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${world.id}`) || '[]');
        allData[`relationships_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${world.id}`) || '[]');
        allData[`maps_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${world.id}`) || '[]');
        allData[`markers_${world.id}`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_markers_${world.id}`) || '[]');
        allData[`scenarios`] = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_scenarios`) || '[]');
      }

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `fantasy-world-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export error:', error);
      alert('Помилка при експорті даних');
    }
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
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onSave={handleSave}
        onExport={handleExport}
        onHomeClick={handleHomeClick}
        onNavigate={handleNavigate}
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

          {activeSection === 'settings' && (
            <Settings currentWorldId={currentWorldId} />
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
