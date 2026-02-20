import { StyleSheet, View } from "react-native";
import { palette, spacing } from "../../design/tokens";

/**
 * Divider — horizontal line separator.
 * @param {object} [props]
 * @param {object} [props.style]
 */
export default function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
    marginVertical: spacing.sm,
  },
});
