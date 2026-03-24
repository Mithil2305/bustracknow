import { ActivityIndicator, StyleSheet, View } from "react-native";
import { palette, spacing } from "../../design/tokens";

export default function Loader({ size = "small", color, style }) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color || palette.primary || "#2563EB"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
