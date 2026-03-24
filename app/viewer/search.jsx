import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, spacing } from "../../design/tokens";
import { useCachedRoutes } from "../../hooks/useCachedRoutes";

const FILTER_TABS = ["All", "Nearest", "On Time"];

// Deterministic colour per route number
const ROUTE_COLORS = [palette.primary, "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#3B82F6"];
const routeColor = (num) => ROUTE_COLORS[(parseInt(num, 10) || 0) % ROUTE_COLORS.length];

export default function RouteSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { routes, loading } = useCachedRoutes({ auto: true });

  // Derive up to 8 unique stops from real route data for the chips
  const popularStops = useMemo(() => {
    const seen = new Set();
    const stops = [];
    for (const r of routes) {
      for (const candidate of [r.origin, r.destination]) {
        if (candidate && !seen.has(candidate) && stops.length < 8) {
          seen.add(candidate);
          stops.push(candidate);
        }
      }
      if (stops.length >= 8) break;
    }
    return stops;
  }, [routes]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return routes;
    return routes.filter(
      (r) =>
        (r.number && String(r.number).toLowerCase().includes(q)) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.origin && r.origin.toLowerCase().includes(q)) ||
        (r.destination && r.destination.toLowerCase().includes(q)) ||
        (Array.isArray(r.stops) && r.stops.some((s) => String(s).toLowerCase().includes(q)))
    );
  }, [routes, query]);

  const handleStopPress = (stop) => {
    setQuery(stop);
  };

  const handleRoutePress = (item) => {
    router.push({
      pathname: "/(tabs)/routes/[id]",
      params: { id: item.id },
    });
  };

  const renderRoute = ({ item }) => {
    const color = routeColor(item.number);
    return (
      <TouchableOpacity
        style={styles.routeCard}
        activeOpacity={0.7}
        onPress={() => handleRoutePress(item)}
      >
        {/* Route Badge */}
        <View style={[styles.routeBadge, { backgroundColor: color }]}>
          <Text style={styles.routeBadgeText}>{item.number}</Text>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfo}>
          <Text style={styles.routeName} numberOfLines={1}>
            {item.origin} → {item.destination}
          </Text>
          <View style={styles.distanceRow}>
            <Ionicons name="location-outline" size={13} color={colors.gray400} />
            <Text style={styles.distanceText}>
              {Array.isArray(item.stops) ? item.stops.length : 0} stops
            </Text>
          </View>
          <View style={styles.statusEtaRow}>
            <View style={[styles.statusPill, { backgroundColor: palette.primary }]}>
              <Text style={styles.statusText}>
                {item.source === "poy" ? "Pollachi" : "Coimbatore"}
              </Text>
            </View>
            {Array.isArray(item.scheduleTimes) && item.scheduleTimes.length > 0 && (
              <View style={styles.etaWrap}>
                <Ionicons name="time-outline" size={14} color={palette.primary} />
                <Text style={styles.etaText}>{item.scheduleTimes[0]}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Routes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Route number, destination, or stop..."
            placeholderTextColor={colors.gray400}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRoute}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Popular Stops — derived from real route origins/destinations */}
            {popularStops.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="trending-up-outline" size={20} color={colors.gray700} />
                  <Text style={styles.sectionTitle}>Popular Stops</Text>
                </View>
                <View style={styles.chipsWrap}>
                  {popularStops.map((stop) => (
                    <TouchableOpacity
                      key={stop}
                      style={styles.chip}
                      activeOpacity={0.7}
                      onPress={() => handleStopPress(stop)}
                    >
                      <Text style={styles.chipText}>{stop}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* All Routes Header + Filter Tabs */}
            <Text style={styles.allRoutesTitle}>All Routes</Text>
            <View style={styles.filterRow}>
              {FILTER_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
                  onPress={() => setActiveFilter(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      activeFilter === tab && styles.filterTabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={48} color={colors.gray300} />
              <Text style={styles.emptyText}>No routes found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.gray900,
    flex: 1,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 2,
    borderColor: palette.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.card,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.gray900,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray900,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: palette.card,
  },
  chipText: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: "500",
  },
  allRoutesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  filterTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.gray900,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray400,
  },
  filterTabTextActive: {
    color: colors.gray900,
    fontWeight: "700",
  },
  routeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  routeBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  routeBadgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 13,
    color: colors.gray500,
  },
  statusEtaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  etaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  etaText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.primary,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.gray400,
  },
});
