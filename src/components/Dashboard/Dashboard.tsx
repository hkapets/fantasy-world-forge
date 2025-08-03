import React from 'react';
import { Plus } from 'lucide-react';
import { SmartRecommendations } from './SmartRecommendations';

interface World {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
}

interface DashboardProps {
  worlds: World[];
  onCreateWorld: () => void;
  onSelectWorld: (worldId: string) => void;
  selectedWorld: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  worlds,
  onCreateWorld,
  onSelectWorld,
  selectedWorld
}) => {
  if (worlds.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-primary)'
        }}>
          <Plus size={40} color="white" />
        </div>

        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Створити світ
        </h2>

        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Fantasy World Builder - це потужний інструмент для створення та управління фентезійними світами. 
          Створюйте персонажів, будуйте історію, розробляйте магічні системи та керуйте складними 
          взаємозв'язками у ваших світах.
        </p>

        <button 
          className="btn btn-primary"
          onClick={onCreateWorld}
          style={{
            fontSize: '1.125rem',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Plus size={24} style={{ marginRight: '0.5rem' }} />
          Створити перший світ
        </button>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          maxWidth: '800px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Можливості застосунку:
          </h3>
          <ul style={{
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            {[
              'Створення та управління персонажами',
              'Розробка лору та міфології',
              'Побудова хронології подій',
              'Інтерактивні карти світу',
              'Система зв\'язків між елементами',
              'Створення сценаріїв та сюжетів',
              'Офлайн робота та локальне збереження',
              'Експорт даних у різних форматах'
            ].map((feature, index) => (
              <li 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem'
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--fantasy-primary)',
                  marginRight: '0.75rem',
                  flexShrink: 0
                }}></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
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
          Мої світи
        </h1>
        <button 
          className="btn btn-primary"
          onClick={onCreateWorld}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          Створити світ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {worlds.map(world => (
          <div
            key={world.id}
            className="card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: selectedWorld === world.id ? 
                `2px solid var(--fantasy-primary)` : 
                '1px solid var(--border-primary)'
            }}
            onClick={() => onSelectWorld(world.id)}
          >
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              {world.name}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {world.description}
            </p>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div>Створено: {new Date(world.createdAt).toLocaleDateString('uk-UA')}</div>
              <div>Змінено: {new Date(world.lastModified).toLocaleDateString('uk-UA')}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedWorld && worlds.length > 0 && (
        <div style={{
          marginTop: '2rem'
        }}>
          <SmartRecommendations 
            worldId={selectedWorld}
            onNavigate={(section, subsection, itemId) => {
              console.log('Navigate to:', section, subsection, itemId);
            }}
          />
        </div>
      )}
    </div>
  );
};