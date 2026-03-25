import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FormTextInput } from "@/src/components/FormTextInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { theme } from "@/src/theme";
import { normalizeUsername, validateUsername } from "@/src/utils/username";

export default function SearchScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSearch() {
    const validation = validateUsername(username);

    if (validation) {
      setError(validation);
      return;
    }

    setError(null);
    router.push(`/profile/${normalizeUsername(username)}`);
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Find a public profile by exact username.</Text>
        <Text style={styles.subtitle}>
          This foundation uses exact matches only, which keeps discovery
          predictable and privacy cleaner.
        </Text>
      </View>

      <SectionCard eyebrow="Lookup" title="Search GiftMe usernames">
        <FormTextInput
          autoCapitalize="none"
          autoCorrect={false}
          error={error}
          label="Username"
          onChangeText={setUsername}
          placeholder="type an exact username"
          value={username}
        />
        <PrimaryButton label="Open profile" onPress={handleSearch} />
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
});
