import "dotenv/config";

const googleMapsApiKey =
	process.env.GOOGLE_MAPS_API_KEY ||
	process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
	"";

export default {
	expo: {
		name: "bustracknow",
		slug: "bustracknow",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/logo.png",
		scheme: "bustracknow",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
			config: {
				googleMapsApiKey,
			},
		},
		android: {
			adaptiveIcon: {
				backgroundColor: "#E6F4FE",
			},
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
			config: {
				googleMaps: {
					apiKey: googleMapsApiKey,
				},
			},
		},
		web: {
			output: "static",
			favicon: "./assets/logo.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
					dark: {
						backgroundColor: "#000000",
					},
				},
			],
			"react-native-maps",
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
		extra: {
			googleMapsApiKey,
		},
	},
};
