import { useState, useEffect } from 'react';

export interface ChronologyEvent {
  id: string;
  chronologyId: string;
  name: string;
  date: number;
  type: string;
  description: string;
  image?: string;
  relatedLocations?: string;
  relatedCharacters?: string;
  createdAt: string;
  lastModified: string;
}

export interface Chronology {
  id: string;
  worldId: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  lastModified: string;
}

export function useChronologyData(worldId: string) {
  const [chronologies, setChronologies] = useState<Chronology[]>([]);
  const [events, setEvents] = useState<ChronologyEvent[]>([]);

  // Завантаження хронологій з localStorage
  useEffect(() => {
    if (worldId) {
      const savedChronologies = localStorage.getItem(`fantasyWorldBuilder_chronologies_${worldId}`);
      if (savedChronologies) {
        try {
          setChronologies(JSON.parse(savedChronologies));
        } catch (error) {
          console.error('Error loading chronologies:', error);
          setChronologies([]);
        }
      }
    }
  }, [worldId]);

  // Завантаження подій з localStorage
  useEffect(() => {
    if (worldId) {
      const savedEvents = localStorage.getItem(`fantasyWorldBuilder_events_${worldId}`);
      if (savedEvents) {
        try {
          setEvents(JSON.parse(savedEvents));
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents([]);
        }
      }
    }
  }, [worldId]);

  // Збереження хронологій в localStorage
  const saveChronologies = (items: Chronology[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_chronologies_${worldId}`, JSON.stringify(items));
      setChronologies(items);
    }
  };

  // Збереження подій в localStorage
  const saveEvents = (items: ChronologyEvent[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_events_${worldId}`, JSON.stringify(items));
      setEvents(items);
    }
  };

  const addChronology = (chronologyData: Omit<Chronology, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    const newChronology: Chronology = {
      id: Date.now().toString(),
      worldId,
      ...chronologyData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedChronologies = [...chronologies, newChronology];
    saveChronologies(updatedChronologies);
    return newChronology;
  };

  const updateChronology = (chronologyId: string, updates: Partial<Chronology>) => {
    const updatedChronologies = chronologies.map(chronology =>
      chronology.id === chronologyId
        ? { ...chronology, ...updates, lastModified: new Date().toISOString() }
        : chronology
    );
    saveChronologies(updatedChronologies);
  };

  const deleteChronology = (chronologyId: string) => {
    const updatedChronologies = chronologies.filter(chronology => chronology.id !== chronologyId);
    saveChronologies(updatedChronologies);
    
    // Також видаляємо всі події цієї хронології
    const updatedEvents = events.filter(event => event.chronologyId !== chronologyId);
    saveEvents(updatedEvents);
  };

  const addEvent = (eventData: Omit<ChronologyEvent, 'id' | 'chronologyId' | 'createdAt' | 'lastModified'>, chronologyId: string) => {
    const newEvent: ChronologyEvent = {
      id: Date.now().toString(),
      chronologyId,
      ...eventData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<ChronologyEvent>) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, ...updates, lastModified: new Date().toISOString() }
        : event
    );
    saveEvents(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
  };

  const getEventsByChronology = (chronologyId: string) => {
    return events.filter(event => event.chronologyId === chronologyId);
  };

  const getEventsByType = (chronologyId: string, type: string) => {
    return events.filter(event => event.chronologyId === chronologyId && event.type === type);
  };

  return {
    chronologies,
    events,
    addChronology,
    updateChronology,
    deleteChronology,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByChronology,
    getEventsByType
  };
}