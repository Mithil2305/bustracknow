import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../../design/tokens";

const filters = [
  { id: "all", label: "All" },
  { id: "full", label: "Full" },
  { id: "late", label: "Late" },
  { id: "not-running", label: "Not Running" },
];

const alerts = [
  {
    id: "1",
    type: "full",
    routeNumber: "45",
    routeName: "Gandhi Chowk → Railway Station",
    location: "Near College Road",
    upvotes: 12,
    time: "15 mins ago",
    contributor: "Rahul K.",
  },
  {
    id: "2",
    type: "late",
    routeNumber: "12",
    routeName: "Bus Stand → Airport",
    location: "City Center",
    upvotes: 8,
    time: "30 mins ago",
    contributor: "Priya M.",
  },
  {
    id: "3",
    type: "not-running",
    routeNumber: "28",
    routeName: "University → Downtown",
    location: "Main Junction",
    upvotes: 25,
    time: "1 hour ago",
    contributor: "Amit S.",
  },
];

const getTypeConfig = (type) => {
  switch (type) {
    case "full":
      return {
        icon: "people",
        color: palette.warning,
        label: "Bus Full",
        bg: palette.warningLight,
      };
    case "late":
      return {
        icon: "time",
        color: palette.danger,
        label: "Running Late",
        bg: palette.dangerLight,
      };
    case "not-running":
      return {
        icon: "bus-outline",
        color: colors.gray500,
        label: "Not Running",
        bg: palette.surface,
      };
    default:
      return { icon: "alert-circle", color: colors.gray500, label: "Alert", bg: palette.surface };
  }
};

export default function AlertsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAlerts =
    activeFilter === "all" ? alerts : alerts.filter((a) => a.type === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Community Alerts</Text>
          <Text style={styles.headerSubtitle}>{alerts.length} active alerts nearby</Text>
        </View>
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => router.push("/(tabs)/alerts/report")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.reportBtnText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Alerts List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {filteredAlerts.map((alert) => {
          const config = getTypeConfig(alert.type);
          return (
            <TouchableOpacity key={alert.id} style={styles.alertCard} activeOpacity={0.7}>
              {/* Left accent */}
              <View style={[styles.alertAccent, { backgroundColor: config.color }]} />

              <View style={styles.alertBody}>
                <View style={styles.alertTop}>
                  <View style={[styles.typeIconWrap, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={20} color={config.color} />
                  </View>

                  <View style={styles.alertInfo}>
                    <Text style={styles.alertRoute}>Route {alert.routeNumber}</Text>
                    <Text style={styles.alertRouteName}>{alert.routeName}</Text>
                  </View>

                  <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                    <Text style={[styles.typeBadgeText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={colors.gray400} />
                  <Text style={styles.locationText}>{alert.location}</Text>
                </View>

                {/* Footer */}
                <View style={styles.alertFooter}>
                  <View style={styles.contributorRow}>
                    <View style={styles.contributorAvatar}>
                      <Text style={styles.contributorInitial}>{alert.contributor.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.contributorName}>{alert.contributor}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.upvoteBtn}>
                    <Ionicons name="thumbs-up-outline" size={14} color={palette.primary} />
                    <Text style={styles.upvoteText}>{alert.upvotes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-outline" size={40} color={colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>No Alerts Found</Text>
            <Text style={styles.emptyDesc}>No alerts match this filter right now.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.gray900,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  reportBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  filtersContainer: {
    backgroundColor: palette.card,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderLight,
  },
  filtersList: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: "#CCFBF1",
    borderColor: palette.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray600,
  },
  filterTextActive: {
    color: palette.primary,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  alertCard: {
    flexDirection: "row",
    backgroundColor: palette.card,
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadow.card,
  },
  alertAccent: {
    width: 4,
  },
  alertBody: {
    flex: 1,
    padding: spacing.lg,
  },
  alertTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  typeIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  alertInfo: {
    flex: 1,
  },
  alertRoute: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
  },
  alertRouteName: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.gray500,
  },
  alertFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.borderLight,
  },
  contributorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contributorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  contributorInitial: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.gray600,
  },
  contributorName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray700,
  },
  alertTime: {
    fontSize: 11,
    color: colors.gray400,
    marginTop: 1,
  },
  upvoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  upvoteText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.gray700,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray700,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: "center",
  },
});
