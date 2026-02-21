import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../design/tokens";

const seedResults = [
  { id: "r1", from: "Gandhipuram", to: "Airport", eta: "5m" },
  { id: "r2", from: "Railway Station", to: "Town Hall", eta: "8m" },
  { id: "r3", from: "Peelamedu", to: "Central", eta: "14m" },
];

export default function RouteSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = seedResults.filter((r) =>
    `${r.from} ${r.to}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Routes</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color={palette.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by stop or destination"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={colors.gray400}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <View style={styles.cardIconWrap}>
                <Ionicons name="navigate-outline" size={18} color={palette.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.routeLine}>
                  {item.from} → {item.to}
                </Text>
                <Text style={styles.meta}>Next bus in {item.eta}</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Ionicons name="chevron-forward" size={16} color={colors.gray400} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={48} color={colors.gray300} />
              <Text style={styles.emptyText}>No routes found</Text>
            </View>
          }
        />
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.card,
    height: 52,
    gap: spacing.sm,
    ...shadow.soft,
  },
  searchInput: { flex: 1, color: colors.gray900, fontSize: 15 },
  card: {
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.borderLight,
    ...shadow.soft,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  cardInfo: { flex: 1 },
  routeLine: { fontSize: 15, fontWeight: "700", color: colors.gray900 },
  meta: { fontSize: 12, color: colors.gray500, marginTop: 3 },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.gray400 },
});
