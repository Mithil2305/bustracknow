import { StyleSheet, Text, TextInput, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../app/design/tokens";

export default function Input({
	label,
	placeholder,
	value,
	onChangeText,
	keyboardType,
	secureTextEntry,
	leftIcon,
	rightIcon,
	error,
	multiline = false,
	style,
	inputStyle,
	...rest
}) {
	return (
		<View style={[styles.wrap, style]}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<View
				style={[
					styles.field,
					error && { borderColor: "#EF4444" },
					multiline && { minHeight: 110, alignItems: "flex-start" },
				]}
			>
				{leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
				<TextInput
					style={[
						styles.input,
						multiline && { textAlignVertical: "top" },
						inputStyle,
					]}
					placeholder={placeholder}
					value={value}
					onChangeText={onChangeText}
					placeholderTextColor={palette.subtext}
					keyboardType={keyboardType}
					secureTextEntry={secureTextEntry}
					multiline={multiline}
					{...rest}
				/>
				{rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
			</View>
			{error ? <Text style={styles.error}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { gap: spacing.xs },
	label: { fontSize: 13, fontWeight: "700", color: palette.subtext },
	field: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: palette.border,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.md,
		backgroundColor: "#F8FAFC",
		...shadow.card,
		minHeight: 52,
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: palette.text,
		paddingVertical: spacing.xs,
	},
	icon: { marginRight: spacing.xs },
	error: { color: "#EF4444", fontSize: 12, fontWeight: "700" },
});
