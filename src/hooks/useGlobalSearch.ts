import { useState, useEffect } from 'react';

export interface SearchResult {
  id: string;
  type: 'character' | 'lore' | 'chronology' | 'event' | 'note' | 'relationship' | 'map' | 'scenario';
  title: string;
  description: string;
  worldId: string;
  worldName: string;
  section: string;
  subsection?: string;
  matchedFields: string[];
  relevance: number;
}

export function useGlobalSearch() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInText = (text: string, query: string): boolean => {
    return text.toLowerCase().includes(query.toLowerCase());
  };

  const calculateRelevance = (item: any, query: string, matchedFields: string[]): number => {
    let relevance = 0;
    const lowerQuery = query.toLowerCase();
    
    // Назва має найвищий пріоритет
    if (item.name && searchInText(item.name, query)) {
      relevance += item.name.toLowerCase() === lowerQuery ? 100 : 50;
    }
    if (item.title && searchInText(item.title, query)) {
      relevance += item.title.toLowerCase() === lowerQuery ? 100 : 50;
    }
    
    // Опис має середній пріоритет
    if (item.description && searchInText(item.description, query)) {
      relevance += 20;
    }
    
    // Інші поля мають нижчий пріоритет
    matchedFields.forEach(field => {
      if (field !== 'name' && field !== 'title' && field !== 'description') {
        relevance += 10;
      }
    });
    
    return relevance;
  };

  const performGlobalSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    try {
      // Отримуємо список світів для назв
      const worlds = JSON.parse(localStorage.getItem('fantasyWorldBuilder_worlds') || '[]');
      const worldsMap = worlds.reduce((acc: any, world: any) => {
        acc[world.id] = world.name;
        return acc;
      }, {});

      // Пошук персонажів
      const characters = JSON.parse(localStorage.getItem('fantasyWorldBuilder_characters') || '[]');
      characters.forEach((character: any) => {
        const matchedFields: string[] = [];
        
        if (searchInText(character.name || '', query)) matchedFields.push('name');
        if (searchInText(character.description || '', query)) matchedFields.push('description');
        if (searchInText(character.race || '', query)) matchedFields.push('race');
        if (searchInText(character.characterClass || '', query)) matchedFields.push('class');
        if (searchInText(character.birthPlace || '', query)) matchedFields.push('birthPlace');
        if (searchInText(character.status || '', query)) matchedFields.push('status');
        
        if (matchedFields.length > 0) {
          results.push({
            id: character.id,
            type: 'character',
            title: character.name,
            description: character.description || `${character.race} ${character.characterClass}`.trim(),
            worldId: character.worldId,
            worldName: worldsMap[character.worldId] || 'Невідомий світ',
            section: 'characters',
            matchedFields,
            relevance: calculateRelevance(character, query, matchedFields)
          });
        }
      });

      // Пошук у лорі для кожного світу
      for (const world of worlds) {
        const loreItems = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_lore_${world.id}`) || '[]');
        
        loreItems.forEach((item: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(item.name || '', query)) matchedFields.push('name');
          if (searchInText(item.description || '', query)) matchedFields.push('description');
          if (searchInText(item.subtype || '', query)) matchedFields.push('subtype');
          if (searchInText(item.relatedLocations || '', query)) matchedFields.push('relatedLocations');
          if (searchInText(item.relatedCharacters || '', query)) matchedFields.push('relatedCharacters');
          
          if (matchedFields.length > 0) {
            const sectionNames: Record<string, string> = {
              races: 'Лор → Раси',
              bestiary: 'Лор → Бестіарій',
              geography: 'Лор → Географія',
              history: 'Лор → Історія',
              politics: 'Лор → Політика',
              religion: 'Лор → Релігія і mythologie',
              languages: 'Лор → Писемність, мови і літочислення',
              magic: 'Лор → Магія',
              artifacts: 'Лор → Артефакти'
            };
            
            results.push({
              id: item.id,
              type: 'lore',
              title: item.name,
              description: item.description,
              worldId: world.id,
              worldName: world.name,
              section: 'lore',
              subsection: item.type,
              matchedFields,
              relevance: calculateRelevance(item, query, matchedFields)
            });
          }
        });

        // Пошук у хронологіях
        const chronologies = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_chronologies_${world.id}`) || '[]');
        chronologies.forEach((chronology: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(chronology.name || '', query)) matchedFields.push('name');
          if (searchInText(chronology.description || '', query)) matchedFields.push('description');
          
          if (matchedFields.length > 0) {
            results.push({
              id: chronology.id,
              type: 'chronology',
              title: chronology.name,
              description: chronology.description,
              worldId: world.id,
              worldName: world.name,
              section: 'chronology',
              matchedFields,
              relevance: calculateRelevance(chronology, query, matchedFields)
            });
          }
        });

        // Пошук у подіях хронології
        const events = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_events_${world.id}`) || '[]');
        events.forEach((event: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(event.name || '', query)) matchedFields.push('name');
          if (searchInText(event.description || '', query)) matchedFields.push('description');
          if (searchInText(event.type || '', query)) matchedFields.push('type');
          if (searchInText(event.relatedLocations || '', query)) matchedFields.push('relatedLocations');
          if (searchInText(event.relatedCharacters || '', query)) matchedFields.push('relatedCharacters');
          
          if (matchedFields.length > 0) {
            results.push({
              id: event.id,
              type: 'event',
              title: event.name,
              description: `${event.date} рік: ${event.description}`,
              worldId: world.id,
              worldName: world.name,
              section: 'chronology',
              subsection: 'event',
              matchedFields,
              relevance: calculateRelevance(event, query, matchedFields)
            });
          }
        });

        // Пошук у нотатках
        const notes = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_notes_${world.id}`) || '[]');
        notes.forEach((note: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(note.title || '', query)) matchedFields.push('title');
          if (searchInText(note.content || '', query)) matchedFields.push('content');
          if (searchInText(note.category || '', query)) matchedFields.push('category');
          if (note.tags && note.tags.some((tag: string) => searchInText(tag, query))) {
            matchedFields.push('tags');
          }
          
          if (matchedFields.length > 0) {
            results.push({
              id: note.id,
              type: 'note',
              title: note.title,
              description: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
              worldId: world.id,
              worldName: world.name,
              section: 'notes',
              matchedFields,
              relevance: calculateRelevance(note, query, matchedFields)
            });
          }
        });

        // Пошук у зв'язках
        const relationships = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_relationships_${world.id}`) || '[]');
        relationships.forEach((relationship: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(relationship.sourceName || '', query)) matchedFields.push('sourceName');
          if (searchInText(relationship.targetName || '', query)) matchedFields.push('targetName');
          if (searchInText(relationship.relationshipType || '', query)) matchedFields.push('relationshipType');
          if (searchInText(relationship.description || '', query)) matchedFields.push('description');
          
          if (matchedFields.length > 0) {
            results.push({
              id: relationship.id,
              type: 'relationship',
              title: `${relationship.sourceName} → ${relationship.targetName}`,
              description: `${relationship.relationshipType}: ${relationship.description}`,
              worldId: world.id,
              worldName: world.name,
              section: 'relationships',
              matchedFields,
              relevance: calculateRelevance(relationship, query, matchedFields)
            });
          }
        });

        // Пошук у картах
        const maps = JSON.parse(localStorage.getItem(`fantasyWorldBuilder_maps_${world.id}`) || '[]');
        maps.forEach((map: any) => {
          const matchedFields: string[] = [];
          
          if (searchInText(map.name || '', query)) matchedFields.push('name');
          if (searchInText(map.description || '', query)) matchedFields.push('description');
          if (map.tags && map.tags.some((tag: string) => searchInText(tag, query))) {
            matchedFields.push('tags');
          }
          
          if (matchedFields.length > 0) {
            results.push({
              id: map.id,
              type: 'map',
              title: map.name,
              description: map.description,
              worldId: world.id,
              worldName: world.name,
              section: 'maps',
              matchedFields,
              relevance: calculateRelevance(map, query, matchedFields)
            });
          }
        });
      }

      // Пошук у сценаріях
      const scenarios = JSON.parse(localStorage.getItem('fantasyWorldBuilder_scenarios') || '[]');
      scenarios.forEach((scenario: any) => {
        const matchedFields: string[] = [];
        
        if (searchInText(scenario.title || '', query)) matchedFields.push('title');
        if (searchInText(scenario.description || '', query)) matchedFields.push('description');
        if (searchInText(scenario.type || '', query)) matchedFields.push('type');
        if (scenario.tags && scenario.tags.some((tag: string) => searchInText(tag, query))) {
          matchedFields.push('tags');
        }
        
        if (matchedFields.length > 0) {
          results.push({
            id: scenario.id,
            type: 'scenario',
            title: scenario.title,
            description: scenario.description,
            worldId: scenario.worldId,
            worldName: worldsMap[scenario.worldId] || 'Невідомий світ',
            section: 'scenarios',
            matchedFields,
            relevance: calculateRelevance(scenario, query, matchedFields)
          });
        }
      });

      // Сортуємо за релевантністю
      results.sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults,
    isSearching,
    performGlobalSearch
  };
}