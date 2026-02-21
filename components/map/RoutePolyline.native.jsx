import { Polyline } from "react-native-maps";

export default function RoutePolyline({
	coordinates = [],
	color = "#2563EB",
	width = 5,
	dashed = false,
	zIndex = 1,
}) {
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
