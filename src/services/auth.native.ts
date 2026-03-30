import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { NativeModules, Platform } from "react-native";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/client";
import { firebaseEnv } from "@/src/lib/firebase/env";
import { createRawNonce, hashNonce } from "@/src/utils/nonce";

import type { AuthProviderStatus, PlatformAuthAdapter } from "./auth.contract";

let googleConfigured = false;

function enabledStatus(): AuthProviderStatus {
  return {
    enabled: true,
    reason: "",
  };
}

function disabledStatus(reason: string): AuthProviderStatus {
  return {
    enabled: false,
    reason,
  };
}

function canUseGoogleSignIn() {
  return Boolean(NativeModules.RNGoogleSignin);
}

function hasGoogleClientIds() {
  return Boolean(
    firebaseEnv.googleWebClientId &&
      (firebaseEnv.googleIosClientId || firebaseEnv.googleAndroidClientId),
  );
}

function configureGoogleIfNeeded() {
  if (googleConfigured || !canUseGoogleSignIn()) {
    return;
  }

  GoogleSignin.configure({
    webClientId: firebaseEnv.googleWebClientId,
    iosClientId: firebaseEnv.googleIosClientId || undefined,
    offlineAccess: false,
  });

  googleConfigured = true;
}

async function getGoogleAuthStatus() {
  if (!hasGoogleClientIds()) {
    return disabledStatus(
      "Add Google OAuth client IDs to your Expo env to enable Google.",
    );
  }

  if (!canUseGoogleSignIn()) {
    return disabledStatus(
      "Google Sign In requires a native development or production build.",
    );
  }

  return enabledStatus();
}

async function getAppleAuthStatus() {
  if (Platform.OS !== "ios") {
    return disabledStatus("Apple Sign In is only available on iOS devices.");
  }

  try {
    const available = await AppleAuthentication.isAvailableAsync();
    return available
      ? enabledStatus()
      : disabledStatus("Apple Sign In is unavailable on this device.");
  } catch {
    return disabledStatus("Apple Sign In is unavailable on this device.");
  }
}

async function signInWithGoogle() {
  const availability = await getGoogleAuthStatus();

  if (!availability.enabled) {
    throw new Error(availability.reason);
  }

  configureGoogleIfNeeded();

  if (Platform.OS === "android") {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
  }

  const result = await GoogleSignin.signIn();

  if (result.type !== "success" || !result.data.idToken) {
    throw new Error("Google sign-in was cancelled before completing.");
  }

  const credential = GoogleAuthProvider.credential(result.data.idToken);
  return signInWithCredential(auth, credential);
}

async function signInWithApple() {
  const availability = await getAppleAuthStatus();

  if (!availability.enabled) {
    throw new Error(availability.reason);
  }

  const rawNonce = await createRawNonce();
  const hashedNonce = await hashNonce(rawNonce);

  const credentialState = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credentialState.identityToken) {
    throw new Error("Apple did not return an identity token.");
  }

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({
    idToken: credentialState.identityToken,
    rawNonce,
  });

  return signInWithCredential(auth, credential);
}

async function signOutUser() {
  await signOut(auth);

  if (!canUseGoogleSignIn()) {
    return;
  }

  try {
    await GoogleSignin.signOut();
  } catch {
    // Firebase session sign out already succeeded, so keep this best effort.
  }
}

export const platformAuthAdapter: PlatformAuthAdapter = {
  getGoogleAuthStatus,
  getAppleAuthStatus,
  signInWithGoogle,
  signInWithApple,
  signOutUser,
};
