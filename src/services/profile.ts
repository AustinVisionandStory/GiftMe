import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, functions, storage } from "@/src/lib/firebase/client";
import type { PublicProfile, UsernameClaim } from "@/src/lib/firebase/types";
import { normalizeUsername } from "@/src/utils/username";

interface CompleteProfileSetupInput {
  username: string;
  displayName: string;
  bio?: string;
}

interface CompleteProfileSetupResponse {
  profile: PublicProfile;
}

interface UpdateMyProfileInput {
  displayName: string;
  bio: string;
  photoURL?: string | null;
}

export async function completeProfileSetup(input: CompleteProfileSetupInput) {
  const callable = httpsCallable<
    CompleteProfileSetupInput,
    CompleteProfileSetupResponse
  >(functions, "completeProfileSetup");

  const result = await callable({
    username: input.username,
    displayName: input.displayName.trim(),
    bio: input.bio?.trim() ?? "",
  });

  return result.data.profile;
}

export async function getMyProfile(uid: string) {
  const snapshot = await getDoc(doc(db, "profiles", uid));
  return snapshot.exists() ? (snapshot.data() as PublicProfile) : null;
}

export function subscribeToMyProfile(
  uid: string,
  callback: (profile: PublicProfile | null) => void,
) {
  return onSnapshot(doc(db, "profiles", uid), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as PublicProfile) : null);
  });
}

export async function updateMyProfile(uid: string, input: UpdateMyProfileInput) {
  await updateDoc(doc(db, "profiles", uid), {
    displayName: input.displayName.trim(),
    bio: input.bio.trim(),
    photoURL: input.photoURL ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadAvatarAsync(uid: string, imageUri: string) {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const avatarRef = ref(storage, `avatars/${uid}/current.jpg`);

  await uploadBytes(avatarRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  return getDownloadURL(avatarRef);
}

export async function getProfileByUsername(username: string) {
  const normalized = normalizeUsername(username);
  const usernameSnapshot = await getDoc(doc(db, "usernames", normalized));

  if (!usernameSnapshot.exists()) {
    return null;
  }

  const claim = usernameSnapshot.data() as UsernameClaim;
  const profileSnapshot = await getDoc(doc(db, "profiles", claim.uid));

  return profileSnapshot.exists()
    ? (profileSnapshot.data() as PublicProfile)
    : null;
}
