import { useState, useEffect, useCallback } from 'react';
import { Note, NoteFilters } from '../types/Note';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'notes-app-data';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage
  const saveNotes = useCallback((notesToSave: Note[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesToSave));
    setNotes(notesToSave);
  }, []);

  const createNote = useCallback((title: string, content: string, tags: string[] = []) => {
    const newNote: Note = {
      id: nanoid(),
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };
    
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    return newNote;
  }, [notes, saveNotes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const deleteNote = useCallback((id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const shareNote = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return null;

    const shareId = note.shareId || nanoid(10);
    updateNote(id, { isPublic: true, shareId });
    
    return `${window.location.origin}/share/${shareId}`;
  }, [notes, updateNote]);

  const getSharedNote = useCallback((shareId: string): Note | null => {
    return notes.find(note => note.shareId === shareId && note.isPublic) || null;
  }, [notes]);

  const filterNotes = useCallback((filters: NoteFilters) => {
    return notes.filter(note => {
      const matchesSearch = !filters.search || 
        note.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        note.content.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesTag = !filters.tag || note.tags.includes(filters.tag);
      
      return matchesSearch && matchesTag;
    });
  }, [notes]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    getSharedNote,
    filterNotes,
  };
};