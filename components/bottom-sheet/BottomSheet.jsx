import { useCallback, useMemo, useRef } from "react";
import {
	Animated,
	Dimensions,
	PanResponder,
	StyleSheet,
	View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 180;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.7;

/**
 * Reanimated-style bottom sheet with collapsed/expanded states.
 * Uses PanResponder for gesture handling without extra native deps.
 */
export default function BottomSheet({ children, collapsed = true, onToggle }) {
	const translateY = useRef(
		new Animated.Value(collapsed ? 0 : -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT)),
	).current;
	const lastGestureDy = useRef(0);
	const isExpanded = useRef(!collapsed);

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: (_, gestureState) =>
					Math.abs(gestureState.dy) > 10,
				onPanResponderGrant: () => {
					translateY.extractOffset();
				},
				onPanResponderMove: (_, gestureState) => {
					// Only allow vertical dragging within bounds
					const newVal = Math.max(
						-(EXPANDED_HEIGHT - COLLAPSED_HEIGHT),
						Math.min(0, gestureState.dy),
					);
					translateY.setValue(newVal);
					lastGestureDy.current = gestureState.dy;
				},
				onPanResponderRelease: () => {
					translateY.flattenOffset();
					// Snap to expanded or collapsed based on drag direction
					const shouldExpand = lastGestureDy.current < -50;
					const shouldCollapse = lastGestureDy.current > 50;

					if (shouldExpand && !isExpanded.current) {
						isExpanded.current = true;
						Animated.spring(translateY, {
							toValue: -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT),
							useNativeDriver: true,
							bounciness: 4,
						}).start();
						onToggle?.(true);
					} else if (shouldCollapse && isExpanded.current) {
						isExpanded.current = false;
						Animated.spring(translateY, {
							toValue: 0,
							useNativeDriver: true,
							bounciness: 4,
						}).start();
						onToggle?.(false);
					} else {
						// Snap back to current state
						Animated.spring(translateY, {
							toValue: isExpanded.current
								? -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT)
								: 0,
							useNativeDriver: true,
							bounciness: 4,
						}).start();
					}
				},
			}),
		[translateY, onToggle],
	);

	const toggle = useCallback(() => {
		const toExpanded = !isExpanded.current;
		isExpanded.current = toExpanded;
		Animated.spring(translateY, {
			toValue: toExpanded ? -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT) : 0,
			useNativeDriver: true,
			bounciness: 4,
		}).start();
		onToggle?.(toExpanded);
	}, [translateY, onToggle]);

	return (
		<Animated.View
			style={[styles.container, { transform: [{ translateY }] }]}
			{...panResponder.panHandlers}
		>
			<View style={styles.handleWrap} onTouchEnd={toggle}>
				<View style={styles.handle} />
			</View>
			<View style={styles.content}>{children}</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: EXPANDED_HEIGHT,
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	handleWrap: {
		alignItems: "center",
		paddingVertical: 10,
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#D1D5DB",
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
	},
});
