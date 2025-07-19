import { useState, useEffect } from 'react';
import { useMapsData, MapMarker } from './useMapsData';
import { useLocalStorage } from './useLocalStorage';

interface Character {
  id: string;
  worldId: string;
  name: string;
  birthPlace: string;
  status: string;
  image?: string;
  description: string;
}

export function useCharacterMapIntegration(worldId: string) {
  const { maps, markers, addMarker, updateMarker, deleteMarker } = useMapsData(worldId);
  const [characters] = useLocalStorage<Character[]>('fantasyWorldBuilder_characters', []);

  // Отримуємо персонажів поточного світу
  const worldCharacters = characters.filter(char => char.worldId === worldId);

  // Створення маркера персонажа на карті
  const createCharacterMarker = (
    character: Character, 
    mapId: string, 
    x: number, 
    y: number,
    isAutoCreated: boolean = false
  ) => {
    const existingMarker = markers.find(
      marker => marker.mapId === mapId && 
                marker.type === 'character' && 
                marker.entityId === character.id
    );

    if (existingMarker) {
      return existingMarker;
    }

    const newMarker = addMarker({
      mapId,
      x,
      y,
      type: 'character',
      entityId: character.id,
      entityName: character.name,
      title: character.name,
      description: `${character.status}${character.birthPlace ? ` • Народився: ${character.birthPlace}` : ''}`,
      color: getCharacterColor(character.status),
      size: 'medium',
      isVisible: true
    });

    return newMarker;
  };

  // Автоматичне створення маркерів для персонажів на картах з відповідними локаціями
  const autoCreateCharacterMarkers = () => {
    worldCharacters.forEach(character => {
      if (!character.birthPlace) return;

      // Шукаємо карти, які можуть містити місце народження персонажа
      const relevantMaps = maps.filter(map => 
        map.name.toLowerCase().includes(character.birthPlace.toLowerCase()) ||
        map.description.toLowerCase().includes(character.birthPlace.toLowerCase()) ||
        map.tags.some(tag => 
          tag.toLowerCase().includes(character.birthPlace.toLowerCase()) ||
          character.birthPlace.toLowerCase().includes(tag.toLowerCase())
        )
      );

      relevantMaps.forEach(map => {
        const existingMarker = markers.find(
          marker => marker.mapId === map.id && 
                   marker.type === 'character' && 
                   marker.entityId === character.id
        );

        if (!existingMarker) {
          // Створюємо маркер в центрі карти або в випадковій позиції
          const x = 30 + Math.random() * 40; // 30-70% від ширини
          const y = 30 + Math.random() * 40; // 30-70% від висоти
          
          createCharacterMarker(character, map.id, x, y, true);
        }
      });
    });
  };

  // Синхронізація при зміні персонажів
  const syncCharacterMarkers = () => {
    // Оновлюємо існуючі маркери персонажів
    markers
      .filter(marker => marker.type === 'character')
      .forEach(marker => {
        const character = worldCharacters.find(char => char.id === marker.entityId);
        
        if (character) {
          // Оновлюємо інформацію маркера
          updateMarker(marker.id, {
            entityName: character.name,
            title: character.name,
            description: `${character.status}${character.birthPlace ? ` • Народився: ${character.birthPlace}` : ''}`,
            color: getCharacterColor(character.status)
          });
        } else {
          // Видаляємо маркер якщо персонаж видалений
          deleteMarker(marker.id);
        }
      });
  };

  // Отримання кольору маркера на основі статусу персонажа
  const getCharacterColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('живий') || statusLower.includes('активний')) {
      return '#10b981'; // зелений
    } else if (statusLower.includes('мертвий') || statusLower.includes('загиблий')) {
      return '#ef4444'; // червоний
    } else if (statusLower.includes('зниклий') || statusLower.includes('невідомий')) {
      return '#f59e0b'; // жовтий
    } else if (statusLower.includes('ворог') || statusLower.includes('злодій')) {
      return '#dc2626'; // темно-червоний
    } else if (statusLower.includes('союзник') || statusLower.includes('друг')) {
      return '#3b82f6'; // синій
    }
    
    return '#6b7280'; // сірий за замовчуванням
  };

  // Пошук карт для персонажа на основі його локацій
  const findRelevantMapsForCharacter = (character: Character) => {
    const locations = [character.birthPlace].filter(Boolean);
    
    return maps.filter(map => 
      locations.some(location => 
        map.name.toLowerCase().includes(location.toLowerCase()) ||
        map.description.toLowerCase().includes(location.toLowerCase()) ||
        map.tags.some(tag => 
          tag.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  };

  // Отримання всіх маркерів персонажів
  const getCharacterMarkers = () => {
    return markers.filter(marker => marker.type === 'character');
  };

  // Отримання маркерів конкретного персонажа
  const getMarkersForCharacter = (characterId: string) => {
    return markers.filter(marker => 
      marker.type === 'character' && marker.entityId === characterId
    );
  };

  // Видалення всіх маркерів персонажа
  const removeCharacterMarkers = (characterId: string) => {
    const characterMarkers = getMarkersForCharacter(characterId);
    characterMarkers.forEach(marker => deleteMarker(marker.id));
  };

  return {
    createCharacterMarker,
    autoCreateCharacterMarkers,
    syncCharacterMarkers,
    findRelevantMapsForCharacter,
    getCharacterMarkers,
    getMarkersForCharacter,
    removeCharacterMarkers,
    getCharacterColor
  };
}