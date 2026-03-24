import {
  GoogleSansFlex_400Regular,
  GoogleSansFlex_500Medium,
  GoogleSansFlex_600SemiBold,
  GoogleSansFlex_700Bold,
  GoogleSansFlex_800ExtraBold,
} from "@expo-google-fonts/google-sans-flex";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { LogBox, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/useAuth";

// Apply Google Sans Flex as the default font for ALL Text and TextInput components
const defaultFontFamily = "GoogleSansFlex-Regular";

// Text
const oldTextRender = Text.render;
Text.render = function (...args) {
  const origin = oldTextRender.call(this, ...args);
  const style = origin.props.style;
  // Flatten style array to a single object so we can check fontFamily
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};
  if (!flatStyle.fontFamily) {
    return {
      ...origin,
      props: {
        ...origin.props,
        style: [{ fontFamily: defaultFontFamily }, style],
      },
    };
  }
  return origin;
};

// TextInput
const oldTextInputRender = TextInput.render;
TextInput.render = function (...args) {
  const origin = oldTextInputRender.call(this, ...args);
  const style = origin.props.style;
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};
  if (!flatStyle.fontFamily) {
    return {
      ...origin,
      props: {
        ...origin.props,
        style: [{ fontFamily: defaultFontFamily }, style],
      },
    };
  }
  return origin;
};

// Suppress known deprecation from RN 0.81 internal getter (no app code uses it)
LogBox.ignoreLogs(["SafeAreaView has been deprecated", "Couldn't find the scrollable node handle"]);

// Prevent the splash from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore – keep-awake is unavailable in Expo Go */
});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "GoogleSansFlex-Regular": GoogleSansFlex_400Regular,
    "GoogleSansFlex-Medium": GoogleSansFlex_500Medium,
    "GoogleSansFlex-SemiBold": GoogleSansFlex_600SemiBold,
    "GoogleSansFlex-Bold": GoogleSansFlex_700Bold,
    "GoogleSansFlex-ExtraBold": GoogleSansFlex_800ExtraBold,
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
    </View>
  );
}
