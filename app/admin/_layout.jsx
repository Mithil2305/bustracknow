import { Stack } from "expo-router";
import { palette } from "../../design/tokens";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen name="routes" options={{ title: "Route Management" }} />
      <Stack.Screen name="stops" options={{ title: "Stop Management" }} />
      <Stack.Screen name="users" options={{ title: "User Management" }} />
      <Stack.Screen name="god-mode" options={{ title: "God Mode Map" }} />
    </Stack>
  );
}
