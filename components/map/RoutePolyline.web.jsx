import { Polyline } from 'react-leaflet';

export default function RoutePolyline({
	coordinates = [],
	color = "#2563EB",
	width = 5,
	dashed = false,
	zIndex = 1,
}) {
    if (!coordinates || coordinates.length === 0) return null;
    
	return (
		<Polyline 
            positions={coordinates.map(pt => [pt.latitude, pt.longitude])} 
            color={color} 
            weight={width}
            dashArray={dashed ? "8, 6" : undefined}
            pane="overlayPane"
        />
	);
}
