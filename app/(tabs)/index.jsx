import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NearbyBusesSheet } from "../../components/map";
import { Sidebar } from "../../components/overlays";
import { colors, palette, shadow, spacing } from "../../design/tokens";

// Conditionally require map to prevent Expo Go / Web crashes
let LiveMap;
try {
  LiveMap = require("../../components/map/LiveMap").default;
} catch (e) {
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
        react-native-maps requires a native dev client.{"\n"}
        Run "npx expo run:android" or "npx expo run:ios".
      </Text>
    </View>
  );
}

export default function TabsHome() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* The Map takes the entire background */}
      <View style={styles.mapWrap}>
        {LiveMap ? <LiveMap style={StyleSheet.absoluteFill} /> : <MapPlaceholder />}
      </View>

      {/* Top Bar Overlays */}
      <SafeAreaView style={styles.overlaySafeArea} pointerEvents="box-none">
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
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={colors.gray400} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stops, routes..."
              placeholderTextColor={colors.gray400}
              editable={false}
            />
          </View>

          {/* Points Pill */}
          <View style={styles.pointsPill}>
            <View style={styles.pointsCoin}>
              <Text style={styles.pointsCoinText}>🪙</Text>
            </View>
            <View>
              <Text style={styles.pointsValue}>320</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          </View>
        </View>

        {/* My Location FAB */}
        <View style={styles.fabContainer} pointerEvents="box-none">
          <TouchableOpacity style={styles.locationFab} activeOpacity={0.8}>
            <Ionicons name="locate" size={22} color={palette.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <NearbyBusesSheet />

      {/* Floating "I'm on a bus" Button */}
      <View style={styles.floatingActionContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.imOnABusButton} activeOpacity={0.85}>
          <View style={styles.busBtnIcon}>
            <Ionicons name="bus" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.imOnABusText}>I'm on a bus</Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
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
  fabContainer: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  locationFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.card,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.elevated,
  },
  floatingActionContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  imOnABusButton: {
    backgroundColor: palette.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingLeft: 6,
    paddingRight: 20,
    borderRadius: 28,
    shadowColor: palette.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  busBtnIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imOnABusText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 4,
  },
});
