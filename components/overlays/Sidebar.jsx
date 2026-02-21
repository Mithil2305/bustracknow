import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, palette, shadow, spacing } from "../../design/tokens";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.78;

export default function Sidebar({ visible, onClose, onLogout }) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible && slideAnim._value === -SIDEBAR_WIDTH) return null;

  const navigateTo = (route) => {
    onClose();
    setTimeout(() => router.push(route), 300);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header: Profile */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.gray500} />
              </TouchableOpacity>

              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={28} color={palette.primary} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>Rajesh Kumar</Text>
                  <Text style={styles.phone}>+91 98765 43210</Text>
                </View>
              </View>

              <View style={styles.badgesRow}>
                <View style={styles.levelBadge}>
                  <Ionicons name="star" size={12} color={palette.warningDark} />
                  <Text style={styles.levelText}>Level 2</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={palette.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Menu Items */}
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo("/(tabs)/settings/saved")}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: "#FEF3C7" }]}>
                  <Ionicons name="bookmark" size={18} color={palette.warningDark} />
                </View>
                <Text style={styles.menuText}>Saved Routes</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo("/(tabs)/wallet")}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="time" size={18} color={palette.secondary} />
                </View>
                <Text style={styles.menuText}>Ride History</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo("/(tabs)/alerts")}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: "#CCFBF1" }]}>
                  <Ionicons name="notifications" size={18} color={palette.primary} />
                </View>
                <Text style={styles.menuText}>Notifications</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>2</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dividerSmall} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateTo("/(tabs)/settings")}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: palette.surface }]}>
                  <Ionicons name="settings" size={18} color={colors.gray600} />
                </View>
                <Text style={styles.menuText}>Settings</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { marginTop: spacing.md }]}
                onPress={onLogout}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: palette.dangerLight }]}>
                  <Ionicons name="log-out" size={18} color={palette.danger} />
                </View>
                <Text style={[styles.menuText, { color: palette.danger }]}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>BusTrackNow v1.2.0</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: palette.card,
    height: "100%",
    ...shadow.elevated,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  closeButton: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: colors.gray500,
    fontWeight: "500",
  },
  badgesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.warningBorder,
    gap: 4,
  },
  levelText: {
    color: palette.warningDark,
    fontWeight: "700",
    fontSize: 11,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    gap: 4,
  },
  verifiedText: {
    color: palette.success,
    fontWeight: "700",
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginHorizontal: spacing.xl,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: palette.borderLight,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
  },
  menu: {
    flex: 1,
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray800,
    flex: 1,
  },
  notificationBadge: {
    backgroundColor: palette.danger,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  notificationText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.gray400,
    fontWeight: "500",
  },
});
