import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, palette, shadow, spacing } from "../../design/tokens";

export default function NearbyBusesSheet() {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["30%", "65%"], []);

  const buses = [
    {
      id: "1",
      route: "43A",
      origin: "City Center",
      destination: "Railway Station",
      distance: "0.3 km",
      eta: "2 min",
      status: "ON TIME",
      color: palette.success,
    },
    {
      id: "2",
      route: "12B",
      origin: "Market Road",
      destination: "Hospital",
      distance: "0.8 km",
      eta: "8 min",
      status: "LATE",
      color: palette.warning,
    },
    {
      id: "3",
      route: "7",
      origin: "Bus Stand",
      destination: "College",
      distance: "1.2 km",
      eta: "15 min",
      status: "ON TIME",
      color: palette.success,
    },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      style={styles.sheetContainer}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="bus" size={16} color={palette.primary} />
          </View>
          <Text style={styles.title}>Nearby Buses</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{buses.length}</Text>
        </View>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        {buses.map((bus) => (
          <View key={bus.id} style={styles.card}>
            <View style={[styles.routeCircle, { backgroundColor: bus.color }]}>
              <Text style={styles.routeText}>{bus.route}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {bus.origin} → {bus.destination}
              </Text>
              <View style={styles.distanceRow}>
                <Ionicons name="navigate-outline" size={12} color={colors.gray400} />
                <Text style={styles.distanceText}>{bus.distance} away</Text>
              </View>
            </View>

            <View style={styles.etaContainer}>
              <Text
                style={[
                  styles.etaText,
                  { color: bus.status === "LATE" ? palette.warning : palette.primary },
                ]}
              >
                {bus.eta}
              </Text>
              <Text style={[styles.statusText, { color: bus.color }]}>{bus.status}</Text>
            </View>
          </View>
        ))}

        {/* Extra padding at bottom for FAB clearance */}
        <View style={{ height: 80 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    ...shadow.elevated,
  },
  sheetBackground: {
    backgroundColor: palette.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.gray300,
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray900,
  },
  countBadge: {
    backgroundColor: palette.surface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.gray600,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  routeCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  routeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 3,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 12,
    color: colors.gray500,
    marginLeft: 4,
  },
  etaContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  etaText: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
