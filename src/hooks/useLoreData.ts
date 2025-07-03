import { useState, useEffect } from 'react';

interface LoreItem {
  id: string;
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
  createdAt: string;
  lastModified: string;
}

export function useLoreData(worldId: string) {
  const [loreItems, setLoreItems] = useState<LoreItem[]>([]);

  // Завантаження даних з localStorage
  useEffect(() => {
    if (worldId) {
      const savedLore = localStorage.getItem(`fantasyWorldBuilder_lore_${worldId}`);
      if (savedLore) {
        try {
          setLoreItems(JSON.parse(savedLore));
        } catch (error) {
          console.error('Error loading lore data:', error);
          setLoreItems([]);
        }
      }
    }
  }, [worldId]);

  // Збереження даних в localStorage
  const saveLoreItems = (items: LoreItem[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_lore_${worldId}`, JSON.stringify(items));
      setLoreItems(items);
    }
  };

  const addLoreItem = (loreData: Omit<LoreItem, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    const newItem: LoreItem = {
      id: Date.now().toString(),
      worldId,
      ...loreData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedItems = [...loreItems, newItem];
    saveLoreItems(updatedItems);
    return newItem;
  };

  const updateLoreItem = (itemId: string, updates: Partial<LoreItem>) => {
    const updatedItems = loreItems.map(item =>
      item.id === itemId
        ? { ...item, ...updates, lastModified: new Date().toISOString() }
        : item
    );
    saveLoreItems(updatedItems);
  };

  const deleteLoreItem = (itemId: string) => {
    const updatedItems = loreItems.filter(item => item.id !== itemId);
    saveLoreItems(updatedItems);
  };

  const getLoreItemsByType = (type: string) => {
    return loreItems.filter(item => item.type === type);
  };

  return {
    loreItems,
    addLoreItem,
    updateLoreItem,
    deleteLoreItem,
    getLoreItemsByType
  };
}