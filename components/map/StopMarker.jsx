import { StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

export default function StopMarker({
	name = "Stop",
	upcoming = "3 buses",
	active = true,
}) {
	return (
		<View style={[styles.wrap, !active && { opacity: 0.5 }]}>
			<View style={styles.pinHead}>
				<View
					style={[
						styles.pinInner,
						{ backgroundColor: active ? palette.secondary : palette.border },
					]}
				/>
			</View>
			<View style={styles.card}>
				<Text style={styles.title}>{name}</Text>
				<Text style={styles.sub}>{upcoming}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { alignItems: "center", gap: 6 },
	pinHead: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	pinInner: { width: 14, height: 14, borderRadius: 7 },
	card: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		backgroundColor: "#fff",
		borderRadius: radius.md,
		...shadow.card,
		minWidth: 140,
		alignItems: "center",
	},
	title: { fontWeight: "800", color: palette.text },
	sub: { color: palette.subtext, fontSize: 12, marginTop: 2 },
});
