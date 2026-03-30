import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/client";
import { firebaseEnv } from "@/src/lib/firebase/env";

import type { AuthProviderStatus, PlatformAuthAdapter } from "./auth.contract";

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

function canUsePopupAuth() {
  return Boolean(firebaseEnv.authDomain);
}

async function getGoogleAuthStatus() {
  if (!canUsePopupAuth()) {
    return disabledStatus(
      "Add a Firebase auth domain before using Google sign-in on web.",
    );
  }

  return enabledStatus();
}

async function getAppleAuthStatus() {
  if (!canUsePopupAuth()) {
    return disabledStatus(
      "Add a Firebase auth domain before using Apple sign-in on web.",
    );
  }

  return enabledStatus();
}

async function signInWithGoogle() {
  const availability = await getGoogleAuthStatus();

  if (!availability.enabled) {
    throw new Error(availability.reason);
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  return signInWithPopup(auth, provider);
}

async function signInWithApple() {
  const availability = await getAppleAuthStatus();

  if (!availability.enabled) {
    throw new Error(availability.reason);
  }

  const provider = new OAuthProvider("apple.com");
  provider.addScope("email");
  provider.addScope("name");

  return signInWithPopup(auth, provider);
}

async function signOutUser() {
  await signOut(auth);
}

export const platformAuthAdapter: PlatformAuthAdapter = {
  getGoogleAuthStatus,
  getAppleAuthStatus,
  signInWithGoogle,
  signInWithApple,
  signOutUser,
};
