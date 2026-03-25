import type { Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

export type AuthStatus = "loading" | "signed_out" | "signed_in";
export type OnboardingStatus = "loading" | "needs_profile" | "complete";

export interface AccountUser {
  uid: string;
  email: string | null;
  providers: string[];
  onboardingComplete: boolean;
  profileId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PublicProfile {
  uid: string;
  username: string;
  usernameLower: string;
  displayName: string;
  bio: string;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UsernameClaim {
  uid: string;
  username: string;
  usernameLower: string;
  createdAt: Timestamp;
}

export interface SessionState {
  authStatus: AuthStatus;
  onboardingStatus: OnboardingStatus;
  currentUser: User | null;
  accountUser: AccountUser | null;
  profile: PublicProfile | null;
}
