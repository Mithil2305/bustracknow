import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { palette, radius, spacing } from "../../design/tokens";

export default function PointsToastModal() {
  const router = useRouter();
  const { points = 0, reason = "contribution" } = useLocalSearchParams();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        router.back();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [opacity, translateY, router]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
        <Text style={styles.icon}>🎉</Text>
        <View>
          <Text style={styles.title}>+{points} Points!</Text>
          <Text style={styles.reason}>{reason}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 100,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.success,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: "800", color: "#fff" },
  reason: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
});
