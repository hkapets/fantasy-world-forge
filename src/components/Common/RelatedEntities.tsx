import React from 'react';
import { Users, BookOpen, Clock, MapPin, FileText, Film, ExternalLink } from 'lucide-react';
import { useTagsSystem, TaggedEntity } from '@/hooks/useTagsSystem';

interface RelatedEntitiesProps {
  entityId: string;
  entityTags: string[];
  worldId: string;
  onNavigate?: (type: string, id: string) => void;
  maxItems?: number;
}

const entityTypeIcons = {
  character: Users,
  lore: BookOpen,
  chronology: Clock,
  event: Clock,
  note: FileText,
  map: MapPin,
  scenario: Film
};

const entityTypeLabels = {
  character: 'Персонаж',
  lore: 'Лор',
  chronology: 'Хронологія',
  event: 'Подія',
  note: 'Нотатка',
  map: 'Карта',
  scenario: 'Сценарій'
};

const entityTypeColors = {
  character: 'var(--fantasy-primary)',
  lore: 'var(--success)',
  chronology: 'var(--warning)',
  event: 'var(--warning)',
  note: 'var(--info)',
  map: 'var(--fantasy-secondary)',
  scenario: 'var(--purple)'
};

export const RelatedEntities: React.FC<RelatedEntitiesProps> = ({
  entityId,
  entityTags,
  worldId,
  onNavigate,
  maxItems = 6
}) => {
  const { findPotentialConnections } = useTagsSystem(worldId);
  const relatedEntities = findPotentialConnections(entityId, entityTags).slice(0, maxItems);

  if (relatedEntities.length === 0) {
    return (
      <div style={{
        padding: '1rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-primary)'
      }}>
        Немає пов'язаних елементів через теги
      </div>
    );
  }

  const handleEntityClick = (entity: TaggedEntity) => {
    if (onNavigate) {
      onNavigate(entity.type, entity.id);
    }
  };

  // Групуємо за типами
  const groupedEntities = relatedEntities.reduce((acc, entity) => {
    if (!acc[entity.type]) {
      acc[entity.type] = [];
    }
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, TaggedEntity[]>);

  return (
    <div>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <ExternalLink size={16} />
        Пов'язані елементи
        <span style={{
          fontSize: '0.75rem',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-muted)',
          padding: '0.125rem 0.375rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          {relatedEntities.length}
        </span>
      </h4>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {Object.entries(groupedEntities).map(([type, entities]) => {
          const Icon = entityTypeIcons[type as keyof typeof entityTypeIcons];
          const color = entityTypeColors[type as keyof typeof entityTypeColors];
          const label = entityTypeLabels[type as keyof typeof entityTypeLabels];

          return (
            <div key={type}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-secondary)'
              }}>
                <Icon size={14} style={{ color }} />
                {label} ({entities.length})
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {entities.map(entity => {
                  // Знаходимо спільні теги
                  const commonTags = entity.tags.filter(tag => 
                    entityTags.some(entityTag => 
                      entityTag.toLowerCase() === tag.toLowerCase()
                    )
                  );

                  return (
                    <div
                      key={entity.id}
                      onClick={() => handleEntityClick(entity)}
                      style={{
                        padding: '0.75rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-primary)',
                        cursor: onNavigate ? 'pointer' : 'default',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (onNavigate) {
                          e.currentTarget.style.background = 'var(--bg-tertiary)';
                          e.currentTarget.style.borderColor = color;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (onNavigate) {
                          e.currentTarget.style.background = 'var(--bg-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border-primary)';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)'
                        }}>
                          {entity.name}
                        </span>
                        
                        {onNavigate && (
                          <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>

                      {commonTags.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.25rem'
                        }}>
                          {commonTags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                fontSize: '0.625rem',
                                padding: '0.125rem 0.375rem',
                                background: color,
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '500'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};