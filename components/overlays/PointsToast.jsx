import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { radius, spacing } from "../../design/tokens";

/**
 * "+5 Points" animated toast that appears when user earns points.
 * Auto-dismisses after 2 seconds with fade + slide animation.
 */
export default function PointsToast({
	points = 0,
	visible = false,
	onDismiss,
}) {
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(-20)).current;

	useEffect(() => {
		if (visible && points > 0) {
			// Animate in
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.spring(translateY, {
					toValue: 0,
					useNativeDriver: true,
					bounciness: 8,
				}),
			]).start();

			// Auto dismiss after 2 seconds
			const timeout = setTimeout(() => {
				Animated.parallel([
					Animated.timing(opacity, {
						toValue: 0,
						duration: 300,
						useNativeDriver: true,
					}),
					Animated.timing(translateY, {
						toValue: -20,
						duration: 300,
						useNativeDriver: true,
					}),
				]).start(() => onDismiss?.());
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [visible, points, opacity, translateY, onDismiss]);

	if (!visible || points <= 0) return null;

	return (
		<Animated.View
			style={[styles.container, { opacity, transform: [{ translateY }] }]}
		>
			<Ionicons name="star" size={18} color="#F59E0B" />
			<Text style={styles.text}>+{points} Points</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 100,
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "#1E293B",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: radius.xl,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
		zIndex: 9999,
	},
	text: {
		color: "#F59E0B",
		fontSize: 16,
		fontWeight: "800",
	},
});
