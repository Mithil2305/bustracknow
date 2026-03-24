import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing } from "../../design/tokens";

function toBbox(region) {
  const lat = region?.latitude ?? 11.0168;
  const lng = region?.longitude ?? 76.9558;
  const latDelta = Math.max(region?.latitudeDelta ?? 0.05, 0.01);
  const lngDelta = Math.max(region?.longitudeDelta ?? 0.05, 0.01);

  const south = lat - latDelta;
  const north = lat + latDelta;
  const west = lng - lngDelta;
  const east = lng + lngDelta;

  return { south, north, west, east, lat, lng };
}

export default function LiveMap({
  initialRegion = {
    latitude: 11.0168,
    longitude: 76.9558,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  buses = [],
  stops = [],
  onBusPress,
  onStopPress,
  style,
  children,
}) {
  const { south, north, west, east, lat, lng } = useMemo(
    () => toBbox(initialRegion),
    [initialRegion]
  );

  const mapUrl = useMemo(() => {
    const bbox = [west, south, east, north].join(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
  }, [east, lat, lng, north, south, west]);

  return (
    <View style={[styles.card, style]}>
      <iframe title="Live map" src={mapUrl} style={styles.iframe} loading="lazy" />

      <View style={styles.panel}>
        <Text style={styles.title}>Live buses</Text>
        {buses.slice(0, 5).map((bus) => (
          <Pressable key={`bus-${bus.id}`} onPress={() => onBusPress?.(bus)} style={styles.row}>
            <Text style={styles.rowLabel}>{bus.label || bus.id}</Text>
            <Text style={styles.rowMeta}>{bus.eta || "Live"}</Text>
          </Pressable>
        ))}

        <Text style={[styles.title, { marginTop: 10 }]}>Stops</Text>
        {stops.slice(0, 5).map((stop) => (
          <Pressable key={`stop-${stop.id}`} onPress={() => onStopPress?.(stop)} style={styles.row}>
            <Text style={styles.rowLabel}>{stop.name || stop.id}</Text>
          </Pressable>
        ))}
      </View>

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
    position: "relative",
    ...shadow.card,
  },
  iframe: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
    minHeight: 320,
  },
  panel: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    width: 210,
    maxHeight: 260,
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  row: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: "#EEF4FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0B3D5C",
    flexShrink: 1,
  },
  rowMeta: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0A7F86",
    marginLeft: spacing.sm,
  },
  overlay: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
