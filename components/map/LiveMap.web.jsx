import { StyleSheet, View } from "react-native";
import { radius, shadow, spacing } from "../../design/tokens";

// Import react-leaflet components
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
// Import Leaflet CSS is handled in index.html/global styles or below
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import BusMarker from "./BusMarker";
import StopMarker from "./StopMarker";

// Create custom leaflet icons resolving from React Native Web SVG components
const createLeafletIcon = (ReactComponent, options = {}) => {
  const htmlArgs = ReactDOMServer.renderToString(ReactComponent);
  
  return L.divIcon({
    html: htmlArgs,
    className: 'custom-leaflet-marker',
    iconSize: options.size || [30, 30],
    iconAnchor: options.anchor || [15, 15],
  });
};

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

	return (
		<View style={[styles.card, style]}>
			<MapContainer
                center={[initialRegion.latitude, initialRegion.longitude]} 
                zoom={13} 
                zoomControl={false}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                {/* OpenStreetMap Tile Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route Polyline */}
                {route.length > 0 && (
                    <Polyline 
                        positions={route.map(pt => [pt.latitude, pt.longitude])} 
                        color="#0C8B99" 
                        weight={4}
                    />
                )}

                {/* Stop Markers */}
                {stops.map((s) => (
                    <Marker 
                        key={`stop-${s.id}`} 
                        position={[s.lat, s.lng]}
                        icon={createLeafletIcon(<StopMarker name={s.name} upcoming={s.upcoming} active={s.active} />, { size: [24, 24], anchor: [12, 12] })}
                        eventHandlers={{ click: () => onStopPress?.(s) }}
                    />
                ))}

                {/* Bus Markers */}
                {buses.map((b) => (
                    <Marker 
                        key={`bus-${b.id}`} 
                        position={[b.lat, b.lng]}
                        // Leaflet doesn't natively rotate markers easily without plugins, creating a wrapped div icon
                        icon={L.divIcon({
                            html: `<div style="transform: rotate(${b.heading ?? 0}deg);">${ReactDOMServer.renderToString(
                                <BusMarker label={b.label} eta={b.eta} crowd={b.crowd} active={b.active} />
                            )}</div>`,
                            className: 'custom-bus-marker',
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                        })}
                        eventHandlers={{ click: () => onBusPress?.(b) }}
                    />
                ))}
            </MapContainer>
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
        zIndex: 1000, // Important on web to sit above the leafet pane
	},
});
