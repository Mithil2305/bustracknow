import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, palette, radius, shadow, spacing } from "../../design/tokens";
import { useCachedRoutes } from "../../hooks/useCachedRoutes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_LOW = SCREEN_HEIGHT * 0.3;
const SNAP_HIGH = SCREEN_HEIGHT * 0.65;

// Deterministic colour per route number
const ROUTE_COLORS = [palette.primary, "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#3B82F6"];
const routeColor = (num) => ROUTE_COLORS[(parseInt(num, 10) || 0) % ROUTE_COLORS.length];

export default function NearbyBusesSheet() {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT - SNAP_LOW)).current;
  const lastSnap = useRef(SCREEN_HEIGHT - SNAP_LOW);
  const [isExpanded, setIsExpanded] = useState(false);
  const { routes, loading } = useCachedRoutes({ auto: true });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        // Freeze current position at gesture start
        translateY.stopAnimation();
      },
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
        const target = current < mid ? SCREEN_HEIGHT - SNAP_HIGH : SCREEN_HEIGHT - SNAP_LOW;
        lastSnap.current = target;
        setIsExpanded(target === SCREEN_HEIGHT - SNAP_HIGH);
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: true,
          friction: 9,
          tension: 60,
        }).start();
      },
    })
  ).current;

  // Show up to 20 real routes from the store
  const buses = routes.slice(0, 20);

  const renderBus = ({ item: bus }) => {
    const color = routeColor(bus.number);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/routes/[id]",
            params: { id: bus.id },
          })
        }
      >
        <View style={[styles.routeCircle, { backgroundColor: color }]}>
          <Text style={styles.routeText}>{bus.number}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {bus.origin} → {bus.destination}
          </Text>
          <View style={styles.distanceRow}>
            <Ionicons name="map-outline" size={12} color={colors.gray400} />
            <Text style={styles.distanceText}>
              {Array.isArray(bus.stops) ? bus.stops.length : 0} stops
            </Text>
          </View>
        </View>
        <View style={styles.etaContainer}>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[styles.sheetContainer, { transform: [{ translateY }], height: SNAP_HIGH + 40 }]}
    >
      {/* Draggable Header Area — handle + title row */}
      <View {...panResponder.panHandlers} style={styles.dragZone}>
        <View style={styles.handleIndicator} />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="bus" size={16} color={palette.primary} />
            </View>
            <Text style={styles.title}>Nearby Buses</Text>
          </View>
          <View style={styles.countBadge}>
            {loading ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <Text style={styles.countText}>{buses.length}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Bus List — scrollable only when expanded */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : (
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem={renderBus}
          contentContainerStyle={styles.scrollContent}
          ListFooterComponent={<View style={{ height: 80 }} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No routes available</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          scrollEnabled={isExpanded}
        />
      )}
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
    overflow: "hidden",
    ...shadow.elevated,
  },
  dragZone: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleIndicator: {
    alignSelf: "center",
    backgroundColor: colors.gray300,
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 8,
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
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray400,
  },
});
