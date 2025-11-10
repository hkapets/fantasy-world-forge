import React, { useState, lazy, Suspense } from 'react';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { CreateWorldModal } from '@/components/Modal/CreateWorldModal';
import { CharacterView } from '@/components/Characters/CharacterView';
import { useWorldsData } from '@/hooks/useLocalStorage';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { PerformanceMonitor } from '@/components/Common/PerformanceMonitor';
import { DataValidator } from '@/components/Common/DataValidator';
import { KeyboardShortcuts } from '@/components/Common/KeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import { toast } from '@/components/ui/sonner';
import { DataIntegrityChecker } from '@/components/Common/DataIntegrityChecker';
import { OfflineIndicator } from '@/components/Common/OfflineIndicator';

const LazyLoadFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <LoadingSpinner />
  </div>
);

const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Characters = lazy(() => import('@/components/Characters/Characters').then(m => ({ default: m.Characters })));
const Lore = lazy(() => import('@/components/Lore/Lore').then(m => ({ default: m.Lore })));
const Chronology = lazy(() => import('@/components/Chronology/Chronology').then(m => ({ default: m.Chronology })));
const Notes = lazy(() => import('@/components/Notes/Notes').then(m => ({ default: m.Notes })));
const Maps = lazy(() => import('@/components/Maps/Maps').then(m => ({ default: m.Maps })));
const Relationships = lazy(() => import('@/components/Relationships/Relationships').then(m => ({ default: m.Relationships })));
const Scenarios = lazy(() => import('@/components/Scenarios/Scenarios').then(m => ({ default: m.Scenarios })));
const Settings = lazy(() => import('@/components/Settings/Settings').then(m => ({ default: m.Settings })));
const PluginManager = lazy(() => import('@/components/Settings/PluginManager').then(m => ({ default: m.PluginManager })));

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

  const { playEffect } = useSoundSystem();

  // Автозбереження
  const { lastSave, saveNow } = useAutoSave({
    enabled: true,
    interval: 2 * 60 * 1000, // 2 хвилини
    onSave: () => {
      toast.success('Дані автоматично збережено', {
        duration: 1500,
        position: 'bottom-right'
      });
    },
    onError: (error) => {
      toast.error('Помилка автозбереження: ' + error.message, {
        duration: 5000,
        position: 'bottom-right'
      });
    }
  });

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCreateWorldModalOpen, setIsCreateWorldModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingCharacter, setViewingCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const handleCreateWorld = () => {
    playEffect('buttonClick');
    setIsCreateWorldModalOpen(true);
  };

  const handleSaveWorld = (worldData: { name: string; description: string }) => {
    playEffect('create');
    addWorld(worldData);
  };

  const handleSelectWorld = (worldId: string) => {
    playEffect('pageFlip');
    setCurrentWorldId(worldId);
  };

  const handleSearch = (query: string) => {
    // Глобальний пошук тепер обробляється в GlobalSearchModal
  };

  const handleNavigate = (section: string, subsection?: string, itemId?: string) => {
    playEffect('pageFlip');
    setActiveSection(section);
    
    // Навігація до конкретного елемента
    if (itemId) {
      switch (section) {
        case 'characters':
          // Знаходимо персонажа та відкриваємо його
          const character = characters.find(char => char.id === itemId);
          if (character) {
            setViewingCharacter(character);
          }
          break;
        case 'lore':
          // Переходимо до підрозділу лору
          if (subsection) {
            // Логіка для відкриття конкретного елемента лору
            console.log('Navigate to lore:', subsection, itemId);
          }
          break;
        case 'notes':
        case 'maps':
        case 'scenarios':
        case 'relationships':
        case 'chronology':
          // Для інших розділів поки що просто переходимо до розділу
          console.log('Navigate to:', { section, subsection, itemId });
          break;
      }
    }
  };

  const handleSave = () => {
    // Збереження всіх даних
    playEffect('save');
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
    playEffect('success');
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
    playEffect('pageFlip');
    setActiveSection('dashboard');
    setViewingCharacter(null);
  };

  const handleViewCharacter = (character: Character) => {
    playEffect('pageFlip');
    setViewingCharacter(character);
  };

  const handleBackFromCharacter = () => {
    setViewingCharacter(null);
  };

  const handleSaveCharacter = (character: Character) => {
    // Оновити персонажа в localStorage через хук
    playEffect('save');
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
    playEffect('delete');
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
            <Suspense fallback={<LazyLoadFallback />}>
              <Dashboard
                worlds={worlds}
                onCreateWorld={handleCreateWorld}
                onSelectWorld={handleSelectWorld}
                selectedWorld={currentWorldId}
                onNavigate={handleNavigate}
                onHomeClick={handleHomeClick}
              />
            </Suspense>
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
              <Suspense fallback={<LazyLoadFallback />}>
                <Characters
                  currentWorldId={currentWorldId}
                  onViewCharacter={handleViewCharacter}
                />
              </Suspense>
            )
          )}

          {activeSection === 'lore' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Lore currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'chronology' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Chronology currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'notes' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Notes currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'maps' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Maps currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'relationships' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Relationships currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'scenarios' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Scenarios currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'settings' && (
            <Suspense fallback={<LazyLoadFallback />}>
              <Settings currentWorldId={currentWorldId} />
            </Suspense>
          )}

          {activeSection === 'plugins' && showSidebar && (
            <Suspense fallback={<LazyLoadFallback />}>
              <div style={{ padding: '2rem' }}>
                <PluginManager />
              </div>
            </Suspense>
          )}
        </main>
      </div>

      <CreateWorldModal
        isOpen={isCreateWorldModalOpen}
        onClose={() => setIsCreateWorldModalOpen(false)}
        onSave={handleSaveWorld}
      />

      {/* Системні компоненти */}
      <PerformanceMonitor />
      <DataValidator />
      <DataIntegrityChecker />
      <OfflineIndicator />
      <KeyboardShortcuts
        onNavigate={setActiveSection}
        onSave={handleSave}
        onExport={handleExport}
        onCreateWorld={handleCreateWorld}
        onSearch={() => {
          // Відкриваємо глобальний пошук через header
          const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement;
          searchButton?.click();
        }}
      />
    </div>
  );
};

export default Index;
