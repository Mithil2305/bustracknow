import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { FirestoreService } from "../../../services/firebase/firestoreService";

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

  const renderRoute = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/(tabs)/routes/${item.id}`)}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.number || "—"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.stops?.length || 0} stops · {item.distance || "—"} km
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Routes</Text>
        <TextInput
          style={styles.search}
          placeholder="Search routes..."
          placeholderTextColor={palette.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderRoute}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No routes found" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: { padding: spacing.md },
  title: { fontSize: 22, fontWeight: "800", color: palette.text, marginBottom: spacing.sm },
  search: {
    backgroundColor: palette.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    fontSize: 15,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
  },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primary + "18",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  badgeText: { fontSize: 14, fontWeight: "700", color: palette.primary },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: palette.text },
  meta: { fontSize: 12, color: palette.muted, marginTop: 2 },
  arrow: { fontSize: 24, color: palette.muted },
});
