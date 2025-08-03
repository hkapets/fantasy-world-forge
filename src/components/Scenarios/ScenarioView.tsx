import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Clock, Users, Star, Calendar, Tag } from 'lucide-react';
import { Scenario } from '@/hooks/useScenariosData';
import { CreateScenarioModal } from '../Modal/CreateScenarioModal';
import { QuickLinksPanel } from '../Common/QuickLinksPanel';
import { RelationshipNetwork } from '../Common/RelationshipNetwork';
import { SmartSuggestions } from '../Common/SmartSuggestions';

interface ScenarioViewProps {
  scenario: Scenario;
  onBack: () => void;
  onEdit: (scenario: Scenario) => void;
  onDelete: (scenarioId: string) => void;
  onSave: (scenarioData: Omit<Scenario, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => void;
}

const typeLabels = {
  adventure: 'Пригода',
  campaign: 'Кампанія',
  oneshot: 'Разова гра',
  sidequest: 'Побічний квест'
};

const statusLabels = {
  draft: 'Чернетка',
  active: 'Активний',
  completed: 'Завершений',
  paused: 'Призупинений'
};

const difficultyLabels = {
  easy: 'Легкий',
  medium: 'Середній',
  hard: 'Складний',
  extreme: 'Екстремальний'
};

const statusColors = {
  draft: 'var(--text-muted)',
  active: 'var(--success)',
  completed: 'var(--fantasy-primary)',
  paused: 'var(--warning)'
};

const difficultyColors = {
  easy: 'var(--success)',
  medium: 'var(--warning)',
  hard: 'var(--danger)',
  extreme: 'var(--fantasy-danger)'
};

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  scenario,
  onBack,
  onEdit,
  onDelete,
  onSave
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    if (confirm(`Ви впевнені, що хочете видалити сценарій "${scenario.title}"?`)) {
      onDelete(scenario.id);
      onBack();
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (scenarioData: Omit<Scenario, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    onSave(scenarioData);
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Розумні пропозиції */}
      <SmartSuggestions
        entityId={scenario.id}
        entityType="scenario"
        worldId={scenario.worldId}
        maxSuggestions={2}
      />

      {/* Навігація */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <button
          className="btn btn-secondary"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={20} />
          Назад до списку
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Edit size={18} />
            Редагувати
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Trash2 size={18} />
            Видалити
          </button>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="card" style={{
        background: 'var(--gradient-card)',
        marginBottom: '2rem',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              {scenario.title}
            </h1>

            {/* Статуси та метадані */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${statusColors[scenario.status]}`
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: statusColors[scenario.status]
                }}>
                  {statusLabels[scenario.status]}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {typeLabels[scenario.type]}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${difficultyColors[scenario.difficulty]}`
              }}>
                <Star size={16} style={{ color: difficultyColors[scenario.difficulty] }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: difficultyColors[scenario.difficulty]
                }}>
                  {difficultyLabels[scenario.difficulty]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Опис */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            📖 Опис сценарію
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            fontSize: '1rem',
            whiteSpace: 'pre-wrap'
          }}>
            {scenario.description || 'Опис сценарію ще не додано'}
          </p>
        </div>

        {/* Детальна інформація */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Clock size={18} style={{ color: 'var(--fantasy-primary)' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Тривалість
              </h4>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              {scenario.estimatedDuration || 'Не вказано'}
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Users size={18} style={{ color: 'var(--fantasy-primary)' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Гравці
              </h4>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              {scenario.playerCount || 'Не вказано'}
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={18} style={{ color: 'var(--fantasy-primary)' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Створено
              </h4>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              {new Date(scenario.createdAt).toLocaleDateString('uk-UA')}
            </p>
          </div>
        </div>

        {/* Теги */}
        {scenario.tags.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Tag size={18} style={{ color: 'var(--fantasy-primary)' }} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                Теги
              </h4>
            </div>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {scenario.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Секція для майбутніх розширень */}
      <div className="card" style={{
        padding: '2rem',
        background: 'var(--bg-tertiary)',
        border: '2px dashed var(--border-primary)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>
          🚀 Майбутні можливості
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem'
        }}>
          Тут будуть етапи сценарію, прив'язані персонажі та інші деталі
        </p>
      </div>

      {/* Мережа зв'язків */}
      <div className="card" style={{
        padding: '2rem',
        marginTop: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          🕸️ Мережа зв'язків
        </h3>
        
        <RelationshipNetwork
          entityId={scenario.id}
          entityType="scenario"
          worldId={scenario.worldId}
          onNavigate={(entityType, entityId) => {
            console.log('Navigate to:', entityType, entityId);
          }}
          width={800}
          height={500}
        />
      </div>

      {/* Модальне вікно редагування */}
      <CreateScenarioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        editingScenario={scenario}
      />

      {/* Панель швидких зв'язків */}
      <QuickLinksPanel
        entityId={scenario.id}
        entityType="scenario"
        entityName={scenario.title}
        worldId={scenario.worldId}
        onNavigate={(entityType, entityId) => {
          console.log('Navigate to:', entityType, entityId);
        }}
      />
    </div>
  );
};