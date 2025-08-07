import Dexie, { Table } from 'dexie';
import LZString from 'lz-string';

// Інтерфейси для бази даних
export interface World {
  id?: number;
  uuid: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
  isActive: boolean;
}

export interface Character {
  id?: number;
  uuid: string;
  worldId: string;
  name: string;
  image?: string;
  birthDate: string;
  birthPlace: string;
  race: string;
  ethnicity: string;
  status: string;
  relatives: string;
  characterClass: string;
  description: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export interface LoreItem {
  id?: number;
  uuid: string;
  worldId: string;
  type: string;
  name: string;
  image?: string;
  description: string;
  subtype?: string;
  relatedLocations?: string;
  relatedCharacters?: string;
  dangerLevel?: string;
  eventDate?: string;
  origin?: string;
  magicalSkills?: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export interface Note {
  id?: number;
  uuid: string;
  worldId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export interface WorldMap {
  id?: number;
  uuid: string;
  worldId: string;
  name: string;
  description: string;
  imageData?: string; // Base64 або blob
  width: number;
  height: number;
  scale: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export interface MapMarker {
  id?: number;
  uuid: string;
  mapId: string;
  x: number;
  y: number;
  type: 'location' | 'character' | 'event' | 'lore';
  entityId: string;
  entityName: string;
  title: string;
  description: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
  createdAt: string;
  lastModified: string;
}

export interface Relationship {
  id?: number;
  uuid: string;
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

export interface Scenario {
  id?: number;
  uuid: string;
  worldId: string;
  title: string;
  description: string;
  type: 'adventure' | 'campaign' | 'oneshot' | 'sidequest';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  status: 'draft' | 'active' | 'completed' | 'paused';
  tags: string[];
  estimatedDuration: string;
  playerCount: string;
  createdAt: string;
  lastModified: string;
}

export interface Chronology {
  id?: number;
  uuid: string;
  worldId: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  lastModified: string;
}

export interface ChronologyEvent {
  id?: number;
  uuid: string;
  chronologyId: string;
  name: string;
  date: number;
  type: string;
  description: string;
  image?: string;
  relatedLocations?: string;
  relatedCharacters?: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export interface AppSettings {
  id?: number;
  key: string;
  value: string;
  lastModified: string;
}

export interface BackupRecord {
  id?: number;
  name: string;
  data: string; // Compressed JSON
  size: number;
  createdAt: string;
}

// База даних
class FantasyWorldDatabase extends Dexie {
  worlds!: Table<World>;
  characters!: Table<Character>;
  loreItems!: Table<LoreItem>;
  notes!: Table<Note>;
  maps!: Table<WorldMap>;
  markers!: Table<MapMarker>;
  relationships!: Table<Relationship>;
  scenarios!: Table<Scenario>;
  chronologies!: Table<Chronology>;
  events!: Table<ChronologyEvent>;
  settings!: Table<AppSettings>;
  backups!: Table<BackupRecord>;

  constructor() {
    super('FantasyWorldBuilder');
    
    this.version(1).stores({
      worlds: '++id, uuid, name, isActive, createdAt, lastModified',
      characters: '++id, uuid, worldId, name, race, characterClass, status, createdAt, lastModified',
      loreItems: '++id, uuid, worldId, type, name, subtype, createdAt, lastModified',
      notes: '++id, uuid, worldId, title, category, createdAt, lastModified',
      maps: '++id, uuid, worldId, name, isPublic, createdAt, lastModified',
      markers: '++id, uuid, mapId, type, entityId, isVisible, createdAt',
      relationships: '++id, uuid, worldId, sourceType, sourceId, targetType, targetId, status, strength, createdAt',
      scenarios: '++id, uuid, worldId, title, type, difficulty, status, createdAt, lastModified',
      chronologies: '++id, uuid, worldId, name, createdAt, lastModified',
      events: '++id, uuid, chronologyId, name, date, type, createdAt, lastModified',
      settings: '++id, key, lastModified',
      backups: '++id, name, size, createdAt'
    });

    // Хуки для автоматичного оновлення lastModified
    this.worlds.hook('creating', (primKey, obj, trans) => {
      obj.uuid = obj.uuid || generateUUID();
      obj.createdAt = obj.createdAt || new Date().toISOString();
      obj.lastModified = new Date().toISOString();
    });

    this.worlds.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.lastModified = new Date().toISOString();
    });

    // Аналогічні хуки для інших таблиць
    [this.characters, this.loreItems, this.notes, this.maps, this.markers, 
     this.relationships, this.scenarios, this.chronologies, this.events].forEach(table => {
      table.hook('creating', (primKey, obj, trans) => {
        obj.uuid = obj.uuid || generateUUID();
        obj.createdAt = obj.createdAt || new Date().toISOString();
        obj.lastModified = new Date().toISOString();
      });

      table.hook('updating', (modifications, primKey, obj, trans) => {
        modifications.lastModified = new Date().toISOString();
      });
    });
  }
}

// Генерація UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Ініціалізація бази даних
export const db = new FantasyWorldDatabase();

// Утіліти для роботи з даними
export class DatabaseManager {
  // Міграція з localStorage
  static async migrateFromLocalStorage(): Promise<boolean> {
    try {
      console.log('🔄 Початок міграції з localStorage...');
      
      // Перевіряємо чи є дані в IndexedDB
      const existingWorlds = await db.worlds.count();
      if (existingWorlds > 0) {
        console.log('✅ Дані вже мігровані');
        return true;
      }

      // Мігруємо світи
      const worldsData = localStorage.getItem('fantasyWorldBuilder_worlds');
      if (worldsData) {
        const worlds = JSON.parse(worldsData);
        for (const world of worlds) {
          await db.worlds.add({
            uuid: world.id,
            name: world.name,
            description: world.description,
            createdAt: world.createdAt,
            lastModified: world.lastModified,
            isActive: false
          });
        }
        console.log(`✅ Мігровано ${worlds.length} світів`);
      }

      // Мігруємо персонажів
      const charactersData = localStorage.getItem('fantasyWorldBuilder_characters');
      if (charactersData) {
        const characters = JSON.parse(charactersData);
        for (const char of characters) {
          await db.characters.add({
            uuid: char.id,
            worldId: char.worldId,
            name: char.name,
            image: char.image,
            birthDate: char.birthDate,
            birthPlace: char.birthPlace,
            race: char.race,
            ethnicity: char.ethnicity,
            status: char.status,
            relatives: char.relatives,
            characterClass: char.characterClass,
            description: char.description,
            tags: char.tags || [],
            createdAt: char.createdAt,
            lastModified: char.lastModified
          });
        }
        console.log(`✅ Мігровано ${characters.length} персонажів`);
      }

      // Мігруємо дані для кожного світу
      const allWorlds = await db.worlds.toArray();
      for (const world of allWorlds) {
        // Лор
        const loreData = localStorage.getItem(`fantasyWorldBuilder_lore_${world.uuid}`);
        if (loreData) {
          const loreItems = JSON.parse(loreData);
          for (const item of loreItems) {
            await db.loreItems.add({
              uuid: item.id,
              worldId: world.uuid,
              type: item.type,
              name: item.name,
              image: item.image,
              description: item.description,
              subtype: item.subtype,
              relatedLocations: item.relatedLocations,
              relatedCharacters: item.relatedCharacters,
              dangerLevel: item.dangerLevel,
              eventDate: item.eventDate,
              origin: item.origin,
              magicalSkills: item.magicalSkills,
              tags: item.tags || [],
              createdAt: item.createdAt,
              lastModified: item.lastModified
            });
          }
        }

        // Нотатки
        const notesData = localStorage.getItem(`fantasyWorldBuilder_notes_${world.uuid}`);
        if (notesData) {
          const notes = JSON.parse(notesData);
          for (const note of notes) {
            await db.notes.add({
              uuid: note.id,
              worldId: world.uuid,
              title: note.title,
              content: note.content,
              category: note.category,
              tags: note.tags || [],
              createdAt: note.createdAt,
              lastModified: note.lastModified
            });
          }
        }

        // Карти
        const mapsData = localStorage.getItem(`fantasyWorldBuilder_maps_${world.uuid}`);
        if (mapsData) {
          const maps = JSON.parse(mapsData);
          for (const map of maps) {
            await db.maps.add({
              uuid: map.id,
              worldId: world.uuid,
              name: map.name,
              description: map.description,
              imageData: map.imageFile || map.imageUrl,
              width: map.width,
              height: map.height,
              scale: map.scale,
              isPublic: map.isPublic,
              tags: map.tags || [],
              createdAt: map.createdAt,
              lastModified: map.lastModified
            });
          }
        }

        // Маркери
        const markersData = localStorage.getItem(`fantasyWorldBuilder_markers_${world.uuid}`);
        if (markersData) {
          const markers = JSON.parse(markersData);
          for (const marker of markers) {
            await db.markers.add({
              uuid: marker.id,
              mapId: marker.mapId,
              x: marker.x,
              y: marker.y,
              type: marker.type,
              entityId: marker.entityId,
              entityName: marker.entityName,
              title: marker.title,
              description: marker.description,
              color: marker.color,
              size: marker.size,
              isVisible: marker.isVisible,
              createdAt: marker.createdAt,
              lastModified: marker.lastModified
            });
          }
        }

        // Зв'язки
        const relationshipsData = localStorage.getItem(`fantasyWorldBuilder_relationships_${world.uuid}`);
        if (relationshipsData) {
          const relationships = JSON.parse(relationshipsData);
          for (const rel of relationships) {
            await db.relationships.add({
              uuid: rel.id,
              worldId: world.uuid,
              sourceType: rel.sourceType,
              sourceId: rel.sourceId,
              sourceName: rel.sourceName,
              targetType: rel.targetType,
              targetId: rel.targetId,
              targetName: rel.targetName,
              relationshipType: rel.relationshipType,
              description: rel.description,
              strength: rel.strength,
              status: rel.status,
              startDate: rel.startDate,
              endDate: rel.endDate,
              isSecret: rel.isSecret,
              createdAt: rel.createdAt,
              lastModified: rel.lastModified
            });
          }
        }

        // Хронології
        const chronologiesData = localStorage.getItem(`fantasyWorldBuilder_chronologies_${world.uuid}`);
        if (chronologiesData) {
          const chronologies = JSON.parse(chronologiesData);
          for (const chron of chronologies) {
            await db.chronologies.add({
              uuid: chron.id,
              worldId: world.uuid,
              name: chron.name,
              description: chron.description,
              image: chron.image,
              createdAt: chron.createdAt,
              lastModified: chron.lastModified
            });
          }
        }

        // Події
        const eventsData = localStorage.getItem(`fantasyWorldBuilder_events_${world.uuid}`);
        if (eventsData) {
          const events = JSON.parse(eventsData);
          for (const event of events) {
            await db.events.add({
              uuid: event.id,
              chronologyId: event.chronologyId,
              name: event.name,
              date: event.date,
              type: event.type,
              description: event.description,
              image: event.image,
              relatedLocations: event.relatedLocations,
              relatedCharacters: event.relatedCharacters,
              tags: event.tags || [],
              createdAt: event.createdAt,
              lastModified: event.lastModified
            });
          }
        }
      }

      // Мігруємо сценарії
      const scenariosData = localStorage.getItem('fantasyWorldBuilder_scenarios');
      if (scenariosData) {
        const scenarios = JSON.parse(scenariosData);
        for (const scenario of scenarios) {
          await db.scenarios.add({
            uuid: scenario.id,
            worldId: scenario.worldId,
            title: scenario.title,
            description: scenario.description,
            type: scenario.type,
            difficulty: scenario.difficulty,
            status: scenario.status,
            tags: scenario.tags || [],
            estimatedDuration: scenario.estimatedDuration,
            playerCount: scenario.playerCount,
            createdAt: scenario.createdAt,
            lastModified: scenario.lastModified
          });
        }
        console.log(`✅ Мігровано ${scenarios.length} сценаріїв`);
      }

      // Мігруємо налаштування
      const settingsData = localStorage.getItem('fantasyWorldBuilder_settings');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        for (const [key, value] of Object.entries(settings)) {
          await db.settings.add({
            key,
            value: JSON.stringify(value),
            lastModified: new Date().toISOString()
          });
        }
      }

      // Встановлюємо поточний світ
      const currentWorldId = localStorage.getItem('fantasyWorldBuilder_currentWorld');
      if (currentWorldId) {
        await db.worlds.where('uuid').equals(currentWorldId).modify({ isActive: true });
        await db.settings.add({
          key: 'currentWorldId',
          value: currentWorldId,
          lastModified: new Date().toISOString()
        });
      }

      console.log('✅ Міграція завершена успішно!');
      return true;
    } catch (error) {
      console.error('❌ Помилка міграції:', error);
      return false;
    }
  }

  // Створення резервної копії
  static async createBackup(name?: string): Promise<string> {
    try {
      const backupData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        worlds: await db.worlds.toArray(),
        characters: await db.characters.toArray(),
        loreItems: await db.loreItems.toArray(),
        notes: await db.notes.toArray(),
        maps: await db.maps.toArray(),
        markers: await db.markers.toArray(),
        relationships: await db.relationships.toArray(),
        scenarios: await db.scenarios.toArray(),
        chronologies: await db.chronologies.toArray(),
        events: await db.events.toArray(),
        settings: await db.settings.toArray()
      };

      const jsonData = JSON.stringify(backupData);
      const compressedData = LZString.compress(jsonData);
      
      const backupName = name || `Backup-${new Date().toISOString().split('T')[0]}`;
      
      await db.backups.add({
        name: backupName,
        data: compressedData,
        size: compressedData.length,
        createdAt: new Date().toISOString()
      });

      return backupName;
    } catch (error) {
      console.error('Помилка створення резервної копії:', error);
      throw error;
    }
  }

  // Відновлення з резервної копії
  static async restoreFromBackup(backupId: number): Promise<boolean> {
    try {
      const backup = await db.backups.get(backupId);
      if (!backup) {
        throw new Error('Резервну копію не знайдено');
      }

      const jsonData = LZString.decompress(backup.data);
      const backupData = JSON.parse(jsonData);

      // Очищаємо поточні дані
      await db.transaction('rw', [
        db.worlds, db.characters, db.loreItems, db.notes, db.maps, 
        db.markers, db.relationships, db.scenarios, db.chronologies, db.events
      ], async () => {
        await db.worlds.clear();
        await db.characters.clear();
        await db.loreItems.clear();
        await db.notes.clear();
        await db.maps.clear();
        await db.markers.clear();
        await db.relationships.clear();
        await db.scenarios.clear();
        await db.chronologies.clear();
        await db.events.clear();
      });

      // Відновлюємо дані
      await db.worlds.bulkAdd(backupData.worlds);
      await db.characters.bulkAdd(backupData.characters);
      await db.loreItems.bulkAdd(backupData.loreItems);
      await db.notes.bulkAdd(backupData.notes);
      await db.maps.bulkAdd(backupData.maps);
      await db.markers.bulkAdd(backupData.markers);
      await db.relationships.bulkAdd(backupData.relationships);
      await db.scenarios.bulkAdd(backupData.scenarios);
      await db.chronologies.bulkAdd(backupData.chronologies);
      await db.events.bulkAdd(backupData.events);

      console.log('✅ Дані відновлено з резервної копії');
      return true;
    } catch (error) {
      console.error('❌ Помилка відновлення:', error);
      return false;
    }
  }

  // Експорт даних
  static async exportToFile(): Promise<void> {
    try {
      const backupData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        worlds: await db.worlds.toArray(),
        characters: await db.characters.toArray(),
        loreItems: await db.loreItems.toArray(),
        notes: await db.notes.toArray(),
        maps: await db.maps.toArray(),
        markers: await db.markers.toArray(),
        relationships: await db.relationships.toArray(),
        scenarios: await db.scenarios.toArray(),
        chronologies: await db.chronologies.toArray(),
        events: await db.events.toArray(),
        settings: await db.settings.toArray()
      };

      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `fantasy-world-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Помилка експорту:', error);
      throw error;
    }
  }

  // Імпорт даних
  static async importFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.version || !importData.worlds) {
        throw new Error('Невірний формат файлу');
      }

      // Очищаємо поточні дані
      await db.transaction('rw', [
        db.worlds, db.characters, db.loreItems, db.notes, db.maps, 
        db.markers, db.relationships, db.scenarios, db.chronologies, db.events
      ], async () => {
        await db.worlds.clear();
        await db.characters.clear();
        await db.loreItems.clear();
        await db.notes.clear();
        await db.maps.clear();
        await db.markers.clear();
        await db.relationships.clear();
        await db.scenarios.clear();
        await db.chronologies.clear();
        await db.events.clear();
      });

      // Імпортуємо дані
      if (importData.worlds) await db.worlds.bulkAdd(importData.worlds);
      if (importData.characters) await db.characters.bulkAdd(importData.characters);
      if (importData.loreItems) await db.loreItems.bulkAdd(importData.loreItems);
      if (importData.notes) await db.notes.bulkAdd(importData.notes);
      if (importData.maps) await db.maps.bulkAdd(importData.maps);
      if (importData.markers) await db.markers.bulkAdd(importData.markers);
      if (importData.relationships) await db.relationships.bulkAdd(importData.relationships);
      if (importData.scenarios) await db.scenarios.bulkAdd(importData.scenarios);
      if (importData.chronologies) await db.chronologies.bulkAdd(importData.chronologies);
      if (importData.events) await db.events.bulkAdd(importData.events);

      console.log('✅ Дані імпортовано успішно');
      return true;
    } catch (error) {
      console.error('❌ Помилка імпорту:', error);
      return false;
    }
  }

  // Очищення всіх даних
  static async clearAllData(): Promise<void> {
    await db.delete();
    await db.open();
    console.log('✅ Всі дані очищено');
  }

  // Статистика бази даних
  static async getDatabaseStats() {
    const stats = {
      worlds: await db.worlds.count(),
      characters: await db.characters.count(),
      loreItems: await db.loreItems.count(),
      notes: await db.notes.count(),
      maps: await db.maps.count(),
      markers: await db.markers.count(),
      relationships: await db.relationships.count(),
      scenarios: await db.scenarios.count(),
      chronologies: await db.chronologies.count(),
      events: await db.events.count(),
      backups: await db.backups.count(),
      totalSize: await this.calculateDatabaseSize()
    };

    return stats;
  }

  // Розрахунок розміру бази даних
  static async calculateDatabaseSize(): Promise<number> {
    try {
      if ('estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  // Оптимізація бази даних
  static async optimizeDatabase(): Promise<void> {
    try {
      // Видаляємо старі резервні копії (залишаємо тільки останні 10)
      const backups = await db.backups.orderBy('createdAt').toArray();
      if (backups.length > 10) {
        const toDelete = backups.slice(0, backups.length - 10);
        await db.backups.bulkDelete(toDelete.map(b => b.id!));
      }

      // Стискаємо великі текстові поля
      const notes = await db.notes.toArray();
      for (const note of notes) {
        if (note.content.length > 1000) {
          const compressed = LZString.compress(note.content);
          if (compressed.length < note.content.length * 0.8) {
            await db.notes.update(note.id!, { content: compressed });
          }
        }
      }

      console.log('✅ База даних оптимізована');
    } catch (error) {
      console.error('❌ Помилка оптимізації:', error);
    }
  }
}

// Ініціалізація при завантаженні
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    await db.open();
    
    // Перевіряємо чи потрібна міграція
    const hasLocalStorageData = localStorage.getItem('fantasyWorldBuilder_worlds');
    const hasIndexedDBData = await db.worlds.count() > 0;
    
    if (hasLocalStorageData && !hasIndexedDBData) {
      console.log('🔄 Виявлено дані localStorage, починаємо міграцію...');
      await DatabaseManager.migrateFromLocalStorage();
    }
    
    console.log('✅ База даних ініціалізована');
    return true;
  } catch (error) {
    console.error('❌ Помилка ініціалізації бази даних:', error);
    return false;
  }
};