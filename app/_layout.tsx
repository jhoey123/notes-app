import { Stack } from "expo-router";
import { NotesProvider } from "./context/notes-context";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="add-note" 
          options={{ 
            title: 'Add Note',
            headerShown: true,
            presentation: 'modal'
          }} 
        />
      </Stack>
    </NotesProvider>
  );
}
