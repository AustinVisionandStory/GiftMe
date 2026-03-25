import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FormTextInput } from "@/src/components/FormTextInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { getFriendlyAuthError, registerWithEmail } from "@/src/services/auth";
import { theme } from "@/src/theme";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (password !== confirmPassword) {
      setError("Passwords need to match before you continue.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await registerWithEmail(email, password);
    } catch (nextError) {
      setError(getFriendlyAuthError(nextError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Create the profile people will actually shop from.</Text>
        <Text style={styles.subtitle}>
          We&apos;ll set up your account first, then reserve a unique username in
          onboarding.
        </Text>
      </View>

      <SectionCard eyebrow="Register" title="Create your account">
        <FormTextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        <FormTextInput
          autoCapitalize="none"
          autoComplete="new-password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Choose a strong password"
          secureTextEntry
          value={password}
        />
        <FormTextInput
          autoCapitalize="none"
          autoComplete="new-password"
          label="Confirm password"
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secureTextEntry
          value={confirmPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          label="Create account"
          loading={loading}
          onPress={handleRegister}
        />
        <Text style={styles.linkRow}>
          Already have an account?{" "}
          <Link href="/(auth)" style={styles.link}>
            Sign in
          </Link>
        </Text>
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
  linkRow: {
    color: theme.colors.mutedInk,
    fontSize: 14,
  },
  link: {
    color: theme.colors.clayDark,
    fontWeight: "700",
  },
});
