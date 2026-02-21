import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../design/tokens";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/");
    }, 1400);

    return () => clearTimeout(timer);
  }, [opacity, scale, taglineOpacity, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
          <View style={styles.logoCircle}>
            <Ionicons name="bus" size={48} color={palette.primary} />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text style={[styles.title, { opacity }]}>BusTrackNow</Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.subtitle, { opacity: taglineOpacity }]}>
          Real-time tracking. Crowdsourced.
        </Animated.Text>

        {/* Bottom Branding */}
        <View style={styles.bottom}>
          <Text style={styles.footerText}>Coimbatore Pilot</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.primary },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoWrap: { marginBottom: 24 },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
  },
  bottom: {
    position: "absolute",
    bottom: 48,
  },
  footerText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
  },
});
