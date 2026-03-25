import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ProfileSummary } from "@/src/components/ProfileSummary";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { useSession } from "@/src/context/SessionProvider";
import { theme } from "@/src/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useSession();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.badge}>Foundation ready</Text>
        <Text style={styles.title}>Your public gifting layer is live.</Text>
        <Text style={styles.subtitle}>
          Next we can add gift links, claiming, and relationship features without
          reworking the core identity system.
        </Text>
      </View>

      {profile ? (
        <SectionCard eyebrow="Your Profile" title="This is what buyers will see">
          <ProfileSummary
            profile={profile}
            subtitle="Public profile visible by exact username"
          />
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Next moves" title="Use the foundation">
        <PrimaryButton
          label="Search for a username"
          onPress={() => router.push("/(app)/search")}
        />
        {profile ? (
          <PrimaryButton
            label="Preview my public profile"
            onPress={() => router.push(`/profile/${profile.usernameLower}`)}
            variant="ghost"
          />
        ) : null}
      </SectionCard>

      <SectionCard eyebrow="What exists" title="Foundation checklist">
        <Text style={styles.bullet}>Email, Google, and Apple auth entry points</Text>
        <Text style={styles.bullet}>Unique username claiming through a callable function</Text>
        <Text style={styles.bullet}>Public profiles plus private owner-only account docs</Text>
        <Text style={styles.bullet}>Profile edit flow with avatar uploads and rules</Text>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(95, 118, 83, 0.14)",
    color: theme.colors.moss,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
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
  bullet: {
    color: theme.colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
});
