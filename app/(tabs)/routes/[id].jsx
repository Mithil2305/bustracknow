import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { colors, palette, shadow, spacing } from "../../../design/tokens";
import { FirestoreService } from "../../../services/firebase/firestoreService";

export default function RouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock extended data since firestore may only have basic stops
  const mockExtendedStops = useMemo(
    () => [
      { id: "1", name: "City Center", time: "10:15 AM", status: "departed" },
      { id: "2", name: "Main Road Junction", time: "10:22 AM", status: "departed" },
      {
        id: "3",
        name: "College Road",
        time: "10:38 AM",
        status: "upcoming",
        eta: "12 min",
        canConfirm: true,
      },
      {
        id: "4",
        name: "Railway Station",
        time: "10:44 AM",
        status: "upcoming",
        eta: "18 min",
        canConfirm: true,
      },
    ],
    []
  );

  const loadRoute = useCallback(async () => {
    try {
      const data = await FirestoreService.getRouteById(id);
      setRoute(data);
    } catch {
      // silent
    } finally {
      // Create mock data even if failed for UI demonstration purposes
      if (!route) {
        setRoute({
          id: id || "12B",
          number: "12B",
          name: "City Center - Railway Station",
          stops: mockExtendedStops,
        });
      }
      setLoading(false);
    }
  }, [id, route, mockExtendedStops]);

  useEffect(() => {
    loadRoute();
  }, [loadRoute]);

  if (loading) return <Loader />;
  if (!route) return <EmptyState message="Route not found" />;

  const displayStops =
    route.stops && route.stops.length > 0 && route.stops[0].time ? route.stops : mockExtendedStops;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="star-outline" size={24} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Block */}
          <View style={styles.headerBlock}>
            <View style={styles.routeBadge}>
              <Text style={styles.routeBadgeText}>{route.number}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.routeName}>{route.name}</Text>
              <View style={styles.statusRow}>
                <View style={styles.onTimePill}>
                  <Text style={styles.onTimeText}>On Time</Text>
                </View>
                <View style={styles.crowdIndicator}>
                  <Ionicons name="people-outline" size={14} color="#64748B" />
                  <Text style={styles.crowdText}>Moderate crowd</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Live Tracking Visualizer */}
          <View style={styles.visualizerContainer}>
            <View style={styles.visualizerMap}>
              {/* Dotted background pattern simulation */}
              <View style={styles.dottedBg} />

              {/* Arc simulation */}
              <View style={styles.arcContainer}>
                <View style={styles.arcLine} />
              </View>

              {/* Bus Icon */}
              <View style={styles.visualizerBus}>
                <Ionicons name="bus" size={24} color="#10B981" />
              </View>

              {/* View Map Button */}
              <TouchableOpacity style={styles.viewMapButton}>
                <Ionicons
                  name="navigate-outline"
                  size={16}
                  color="#0F172A"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.viewMapText}>View Map</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.visualizerStatus}>
              <View style={styles.liveStatusLeft}>
                <View style={styles.liveIconBg}>
                  <Ionicons name="radio-outline" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.liveStatusTitle}>Live tracking active</Text>
                  <Text style={styles.liveStatusTime}>Updated just now by 3 passengers</Text>
                </View>
              </View>
              <View style={styles.onlinePill}>
                <Ionicons
                  name="people-outline"
                  size={12}
                  color="#2563EB"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.onlineText}>12 Online</Text>
              </View>
            </View>
          </View>

          {/* Route Stops Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>Route Stops</Text>

            <View style={styles.timeline}>
              {displayStops.map((stop, index) => {
                const isFirst = index === 0;
                const isLast = index === displayStops.length - 1;
                const isDeparted = stop.status === "departed";

                return (
                  <View key={stop.id} style={styles.stopNode}>
                    {/* Node and Line */}
                    <View style={styles.timelineVisual}>
                      {!isFirst && (
                        <View
                          style={[
                            styles.timelineLine,
                            isDeparted ? styles.lineDeparted : styles.lineUpcoming,
                            { top: 0, bottom: "50%" },
                          ]}
                        />
                      )}
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            isDeparted ? styles.lineDeparted : styles.lineUpcoming,
                            { top: "50%", bottom: 0 },
                          ]}
                        />
                      )}

                      <View
                        style={[
                          styles.nodeCircle,
                          isDeparted ? styles.nodeDeparted : styles.nodeUpcoming,
                        ]}
                      >
                        <View
                          style={[
                            styles.nodeInner,
                            isDeparted ? styles.nodeInnerDeparted : styles.nodeInnerUpcoming,
                          ]}
                        />
                      </View>
                    </View>

                    {/* Content */}
                    <View style={styles.stopContent}>
                      <View style={styles.stopHeaderRow}>
                        <View>
                          <Text style={[styles.stopName, isDeparted && styles.textDeparted]}>
                            {stop.name}
                          </Text>
                          <View style={styles.timeRow}>
                            <Ionicons name="time-outline" size={14} color="#94A3B8" />
                            <Text style={styles.stopTime}>{stop.time}</Text>
                          </View>
                        </View>

                        {isDeparted ? (
                          <Text style={styles.departedText}>Departed</Text>
                        ) : (
                          <Text style={styles.etaText}>{stop.eta}</Text>
                        )}
                      </View>

                      {stop.canConfirm && (
                        <TouchableOpacity style={styles.confirmButton}>
                          <Ionicons name="checkmark-circle-outline" size={14} color="#D97706" />
                          <Text style={styles.confirmText}>Confirm Stop</Text>
                          <View style={styles.pointsBadge}>
                            <Text style={styles.pointsBadgeText}>+2</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Report an Issue */}
          <View style={styles.reportSection}>
            <View style={styles.reportHeader}>
              <Ionicons name="alert-circle-outline" size={20} color="#64748B" />
              <Text style={styles.reportTitle}>Report an Issue</Text>
            </View>

            <View style={styles.reportButtonsRow}>
              <TouchableOpacity style={styles.reportButton}>
                <View style={styles.reportIconRow}>
                  <Ionicons name="people-outline" size={18} color="#EF4444" />
                  <Text style={styles.reportBtnTitle}>Full Bus</Text>
                </View>
                <Text style={styles.reportBtnPts}>+2 pts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reportButton}>
                <View style={styles.reportIconRow}>
                  <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
                  <Text style={styles.reportBtnTitle}>Not Running</Text>
                </View>
                <Text style={styles.reportBtnPts}>+5 pts</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerAction} activeOpacity={0.9}>
            <Ionicons name="bus" size={20} color="#FFFFFF" />
            <Text style={styles.footerActionText}>{"I'm on this bus"}</Text>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeText}>Earn Pts</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.card,
  },
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: 100, // accommodate footer
  },
  headerBlock: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  routeBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  routeBadgeText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  routeName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.gray900,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  onTimePill: {
    backgroundColor: palette.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  onTimeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  crowdIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  crowdText: {
    fontSize: 13,
    color: colors.gray500,
  },
  visualizerContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    marginBottom: spacing.xl,
  },
  visualizerMap: {
    height: 140,
    backgroundColor: colors.gray100,
    position: "relative",
    overflow: "hidden",
  },
  dottedBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    backgroundColor: colors.gray50,
  },
  arcContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  arcLine: {
    width: "120%",
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: palette.primary,
    borderStyle: "dashed",
    position: "absolute",
    top: 60,
  },
  visualizerBus: {
    position: "absolute",
    top: 50,
    left: "50%",
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: palette.success,
    ...shadow.elevated,
  },
  viewMapButton: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...shadow.card,
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray900,
  },
  visualizerStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: palette.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  liveStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  liveIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  liveStatusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.primaryDark,
  },
  liveStatusTime: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  onlineText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.secondary,
  },
  timelineSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.gray900,
    marginBottom: spacing.lg,
  },
  timeline: {
    paddingLeft: spacing.xs,
  },
  stopNode: {
    flexDirection: "row",
    minHeight: 80,
  },
  timelineVisual: {
    width: 30,
    alignItems: "center",
    marginRight: spacing.md,
  },
  timelineLine: {
    position: "absolute",
    width: 2,
    left: "50%",
    marginLeft: -1,
  },
  lineDeparted: {
    backgroundColor: colors.gray200,
  },
  lineUpcoming: {
    backgroundColor: colors.gray200,
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
    zIndex: 2,
  },
  nodeDeparted: {
    backgroundColor: colors.gray100,
    borderWidth: 3,
    borderColor: colors.gray50,
  },
  nodeInnerDeparted: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray400,
  },
  nodeUpcoming: {
    backgroundColor: palette.card,
    borderWidth: 3,
    borderColor: colors.gray100,
  },
  nodeInnerUpcoming: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray500,
  },
  stopContent: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  stopHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stopName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 4,
  },
  textDeparted: {
    color: colors.gray900,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stopTime: {
    fontSize: 13,
    color: colors.gray500,
  },
  departedText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray400,
  },
  etaText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.gray900,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: spacing.md,
  },
  confirmText: {
    color: "#D97706",
    fontWeight: "600",
    fontSize: 13,
    marginHorizontal: 6,
  },
  pointsBadge: {
    backgroundColor: "#FDE68A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pointsBadgeText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "800",
  },
  reportSection: {
    padding: spacing.xl,
    backgroundColor: colors.gray50,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.md,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
  },
  reportButtonsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  reportButton: {
    flex: 1,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: "flex-start",
    ...shadow.card,
  },
  reportIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.sm,
  },
  reportBtnTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.gray900,
  },
  reportBtnPts: {
    fontSize: 12,
    color: colors.gray400,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.primary,
  },
  footerAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  footerActionText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  footerBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
