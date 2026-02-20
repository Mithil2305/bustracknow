import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

/**
 * Circular progress ring for wallet/badge progress indicators.
 * @param {number} progress - Value between 0 and 1
 * @param {number} size - Diameter in pixels
 * @param {string} color - Stroke color
 * @param {number} strokeWidth - Ring thickness
 * @param {React.ReactNode} children - Center content (e.g., text)
 */
export default function ProgressRing({
	progress = 0,
	size = 80,
	color = "#0D9488",
	strokeWidth = 6,
	trackColor = "#E2E8F0",
	children,
}) {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset =
		circumference * (1 - Math.min(Math.max(progress, 0), 1));

	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<Svg width={size} height={size} style={styles.svg}>
				{/* Background track */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={trackColor}
					strokeWidth={strokeWidth}
					fill="none"
				/>
				{/* Progress arc */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={color}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					rotation="-90"
					origin={`${size / 2}, ${size / 2}`}
				/>
			</Svg>
			<View style={styles.center}>{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
	svg: {
		position: "absolute",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
});
