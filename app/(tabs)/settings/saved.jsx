import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EmptyState from "../../../components/common/EmptyState";
import { palette, radius, shadow, spacing } from "../../../design/tokens";
import { useAuthStore } from "../../../store/authStore";

export default function SavedRoutes() {
  const { userProfile } = useAuthStore();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    // Load saved/bookmarked routes from user profile
    if (userProfile?.savedRoutes) {
      setSaved(userProfile.savedRoutes);
    }
  }, [userProfile]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.number || "—"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name || "Unnamed Route"}</Text>
        <Text style={styles.meta}>{item.stops?.length || 0} stops</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.removeBtn}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Routes</Text>
      </View>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id || item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No saved routes yet. Star a route to save it!" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: { padding: spacing.md },
  title: { fontSize: 22, fontWeight: "800", color: palette.text },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.primary + "18",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  badgeText: { fontSize: 13, fontWeight: "700", color: palette.primary },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: palette.text },
  meta: { fontSize: 11, color: palette.muted, marginTop: 2 },
  removeBtn: { fontSize: 18, color: palette.danger, padding: spacing.xs },
});
