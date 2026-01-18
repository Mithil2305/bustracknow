import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import env from "../../config/env";
import { radius, shadow, spacing } from "../../design/tokens";
import BusMarker from "./BusMarker";
import RoutePolyline from "./RoutePolyline";
import StopMarker from "./StopMarker";

export default function LiveMap({
	initialRegion = {
		latitude: 37.7749,
		longitude: -122.4194,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,
	},
	buses = [],
	stops = [],
	route = [],
	onBusPress,
	onStopPress,
	style,
	children,
}) {
	const provider =
		Platform.OS === "android" || Platform.OS === "ios"
			? PROVIDER_GOOGLE
			: undefined;

	return (
		<View style={[styles.card, style]}>
			<MapView
				provider={provider}
				googleMapsApiKey={env.GOOGLE_MAPS_API_KEY || undefined}
				style={StyleSheet.absoluteFill}
				initialRegion={initialRegion}
			>
				{route.length > 0 && <RoutePolyline coordinates={route} />}
				{stops.map((s) => (
					<Marker
						key={`stop-${s.id}`}
						coordinate={{ latitude: s.lat, longitude: s.lng }}
						onPress={() => onStopPress?.(s)}
					>
						<StopMarker name={s.name} upcoming={s.upcoming} active={s.active} />
					</Marker>
				))}
				{buses.map((b) => (
					<Marker
						key={`bus-${b.id}`}
						coordinate={{ latitude: b.lat, longitude: b.lng }}
						rotation={b.heading ?? 0}
						anchor={{ x: 0.5, y: 0.5 }}
						onPress={() => onBusPress?.(b)}
					>
						<BusMarker
							label={b.label}
							eta={b.eta}
							crowd={b.crowd}
							active={b.active}
						/>
					</Marker>
				))}
			</MapView>
			{children ? <View style={styles.overlay}>{children}</View> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: radius.xl,
		overflow: "hidden",
		backgroundColor: "#E5ECFF",
		minHeight: 320,
		...shadow.card,
	},
	overlay: {
		position: "absolute",
		top: spacing.lg,
		left: spacing.lg,
		right: spacing.lg,
	},
});
