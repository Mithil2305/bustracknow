import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/useAuth";

// Suppress known deprecation from RN 0.81 internal getter (no app code uses it)
LogBox.ignoreLogs(["SafeAreaView has been deprecated", "Couldn't find the scrollable node handle"]);

// Prevent the splash from auto-hiding (safe in Expo Go where keep-awake may fail)
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore – keep-awake is unavailable in Expo Go */
});

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="viewer" />
            <Stack.Screen
              name="modals"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen name="splash" />
            <Stack.Screen name="index" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
