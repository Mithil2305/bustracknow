import { StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";
import Button from "./Button";

export default function EmptyState({
	title = "Nothing here yet",
	description = "Try adjusting your filters or refreshing.",
	ctaLabel,
	onCtaPress,
	icon,
}) {
	return (
		<View style={styles.card}>
			{icon ? <View style={styles.icon}>{icon}</View> : null}
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.desc}>{description}</Text>
			{ctaLabel && onCtaPress ? (
				<Button label={ctaLabel} onPress={onCtaPress} variant="primary" />
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: palette.card,
		padding: spacing.lg,
		borderRadius: radius.xl,
		alignItems: "center",
		gap: spacing.sm,
		...shadow.card,
	},
	icon: { marginBottom: spacing.xs },
	title: { fontSize: 16, fontWeight: "800", color: palette.text },
	desc: { fontSize: 14, color: palette.subtext, textAlign: "center" },
});
