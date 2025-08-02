import React, { useState, useEffect } from 'react';
import { Link, Plus, Eye, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { EntityLink } from './EntityLink';
import { CreateRelationshipModal } from '../Modal/CreateRelationshipModal';
import { useRelationshipsData } from '@/hooks/useRelationshipsData';

interface QuickLinksPanelProps {
  entityId: string;
  entityType: 'character' | 'lore' | 'note' | 'map' | 'scenario' | 'event';
  entityName: string;
  worldId: string;
  onNavigate?: (entityType: string, entityId: string) => void;
  isCollapsed?: boolean;
}

interface RelatedEntity {
  id: string;
  type: string;
  name: string;
  relationshipType: string;
  strength: 'weak' | 'medium' | 'strong';
  isSecret: boolean;
}

export const QuickLinksPanel: React.FC<QuickLinksPanelProps> = ({
  entityId,
  entityType,
  entityName,
  worldId,
  onNavigate,
  isCollapsed = false
}) => {
  const { relationships, addRelationship, deleteRelationship } = useRelationshipsData(worldId);
  const [relatedEntities, setRelatedEntities] = useState<RelatedEntity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['direct']));
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    loadRelatedEntities();
  }, [entityId, entityType, worldId, relationships]);

  const loadRelatedEntities = () => {
    const related: RelatedEntity[] = [];

    // Прямі зв'язки
    const directRelationships = relationships.filter(rel =>
      (rel.sourceType === entityType && rel.sourceId === entityId) ||
      (rel.targetType === entityType && rel.targetId === entityId)
    );

    directRelationships.forEach(rel => {
      const isSource = rel.sourceType === entityType && rel.sourceId === entityId;
      const relatedType = isSource ? rel.targetType : rel.sourceType;
      const relatedId = isSource ? rel.targetId : rel.sourceId;
      const relatedName = isSource ? rel.targetName : rel.sourceName;

      related.push({
        id: relatedId,
        type: relatedType,
        name: relatedName,
        relationshipType: rel.relationshipType,
        strength: rel.strength,
        isSecret: rel.isSecret
      });
    });

    // Зв'язки через теги
    const tagBasedEntities = getTagBasedRelations();
    related.push(...tagBasedEntities);

    // Видаляємо дублікати
    const uniqueRelated = related.filter((entity, index, self) =>
      index === self.findIndex(e => e.id === entity.id && e.type === entity.type)
    );

    setRelatedEntities(uniqueRelated);
  };

  const getTagBasedRelations = (): RelatedEntity[] => {
    const tagBased: RelatedEntity[] = [];
    
    try {
      // Отримуємо теги поточної сутності
      const currentTags = getEntityTags(entityId, entityType);
      if (!currentTags || currentTags.length === 0) return [];

      // Шукаємо інші сутності з такими ж тегами
      const allEntities = getAllEntitiesWithTags();
      
      allEntities.forEach(entity => {
        if (entity.id === entityId && entity.type === entityType) return;
        
        const commonTags = entity.tags.filter(tag => 
          currentTags.some(currentTag => currentTag.toLowerCase() === tag.toLowerCase())
        );
        
        if (commonTags.length > 0) {
          // Перевіряємо, чи немає вже прямого зв'язку
          const hasDirectRelation = relationships.some(rel =>
            (rel.sourceType === entityType && rel.sourceId === entityId && 
             rel.targetType === entity.type && rel.targetId === entity.id) ||
            (rel.targetType === entityType && rel.targetId === entityId && 
             rel.sourceType === entity.type && rel.sourceId === entity.id)
          );

          if (!hasDirectRelation) {
            tagBased.push({
              id: entity.id,
              type: entity.type,
              name: entity.name,
              relationshipType: `Спільні теги: ${commonTags.join(', ')}`,
              strength: 'weak',
              isSecret: false
            });
          }
        }
      });
    } catch (error) {
      console.error('Error getting tag-based relations:', error);
    }

    return tagBased;
  };

  const getEntityTags = (id: string, type: string): string[] => {
    try {
      switch (type) {
        case 'character':
          const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
          const char = characters.find((c: any) => c.id === id && c.worldId === worldId);
          return char?.tags || [];

        case 'note':
          const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
          const note = notes.find((n: any) => n.id === id);
          return note?.tags || [];

        case 'map':
          const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
          const map = maps.find((m: any) => m.id === id);
          return map?.tags || [];

        case 'scenario':
          const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
          const scenario = scenarios.find((s: any) => s.id === id && s.worldId === worldId);
          return scenario?.tags || [];

        default:
          return [];
      }
    } catch {
      return [];
    }
  };

  const getAllEntitiesWithTags = () => {
    const entities: Array<{id: string, type: string, name: string, tags: string[]}> = [];

    try {
      // Персонажі
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      characters
        .filter((char: any) => char.worldId === worldId && char.tags)
        .forEach((char: any) => {
          entities.push({
            id: char.id,
            type: 'character',
            name: char.name,
            tags: char.tags
          });
        });

      // Нотатки
      const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
      notes
        .filter((note: any) => note.tags)
        .forEach((note: any) => {
          entities.push({
            id: note.id,
            type: 'note',
            name: note.title,
            tags: note.tags
          });
        });

      // Карти
      const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
      maps
        .filter((map: any) => map.tags)
        .forEach((map: any) => {
          entities.push({
            id: map.id,
            type: 'map',
            name: map.name,
            tags: map.tags
          });
        });

      // Сценарії
      const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
      scenarios
        .filter((scenario: any) => scenario.worldId === worldId && scenario.tags)
        .forEach((scenario: any) => {
          entities.push({
            id: scenario.id,
            type: 'scenario',
            name: scenario.title,
            tags: scenario.tags
          });
        });
    } catch (error) {
      console.error('Error loading entities:', error);
    }

    return entities;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleCreateRelationship = (relationshipData: any) => {
    addRelationship(relationshipData);
  };

  const handleDeleteRelationship = (relatedEntity: RelatedEntity) => {
    const relationship = relationships.find(rel =>
      (rel.sourceType === entityType && rel.sourceId === entityId && 
       rel.targetType === relatedEntity.type && rel.targetId === relatedEntity.id) ||
      (rel.targetType === entityType && rel.targetId === entityId && 
       rel.sourceType === relatedEntity.type && rel.sourceId === relatedEntity.id)
    );

    if (relationship && confirm(`Видалити зв'язок "${relationship.relationshipType}"?`)) {
      deleteRelationship(relationship.id);
    }
  };

  // Групуємо зв'язки
  const directRelations = relatedEntities.filter(entity => 
    !entity.relationshipType.startsWith('Спільні теги:')
  );
  const tagBasedRelations = relatedEntities.filter(entity => 
    entity.relationshipType.startsWith('Спільні теги:')
  );

  const groupedByType = directRelations.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, RelatedEntity[]>);

  const typeLabels = {
    character: 'Персонажі',
    lore: 'Лор',
    note: 'Нотатки',
    map: 'Карти',
    scenario: 'Сценарії',
    event: 'Події'
  };

  if (collapsed) {
    return (
      <div style={{
        position: 'fixed',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100
      }}>
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'var(--fantasy-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)'
          }}
          title="Показати панель зв'язків"
        >
          <Link size={20} />
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      right: '1rem',
      top: '100px',
      bottom: '1rem',
      width: '320px',
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-modal)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Заголовок */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Link size={18} style={{ color: 'var(--fantasy-primary)' }} />
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Швидкі зв'язки
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setIsCreateModalOpen(true)}
            title="Створити зв'язок"
          >
            <Plus size={14} />
          </button>
          
          <button
            className="btn-icon btn-icon-sm"
            onClick={() => setCollapsed(true)}
            title="Згорнути панель"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Контент */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem'
      }}>
        {relatedEntities.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: 'var(--text-secondary)'
          }}>
            <Link size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Немає зв'язків з іншими елементами
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              style={{ fontSize: '0.875rem' }}
            >
              <Plus size={16} style={{ marginRight: '0.25rem' }} />
              Створити зв'язок
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Прямі зв'язки */}
            {directRelations.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('direct')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {expandedSections.has('direct') ? 
                    <ChevronDown size={14} /> : 
                    <ChevronRight size={14} />
                  }
                  Прямі зв'язки ({directRelations.length})
                </button>

                {expandedSections.has('direct') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Object.entries(groupedByType).map(([type, entities]) => (
                      <div key={type}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.25rem'
                        }}>
                          {typeLabels[type as keyof typeof typeLabels]} ({entities.length})
                        </div>
                        
                        {entities.map(entity => (
                          <div
                            key={`${entity.type}-${entity.id}`}
                            style={{
                              padding: '0.75rem',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-primary)'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.25rem'
                            }}>
                              <EntityLink
                                entityType={entity.type as any}
                                entityId={entity.id}
                                entityName={entity.name}
                                worldId={worldId}
                                onNavigate={onNavigate}
                                style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}
                              />
                              
                              <button
                                className="btn-icon btn-icon-sm"
                                onClick={() => handleDeleteRelationship(entity)}
                                style={{
                                  background: 'var(--danger)',
                                  color: 'white'
                                }}
                                title="Видалити зв'язок"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            
                            <div style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              marginBottom: '0.25rem'
                            }}>
                              {entity.relationshipType}
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              gap: '0.25rem',
                              alignItems: 'center'
                            }}>
                              <span style={{
                                fontSize: '0.625rem',
                                padding: '0.125rem 0.375rem',
                                borderRadius: 'var(--radius-sm)',
                                background: entity.strength === 'strong' ? 'var(--success)' :
                                           entity.strength === 'medium' ? 'var(--warning)' : 'var(--text-muted)',
                                color: 'white',
                                fontWeight: '500'
                              }}>
                                {entity.strength === 'strong' ? 'Сильний' :
                                 entity.strength === 'medium' ? 'Середній' : 'Слабкий'}
                              </span>
                              
                              {entity.isSecret && (
                                <span style={{
                                  fontSize: '0.625rem',
                                  padding: '0.125rem 0.375rem',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'var(--warning)',
                                  color: 'white',
                                  fontWeight: '500'
                                }}>
                                  Секрет
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Зв'язки через теги */}
            {tagBasedRelations.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('tags')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {expandedSections.has('tags') ? 
                    <ChevronDown size={14} /> : 
                    <ChevronRight size={14} />
                  }
                  Через теги ({tagBasedRelations.length})
                </button>

                {expandedSections.has('tags') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tagBasedRelations.map(entity => (
                      <div
                        key={`tag-${entity.type}-${entity.id}`}
                        style={{
                          padding: '0.75rem',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px dashed var(--border-primary)'
                        }}
                      >
                        <EntityLink
                          entityType={entity.type as any}
                          entityId={entity.id}
                          entityName={entity.name}
                          worldId={worldId}
                          onNavigate={onNavigate}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        />
                        
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.25rem'
                        }}>
                          {entity.relationshipType}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модальне вікно створення зв'язку */}
      <CreateRelationshipModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRelationship}
        currentWorldId={worldId}
        editingRelationship={null}
      />
    </div>
  );
};