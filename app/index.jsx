import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { palette } from "../design/tokens";
import { auth } from "../services/firebase/firebaseConfig";
import { useAuthStore } from "../store/authStore";

const AUTH_TIMEOUT_MS = 5000; // max wait for Firebase auth

export default function Index() {
  const { user, userProfile, setUser } = useAuthStore();
  const [hasOnboarded, setHasOnboarded] = useState(null); // null = checking
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check onboarding status from AsyncStorage (PDF spec step 1)
    AsyncStorage.getItem("hasOnboarded").then((value) => {
      setHasOnboarded(value === "true");
    });

    // Listen for auth state
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
    });

    // Safety timeout — if Firebase never responds, don't hang forever
    const timer = setTimeout(() => {
      setAuthReady(true);
    }, AUTH_TIMEOUT_MS);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [setUser]);

  // Still checking onboarding or auth state
  if (!authReady || hasOnboarded === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: palette.background,
        }}
      >
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  // First launch → onboarding flow (PDF spec: Screens 2-5)
  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  // Not authenticated → auth flow (PDF spec: Screens 6-9)
  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  // Admin user → admin dashboard
  if (userProfile?.role === "admin") {
    return <Redirect href="/admin" />;
  }

  // Regular user → main tabs (PDF spec: Screen 10+)
  return <Redirect href="/(tabs)" />;
}
