import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('notes.db');

export interface Note {
  id: string;
  title: string;
  category: string;
}

// Initialize database
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
  try {
    const result = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY id DESC');
    return result;
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

// Add a new note
export const addNote = async (title: string, category: string): Promise<Note | null> => {
  try {
    const id = Date.now().toString(); // Simple ID generation
    await db.runAsync('INSERT INTO notes (id, title, category) VALUES (?, ?, ?)', [id, title, category]);
    return { id, title, category };
  } catch (error) {
    console.error('Error adding note:', error);
    return null;
  }
};

// Update a note
export const updateNote = async (id: string, title: string, category: string): Promise<boolean> => {
  try {
    await db.runAsync('UPDATE notes SET title = ?, category = ? WHERE id = ?', [title, category, id]);
    return true;
  } catch (error) {
    console.error('Error updating note:', error);
    return false;
  }
};

// Delete a note
export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};