import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "KerygmaAI",
  slug: "KerygmaAI",
  version: "2.0.0",
  orientation: "portrait",
  icon: "./assets/icons/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    icon: {
      dark: "./assets/icons/icon.png",
      light: "./assets/icons/icon.png",
    },
    bundleIdentifier: "com.gersonrocha9.KerygmaAI",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#4CAF50",
    },
    package: "com.gersonrocha9.KerygmaAI",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/icons/icon.png",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#4CAF50",
      },
    ],
    "expo-font",
    "expo-localization",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "7f4e4c38-4f41-47c2-82d1-c6098ab96bf9",
    },
  },
  owner: "gersonrocha9",
});
