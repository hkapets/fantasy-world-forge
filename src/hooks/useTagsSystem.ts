import { useState, useEffect } from 'react';
import { useRelationshipsData } from './useRelationshipsData';

export interface TaggedEntity {
  id: string;
  type: 'character' | 'lore' | 'chronology' | 'event' | 'note' | 'map' | 'scenario';
  name: string;
  tags: string[];
  worldId: string;
}

export interface TagSuggestion {
  tag: string;
  count: number;
  entities: TaggedEntity[];
}

export function useTagsSystem(worldId: string) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [taggedEntities, setTaggedEntities] = useState<TaggedEntity[]>([]);
  const { addRelationship } = useRelationshipsData(worldId);

  // Збираємо всі теги з усіх модулів
  useEffect(() => {
    if (!worldId) return;

    const entities: TaggedEntity[] = [];
    const tagsSet = new Set<string>();

    try {
      // Персонажі
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      characters
        .filter((char: any) => char.worldId === worldId)
        .forEach((char: any) => {
          if (char.tags && Array.isArray(char.tags)) {
            const entity: TaggedEntity = {
              id: char.id,
              type: 'character',
              name: char.name,
              tags: char.tags,
              worldId: char.worldId
            };
            entities.push(entity);
            char.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
          }
        });

      // Лор
      const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`) || '[]');
      loreItems.forEach((item: any) => {
        if (item.tags && Array.isArray(item.tags)) {
          const entity: TaggedEntity = {
            id: item.id,
            type: 'lore',
            name: item.name,
            tags: item.tags,
            worldId
          };
          entities.push(entity);
          item.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
        }
      });

      // Нотатки
      const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`) || '[]');
      notes.forEach((note: any) => {
        if (note.tags && Array.isArray(note.tags)) {
          const entity: TaggedEntity = {
            id: note.id,
            type: 'note',
            name: note.title,
            tags: note.tags,
            worldId
          };
          entities.push(entity);
          note.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
        }
      });

      // Карти
      const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`) || '[]');
      maps.forEach((map: any) => {
        if (map.tags && Array.isArray(map.tags)) {
          const entity: TaggedEntity = {
            id: map.id,
            type: 'map',
            name: map.name,
            tags: map.tags,
            worldId
          };
          entities.push(entity);
          map.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
        }
      });

      // Сценарії
      const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
      scenarios
        .filter((scenario: any) => scenario.worldId === worldId)
        .forEach((scenario: any) => {
          if (scenario.tags && Array.isArray(scenario.tags)) {
            const entity: TaggedEntity = {
              id: scenario.id,
              type: 'scenario',
              name: scenario.title,
              tags: scenario.tags,
              worldId: scenario.worldId
            };
            entities.push(entity);
            scenario.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
          }
        });

      setAllTags(Array.from(tagsSet).sort());
      setTaggedEntities(entities);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, [worldId]);

  // Пошук сутностей за тегом
  const getEntitiesByTag = (tag: string): TaggedEntity[] => {
    const lowerTag = tag.toLowerCase();
    return taggedEntities.filter(entity => 
      entity.tags.some(entityTag => entityTag.toLowerCase() === lowerTag)
    );
  };

  // Отримання рекомендацій тегів
  const getTagSuggestions = (currentTags: string[] = []): TagSuggestion[] => {
    const suggestions: TagSuggestion[] = [];
    const currentTagsLower = currentTags.map(tag => tag.toLowerCase());

    allTags.forEach(tag => {
      if (!currentTagsLower.includes(tag.toLowerCase())) {
        const entities = getEntitiesByTag(tag);
        if (entities.length > 0) {
          suggestions.push({
            tag,
            count: entities.length,
            entities
          });
        }
      }
    });

    return suggestions.sort((a, b) => b.count - a.count);
  };

  // Автоматичне створення зв'язків на основі тегів
  const createAutoRelationships = (entityId: string, entityType: string, entityName: string, tags: string[]) => {
    if (!tags || tags.length === 0) return;

    tags.forEach(tag => {
      const relatedEntities = getEntitiesByTag(tag).filter(entity => 
        entity.id !== entityId && entity.type !== entityType
      );

      relatedEntities.forEach(relatedEntity => {
        // Перевіряємо, чи не існує вже такий зв'язок
        const relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${worldId}`) || '[]');
        const existingRelationship = relationships.find((rel: any) => 
          (rel.sourceId === entityId && rel.targetId === relatedEntity.id) ||
          (rel.sourceId === relatedEntity.id && rel.targetId === entityId)
        );

        if (!existingRelationship) {
          addRelationship({
            sourceType: entityType as any,
            sourceId: entityId,
            sourceName: entityName,
            targetType: relatedEntity.type,
            targetId: relatedEntity.id,
            targetName: relatedEntity.name,
            relationshipType: `Пов'язані через тег: ${tag}`,
            description: `Автоматично створений зв'язок на основі спільного тегу "${tag}"`,
            strength: 'weak',
            status: 'active',
            isSecret: false
          });
        }
      });
    });
  };

  // Пошук потенційних зв'язків для сутності
  const findPotentialConnections = (entityId: string, tags: string[]): TaggedEntity[] => {
    const connections: TaggedEntity[] = [];
    const seenIds = new Set<string>();

    tags.forEach(tag => {
      const entities = getEntitiesByTag(tag);
      entities.forEach(entity => {
        if (entity.id !== entityId && !seenIds.has(entity.id)) {
          connections.push(entity);
          seenIds.add(entity.id);
        }
      });
    });

    return connections;
  };

  return {
    allTags,
    taggedEntities,
    getEntitiesByTag,
    getTagSuggestions,
    createAutoRelationships,
    findPotentialConnections
  };
}