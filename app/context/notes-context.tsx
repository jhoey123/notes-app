import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { addNote as addNoteToDb, deleteNote as deleteNoteToDb, getNotes, initDatabase, updateNote as updateNoteToDb } from './database';

export interface Note {
  id: string;
  title: string;
  category: string;
}

interface NotesContextType {
  notes: Note[];
  addNote: (title: string, category: string) => Promise<void>;
  updateNote: (id: string, title: string, category: string) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  loading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAndLoadNotes = async () => {
      try {
        await initDatabase();
        const loadedNotes = await getNotes();
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoadNotes();
  }, []);

  const addNote = async (title: string, category: string) => {
    try {
      const newNote = await addNoteToDb(title, category);
      if (newNote) {
        setNotes(prev => [newNote, ...prev]); // Add to beginning for newest first
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (id: string, title: string, category: string) => {
    try {
      const success = await updateNoteToDb(id, title, category);
      if (success) {
        setNotes(prev => prev.map(note => note.id === id ? { ...note, title, category } : note));
      }
      return success;
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const success = await deleteNoteToDb(id);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, loading }}>
      {children}
    </NotesContext.Provider>
  );
};
