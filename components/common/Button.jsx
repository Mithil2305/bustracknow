import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function Button({
  title,
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  size = "large",
}) {
  const text = label || title;
  const isGhost = variant === "ghost";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const bg =
    isGhost || isOutline ? "transparent" : isSecondary ? palette.primaryLight : palette.primary;
  const color =
    isGhost || isOutline ? palette.primary : isSecondary ? palette.primaryDark : "#FFFFFF";
  const borderColor = isOutline ? palette.border : "transparent";
  const height = size === "small" ? 40 : size === "medium" ? 46 : 52;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { backgroundColor: bg, borderColor, height },
        !isGhost && shadow.card,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        {loading ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <Text style={[styles.label, { color }, textStyle]}>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
  },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  icon: { justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },
});
