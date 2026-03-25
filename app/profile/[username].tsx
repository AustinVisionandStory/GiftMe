import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ProfileSummary } from "@/src/components/ProfileSummary";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { useSession } from "@/src/context/SessionProvider";
import type { PublicProfile } from "@/src/lib/firebase/types";
import { getProfileByUsername } from "@/src/services/profile";
import { theme } from "@/src/theme";

export default function PublicProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username: string }>();
  const { currentUser } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await getProfileByUsername(params.username ?? "");

        if (!active) {
          return;
        }

        setProfile(result);

        if (!result) {
          setError("No public profile matches that username yet.");
        }
      } catch (nextError) {
        if (!active) {
          return;
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : "We couldn't load that profile.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [params.username]);

  return (
    <Screen>
      <SectionCard eyebrow="Public Profile" title={`@${params.username ?? "profile"}`}>
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.colors.clayDark} />
            <Text style={styles.subtitle}>Loading profile...</Text>
          </View>
        ) : null}
        {!loading && error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && profile ? (
          <>
            <ProfileSummary
              profile={profile}
              subtitle={
                currentUser?.uid === profile.uid
                  ? "You own this profile"
                  : "Read-only public view"
              }
            />
            <Text style={styles.subtitle}>
              This public page is ready for gift links and reservation state to be
              layered on later.
            </Text>
          </>
        ) : null}
        <PrimaryButton
          label="Go home"
          onPress={() => router.replace("/(app)")}
          variant="ghost"
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.mutedInk,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: theme.colors.error,
    fontSize: 15,
    lineHeight: 22,
  },
});
