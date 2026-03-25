import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { AvatarPicker } from "@/src/components/AvatarPicker";
import { FormTextInput } from "@/src/components/FormTextInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ProfileSummary } from "@/src/components/ProfileSummary";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { useSession } from "@/src/context/SessionProvider";
import { signOutUser } from "@/src/services/auth";
import { updateMyProfile, uploadAvatarAsync } from "@/src/services/profile";
import { theme } from "@/src/theme";

export default function MeScreen() {
  const { currentUser, profile } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setAvatarUri(profile.photoURL);
  }, [profile]);

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setError("Photo access is required before you can change your avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!currentUser || !profile) {
      return;
    }

    try {
      setError(null);
      setNotice(null);
      setSaving(true);

      let photoURL = profile.photoURL;

      if (avatarUri && avatarUri !== profile.photoURL) {
        photoURL = await uploadAvatarAsync(currentUser.uid, avatarUri);
      }

      await updateMyProfile(currentUser.uid, {
        displayName,
        bio,
        photoURL,
      });

      setNotice("Profile saved.");
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Could not save profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true);
      await signOutUser();
    } finally {
      setSigningOut(false);
    }
  }

  if (!profile) {
    return (
      <Screen>
        <SectionCard eyebrow="Profile" title="Finishing your profile sync">
          <Text style={styles.subtitle}>
            Your public profile will appear here as soon as onboarding completes.
          </Text>
        </SectionCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionCard eyebrow="Public Profile" title="How your page feels to others">
        <ProfileSummary profile={profile} subtitle="Owner preview" />
      </SectionCard>

      <SectionCard eyebrow="Edit" title="Refine the basics">
        <AvatarPicker onPress={handlePickAvatar} photoURL={avatarUri} />
        <FormTextInput
          label="Display name"
          onChangeText={setDisplayName}
          value={displayName}
        />
        <FormTextInput
          label="Bio"
          multiline
          onChangeText={setBio}
          value={bio}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <PrimaryButton label="Save profile" loading={saving} onPress={handleSave} />
      </SectionCard>

      <SectionCard eyebrow="Account" title="Session controls">
        <PrimaryButton
          label="Sign out"
          loading={signingOut}
          onPress={handleSignOut}
          variant="danger"
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: theme.colors.mutedInk,
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  notice: {
    color: theme.colors.success,
    fontSize: 14,
    lineHeight: 20,
  },
});
