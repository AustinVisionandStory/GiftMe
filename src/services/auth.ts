import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { NativeModules, Platform } from "react-native";
import {
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/client";
import { firebaseEnv } from "@/src/lib/firebase/env";
import { createRawNonce, hashNonce } from "@/src/utils/nonce";

let googleConfigured = false;

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

export function getGoogleAuthStatus() {
  if (!hasGoogleClientIds()) {
    return {
      enabled: false,
      reason: "Add Google OAuth client IDs to your Expo env to enable Google.",
    };
  }

  if (!canUseGoogleSignIn()) {
    return {
      enabled: false,
      reason:
        "Google Sign In requires a native development or production build.",
    };
  }

  return {
    enabled: true,
    reason: "",
  };
}

export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithGoogle() {
  const availability = getGoogleAuthStatus();

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

export async function signInWithApple() {
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

export async function signOutUser() {
  await signOut(auth);

  if (canUseGoogleSignIn()) {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Firebase session sign out already succeeded, so keep this best effort.
    }
  }
}

export function getFriendlyAuthError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === statusCodes.SIGN_IN_CANCELLED
  ) {
    return "Google sign-in was cancelled.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
