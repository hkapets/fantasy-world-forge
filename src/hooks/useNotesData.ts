import { useState, useEffect } from 'react';

export interface Note {
  id: string;
  worldId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
}

export function useNotesData(worldId: string) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Завантаження нотаток з localStorage
  useEffect(() => {
    if (worldId) {
      const savedNotes = localStorage.getItem(`fantasyWorldBuilder_notes_${worldId}`);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (error) {
          console.error('Error loading notes:', error);
          setNotes([]);
        }
      }
    }
  }, [worldId]);

  // Збереження нотаток в localStorage
  const saveNotes = (items: Note[]) => {
    if (worldId) {
      localStorage.setItem(`fantasyWorldBuilder_notes_${worldId}`, JSON.stringify(items));
      setNotes(items);
    }
  };

  const addNote = (noteData: Omit<Note, 'id' | 'worldId' | 'createdAt' | 'lastModified'>) => {
    const newNote: Note = {
      id: Date.now().toString(),
      worldId,
      ...noteData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    return newNote;
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, ...updates, lastModified: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const getNotesByCategory = (category: string) => {
    return notes.filter(note => note.category === category);
  };

  const searchNotes = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByCategory,
    searchNotes
  };
}