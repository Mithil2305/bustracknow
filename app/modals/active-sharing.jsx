import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette, radius, shadow, spacing } from "../../design/tokens";

const POINTS_TOAST_DURATION = 6000; // show points toast for 6s
const POINT_INTERVAL = 60000; // 1 point per minute

export default function ActiveSharingScreen() {
  const router = useRouter();
  const { route = "12B", routeName = "Market Road - Hospital" } =
    useLocalSearchParams();

  const [seconds, setSeconds] = useState(0);
  const [points, setPoints] = useState(10); // initial bonus
  const [showToast, setShowToast] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Points accumulation (1 point per minute)
  useEffect(() => {
    const pointTimer = setInterval(
      () => setPoints((p) => p + 1),
      POINT_INTERVAL,
    );
    return () => clearInterval(pointTimer);
  }, []);

  // Switch from toast to guide view after delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowToast(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, POINTS_TOAST_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  // Pulse animation for sharing indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    return () => pulseAnim.stopAnimation();
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s2 = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s2}`;
  };

  const handleStop = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={s.container}>
      {/* Top Banner */}
      <SafeAreaView style={s.banner} edges={["top"]}>
        <View style={s.bannerContent}>
          <Animated.View
            style={[s.pulseIcon, { transform: [{ scale: pulseAnim }] }]}
          >
            <Ionicons name="radio-outline" size={22} color="#FFFFFF" />
          </Animated.View>
          <View style={s.bannerText}>
            <Text style={s.bannerTitle}>Sharing Live Location</Text>
            <Text style={s.bannerSub}>
              Bus {route} • Earn 1 pt/min
            </Text>
          </View>
          <TouchableOpacity
            style={s.stopBtn}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <Text style={s.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <View style={s.body}>
        <Animated.View style={[s.card, { opacity: fadeAnim }]}>
          {showToast ? (
            /* Points Toast View */
            <View style={s.cardInner}>
              <View style={s.coinCircle}>
                <Text style={{ fontSize: 36 }}>🪙</Text>
              </View>
              <Text style={s.pointsTitle}>+{points} Points!</Text>
              <Text style={s.pointsBody}>
                Thanks for helping the community.
              </Text>
              <View style={s.bonusRow}>
                <View style={s.bonusPill}>
                  <Text style={s.bonusText}>Base: +5</Text>
                </View>
                <View style={s.bonusPill}>
                  <Text style={s.bonusText}>Bonus: +5</Text>
                </View>
              </View>
              <View style={s.earnedRow}>
                <Text style={s.earnedLabel}>Points Earned</Text>
                <View style={s.earnedValue}>
                  <Text style={{ fontSize: 14 }}>🪙</Text>
                  <Text style={s.earnedNumber}>{points}</Text>
                </View>
              </View>
              <View style={s.badgeRow}>
                <View style={s.badge}>
                  <Ionicons
                    name="battery-half-outline"
                    size={14}
                    color={palette.muted}
                  />
                  <Text style={s.badgeText}>Low Usage</Text>
                </View>
                <View style={s.badge}>
                  <Ionicons
                    name="eye-off-outline"
                    size={14}
                    color={palette.muted}
                  />
                  <Text style={s.badgeText}>Anonymous</Text>
                </View>
              </View>
            </View>
          ) : (
            /* Guide View */
            <View style={s.cardInner}>
              <View style={s.guideCircle}>
                <Ionicons name="location" size={32} color={palette.success} />
              </View>
              <Text style={s.guideTitle}>You're the Guide!</Text>
              <Text style={s.guideBody}>
                Keep the app open to earn points. Your location helps 12 others
                waiting for this bus.
              </Text>
              <View style={s.rewardsCard}>
                <Text style={s.rewardsLabel}>CURRENT REWARDS</Text>
                <View style={s.rewardsRow}>
                  <Text style={s.rewardsKey}>Time Shared</Text>
                  <Text style={s.rewardsVal}>{formatTime(seconds)}</Text>
                </View>
                <View style={s.rewardsRow}>
                  <Text style={s.rewardsKey}>Points Earned</Text>
                  <View style={s.earnedValue}>
                    <Text style={{ fontSize: 14 }}>🪙</Text>
                    <Text style={[s.earnedNumber, { color: "#D97706" }]}>
                      {points}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={s.badgeRow}>
                <View style={s.badge}>
                  <Ionicons
                    name="battery-half-outline"
                    size={14}
                    color={palette.muted}
                  />
                  <Text style={s.badgeText}>Low Usage</Text>
                </View>
                <View style={s.badge}>
                  <Ionicons
                    name="eye-off-outline"
                    size={14}
                    color={palette.muted}
                  />
                  <Text style={s.badgeText}>Anonymous</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  banner: {
    backgroundColor: palette.primary,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pulseIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  bannerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 2,
  },
  stopBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  stopText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    ...shadow.card,
    borderWidth: 1,
    borderColor: "#FDE68A40",
  },
  cardInner: {
    padding: spacing.xl,
    alignItems: "center",
  },
  /* Points Toast */
  coinCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  pointsTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: palette.text,
    marginBottom: spacing.xs,
  },
  pointsBody: {
    fontSize: 15,
    color: palette.subtext,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  bonusRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bonusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  bonusText: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.subtext,
  },
  earnedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  earnedLabel: {
    fontSize: 14,
    color: palette.muted,
    fontWeight: "600",
  },
  earnedValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  earnedNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#D97706",
  },
  /* Guide View */
  guideCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  guideTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: palette.text,
    marginBottom: spacing.sm,
  },
  guideBody: {
    fontSize: 14,
    color: palette.subtext,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  rewardsCard: {
    width: "100%",
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.lg,
  },
  rewardsLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: palette.primary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  rewardsKey: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.text,
  },
  rewardsVal: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.text,
  },
  /* Badges */
  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: "500",
  },
});
