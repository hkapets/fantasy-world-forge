import React from 'react';
import { Edit, Trash2, Users, Clock, Star } from 'lucide-react';
import { Scenario } from '@/hooks/useScenariosData';
import { EntityTooltip } from '../Common/EntityTooltip';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showTooltip?: boolean;
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
  completed: 'var(--primary)',
  paused: 'var(--warning)'
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onClick,
  onEdit,
  onDelete,
  showTooltip = true
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Видалити сценарій "${scenario.title}"?`)) {
      onDelete();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const cardContent = (
    <div 
      className="card"
      style={{
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        const actions = e.currentTarget.querySelector('.card-actions') as HTMLElement;
        if (actions) actions.style.opacity = '0';
      }}
    >
      {/* Дії */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        opacity: 0,
        transition: 'opacity 0.2s ease'
      }}
      className="card-actions">
        <button
          onClick={handleEdit}
          style={{
            padding: '0.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.375rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: '0.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.375rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--danger)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Заголовок */}
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: 'var(--text-primary)',
        paddingRight: '5rem'
      }}>
        {scenario.title}
      </h3>

      {/* Статус та тип */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          background: 'var(--bg-tertiary)',
          color: statusColors[scenario.status]
        }}>
          {statusLabels[scenario.status]}
        </span>
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)'
        }}>
          {typeLabels[scenario.type]}
        </span>
      </div>

      {/* Опис */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.875rem',
        lineHeight: '1.4',
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {scenario.description}
      </p>

      {/* Метадані */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} />
          {scenario.estimatedDuration}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Users size={12} />
          {scenario.playerCount}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Star size={12} />
          {difficultyLabels[scenario.difficulty]}
        </div>
      </div>

      {/* Теги */}
      {scenario.tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          flexWrap: 'wrap'
        }}>
          {scenario.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                fontSize: '0.625rem',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-muted)'
              }}
            >
              {tag}
            </span>
          ))}
          {scenario.tags.length > 3 && (
            <span style={{
              fontSize: '0.625rem',
              color: 'var(--text-muted)'
            }}>
              +{scenario.tags.length - 3}
            </span>
          )}
        </div>
      )}

    </div>
  );

  return showTooltip ? (
    <EntityTooltip
      entityType="scenario"
      entityId={scenario.id}
      worldId={scenario.worldId}
    >
      {cardContent}
    </EntityTooltip>
  ) : (
    cardContent
  );
};