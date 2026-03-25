import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase/client";
import type {
  AccountUser,
  OnboardingStatus,
  PublicProfile,
  SessionState,
} from "@/src/lib/firebase/types";
import { subscribeToMyProfile } from "@/src/services/profile";

type SessionContextValue = SessionState;

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider(props: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<SessionState["authStatus"]>(
    "loading",
  );
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatus>("loading");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accountUser, setAccountUser] = useState<AccountUser | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const userDocUnsubscribeRef = useRef<null | (() => void)>(null);
  const profileUnsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      userDocUnsubscribeRef.current?.();
      profileUnsubscribeRef.current?.();
      userDocUnsubscribeRef.current = null;
      profileUnsubscribeRef.current = null;

      setCurrentUser(user);

      if (!user) {
        setAuthStatus("signed_out");
        setOnboardingStatus("needs_profile");
        setAccountUser(null);
        setProfile(null);
        return;
      }

      setAuthStatus("signed_in");
      setOnboardingStatus("loading");

      userDocUnsubscribeRef.current = onSnapshot(
        doc(db, "users", user.uid),
        (snapshot) => {
          if (!snapshot.exists()) {
            setAccountUser(null);
            setProfile(null);
            setOnboardingStatus("needs_profile");
            return;
          }

          const data = snapshot.data() as AccountUser;
          setAccountUser(data);

          if (!data.onboardingComplete) {
            setProfile(null);
            setOnboardingStatus("needs_profile");
            return;
          }

          profileUnsubscribeRef.current?.();
          profileUnsubscribeRef.current = subscribeToMyProfile(
            user.uid,
            (nextProfile) => {
              setProfile(nextProfile);
              setOnboardingStatus(nextProfile ? "complete" : "needs_profile");
            },
          );
        },
      );
    });

    return () => {
      unsubscribe();
      userDocUnsubscribeRef.current?.();
      profileUnsubscribeRef.current?.();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        authStatus,
        onboardingStatus,
        currentUser,
        accountUser,
        profile,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used inside SessionProvider.");
  }

  return value;
}
