import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/;

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

function assertProfileInput(value: unknown) {
  if (typeof value !== "object" || value === null) {
    throw new HttpsError("invalid-argument", "Profile payload is required.");
  }

  const input = value as {
    username?: unknown;
    displayName?: unknown;
    bio?: unknown;
  };

  if (typeof input.username !== "string") {
    throw new HttpsError("invalid-argument", "Username is required.");
  }

  if (typeof input.displayName !== "string") {
    throw new HttpsError("invalid-argument", "Display name is required.");
  }

  const usernameLower = normalizeUsername(input.username);
  const displayName = input.displayName.trim();
  const bio = typeof input.bio === "string" ? input.bio.trim() : "";

  if (!USERNAME_REGEX.test(usernameLower)) {
    throw new HttpsError(
      "invalid-argument",
      "Use 3-20 lowercase letters, numbers, periods, or underscores.",
    );
  }

  if (!displayName) {
    throw new HttpsError("invalid-argument", "Display name is required.");
  }

  if (bio.length > 240) {
    throw new HttpsError(
      "invalid-argument",
      "Bio must stay under 240 characters.",
    );
  }

  return {
    usernameLower,
    displayName,
    bio,
  };
}

export const completeProfileSetup = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in before setting up a profile.");
  }

  const db = getFirestore();
  const uid = request.auth.uid;
  const email =
    typeof request.auth.token.email === "string"
      ? request.auth.token.email
      : null;
  const signInProvider =
    typeof request.auth.token.firebase?.sign_in_provider === "string"
      ? request.auth.token.firebase.sign_in_provider
      : "unknown";
  const { usernameLower, displayName, bio } = assertProfileInput(request.data);
  const userRef = db.doc(`users/${uid}`);
  const profileRef = db.doc(`profiles/${uid}`);
  const usernameRef = db.doc(`usernames/${usernameLower}`);

  await db.runTransaction(async (transaction) => {
    const [userSnapshot, profileSnapshot, usernameSnapshot] = await Promise.all([
      transaction.get(userRef),
      transaction.get(profileRef),
      transaction.get(usernameRef),
    ]);

    if (usernameSnapshot.exists) {
      const existingClaim = usernameSnapshot.data();

      if (existingClaim?.uid !== uid) {
        throw new HttpsError(
          "already-exists",
          "That username has already been claimed.",
        );
      }
    }

    if (profileSnapshot.exists) {
      const existingProfile = profileSnapshot.data();

      if (
        existingProfile?.usernameLower &&
        existingProfile.usernameLower !== usernameLower
      ) {
        throw new HttpsError(
          "failed-precondition",
          "Usernames are immutable after setup in this foundation phase.",
        );
      }
    }

    if (!usernameSnapshot.exists) {
      transaction.create(usernameRef, {
        uid,
        username: usernameLower,
        usernameLower,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    transaction.set(
      userRef,
      {
        uid,
        email,
        providers: Array.from(
          new Set([
            signInProvider,
            ...(userSnapshot.exists
              ? ((userSnapshot.data()?.providers as string[] | undefined) ?? [])
              : []),
          ]),
        ),
        onboardingComplete: true,
        profileId: uid,
        createdAt:
          userSnapshot.exists && userSnapshot.data()?.createdAt
            ? userSnapshot.data()?.createdAt
            : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(
      profileRef,
      {
        uid,
        username: usernameLower,
        usernameLower,
        displayName,
        bio,
        photoURL: profileSnapshot.exists
          ? profileSnapshot.data()?.photoURL ?? null
          : null,
        createdAt:
          profileSnapshot.exists && profileSnapshot.data()?.createdAt
            ? profileSnapshot.data()?.createdAt
            : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });

  const profileSnapshot = await profileRef.get();

  return {
    profile: profileSnapshot.data(),
  };
});
