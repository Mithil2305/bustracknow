import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { radius, shadow, spacing } from "../../design/tokens";

/**
 * LiveMap – renders an OpenStreetMap (Leaflet) inside a WebView.
 * Works on Android & iOS. Web variant lives in LiveMap.web.jsx.
 */
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
  const webViewRef = useRef(null);

  // Build the Leaflet HTML once based on initial region
  const leafletHtml = useMemo(() => buildLeafletHtml(initialRegion), [initialRegion]);

  // Push marker / polyline data whenever props change
  useEffect(() => {
    const payload = JSON.stringify({ buses, stops, route });
    webViewRef.current?.injectJavaScript(`
			window.__updateMarkers && window.__updateMarkers(${payload});
			true;
		`);
  }, [buses, stops, route]);

  // Handle messages from the WebView (marker taps)
  const handleMessage = useCallback(
    (event) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === "busPress" && onBusPress) {
          const bus = buses.find((b) => b.id === msg.id);
          if (bus) onBusPress(bus);
        }
        if (msg.type === "stopPress" && onStopPress) {
          const stop = stops.find((s) => s.id === msg.id);
          if (stop) onStopPress(stop);
        }
      } catch (_e) {
        // ignore non-JSON messages
      }
    },
    [buses, stops, onBusPress, onStopPress]
  );

  return (
    <View style={[styles.card, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: leafletHtml }}
        style={StyleSheet.absoluteFill}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="hardware"
        startInLoadingState={false}
      />
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </View>
  );
}

// ── Leaflet HTML builder ───────────────────────────────────────────
function buildLeafletHtml(region) {
  const zoom = Math.round(Math.log2(360 / (region.latitudeDelta || 0.05)) + 1);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}
#map{width:100%;height:100%;}
.bus-marker{
  background:#0b7a9d;color:#fff;font-weight:800;font-size:12px;
  padding:4px 8px;border-radius:8px;text-align:center;white-space:nowrap;
  box-shadow:0 2px 6px rgba(0,0,0,0.3);
}
.bus-marker.inactive{background:#ccc;opacity:0.6;}
.bus-meta{font-size:10px;font-weight:600;margin-top:2px;color:#fff;}
.stop-marker{
  width:16px;height:16px;border-radius:50%;border:3px solid #fff;
  background:#10B981;box-shadow:0 2px 6px rgba(0,0,0,0.3);
}
.stop-marker.inactive{background:#ccc;}
</style>
</head>
<body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false}).setView([${region.latitude},${region.longitude}],${zoom});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19,
  attribution:'\\u00a9 OpenStreetMap'
}).addTo(map);

var busMarkers=[],stopMarkers=[],routeLine=null;
function clearLayer(arr){arr.forEach(function(m){map.removeLayer(m)});arr.length=0;}

window.__updateMarkers=function(data){
  if(routeLine){map.removeLayer(routeLine);routeLine=null;}
  if(data.route&&data.route.length>1){
    var latlngs=data.route.map(function(p){return[p.latitude,p.longitude]});
    routeLine=L.polyline(latlngs,{color:'#0b7a9d',weight:4,opacity:0.8}).addTo(map);
  }
  clearLayer(stopMarkers);
  (data.stops||[]).forEach(function(s){
    var icon=L.divIcon({
      className:'',
      html:'<div class="stop-marker'+(s.active===false?' inactive':'')+'"></div>',
      iconSize:[16,16],iconAnchor:[8,8]
    });
    var m=L.marker([s.lat,s.lng],{icon:icon}).addTo(map);
    m.bindTooltip(s.name||'Stop',{direction:'top',offset:[0,-10]});
    m.on('click',function(){
      window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({type:'stopPress',id:s.id}));
    });
    stopMarkers.push(m);
  });
  clearLayer(busMarkers);
  (data.buses||[]).forEach(function(b){
    var active=b.active!==false;
    var html='<div class="bus-marker'+(active?'':' inactive')+'" style="transform:rotate('+(b.heading||0)+'deg)">'
      +b.label
      +'<div class="bus-meta">'+(b.eta||'')+' \\u2022 '+(b.crowd||'')+'</div>'
      +'</div>';
    var icon=L.divIcon({className:'',html:html,iconSize:[60,36],iconAnchor:[30,18]});
    var m=L.marker([b.lat,b.lng],{icon:icon}).addTo(map);
    m.on('click',function(){
      window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({type:'busPress',id:b.id}));
    });
    busMarkers.push(m);
  });
};
<\/script>
</body>
</html>`;
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
