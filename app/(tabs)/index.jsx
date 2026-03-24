import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { NearbyBusesSheet } from "../../components/map";
import { Sidebar } from "../../components/overlays";
import { requestLocationPermission } from "../../config/permissions";
import { colors, palette, shadow, spacing } from "../../design/tokens";
import { usePoints } from "../../hooks/usePoints";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Conditionally require map to prevent Expo Go / Web crashes
let LiveMap;
try {
  LiveMap = require("../../components/map/LiveMap").default;
} catch (_e) {
  LiveMap = null;
}

function MapPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <View style={styles.placeholderIcon}>
        <Ionicons name="map-outline" size={48} color={palette.primary} />
      </View>
      <Text style={styles.placeholderTitle}>Map View</Text>
      <Text style={styles.placeholderBody}>
        {"OpenStreetMap is loading.\nEnsure you have an internet connection."}
      </Text>
    </View>
  );
}

export default function TabsHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { points } = usePoints();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const locationSubRef = useRef(null);

  // Request location permission on mount and start watching position
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await requestLocationPermission();
      if (!granted || cancelled) return;

      // Get initial position quickly
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        }
      } catch (_e) {
        // silent – will retry via watcher
      }

      // Watch for continuous updates
      try {
        locationSubRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (pos) => {
            if (!cancelled) {
              setUserLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              });
            }
          }
        );
      } catch (_e) {
        // silent – watcher failed
      }
    })();

    return () => {
      cancelled = true;
      locationSubRef.current?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* The Map takes the entire background */}
      <View style={styles.mapWrap}>
        {LiveMap ? (
          <LiveMap style={StyleSheet.absoluteFill} userLocation={userLocation} />
        ) : (
          <MapPlaceholder />
        )}
      </View>

      {/* Top Bar Overlays */}
      <SafeAreaView
        style={[styles.overlaySafeArea, { paddingTop: insets.top + 8 }]}
        pointerEvents="box-none"
      >
        <View style={styles.topBar} pointerEvents="box-none">
          {/* Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setSidebarVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={22} color={colors.gray800} />
          </TouchableOpacity>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchContainer}
            activeOpacity={0.8}
            onPress={() => router.push("/viewer/search")}
          >
            <Ionicons name="search" size={18} color={colors.gray400} />
            <Text style={styles.searchPlaceholder}>Search stops, routes...</Text>
          </TouchableOpacity>

          {/* Points Pill */}
          <View style={styles.pointsPill}>
            <View style={styles.pointsCoin}>
              <Text style={styles.pointsCoinText}>🪙</Text>
            </View>
            <View>
              <Text style={styles.pointsValue}>{points}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          </View>
        </View>

        {/* My Location FAB + I'm on a bus row */}
        <View style={styles.secondRow} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.imOnABusButton}
            activeOpacity={0.85}
            onPress={() => router.push("/modals/im-on-bus")}
          >
            <View style={styles.busBtnIcon}>
              <Ionicons name="bus" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.imOnABusText}>{"I'm on a bus"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.locationFab} activeOpacity={0.8}>
            <Ionicons name="locate" size={22} color={palette.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Refresh Button – just above the sheet, right-aligned */}
      <View
        style={[styles.refreshRow, { bottom: SCREEN_HEIGHT * 0.3 + 12 + insets.bottom }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity style={styles.refreshFab} activeOpacity={0.8}>
          <Ionicons name="refresh" size={20} color={palette.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <NearbyBusesSheet />

      {/* Sidebar Component */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onLogout={() => {
          /* handle logout */
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.surface },
  mapWrap: { ...StyleSheet.absoluteFillObject },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F4F8",
    padding: spacing.xl,
  },
  placeholderIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 6,
  },
  placeholderBody: {
    fontSize: 13,
    color: palette.subtext,
    textAlign: "center",
    lineHeight: 19,
  },
  overlaySafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,
  },
  searchContainer: {
    flex: 1,
    height: 46,
    backgroundColor: palette.card,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    ...shadow.card,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.gray400,
  },
  pointsPill: {
    height: 46,
    backgroundColor: palette.card,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    paddingRight: 14,
    ...shadow.card,
  },
  pointsCoin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.warningLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  pointsCoinText: {
    fontSize: 14,
  },
  pointsValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.gray900,
    lineHeight: 16,
  },
  pointsLabel: {
    fontSize: 9,
    color: colors.gray500,
    fontWeight: "500",
  },
  secondRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  locationFab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.elevated,
  },
  imOnABusButton: {
    backgroundColor: palette.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 23,
    shadowColor: palette.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  busBtnIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  imOnABusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  refreshRow: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 9,
  },
  refreshFab: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,
  },
});
