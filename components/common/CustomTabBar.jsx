// app/components/common/CustomTabBar.jsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({ state, descriptors, navigation }) {
	return (
		<View style={styles.container}>
			{state.routes.map((route, index) => {
				const label = descriptors[route.key].options.title || route.name;
				const isFocused = state.index === index;

				return (
					<TouchableOpacity
						key={route.key}
						accessibilityRole="button"
						onPress={() => {
							const event = navigation.emit({
								type: "tabPress",
								target: route.key,
								canPreventDefault: true,
							});

							if (!event.defaultPrevented) {
								navigation.navigate(route.name);
							}
						}}
						style={styles.tab}
					>
						<Text style={[styles.label, isFocused && styles.focused]}>
							{label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		height: 60,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "space-around",
	},
	tab: {
		flex: 1,
		alignItems: "center",
	},
	label: { fontSize: 12, color: "#444" },
	focused: { color: "#111", fontWeight: "700" },
});
