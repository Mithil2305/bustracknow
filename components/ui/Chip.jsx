import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { palette, radius, spacing } from "../../design/tokens";

/**
 * Chip — small pill for tags, filters, categories.
 * @param {object} props
 * @param {string} props.label
 * @param {boolean} [props.selected]
 * @param {function} [props.onPress]
 * @param {string} [props.color] - override tint color
 */
export default function Chip({ label, selected = false, onPress, color }) {
  const tint = color || palette.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.chip, { borderColor: tint }, selected && { backgroundColor: tint }]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  label: { fontSize: 13, fontWeight: "600", color: palette.text },
  labelSelected: { color: "#fff" },
});
