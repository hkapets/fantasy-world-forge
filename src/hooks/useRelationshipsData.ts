import { useState, useEffect } from 'react';

export interface Relationship {
  id: string;
  worldId: string;
  sourceType: 'character' | 'location' | 'event' | 'lore';
  sourceId: string;
  sourceName: string;
  targetType: 'character' | 'location' | 'event' | 'lore';
  targetId: string;
  targetName: string;
  relationshipType: string;
  description: string;
  strength: 'weak' | 'medium' | 'strong';
  status: 'active' | 'inactive' | 'broken';
  startDate?: string;
  endDate?: string;
  isSecret: boolean;
  createdAt: string;
  lastModified: string;
}

export const relationshipTypes = {
  // Персонаж-персонаж
  'character-character': [
    'Родина', 'Дружба', 'Кохання', 'Ворожнеча', 'Суперництво',
    'Ментор-учень', 'Союзник', 'Підлеглий', 'Колега', 'Знайомий'
  ],
  // Персонаж-локація
  'character-location': [
    'Народжений', 'Проживає', 'Володіє', 'Правитель', 'Вигнаний',
    'Захисник', 'Відвідує', 'Уникає', 'Досліджує', 'Полонений'
  ],
  // Персонаж-подія
  'character-event': [
    'Учасник', 'Організатор', 'Свідок', 'Жертва', 'Герой',
    'Винуватець', 'Врятував', 'Загинув', 'Втік', 'Переміг'
  ],
  // Персонаж-лор
  'character-lore': [
    'Використовує', 'Володіє', 'Вивчає', 'Створив', 'Знищив',
    'Шукає', 'Захищає', 'Боїться', 'Поклоняється', 'Проклятий'
  ],
  // Локація-локація
  'location-location': [
    'Частина', 'Сусідить', 'Торгує', 'Воює', 'Союзник',
    'Васал', 'Столиця', 'Колонія', 'Руїни', 'Походить'
  ],
  // Локація-подія
  'location-event': [
    'Місце події', 'Постраждала', 'Захищала', 'Організувала',
    'Знищена', 'Створена', 'Змінена', 'Покинута', 'Відвойована'
  ],
  // Локація-лор
  'location-lore': [
    'Містить', 'Захищає', 'Створила', 'Знищила', 'Приховує',
    'Вшановує', 'Проклята', 'Благословенна', 'Пов\'язана'
  ],
  // Подія-подія
  'event-event': [
    'Причина', 'Наслідок', 'Одночасно', 'Передувала', 'Спричинила',
    'Перешкодила', 'Допомогла', 'Повторення', 'Відповідь'
  ],
  // Подія-лор
  'event-lore': [
    'Створила', 'Знищила', 'Використала', 'Відкрила', 'Приховала',
    'Змінила', 'Активувала', 'Прокляла', 'Благословила'
  ],
  // Лор-лор
  'lore-lore': [
    'Пов\'язане', 'Походить', 'Протилежне', 'Доповнює', 'Конфліктує',
    'Частина', 'Еволюція', 'Альтернатива', 'Створює', 'Знищує'
  ]
};

export function useRelationshipsData(worldId: string) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  // Завантаження зв'язків з localStorage
  useEffect(() => {
    if (worldId) {
      const savedRelationships = localStorage.getItem(`fantasyWorldBuilder_relationships_${worldId}`);
      if (savedRelationships) {
        try {
          setRelationships(JSON.parse(savedRelationships));
        } catch (error) {
          console.error('Error loading relationships:', error);
          setRelationships([]);
        }
      }
    }
  }, [worldId]);

  // Збереження зв'язків в localStorage
  const saveRelationships = (items: Relationship[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_relationships_${worldId}`, JSON.stringify(items));
      setRelationships(items);
    }
  };

  const addRelationship = (relationshipData: Omit<Relationship, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    const newRelationship: Relationship = {
      id: Date.now().toString(),
      worldId,
      ...relationshipData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedRelationships = [...relationships, newRelationship];
    saveRelationships(updatedRelationships);
    return newRelationship;
  };

  const updateRelationship = (relationshipId: string, updates: Partial<Relationship>) => {
    const updatedRelationships = relationships.map(rel =>
      rel.id === relationshipId
        ? { ...rel, ...updates, lastModified: new Date().toISOString() }
        : rel
    );
    saveRelationships(updatedRelationships);
  };

  const deleteRelationship = (relationshipId: string) => {
    const updatedRelationships = relationships.filter(rel => rel.id !== relationshipId);
    saveRelationships(updatedRelationships);
  };

  const getRelationshipsByEntity = (entityType: string, entityId: string) => {
    return relationships.filter(rel =>
      (rel.sourceType === entityType && rel.sourceId === entityId) ||
      (rel.targetType === entityType && rel.targetId === entityId)
    );
  };

  const getRelationshipsByType = (relationshipType: string) => {
    return relationships.filter(rel => rel.relationshipType === relationshipType);
  };

  const searchRelationships = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return relationships.filter(rel =>
      rel.sourceName.toLowerCase().includes(lowercaseQuery) ||
      rel.targetName.toLowerCase().includes(lowercaseQuery) ||
      rel.relationshipType.toLowerCase().includes(lowercaseQuery) ||
      rel.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    relationships,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationshipsByEntity,
    getRelationshipsByType,
    searchRelationships
  };
}