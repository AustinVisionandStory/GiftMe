const environment = {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
} as const;

function readEnv(name: keyof typeof environment, required = true) {
  const value = environment[name];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value ?? "";
}

export const firebaseEnv = {
  apiKey: readEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: readEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("EXPO_PUBLIC_FIREBASE_APP_ID"),
  functionsRegion:
    process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1",
  useEmulators: process.env.EXPO_PUBLIC_USE_EMULATORS === "true",
  emulatorHost: process.env.EXPO_PUBLIC_EMULATOR_HOST ?? "127.0.0.1",
  googleWebClientId: readEnv("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID", false),
  googleIosClientId: readEnv("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID", false),
  googleAndroidClientId: readEnv(
    "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID",
    false,
  ),
};
