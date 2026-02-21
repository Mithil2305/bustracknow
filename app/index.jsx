import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { palette } from "../design/tokens";
import { auth } from "../services/firebase/firebaseConfig";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const { user, userProfile, isLoading, setUser, setLoading } = useAuthStore();
  const [hasOnboarded, setHasOnboarded] = useState(null); // null = checking

  useEffect(() => {
    // Check onboarding status from AsyncStorage (PDF spec step 1)
    AsyncStorage.getItem("hasOnboarded").then((value) => {
      setHasOnboarded(value === "true");
    });

    setLoading(true);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return unsub;
  }, [setLoading, setUser]);

  // Still checking onboarding or auth state
  if (isLoading || hasOnboarded === null) {
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
