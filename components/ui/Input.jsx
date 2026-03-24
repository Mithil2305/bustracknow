import { StyleSheet, TextInput, View } from "react-native";
import { palette, radius, spacing } from "../../design/tokens";

export default function Input({ style, ...props }) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={palette.muted || "#94A3B8"}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#D6DFEA",
    backgroundColor: "#FFFFFF",
  },
  input: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text || "#0F172A",
    fontSize: 15,
  },
});
