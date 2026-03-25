import type { ConfigContext, ExpoConfig } from "expo/config";
import { existsSync } from "node:fs";

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosGoogleServices = existsSync("./GoogleService-Info.plist")
    ? "./GoogleService-Info.plist"
    : undefined;
  const androidGoogleServices = existsSync("./google-services.json")
    ? "./google-services.json"
    : undefined;
  const hasNativeGoogleConfig = Boolean(
    iosGoogleServices || androidGoogleServices,
  );

  const plugins: NonNullable<ExpoConfig["plugins"]> = [
    "expo-router",
    "expo-apple-authentication",
    [
      "expo-image-picker",
      {
        photosPermission:
          "GiftMe uses your photo library so you can choose a profile picture.",
      },
    ],
  ];

  if (hasNativeGoogleConfig) {
    plugins.push("@react-native-google-signin/google-signin");
  }

  return {
    ...config,
    name: "GiftMe",
    slug: "giftme",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "giftme",
    userInterfaceStyle: "light",
    experiments: {
      typedRoutes: true,
    },
    plugins,
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier:
        process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? "com.giftme.app",
      googleServicesFile: iosGoogleServices,
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#f6f2e8",
      },
      package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? "com.giftme.app",
      googleServicesFile: androidGoogleServices,
    },
    web: {
      bundler: "metro",
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      },
    },
  };
};
