let Polyline;
try {
	Polyline = require("react-native-maps").Polyline;
} catch (e) {
	Polyline = null;
}

export default function RoutePolyline({
	coordinates = [],
	color = "#2563EB",
	width = 5,
	dashed = false,
	zIndex = 1,
}) {
	if (!Polyline) return null;

	return (
		<Polyline
			coordinates={coordinates}
			strokeColor={color}
			strokeWidth={width}
			lineDashPattern={dashed ? [8, 6] : undefined}
			zIndex={zIndex}
		/>
	);
}
