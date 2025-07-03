import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Стан для зберігання значення
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Отримуємо з localStorage
      const item = window.localStorage.getItem(key);
      // Парсимо збережений json або повертаємо initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Функція для оновлення стану та localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Дозволяємо value бути функцією для оновлення на основі попереднього значення
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Зберігаємо в стані
      setStoredValue(valueToStore);
      // Зберігаємо в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Хук для роботи з даними світів
export function useWorldsData() {
  const [worlds, setWorlds] = useLocalStorage('fantasyWorldBuilder_worlds', []);
  const [currentWorldId, setCurrentWorldId] = useLocalStorage('fantasyWorldBuilder_currentWorld', null);

  const addWorld = (worldData: { name: string; description: string }) => {
    const newWorld = {
      id: Date.now().toString(),
      ...worldData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setWorlds((prev: any[]) => [...prev, newWorld]);
    setCurrentWorldId(newWorld.id);
    return newWorld;
  };

  const updateWorld = (worldId: string, updates: Partial<any>) => {
    setWorlds((prev: any[]) => 
      prev.map(world => 
        world.id === worldId 
          ? { ...world, ...updates, lastModified: new Date().toISOString() }
          : world
      )
    );
  };

  const deleteWorld = (worldId: string) => {
    setWorlds((prev: any[]) => prev.filter(world => world.id !== worldId));
    if (currentWorldId === worldId) {
      setCurrentWorldId(null);
    }
  };

  const getCurrentWorld = () => {
    return worlds.find((world: any) => world.id === currentWorldId);
  };

  return {
    worlds,
    currentWorldId,
    setCurrentWorldId,
    addWorld,
    updateWorld,
    deleteWorld,
    getCurrentWorld
  };
}