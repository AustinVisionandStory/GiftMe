import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AvatarPicker } from "@/src/components/AvatarPicker";
import { FormTextInput } from "@/src/components/FormTextInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { useSession } from "@/src/context/SessionProvider";
import { pickAvatarImage } from "@/src/services/mediaPicker";
import { completeProfileSetup, updateMyProfile, uploadAvatarAsync } from "@/src/services/profile";
import { theme } from "@/src/theme";
import { normalizeUsername, validateUsername } from "@/src/utils/username";

export default function OnboardingScreen() {
  const { currentUser } = useSession();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handlePickAvatar() {
    try {
      const nextAvatarUri = await pickAvatarImage();

      if (nextAvatarUri) {
        setError(null);
        setAvatarUri(nextAvatarUri);
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "We couldn't open the image picker.",
      );
    }
  }

  async function handleSubmit() {
    if (!currentUser) {
      return;
    }

    const usernameError = validateUsername(username);

    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (!displayName.trim()) {
      setError("Add a display name so people know they found the right you.");
      return;
    }

    try {
      setError(null);
      setNotice(null);
      setSaving(true);

      await completeProfileSetup({
        username,
        displayName,
        bio,
      });

      if (avatarUri) {
        setAvatarBusy(true);
        const photoURL = await uploadAvatarAsync(currentUser.uid, avatarUri);
        await updateMyProfile(currentUser.uid, {
          displayName,
          bio,
          photoURL,
        });
        setAvatarBusy(false);
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "We couldn't finish setting up your profile.",
      );
    } finally {
      setSaving(false);
      setAvatarBusy(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Claim your public gifting identity.</Text>
        <Text style={styles.subtitle}>
          This username becomes the stable handle people use to find your
          profile.
        </Text>
      </View>

      <SectionCard eyebrow="Profile Setup" title="Build your public profile">
        <AvatarPicker busy={avatarBusy} onPress={handlePickAvatar} photoURL={avatarUri} />
        <FormTextInput
          autoCapitalize="none"
          autoCorrect={false}
          hint={`Your profile will be found as @${normalizeUsername(username || "yourname")}`}
          label="Username"
          onChangeText={setUsername}
          placeholder="austin.gifts"
          value={username}
        />
        <FormTextInput
          label="Display name"
          onChangeText={setDisplayName}
          placeholder="Austin Buell"
          value={displayName}
        />
        <FormTextInput
          hint="Keep it short and warm. This is public."
          label="Bio"
          multiline
          onChangeText={setBio}
          placeholder="Mountain mornings, coffee, and gadgets that actually help."
          value={bio}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        <PrimaryButton
          label="Reserve username and finish setup"
          loading={saving}
          onPress={handleSubmit}
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
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
