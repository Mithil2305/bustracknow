import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmRideModal } from "../../components/overlays";
import { palette, radius, shadow, spacing } from "../../design/tokens";
import { useCachedRoutes } from "../../hooks/useCachedRoutes";

export default function ImOnBusScreen() {
  const router = useRouter();
  const [selectedBus, setSelectedBus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { routes, loading } = useCachedRoutes({ auto: true });

  const handleConfirm = () => {
    if (!selectedBus) return;
    setShowConfirm(true);
  };

  const handleRideConfirmed = () => {
    setShowConfirm(false);
    if (!selectedBus) return;
    router.replace({
      pathname: "/modals/active-sharing",
      params: {
        route: selectedBus.number,
        routeName: `${selectedBus.origin} - ${selectedBus.destination}`,
      },
    });
  };

  // Deterministic colour per route number
  const ROUTE_COLORS = [palette.primary, "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#3B82F6"];
  const routeColor = (num) => ROUTE_COLORS[(parseInt(num, 10) || 0) % ROUTE_COLORS.length];

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={palette.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{"I'm on a Bus"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rewards Banner */}
        <View style={s.rewardsBanner}>
          <View style={s.rewardsIcon}>
            <Text style={{ fontSize: 28 }}>🪙</Text>
          </View>
          <View style={s.rewardsText}>
            <Text style={s.rewardsTitle}>Earn Cash Rewards</Text>
            <Text style={s.rewardsBody}>
              Share your location to earn points. 100 points = ₹10 directly to your UPI.
            </Text>
          </View>
        </View>

        {/* Select Your Bus */}
        <Text style={s.sectionTitle}>Select Your Bus</Text>

        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={s.loadingText}>Loading routes…</Text>
          </View>
        ) : routes.length === 0 ? (
          <View style={s.loadingWrap}>
            <Text style={s.loadingText}>No routes available</Text>
          </View>
        ) : (
          routes.map((bus) => {
            const isSelected = selectedBus?.id === bus.id;
            const color = routeColor(bus.number);
            return (
              <TouchableOpacity
                key={bus.id}
                style={[s.busCard, isSelected && s.busCardSelected]}
                onPress={() => setSelectedBus(bus)}
                activeOpacity={0.7}
              >
                <View style={[s.routeCircle, { backgroundColor: color }]}>
                  <Text style={s.routeText}>{bus.number}</Text>
                </View>
                <View style={s.busInfo}>
                  <Text style={s.busName} numberOfLines={1}>
                    {bus.origin} - {bus.destination}
                  </Text>
                  <Text style={s.busNextStop}>
                    {Array.isArray(bus.stops) ? bus.stops.length : 0} stops
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={palette.primary} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* CTA Button */}
      <View style={s.ctaContainer}>
        <TouchableOpacity
          style={[s.ctaButton, !selectedBus && s.ctaDisabled]}
          onPress={handleConfirm}
          disabled={!selectedBus}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>Confirm & Start Earning</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Modal */}
      {showConfirm && selectedBus && (
        <ConfirmRideModal
          bus={selectedBus}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleRideConfirmed}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.soft,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: palette.text,
    textAlign: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  rewardsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF6FF",
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "#BDE0FE",
    marginBottom: spacing.xl,
  },
  rewardsIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  rewardsText: { flex: 1 },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.text,
    marginBottom: 4,
  },
  rewardsBody: {
    fontSize: 13,
    color: palette.subtext,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: palette.text,
    marginBottom: spacing.md,
  },
  busCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow.soft,
  },
  busCardSelected: {
    borderColor: palette.primary,
    backgroundColor: "#F0FDFA",
  },
  routeCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  routeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  busInfo: { flex: 1 },
  busName: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 4,
  },
  busNextStop: {
    fontSize: 13,
    color: palette.muted,
  },
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: palette.background,
  },
  ctaButton: {
    height: 56,
    backgroundColor: palette.primary,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.elevated,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  loadingWrap: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: palette.muted,
  },
});
