import { Stack } from "expo-router";
import { NotesProvider } from "./context/notes-context";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack />
    </NotesProvider>
  );
}
