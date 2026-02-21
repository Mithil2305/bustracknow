import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Dimensions, FlatList, PanResponder, StyleSheet, Text, View } from "react-native";
import { colors, palette, radius, shadow, spacing } from "../../design/tokens";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_LOW = SCREEN_HEIGHT * 0.3;
const SNAP_HIGH = SCREEN_HEIGHT * 0.65;

export default function NearbyBusesSheet() {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT - SNAP_LOW)).current;
  const lastSnap = useRef(SCREEN_HEIGHT - SNAP_LOW);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderMove: (_, g) => {
        const newY = lastSnap.current + g.dy;
        const clamped = Math.max(
          SCREEN_HEIGHT - SNAP_HIGH,
          Math.min(SCREEN_HEIGHT - SNAP_LOW, newY)
        );
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, g) => {
        const current = lastSnap.current + g.dy;
        const mid = SCREEN_HEIGHT - (SNAP_LOW + SNAP_HIGH) / 2;
        const snapTo = current < mid ? SCREEN_HEIGHT - SNAP_HIGH : SCREEN_HEIGHT - SNAP_LOW;
        lastSnap.current = snapTo;
        Animated.spring(translateY, {
          toValue: snapTo,
          useNativeDriver: true,
          friction: 8,
        }).start();
      },
    })
  ).current;

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

  const renderBus = ({ item: bus }) => (
    <View style={styles.card}>
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
  );

  return (
    <Animated.View
      style={[styles.sheetContainer, { transform: [{ translateY }], height: SNAP_HIGH + 40 }]}
    >
      {/* Drag Handle */}
      <View {...panResponder.panHandlers} style={styles.handleArea}>
        <View style={styles.handleIndicator} />
      </View>

      {/* Header */}
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

      {/* Bus List */}
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={renderBus}
        contentContainerStyle={styles.scrollContent}
        ListFooterComponent={<View style={{ height: 80 }} />}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: SNAP_HIGH + 40,
    backgroundColor: palette.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...shadow.elevated,
  },
  handleArea: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  handleIndicator: {
    backgroundColor: colors.gray300,
    width: 40,
    height: 4,
    borderRadius: 2,
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
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  routeCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
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
