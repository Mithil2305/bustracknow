import "dotenv/config";

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
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "BusTrackNow needs your location to show nearby stops and buses on the map.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    web: {
      output: "static",
      favicon: "./assets/logo.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "BusTrackNow needs your location to show nearby stops and buses on the map.",
        },
      ],
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
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
