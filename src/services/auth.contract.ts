import type { UserCredential } from "firebase/auth";

export interface AuthProviderStatus {
  enabled: boolean;
  reason: string;
}

export interface PlatformAuthAdapter {
  getGoogleAuthStatus(): Promise<AuthProviderStatus>;
  getAppleAuthStatus(): Promise<AuthProviderStatus>;
  signInWithGoogle(): Promise<UserCredential>;
  signInWithApple(): Promise<UserCredential>;
  signOutUser(): Promise<void>;
}
