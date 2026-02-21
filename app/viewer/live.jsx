import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../design/tokens";

const seedBuses = [
  { id: "b1", route: "Route A", eta: "2m", occupancy: "Low" },
  { id: "b2", route: "Route B", eta: "6m", occupancy: "High" },
  { id: "b3", route: "Airport Express", eta: "12m", occupancy: "Medium" },
];

const OCCUPANCY_COLORS = { Low: palette.success, Medium: "#F59E0B", High: palette.danger };

export default function LiveTrackingScreen() {
  const router = useRouter();
  const [buses, setBuses] = useState(seedBuses);

  const refresh = () => {
    setBuses((prev) =>
      prev.map((b, i) => ({
        ...b,
        eta: `${Math.max(0, parseInt(b.eta) - (i + 1))}m`,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={40} color={palette.primary} />
          <Text style={styles.mapText}>Map preview</Text>
        </View>

        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm }}
          renderItem={({ item }) => (
            <View style={styles.busCard}>
              <View style={styles.busIconWrap}>
                <Ionicons name="bus" size={20} color={palette.primary} />
              </View>
              <View style={styles.busInfo}>
                <Text style={styles.busRoute}>{item.route}</Text>
                <View style={styles.occRow}>
                  <View
                    style={[
                      styles.occDot,
                      { backgroundColor: OCCUPANCY_COLORS[item.occupancy] || colors.gray400 },
                    ]}
                  />
                  <Text style={styles.busMeta}>{item.occupancy}</Text>
                </View>
              </View>
              <View style={styles.busEta}>
                <Text style={styles.etaText}>{item.eta}</Text>
                <Text style={styles.etaLabel}>ETA</Text>
              </View>
            </View>
          )}
        />

        <TouchableOpacity style={styles.refreshBtn} onPress={refresh} activeOpacity={0.85}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.gray900 },
  container: { flex: 1, padding: spacing.lg, gap: spacing.md },
  mapPlaceholder: {
    height: 160,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapText: { color: palette.primaryDark, fontWeight: "600", fontSize: 14 },
  busCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  busIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  busInfo: { flex: 1 },
  busRoute: { fontSize: 15, fontWeight: "700", color: colors.gray900 },
  occRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  occDot: { width: 8, height: 8, borderRadius: 4 },
  busMeta: { fontSize: 12, color: colors.gray500 },
  busEta: { alignItems: "flex-end" },
  etaText: { fontSize: 20, fontWeight: "800", color: palette.primaryDark },
  etaLabel: { fontSize: 11, color: colors.gray500, marginTop: 2 },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    backgroundColor: palette.primary,
    gap: 10,
  },
  refreshText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
