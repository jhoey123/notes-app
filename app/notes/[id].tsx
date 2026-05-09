import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNotes } from '../context/notes-context';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote } = useNotes();
  const note = notes.find(n => n.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setCategory(note.category);
    }
  }, [note]);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!category.trim()) {
        throw new Error('Category is required');
      }

      const success = await updateNote(note.id, title.trim(), category.trim());
      if (success) {
        setIsEditing(false);
        Alert.alert('Saved', 'Note updated successfully.');
      } else {
        Alert.alert('Error', 'Unable to update note.');
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteNote(note.id);
            if (success) {
              Alert.alert('Deleted', 'Note deleted successfully.');
              router.back();
            } else {
              Alert.alert('Error', 'Unable to delete note.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <Text style={styles.header}>Edit Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.category}>Category: {note.category}</Text>
          <Text style={styles.id}>ID: {note.id}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Note</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
  },
  id: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
  },
});