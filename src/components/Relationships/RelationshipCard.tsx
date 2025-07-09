import React from 'react';
import { Users, MapPin, Calendar, BookOpen, Edit, Trash2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Relationship } from '@/hooks/useRelationshipsData';

interface RelationshipCardProps {
  relationship: Relationship;
  onEdit: () => void;
  onDelete: () => void;
}

const entityTypeIcons = {
  character: Users,
  location: MapPin,
  event: Calendar,
  lore: BookOpen
};

const entityTypeColors = {
  character: 'var(--fantasy-primary)',
  location: 'var(--success)',
  event: 'var(--warning)',
  lore: 'var(--info)'
};

const strengthColors = {
  weak: 'var(--text-muted)',
  medium: 'var(--warning)',
  strong: 'var(--success)'
};

const statusColors = {
  active: 'var(--success)',
  inactive: 'var(--text-muted)',
  broken: 'var(--danger)'
};

const statusLabels = {
  active: 'Активний',
  inactive: 'Неактивний',
  broken: 'Розірваний'
};

const strengthLabels = {
  weak: 'Слабкий',
  medium: 'Середній',
  strong: 'Сильний'
};

export const RelationshipCard: React.FC<RelationshipCardProps> = ({ 
  relationship, 
  onEdit, 
  onDelete 
}) => {
  const SourceIcon = entityTypeIcons[relationship.sourceType];
  const TargetIcon = entityTypeIcons[relationship.targetType];
  
  const sourceColor = entityTypeColors[relationship.sourceType];
  const targetColor = entityTypeColors[relationship.targetType];

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      {/* Заголовок з кнопками */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flex: 1
        }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            {relationship.relationshipType}
          </div>
          
          {relationship.isSecret && (
            <div title="Секретний зв'язок">
              <EyeOff 
                size={16} 
                style={{ color: 'var(--warning)' }}
              />
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-icon btn-icon-sm"
            onClick={onEdit}
          >
            <Edit size={14} />
          </button>
          <button
            className="btn-icon btn-icon-sm"
            onClick={onDelete}
            style={{ background: 'var(--danger)', color: 'white' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Зв'язок між сутностями */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-primary)'
      }}>
        {/* Джерело */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flex: 1
        }}>
          <SourceIcon size={18} style={{ color: sourceColor }} />
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              {relationship.sourceName}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'capitalize'
            }}>
              {relationship.sourceType === 'character' && 'Персонаж'}
              {relationship.sourceType === 'location' && 'Локація'}
              {relationship.sourceType === 'event' && 'Подія'}
              {relationship.sourceType === 'lore' && 'Лор'}
            </div>
          </div>
        </div>

        {/* Стрілка */}
        <ArrowRight 
          size={20} 
          style={{ 
            color: strengthColors[relationship.strength],
            flexShrink: 0
          }} 
        />

        {/* Ціль */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flex: 1,
          justifyContent: 'flex-end',
          textAlign: 'right'
        }}>
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              {relationship.targetName}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'capitalize'
            }}>
              {relationship.targetType === 'character' && 'Персонаж'}
              {relationship.targetType === 'location' && 'Локація'}
              {relationship.targetType === 'event' && 'Подія'}
              {relationship.targetType === 'lore' && 'Лор'}
            </div>
          </div>
          <TargetIcon size={18} style={{ color: targetColor }} />
        </div>
      </div>

      {/* Опис */}
      {relationship.description && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          marginBottom: '1rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {relationship.description}
        </p>
      )}

      {/* Мета-інформація */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: statusColors[relationship.status],
            color: 'white',
            fontWeight: '500'
          }}
        >
          {statusLabels[relationship.status]}
        </span>
        
        <span
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-primary)'
          }}
        >
          Сила: {strengthLabels[relationship.strength]}
        </span>

        {relationship.startDate && (
          <span
            style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-primary)'
            }}
          >
            {relationship.startDate}
            {relationship.endDate && ` - ${relationship.endDate}`}
          </span>
        )}
      </div>

      {/* Дата створення */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        Створено {new Date(relationship.createdAt).toLocaleDateString('uk-UA')}
      </div>
    </div>
  );
};