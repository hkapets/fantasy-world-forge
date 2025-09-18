// Система масових операцій для ефективного управління даними

import { useState, useEffect } from 'react';
import { db } from './database';
import type { Character, LoreItem, Note, Relationship } from './database';

export interface BulkOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'copy' | 'move';
  entityType: 'character' | 'lore' | 'note' | 'map' | 'scenario';
  entities: string[]; // IDs сутностей
  data?: any; // Дані для операції
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface BulkUpdateData {
  [field: string]: any;
}

export interface CopyOptions {
  sourceWorldId: string;
  targetWorldId: string;
  includeRelationships: boolean;
  updateNames: boolean;
  namePrefix?: string;
  nameSuffix?: string;
}

// Клас для масових операцій
export class BulkOperationsManager {
  private static operations: Map<string, BulkOperation> = new Map();
  private static listeners: Array<(operations: BulkOperation[]) => void> = [];

  // Додавання слухача для оновлень
  static addListener(listener: (operations: BulkOperation[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Сповіщення слухачів
  private static notifyListeners(): void {
    const operations = Array.from(this.operations.values());
    this.listeners.forEach(listener => listener(operations));
  }

  // Створення нової операції
  private static createOperation(
    type: BulkOperation['type'],
    entityType: BulkOperation['entityType'],
    entities: string[],
    data?: any
  ): BulkOperation {
    const operation: BulkOperation = {
      id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      entityType,
      entities,
      data,
      progress: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.operations.set(operation.id, operation);
    this.notifyListeners();
    return operation;
  }

  // Оновлення прогресу операції
  private static updateOperation(operationId: string, updates: Partial<BulkOperation>): void {
    const operation = this.operations.get(operationId);
    if (operation) {
      Object.assign(operation, updates);
      this.notifyListeners();
    }
  }

  // Масове оновлення персонажів
  static async bulkUpdateCharacters(
    characterIds: string[],
    updates: BulkUpdateData,
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    const operation = this.createOperation('update', 'character', characterIds, updates);
    
    try {
      this.updateOperation(operation.id, { status: 'running' });
      
      for (let i = 0; i < characterIds.length; i++) {
        const characterId = characterIds[i];
        await db.characters.where('uuid').equals(characterId).modify(updates);
        
        const progress = Math.round(((i + 1) / characterIds.length) * 100);
        this.updateOperation(operation.id, { progress });
        onProgress?.(progress);
        
        // Невелика затримка для UX
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
      return false;
    }
  }

  // Масове видалення
  static async bulkDelete(
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    const operation = this.createOperation('delete', entityType, entityIds);
    
    try {
      this.updateOperation(operation.id, { status: 'running' });
      
      for (let i = 0; i < entityIds.length; i++) {
        const entityId = entityIds[i];
        
        switch (entityType) {
          case 'character':
            await db.characters.where('uuid').equals(entityId).delete();
            // Видаляємо пов'язані зв'язки
            await db.relationships.where('sourceId').equals(entityId).delete();
            await db.relationships.where('targetId').equals(entityId).delete();
            break;
            
          case 'lore':
            await db.loreItems.where('uuid').equals(entityId).delete();
            break;
            
          case 'note':
            await db.notes.where('uuid').equals(entityId).delete();
            break;
        }
        
        const progress = Math.round(((i + 1) / entityIds.length) * 100);
        this.updateOperation(operation.id, { progress });
        onProgress?.(progress);
        
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      this.updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
      return false;
    }
  }

  // Копіювання елементів між світами
  static async copyEntitiesBetweenWorlds(
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    options: CopyOptions,
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    const operation = this.createOperation('copy', entityType, entityIds, options);
    
    try {
      this.updateOperation(operation.id, { status: 'running' });
      const copiedEntities: Array<{oldId: string, newId: string}> = [];
      
      for (let i = 0; i < entityIds.length; i++) {
        const entityId = entityIds[i];
        let newEntityId: string | null = null;
        
        switch (entityType) {
          case 'character':
            const character = await db.characters.where('uuid').equals(entityId).first();
            if (character) {
              const newCharacter = {
                ...character,
                worldId: options.targetWorldId,
                name: this.updateNameWithOptions(character.name, options)
              };
              delete newCharacter.id; // Видаляємо auto-increment ID
              newEntityId = (await db.characters.add(newCharacter)) as string;
            }
            break;
            
          case 'lore':
            const loreItem = await db.loreItems.where('uuid').equals(entityId).first();
            if (loreItem) {
              const newLoreItem = {
                ...loreItem,
                worldId: options.targetWorldId,
                name: this.updateNameWithOptions(loreItem.name, options)
              };
              delete newLoreItem.id;
              newEntityId = (await db.loreItems.add(newLoreItem)) as string;
            }
            break;
            
          case 'note':
            const note = await db.notes.where('uuid').equals(entityId).first();
            if (note) {
              const newNote = {
                ...note,
                worldId: options.targetWorldId,
                title: this.updateNameWithOptions(note.title, options)
              };
              delete newNote.id;
              newEntityId = (await db.notes.add(newNote)) as string;
            }
            break;
        }
        
        if (newEntityId) {
          copiedEntities.push({ oldId: entityId, newId: newEntityId });
        }
        
        const progress = Math.round(((i + 1) / entityIds.length) * 100);
        this.updateOperation(operation.id, { progress });
        onProgress?.(progress);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Копіюємо зв'язки якщо потрібно
      if (options.includeRelationships && copiedEntities.length > 0) {
        await this.copyRelationships(copiedEntities, options);
      }

      this.updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
      return false;
    }
  }

  // Копіювання зв'язків
  private static async copyRelationships(
    copiedEntities: Array<{oldId: string, newId: string}>,
    options: CopyOptions
  ): Promise<void> {
    const oldIds = copiedEntities.map(e => e.oldId);
    const relationships = await db.relationships
      .where('worldId').equals(options.sourceWorldId)
      .filter(rel => oldIds.includes(rel.sourceId) || oldIds.includes(rel.targetId))
      .toArray();

    for (const rel of relationships) {
      const sourceMapping = copiedEntities.find(e => e.oldId === rel.sourceId);
      const targetMapping = copiedEntities.find(e => e.oldId === rel.targetId);
      
      // Копіюємо тільки якщо обидві сутності були скопійовані
      if (sourceMapping && targetMapping) {
        const newRelationship = {
          ...rel,
          worldId: options.targetWorldId,
          sourceId: sourceMapping.newId,
          targetId: targetMapping.newId
        };
        delete newRelationship.id;
        await db.relationships.add(newRelationship);
      }
    }
  }

  // Оновлення назви з опціями
  private static updateNameWithOptions(name: string, options: CopyOptions): string {
    let updatedName = name;
    
    if (options.namePrefix) {
      updatedName = options.namePrefix + ' ' + updatedName;
    }
    
    if (options.nameSuffix) {
      updatedName = updatedName + ' ' + options.nameSuffix;
    }
    
    return updatedName;
  }

  // Масове додавання тегів
  static async bulkAddTags(
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    tagsToAdd: string[],
    onProgress?: (progress: number) => void
  ): Promise<boolean> {
    const operation = this.createOperation('update', entityType, entityIds, { tagsToAdd });
    
    try {
      this.updateOperation(operation.id, { status: 'running' });
      
      for (let i = 0; i < entityIds.length; i++) {
        const entityId = entityIds[i];
        
        switch (entityType) {
          case 'character':
            const character = await db.characters.where('uuid').equals(entityId).first();
            if (character) {
              const existingTags = character.tags || [];
              const newTags = [...new Set([...existingTags, ...tagsToAdd])];
              await db.characters.where('uuid').equals(entityId).modify({ tags: newTags });
            }
            break;
            
          case 'note':
            const note = await db.notes.where('uuid').equals(entityId).first();
            if (note) {
              const existingTags = note.tags || [];
              const newTags = [...new Set([...existingTags, ...tagsToAdd])];
              await db.notes.where('uuid').equals(entityId).modify({ tags: newTags });
            }
            break;
        }
        
        const progress = Math.round(((i + 1) / entityIds.length) * 100);
        this.updateOperation(operation.id, { progress });
        onProgress?.(progress);
        
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      this.updateOperation(operation.id, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.updateOperation(operation.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Невідома помилка'
      });
      return false;
    }
  }

  // Отримання всіх операцій
  static getAllOperations(): BulkOperation[] {
    return Array.from(this.operations.values());
  }

  // Отримання активних операцій
  static getActiveOperations(): BulkOperation[] {
    return Array.from(this.operations.values()).filter(op => 
      op.status === 'pending' || op.status === 'running'
    );
  }

  // Очищення завершених операцій
  static clearCompletedOperations(): void {
    Array.from(this.operations.entries()).forEach(([id, operation]) => {
      if (operation.status === 'completed' || operation.status === 'failed') {
        this.operations.delete(id);
      }
    });
    this.notifyListeners();
  }

  // Скасування операції
  static cancelOperation(operationId: string): boolean {
    const operation = this.operations.get(operationId);
    if (operation && operation.status === 'pending') {
      this.updateOperation(operationId, { status: 'failed', error: 'Скасовано користувачем' });
      return true;
    }
    return false;
  }
}

// Хук для роботи з масовими операціями
export function useBulkOperations() {
  const [operations, setOperations] = useState<BulkOperation[]>([]);

  useEffect(() => {
    const unsubscribe = BulkOperationsManager.addListener(setOperations);
    setOperations(BulkOperationsManager.getAllOperations());
    return unsubscribe;
  }, []);

  const bulkUpdateCharacters = async (
    characterIds: string[],
    updates: BulkUpdateData,
    onProgress?: (progress: number) => void
  ) => {
    return await BulkOperationsManager.bulkUpdateCharacters(characterIds, updates, onProgress);
  };

  const bulkDelete = async (
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    onProgress?: (progress: number) => void
  ) => {
    return await BulkOperationsManager.bulkDelete(entityType, entityIds, onProgress);
  };

  const copyEntitiesBetweenWorlds = async (
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    options: CopyOptions,
    onProgress?: (progress: number) => void
  ) => {
    return await BulkOperationsManager.copyEntitiesBetweenWorlds(entityType, entityIds, options, onProgress);
  };

  const bulkAddTags = async (
    entityType: BulkOperation['entityType'],
    entityIds: string[],
    tags: string[],
    onProgress?: (progress: number) => void
  ) => {
    return await BulkOperationsManager.bulkAddTags(entityType, entityIds, tags, onProgress);
  };

  const clearCompleted = () => {
    BulkOperationsManager.clearCompletedOperations();
  };

  const cancelOperation = (operationId: string) => {
    return BulkOperationsManager.cancelOperation(operationId);
  };

  return {
    operations,
    activeOperations: operations.filter(op => op.status === 'pending' || op.status === 'running'),
    completedOperations: operations.filter(op => op.status === 'completed'),
    failedOperations: operations.filter(op => op.status === 'failed'),
    bulkUpdateCharacters,
    bulkDelete,
    copyEntitiesBetweenWorlds,
    bulkAddTags,
    clearCompleted,
    cancelOperation
  };
}