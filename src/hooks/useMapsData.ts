import { useState, useEffect } from 'react';

export interface MapMarker {
  id: string;
  mapId: string;
  x: number; // позиція X на карті (в пікселях або відсотках)
  y: number; // позиція Y на карті (в пікселях або відсотках)
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

export interface WorldMap {
  id: string;
  worldId: string;
  name: string;
  description: string;
  imageUrl?: string;
  imageFile?: string; // Base64 encoded image
  width: number;
  height: number;
  scale: number; // масштаб карти
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export function useMapsData(worldId: string) {
  const [maps, setMaps] = useState<WorldMap[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  // Завантаження карт з localStorage
  useEffect(() => {
    if (worldId) {
      const savedMaps = localStorage.getItem(`fantasyWorldBuilder_maps_${worldId}`);
      if (savedMaps) {
        try {
          setMaps(JSON.parse(savedMaps));
        } catch (error) {
          console.error('Error loading maps:', error);
          setMaps([]);
        }
      }

      const savedMarkers = localStorage.getItem(`fantasyWorldBuilder_markers_${worldId}`);
      if (savedMarkers) {
        try {
          setMarkers(JSON.parse(savedMarkers));
        } catch (error) {
          console.error('Error loading markers:', error);
          setMarkers([]);
        }
      }
    }
  }, [worldId]);

  // Збереження карт в localStorage
  const saveMaps = (items: WorldMap[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_maps_${worldId}`, JSON.stringify(items));
      setMaps(items);
    }
  };

  // Збереження маркерів в localStorage
  const saveMarkers = (items: MapMarker[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_markers_${worldId}`, JSON.stringify(items));
      setMarkers(items);
    }
  };

  const addMap = (mapData: Omit<WorldMap, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    const newMap: WorldMap = {
      id: Date.now().toString(),
      worldId,
      ...mapData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedMaps = [...maps, newMap];
    saveMaps(updatedMaps);
    return newMap;
  };

  const updateMap = (mapId: string, updates: Partial<WorldMap>) => {
    const updatedMaps = maps.map(map =>
      map.id === mapId
        ? { ...map, ...updates, lastModified: new Date().toISOString() }
        : map
    );
    saveMaps(updatedMaps);
  };

  const deleteMap = (mapId: string) => {
    const updatedMaps = maps.filter(map => map.id !== mapId);
    saveMaps(updatedMaps);

    // Також видаляємо всі маркери цієї карти
    const updatedMarkers = markers.filter(marker => marker.mapId !== mapId);
    saveMarkers(updatedMarkers);
  };

  const addMarker = (markerData: Omit<MapMarker, 'id' | 'createdAt' | 'lastModified'>) => {
    const newMarker: MapMarker = {
      id: Date.now().toString(),
      ...markerData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedMarkers = [...markers, newMarker];
    saveMarkers(updatedMarkers);
    return newMarker;
  };

  const updateMarker = (markerId: string, updates: Partial<MapMarker>) => {
    const updatedMarkers = markers.map(marker =>
      marker.id === markerId
        ? { ...marker, ...updates, lastModified: new Date().toISOString() }
        : marker
    );
    saveMarkers(updatedMarkers);
  };

  const deleteMarker = (markerId: string) => {
    const updatedMarkers = markers.filter(marker => marker.id !== markerId);
    saveMarkers(updatedMarkers);
  };

  const getMarkersByMap = (mapId: string) => {
    return markers.filter(marker => marker.mapId === mapId);
  };

  const searchMaps = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return maps.filter(map =>
      map.name.toLowerCase().includes(lowercaseQuery) ||
      map.description.toLowerCase().includes(lowercaseQuery) ||
      map.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    maps,
    markers,
    addMap,
    updateMap,
    deleteMap,
    addMarker,
    updateMarker,
    deleteMarker,
    getMarkersByMap,
    searchMaps
  };
}