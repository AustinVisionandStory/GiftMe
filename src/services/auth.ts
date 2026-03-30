import { Platform } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/src/lib/firebase/client";

import type {
  AuthProviderStatus,
  PlatformAuthAdapter,
} from "./auth.contract";

let authAdapterPromise: Promise<PlatformAuthAdapter> | null = null;

async function getAuthAdapter(): Promise<PlatformAuthAdapter> {
  if (authAdapterPromise) {
    return authAdapterPromise;
  }

  authAdapterPromise =
    Platform.OS === "web"
      ? import("./auth.web").then((module) => module.platformAuthAdapter)
      : import("./auth.native").then((module) => module.platformAuthAdapter);

  return authAdapterPromise;
}

export async function getGoogleAuthStatus(): Promise<AuthProviderStatus> {
  const adapter = await getAuthAdapter();
  return adapter.getGoogleAuthStatus();
}

export async function getAppleAuthStatus(): Promise<AuthProviderStatus> {
  const adapter = await getAuthAdapter();
  return adapter.getAppleAuthStatus();
}

export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signInWithGoogle() {
  const adapter = await getAuthAdapter();
  return adapter.signInWithGoogle();
}

export async function signInWithApple() {
  const adapter = await getAuthAdapter();
  return adapter.signInWithApple();
}

export async function signOutUser() {
  const adapter = await getAuthAdapter();
  return adapter.signOutUser();
}

export function getFriendlyAuthError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (error.code === "SIGN_IN_CANCELLED") {
      return "Google sign-in was cancelled.";
    }

    if (error.code === "auth/popup-closed-by-user") {
      return "The sign-in window was closed before finishing.";
    }

    if (error.code === "auth/cancelled-popup-request") {
      return "Another sign-in attempt is already in progress.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
