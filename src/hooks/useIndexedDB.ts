import { useState, useEffect, useCallback } from 'react';
import { db, DatabaseManager } from '@/lib/database';
import type { World, Character, LoreItem, Note, WorldMap, MapMarker, Relationship, Scenario, Chronology, ChronologyEvent } from '@/lib/database';

// Хук для роботи зі світами
export function useWorldsDB() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWorlds = useCallback(async () => {
    try {
      const worldsData = await db.worlds.orderBy('lastModified').reverse().toArray();
      setWorlds(worldsData);
      
      const activeWorld = worldsData.find(w => w.isActive);
      setCurrentWorld(activeWorld || null);
    } catch (error) {
      console.error('Error loading worlds:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorlds();
  }, [loadWorlds]);

  const addWorld = async (worldData: Omit<World, 'id' | 'uuid' | 'createdAt' | 'lastModified' | 'isActive'>) => {
    try {
      // Деактивуємо інші світи
      await db.worlds.toCollection().modify({ isActive: false });
      
      const newWorld = await db.worlds.add({
        ...worldData,
        isActive: true
      });
      
      await loadWorlds();
      return newWorld;
    } catch (error) {
      console.error('Error adding world:', error);
      throw error;
    }
  };

  const updateWorld = async (worldId: string, updates: Partial<World>) => {
    try {
      await db.worlds.where('uuid').equals(worldId).modify(updates);
      await loadWorlds();
    } catch (error) {
      console.error('Error updating world:', error);
      throw error;
    }
  };

  const deleteWorld = async (worldId: string) => {
    try {
      await db.transaction('rw', [
        db.worlds, db.characters, db.loreItems, db.notes, db.maps, 
        db.markers, db.relationships, db.scenarios, db.chronologies, db.events
      ], async () => {
        await db.worlds.where('uuid').equals(worldId).delete();
        await db.characters.where('worldId').equals(worldId).delete();
        await db.loreItems.where('worldId').equals(worldId).delete();
        await db.notes.where('worldId').equals(worldId).delete();
        await db.maps.where('worldId').equals(worldId).delete();
        await db.relationships.where('worldId').equals(worldId).delete();
        await db.scenarios.where('worldId').equals(worldId).delete();
        await db.chronologies.where('worldId').equals(worldId).delete();
        
        // Видаляємо маркери карт цього світу
        const worldMaps = await db.maps.where('worldId').equals(worldId).toArray();
        for (const map of worldMaps) {
          await db.markers.where('mapId').equals(map.uuid).delete();
        }
        
        // Видаляємо події хронологій цього світу
        const worldChronologies = await db.chronologies.where('worldId').equals(worldId).toArray();
        for (const chronology of worldChronologies) {
          await db.events.where('chronologyId').equals(chronology.uuid).delete();
        }
      });
      
      await loadWorlds();
    } catch (error) {
      console.error('Error deleting world:', error);
      throw error;
    }
  };

  const setActiveWorld = async (worldId: string) => {
    try {
      await db.worlds.toCollection().modify({ isActive: false });
      await db.worlds.where('uuid').equals(worldId).modify({ isActive: true });
      await loadWorlds();
    } catch (error) {
      console.error('Error setting active world:', error);
      throw error;
    }
  };

  return {
    worlds,
    currentWorld,
    loading,
    addWorld,
    updateWorld,
    deleteWorld,
    setActiveWorld,
    refreshWorlds: loadWorlds
  };
}

// Хук для роботи з персонажами
export function useCharactersDB(worldId: string) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCharacters = useCallback(async () => {
    if (!worldId) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    try {
      const charactersData = await db.characters
        .where('worldId')
        .equals(worldId)
        .orderBy('name')
        .toArray();
      setCharacters(charactersData);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const addCharacter = async (characterData: Omit<Character, 'id' | 'uuid' | 'createdAt' | 'lastModified'>) => {
    try {
      const newCharacter = await db.characters.add({
        ...characterData,
        worldId
      });
      await loadCharacters();
      return newCharacter;
    } catch (error) {
      console.error('Error adding character:', error);
      throw error;
    }
  };

  const updateCharacter = async (characterId: string, updates: Partial<Character>) => {
    try {
      await db.characters.where('uuid').equals(characterId).modify(updates);
      await loadCharacters();
    } catch (error) {
      console.error('Error updating character:', error);
      throw error;
    }
  };

  const deleteCharacter = async (characterId: string) => {
    try {
      await db.characters.where('uuid').equals(characterId).delete();
      // Також видаляємо пов'язані зв'язки
      await db.relationships.where('sourceId').equals(characterId).delete();
      await db.relationships.where('targetId').equals(characterId).delete();
      await loadCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  };

  const searchCharacters = async (query: string): Promise<Character[]> => {
    try {
      return await db.characters
        .where('worldId')
        .equals(worldId)
        .filter(char => 
          char.name.toLowerCase().includes(query.toLowerCase()) ||
          char.race.toLowerCase().includes(query.toLowerCase()) ||
          char.characterClass.toLowerCase().includes(query.toLowerCase()) ||
          char.description.toLowerCase().includes(query.toLowerCase())
        )
        .toArray();
    } catch (error) {
      console.error('Error searching characters:', error);
      return [];
    }
  };

  return {
    characters,
    loading,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    searchCharacters,
    refreshCharacters: loadCharacters
  };
}

// Хук для роботи з нотатками
export function useNotesDB(worldId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!worldId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const notesData = await db.notes
        .where('worldId')
        .equals(worldId)
        .orderBy('lastModified')
        .reverse()
        .toArray();
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const addNote = async (noteData: Omit<Note, 'id' | 'uuid' | 'createdAt' | 'lastModified'>) => {
    try {
      const newNote = await db.notes.add({
        ...noteData,
        worldId
      });
      await loadNotes();
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      await db.notes.where('uuid').equals(noteId).modify(updates);
      await loadNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await db.notes.where('uuid').equals(noteId).delete();
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const searchNotes = async (query: string): Promise<Note[]> => {
    try {
      return await db.notes
        .where('worldId')
        .equals(worldId)
        .filter(note => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .toArray();
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
    refreshNotes: loadNotes
  };
}

// Хук для глобального пошуку в IndexedDB
export function useGlobalSearchDB() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: any[] = [];

    try {
      const lowerQuery = query.toLowerCase();

      // Пошук персонажів
      const characters = await db.characters
        .filter(char => 
          char.name.toLowerCase().includes(lowerQuery) ||
          char.description.toLowerCase().includes(lowerQuery) ||
          char.race.toLowerCase().includes(lowerQuery) ||
          char.characterClass.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      characters.forEach(char => {
        results.push({
          id: char.uuid,
          type: 'character',
          title: char.name,
          description: `${char.race} ${char.characterClass}`,
          worldId: char.worldId,
          section: 'characters',
          relevance: calculateRelevance(char.name, char.description, query)
        });
      });

      // Пошук лору
      const loreItems = await db.loreItems
        .filter(item => 
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      loreItems.forEach(item => {
        results.push({
          id: item.uuid,
          type: 'lore',
          title: item.name,
          description: item.description,
          worldId: item.worldId,
          section: 'lore',
          subsection: item.type,
          relevance: calculateRelevance(item.name, item.description, query)
        });
      });

      // Пошук нотаток
      const notes = await db.notes
        .filter(note => 
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      notes.forEach(note => {
        results.push({
          id: note.uuid,
          type: 'note',
          title: note.title,
          description: note.content.substring(0, 100),
          worldId: note.worldId,
          section: 'notes',
          relevance: calculateRelevance(note.title, note.content, query)
        });
      });

      // Пошук карт
      const maps = await db.maps
        .filter(map => 
          map.name.toLowerCase().includes(lowerQuery) ||
          map.description.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      maps.forEach(map => {
        results.push({
          id: map.uuid,
          type: 'map',
          title: map.name,
          description: map.description,
          worldId: map.worldId,
          section: 'maps',
          relevance: calculateRelevance(map.name, map.description, query)
        });
      });

      // Пошук сценаріїв
      const scenarios = await db.scenarios
        .filter(scenario => 
          scenario.title.toLowerCase().includes(lowerQuery) ||
          scenario.description.toLowerCase().includes(lowerQuery)
        )
        .toArray();

      scenarios.forEach(scenario => {
        results.push({
          id: scenario.uuid,
          type: 'scenario',
          title: scenario.title,
          description: scenario.description,
          worldId: scenario.worldId,
          section: 'scenarios',
          relevance: calculateRelevance(scenario.title, scenario.description, query)
        });
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

  const calculateRelevance = (title: string, description: string, query: string): number => {
    const lowerQuery = query.toLowerCase();
    let relevance = 0;

    // Точний збіг в назві
    if (title.toLowerCase() === lowerQuery) relevance += 100;
    // Назва починається з запиту
    else if (title.toLowerCase().startsWith(lowerQuery)) relevance += 80;
    // Назва містить запит
    else if (title.toLowerCase().includes(lowerQuery)) relevance += 60;

    // Опис містить запит
    if (description.toLowerCase().includes(lowerQuery)) relevance += 20;

    return relevance;
  };

  return {
    searchResults,
    isSearching,
    performSearch
  };
}

// Хук для статистики бази даних
export function useDatabaseStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const dbStats = await DatabaseManager.getDatabaseStats();
      setStats(dbStats);
    } catch (error) {
      console.error('Error loading database stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    
    // Оновлюємо статистику кожні 30 секунд
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return {
    stats,
    loading,
    refreshStats: loadStats
  };
}

// Хук для резервного копіювання
export function useBackupSystem() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBackups = useCallback(async () => {
    try {
      const backupsData = await db.backups.orderBy('createdAt').reverse().toArray();
      setBackups(backupsData);
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  }, []);

  useEffect(() => {
    loadBackups();
  }, [loadBackups]);

  const createBackup = async (name?: string) => {
    setLoading(true);
    try {
      const backupName = await DatabaseManager.createBackup(name);
      await loadBackups();
      return backupName;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (backupId: number) => {
    setLoading(true);
    try {
      const success = await DatabaseManager.restoreFromBackup(backupId);
      if (success) {
        // Перезавантажуємо сторінку для оновлення всіх даних
        window.location.reload();
      }
      return success;
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (backupId: number) => {
    try {
      await db.backups.delete(backupId);
      await loadBackups();
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  };

  const exportToFile = async () => {
    setLoading(true);
    try {
      await DatabaseManager.exportToFile();
    } catch (error) {
      console.error('Error exporting to file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importFromFile = async (file: File) => {
    setLoading(true);
    try {
      const success = await DatabaseManager.importFromFile(file);
      if (success) {
        window.location.reload();
      }
      return success;
    } catch (error) {
      console.error('Error importing from file:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    backups,
    loading,
    createBackup,
    restoreBackup,
    deleteBackup,
    exportToFile,
    importFromFile,
    refreshBackups: loadBackups
  };
}