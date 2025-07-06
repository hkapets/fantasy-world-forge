import React, { useState } from 'react';
import { Plus, Clock, Search } from 'lucide-react';
import { ChronologyCard } from './ChronologyCard';
import { Timeline } from './Timeline';
import { CreateChronologyModal } from '../Modal/CreateChronologyModal';
import { useChronologyData, Chronology as ChronologyType } from '@/hooks/useChronologyData';

interface ChronologyProps {
  currentWorldId: string | null;
}

export const Chronology: React.FC<ChronologyProps> = ({ currentWorldId }) => {
  const { chronologies, addChronology, updateChronology, deleteChronology } = useChronologyData(currentWorldId || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingChronology, setViewingChronology] = useState<ChronologyType | null>(null);

  const filteredChronologies = chronologies.filter(chronology =>
    chronology.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewingChronology) {
    return (
      <Timeline
        chronology={viewingChronology}
        onBack={() => setViewingChronology(null)}
        onEdit={(updatedChronology) => {
          updateChronology(updatedChronology.id, updatedChronology);
          setViewingChronology(updatedChronology);
        }}
        onDelete={(chronologyId) => {
          deleteChronology(chronologyId);
          setViewingChronology(null);
        }}
      />
    );
  }

  if (!currentWorldId) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Оберіть світ для роботи з хронологіями
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
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            Хронологія
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Управляйте часовими лініями вашого світу
          </p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити хронологію
        </button>
      </div>

      {/* Пошук */}
      <div style={{ 
        position: 'relative', 
        marginBottom: '2rem',
        maxWidth: '400px'
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
          placeholder="Пошук хронологій..."
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Список хронологій */}
      {filteredChronologies.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          {searchQuery ? 'Хронологій не знайдено' : 'Немає створених хронологій'}
          <br />
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} />
            Створити першу хронологію
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredChronologies.map(chronology => (
            <ChronologyCard
              key={chronology.id}
              chronology={chronology}
              onClick={() => setViewingChronology(chronology)}
            />
          ))}
        </div>
      )}

      <CreateChronologyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(chronologyData) => addChronology(chronologyData)}
      />
    </div>
  );
};