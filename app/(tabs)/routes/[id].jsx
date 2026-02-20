import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { FirestoreService } from "../../../services/firebase/firestoreService";

export default function RouteDetail() {
  const { id } = useLocalSearchParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRoute = useCallback(async () => {
    try {
      const data = await FirestoreService.getRouteById(id);
      setRoute(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRoute();
  }, [loadRoute]);

  if (loading) return <Loader />;
  if (!route) return <EmptyState message="Route not found" />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.number}>{route.number || "—"}</Text>
          <Text style={styles.name}>{route.name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{route.stops?.length || 0}</Text>
              <Text style={styles.statLabel}>Stops</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{route.distance || "—"}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{route.activeBuses || 0}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Stops</Text>
        {route.stops?.map((stop, i) => (
          <View key={stop.id || i} style={styles.stopRow}>
            <View style={styles.stopDot} />
            <Text style={styles.stopName}>{stop.name}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { padding: spacing.md },
  headerCard: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    ...shadow,
  },
  number: { fontSize: 28, fontWeight: "800", color: palette.primary },
  name: { fontSize: 16, color: palette.text, fontWeight: "600", marginTop: spacing.xs },
  statsRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.xl },
  stat: { alignItems: "center" },
  statVal: { fontSize: 20, fontWeight: "700", color: palette.text },
  statLabel: { fontSize: 11, color: palette.muted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: palette.text, marginBottom: spacing.sm },
  stopRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.xs },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.primary,
    marginRight: spacing.sm,
  },
  stopName: { fontSize: 14, color: palette.text },
});
