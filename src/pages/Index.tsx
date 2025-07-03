import React, { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CreateWorldModal } from '@/components/Modal/CreateWorldModal';
import { useWorldsData } from '@/hooks/useLocalStorage';

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
            <div style={{ padding: '2rem' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                Персонажі
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Розділ персонажів буде реалізовано в наступному кроці...
              </p>
            </div>
          )}

          {activeSection === 'lore' && showSidebar && (
            <div style={{ padding: '2rem' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                Лор
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Розділ лору буде реалізовано в наступному кроці...
              </p>
            </div>
          )}

          {/* Інші розділи будуть додані пізніше */}
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
