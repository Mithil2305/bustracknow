import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../../components/common/EmptyState";
import Loader from "../../../components/common/Loader";
import { requestLocationPermission } from "../../../config/permissions";
import { colors, palette, radius, shadow, spacing } from "../../../design/tokens";
import { FirestoreService } from "../../../services/firebase/firestoreService";

// Conditionally require map to prevent crashes if WebView not available
let LiveMap;
try {
  LiveMap = require("../../../components/map/LiveMap").default;
} catch (_e) {
  LiveMap = null;
}

export default function RouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const locationSubRef = useRef(null);

  // Request location and watch position
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted || cancelled) return;
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled)
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
      } catch (_e) {
        /* silent */
      }
      try {
        locationSubRef.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
          (pos) => {
            if (!cancelled)
              setUserLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              });
          }
        );
      } catch (_e) {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
      locationSubRef.current?.remove();
    };
  }, []);

  // Fetch real route from Firestore
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await FirestoreService.getRouteById(id);
        if (!cancelled) setRoute(data || null);
      } catch (_e) {
        if (!cancelled) setRoute(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Normalise stops: Firestore stores stops as string[] — convert to display objects
  const displayStops = useMemo(() => {
    if (!route) return [];
    const rawStops = route.stops || [];
    return rawStops.map((s, i) => ({
      id: String(i),
      name: typeof s === "string" ? s : s.name || `Stop ${i + 1}`,
      lat: typeof s === "object" ? s.lat : null,
      lng: typeof s === "object" ? s.lng : null,
    }));
  }, [route]);

  // Build map stops — spread along Coimbatore area if no real coords
  const mapStops = useMemo(() => {
    const baseLat = 11.0168;
    const baseLng = 76.9558;
    return displayStops.map((s, i) => ({
      id: s.id,
      name: s.name,
      lat: s.lat || baseLat + (i - displayStops.length / 2) * 0.003,
      lng: s.lng || baseLng + (i - displayStops.length / 2) * 0.002,
      active: true,
    }));
  }, [displayStops]);

  const mapRoute = useMemo(
    () => mapStops.map((s) => ({ latitude: s.lat, longitude: s.lng })),
    [mapStops]
  );

  if (loading) return <Loader />;
  if (!route) return <EmptyState message="Route not found" />;

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
              <Text style={styles.routeName} numberOfLines={2}>
                {route.origin && route.destination
                  ? `${route.origin} → ${route.destination}`
                  : route.name}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={colors.gray500} />
                <Text style={styles.metaText}>{displayStops.length} stops</Text>
                {route.scheduleTimes?.length > 0 && (
                  <>
                    <View style={styles.metaDot} />
                    <Ionicons name="time-outline" size={13} color={colors.gray500} />
                    <Text style={styles.metaText}>{route.scheduleTimes.length} departures</Text>
                  </>
                )}
                {route.source && (
                  <>
                    <View style={styles.metaDot} />
                    <Text style={[styles.metaText, { textTransform: "uppercase" }]}>
                      {route.source}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Live Map Visualizer */}
          <View style={styles.visualizerContainer}>
            <View style={styles.visualizerMap}>
              {LiveMap ? (
                <LiveMap
                  initialRegion={{
                    latitude: mapStops.length > 0 ? mapStops[0].lat : 11.0168,
                    longitude: mapStops.length > 0 ? mapStops[0].lng : 76.9558,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                  }}
                  stops={mapStops}
                  route={mapRoute}
                  userLocation={userLocation}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View style={styles.mapFallback}>
                  <Ionicons name="map-outline" size={32} color={palette.primary} />
                  <Text style={styles.mapFallbackText}>Map loading...</Text>
                </View>
              )}
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
            <Text style={styles.sectionTitle}>Route Stops ({displayStops.length})</Text>

            {displayStops.length === 0 ? (
              <EmptyState message="No stop information available" />
            ) : (
              <View style={styles.timeline}>
                {displayStops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === displayStops.length - 1;

                  return (
                    <View key={stop.id} style={styles.stopNode}>
                      {/* Node and Line */}
                      <View style={styles.timelineVisual}>
                        {!isFirst && (
                          <View
                            style={[
                              styles.timelineLine,
                              styles.lineUpcoming,
                              { top: 0, bottom: "50%" },
                            ]}
                          />
                        )}
                        {!isLast && (
                          <View
                            style={[
                              styles.timelineLine,
                              styles.lineUpcoming,
                              { top: "50%", bottom: 0 },
                            ]}
                          />
                        )}
                        <View
                          style={[
                            styles.nodeCircle,
                            isFirst || isLast ? styles.nodeTerminal : styles.nodeUpcoming,
                          ]}
                        >
                          <View
                            style={[
                              styles.nodeInner,
                              isFirst || isLast
                                ? styles.nodeInnerTerminal
                                : styles.nodeInnerUpcoming,
                            ]}
                          />
                        </View>
                      </View>

                      {/* Content */}
                      <View style={styles.stopContent}>
                        <View style={styles.stopHeaderRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.stopName}>{stop.name}</Text>
                            {(isFirst || isLast) && (
                              <Text style={styles.terminalLabel}>
                                {isFirst ? "Origin" : "Destination"}
                              </Text>
                            )}
                          </View>
                          {(isFirst || isLast) && (
                            <View style={styles.terminalBadge}>
                              <Text style={styles.terminalBadgeText}>
                                {isFirst ? "Start" : "End"}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Schedule Times */}
          {route.scheduleTimes && route.scheduleTimes.length > 0 && (
            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>
                Schedule ({route.scheduleTimes.length} departures)
              </Text>
              <View style={styles.scheduleGrid}>
                {route.scheduleTimes.map((t, i) => (
                  <View key={i} style={styles.scheduleChip}>
                    <Ionicons name="time-outline" size={12} color={palette.primary} />
                    <Text style={styles.scheduleTime}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

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
    borderRadius: radius.full,
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
    fontSize: 18,
    fontWeight: "800",
    color: colors.gray900,
    marginBottom: 4,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.gray500,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gray300,
  },
  visualizerContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    marginBottom: spacing.xl,
  },
  visualizerMap: {
    height: 200,
    backgroundColor: colors.gray100,
    position: "relative",
    overflow: "hidden",
  },
  mapFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F4F8",
  },
  mapFallbackText: {
    fontSize: 13,
    color: palette.subtext,
    marginTop: spacing.xs,
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
    borderRadius: radius.full,
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
    minHeight: 64,
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
  nodeTerminal: {
    backgroundColor: palette.primary,
    borderWidth: 3,
    borderColor: palette.primaryLight,
  },
  nodeInnerTerminal: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  nodeUpcoming: {
    backgroundColor: palette.card,
    borderWidth: 3,
    borderColor: colors.gray200,
  },
  nodeInnerUpcoming: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray400,
  },
  stopContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stopHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stopName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray900,
    marginBottom: 2,
  },
  terminalLabel: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: "600",
  },
  terminalBadge: {
    backgroundColor: palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  terminalBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.primaryDark,
  },
  scheduleSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  scheduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  scheduleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: palette.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.primaryDark,
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
    borderRadius: radius.xl,
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
