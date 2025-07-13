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

    if (!currentWorldId) return (
      <div className="card" style={{
        margin: '2rem',
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--gradient-card)'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          marginBottom: '0.5rem',
          color: 'var(--text-primary)'
        }}>
          🌟 Оберіть світ для створення сценаріїв
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Сценарії допоможуть структурувати пригоди у вашому фентезійному світі
        </p>
      </div>
    );

  return (
    <div style={{ padding: '2rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Заголовок з статистикою */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        background: 'var(--gradient-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-primary)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            📜 Сценарії
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            Всього сценаріїв: {worldScenarios.length} | 
            Активних: {worldScenarios.filter(s => s.status === 'active').length} | 
            Завершених: {worldScenarios.filter(s => s.status === 'completed').length}
          </p>
        </div>
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

      {/* Швидкі фільтри */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'Всі', key: 'all', count: worldScenarios.length },
          { label: 'Чернетки', key: 'draft', count: worldScenarios.filter(s => s.status === 'draft').length },
          { label: 'Активні', key: 'active', count: worldScenarios.filter(s => s.status === 'active').length },
          { label: 'Завершені', key: 'completed', count: worldScenarios.filter(s => s.status === 'completed').length }
        ].map(filter => (
          <button
            key={filter.key}
            className={filterStatus === filter.key ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setFilterStatus(filter.key)}
            style={{ fontSize: '0.75rem' }}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>
      {/* Список сценаріїв */}
      {worldScenarios.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--gradient-card)',
          marginTop: '2rem'
        }}>
          {searchQuery || filterType !== 'all' || filterStatus !== 'all' ? (
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                🔍 Сценаріїв не знайдено
              </h3>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Спробуйте змінити критерії пошуку або фільтрування
              </p>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}>
                📚 Створіть перший сценарій
              </h3>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                Сценарії допоможуть організувати пригоди, квести та події у вашому фентезійному світі
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={20} style={{ marginRight: '0.5rem' }} />
                Створити перший сценарій
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Улучшенная сітка з сценаріями */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {worldScenarios.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onEdit={() => openEditModal(scenario)}
                onDelete={() => handleDeleteScenario(scenario.id)}
              />
            ))}
          </div>

          {/* Кнопка додавання ще одного сценарію */}
          <div 
            className="card"
            style={{
              marginTop: '1.5rem',
              border: '2px dashed var(--border-primary)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              padding: '2rem'
            }}
            onClick={() => setIsCreateModalOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--fantasy-primary)';
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Plus size={24} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Додати новий сценарій
            </p>
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