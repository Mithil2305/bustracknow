import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function ConfirmRideModal({ bus, onCancel, onConfirm }) {
  if (!bus) return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={s.overlay}>
        <View style={s.card}>
          {/* Close */}
          <TouchableOpacity style={s.closeBtn} onPress={onCancel}>
            <Ionicons name="close" size={22} color={palette.muted} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={s.title}>Confirm Your Ride</Text>

          {/* Route Card */}
          <View style={s.routeCard}>
            <Text style={s.routeLabel}>You are on</Text>
            <Text style={s.routeNumber}>{bus.route}</Text>
            <Text style={s.routeName}>
              {bus.origin} - {bus.destination}
            </Text>
          </View>

          {/* GPS Notice */}
          <View style={s.gpsNotice}>
            <Ionicons name="information-circle-outline" size={20} color="#D97706" />
            <Text style={s.gpsText}>
              Please ensure your GPS is on. You&apos;ll earn points for every minute you share.
            </Text>
          </View>

          {/* Buttons */}
          <View style={s.buttons}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={s.confirmText}>Yes, I&apos;m here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.elevated,
  },
  closeBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  routeCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  routeLabel: {
    fontSize: 14,
    color: palette.muted,
    marginBottom: spacing.xs,
  },
  routeNumber: {
    fontSize: 36,
    fontWeight: "900",
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.text,
  },
  gpsNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF7ED",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: spacing.sm,
  },
  gpsText: {
    flex: 1,
    fontSize: 13,
    color: "#D97706",
    lineHeight: 19,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: palette.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.card,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.text,
  },
  confirmBtn: {
    flex: 1.3,
    height: 50,
    borderRadius: radius.full,
    backgroundColor: palette.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
