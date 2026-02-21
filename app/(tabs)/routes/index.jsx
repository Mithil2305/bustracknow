import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { colors, palette, shadow, spacing } from "../../../design/tokens";
import { FirestoreService } from "../../../services/firebase/firestoreService";

const ROUTE_COLORS = [
  palette.primary,
  palette.success,
  palette.secondary,
  palette.warning,
  "#8B5CF6",
];

export default function RoutesIndex() {
  const router = useRouter();
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const data = await FirestoreService.getRoutes();
      setRoutes(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const filtered = routes.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.number?.toLowerCase().includes(search.toLowerCase())
  );

  const renderRoute = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(tabs)/routes/${item.id}`)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.routeBadge, { backgroundColor: ROUTE_COLORS[index % ROUTE_COLORS.length] }]}
      >
        <Text style={styles.routeBadgeText}>{item.number || "—"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.routeName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color={colors.gray400} />
          <Text style={styles.meta}>{item.stops?.length || 0} stops</Text>
          <View style={styles.metaDot} />
          <Text style={styles.meta}>{item.distance || "—"} km</Text>
        </View>
      </View>
      <View style={styles.arrowWrap}>
        <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Routes</Text>
        <Text style={styles.subtitle}>{routes.length} bus routes available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or number..."
            placeholderTextColor={colors.gray400}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={colors.gray300} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRoute}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No routes found" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: palette.card,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.gray900,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.gray900,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  routeBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  routeBadgeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  info: { flex: 1 },
  routeName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.gray500,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gray300,
  },
  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
  },
});
