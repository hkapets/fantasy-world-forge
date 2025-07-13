import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { ScenarioCard } from './ScenarioCard';
import { CreateScenarioModal } from '../Modal/CreateScenarioModal';
import { useScenariosData, Scenario } from '@/hooks/useScenariosData';

interface ScenariosProps {
  currentWorldId: string | null;
}

export const Scenarios: React.FC<ScenariosProps> = ({ currentWorldId }) => {
  const { scenarios, addScenario, updateScenario, deleteScenario, getScenariosByWorld } = useScenariosData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'type' | 'status' | 'created'>('created');

  // Фільтруємо сценарії поточного світу
  const worldScenarios = useMemo(() => {
    if (!currentWorldId) return [];
    
    return getScenariosByWorld(currentWorldId)
      .filter(scenario => {
        const matchesSearch = searchQuery === '' || 
          scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
        const matchesType = filterType === 'all' || scenario.type === filterType;
        const matchesStatus = filterStatus === 'all' || scenario.status === filterStatus;
          
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title, 'uk');
          case 'type':
            return a.type.localeCompare(b.type, 'uk');
          case 'status':
            return a.status.localeCompare(b.status, 'uk');
          case 'created':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [scenarios, currentWorldId, searchQuery, filterType, filterStatus, sortBy, getScenariosByWorld]);

  const handleCreateScenario = (scenarioData: Omit<Scenario, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (!currentWorldId) return;

    addScenario({
      ...scenarioData,
      worldId: currentWorldId
    });
  };

  const handleEditScenario = (scenarioData: Omit<Scenario, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    if (!editingScenario) return;

    updateScenario(editingScenario.id, scenarioData);
    setEditingScenario(null);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    deleteScenario(scenarioId);
  };

  const openEditModal = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setIsCreateModalOpen(true);
  };

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи зі сценаріями
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
          Сценарії
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити сценарій
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
            placeholder="Пошук сценаріїв..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        {/* Фільтр за типом */}
        <select
          className="input"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">Усі типи</option>
          <option value="adventure">Пригода</option>
          <option value="campaign">Кампанія</option>
          <option value="oneshot">Разова гра</option>
          <option value="sidequest">Побічний квест</option>
        </select>

        {/* Фільтр за статусом */}
        <select
          className="input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="all">Усі статуси</option>
          <option value="draft">Чернетка</option>
          <option value="active">Активний</option>
          <option value="completed">Завершений</option>
          <option value="paused">Призупинений</option>
        </select>

        {/* Сортування */}
        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{ minWidth: '150px' }}
        >
          <option value="created">За датою створення</option>
          <option value="title">За назвою</option>
          <option value="type">За типом</option>
          <option value="status">За статусом</option>
        </select>
      </div>

      {/* Список сценаріїв */}
      {worldScenarios.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery || filterType !== 'all' || filterStatus !== 'all' ? (
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                Сценаріїв не знайдено
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
                У цьому світі ще немає сценаріїв
              </h3>
              <p>Створіть перший сценарій для вашого фентезійного світу</p>
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
            Знайдено сценаріїв: {worldScenarios.length}
          </div>

          {/* Грід з сценаріями */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {worldScenarios.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onEdit={() => openEditModal(scenario)}
                onDelete={() => handleDeleteScenario(scenario.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Модальне вікно створення/редагування */}
      <CreateScenarioModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingScenario(null);
        }}
        onSave={editingScenario ? handleEditScenario : handleCreateScenario}
        editingScenario={editingScenario}
      />
    </div>
  );
};