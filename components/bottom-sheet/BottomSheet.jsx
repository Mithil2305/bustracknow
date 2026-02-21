import { StyleSheet, View } from "react-native";
import { colors } from "../../design/tokens";

/**
 * Legacy BottomSheet stub — kept for API compatibility.
 * The actual bottom-sheet UI is now in components/map/NearbyBusesSheet.jsx
 * using plain RN Animated instead of @gorhom/bottom-sheet.
 */
const BottomSheet = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50 || "#F9FAFB",
  },
});

export default BottomSheet;
