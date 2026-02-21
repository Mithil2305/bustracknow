import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import { colors, palette, shadow, spacing } from "../../../design/tokens";
import { useAuthStore } from "../../../store/authStore";

export default function SavedRoutes() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    if (userProfile?.savedRoutes) {
      setSaved(userProfile.savedRoutes);
    }
  }, [userProfile]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.routeBadge}>
        <Ionicons name="bus" size={18} color={palette.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name || "Unnamed Route"}
        </Text>
        <Text style={styles.meta}>{item.stops?.length || 0} stops</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn}>
        <Ionicons name="bookmark" size={20} color={palette.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Routes</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id || item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState message="No saved routes yet. Tap the bookmark icon on any route to save it!" />
        }
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray800,
    marginBottom: 3,
  },
  meta: {
    fontSize: 12,
    color: colors.gray500,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
  },
});
