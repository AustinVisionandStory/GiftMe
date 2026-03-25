import { Link } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { FormTextInput } from "@/src/components/FormTextInput";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import {
  getFriendlyAuthError,
  getGoogleAuthStatus,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
} from "@/src/services/auth";
import { theme } from "@/src/theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<
    "email" | "google" | "apple" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const googleStatus = getGoogleAuthStatus();

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);

  async function handleEmailSignIn() {
    try {
      setError(null);
      setLoadingAction("email");
      await signInWithEmail(email, password);
    } catch (nextError) {
      setError(getFriendlyAuthError(nextError));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError(null);
      setLoadingAction("google");
      await signInWithGoogle();
    } catch (nextError) {
      setError(getFriendlyAuthError(nextError));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleAppleSignIn() {
    try {
      setError(null);
      setLoadingAction("apple");
      await signInWithApple();
    } catch (nextError) {
      setError(getFriendlyAuthError(nextError));
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.badge}>Gift coordination, without collisions</Text>
        <Text style={styles.title}>Build a public gift profile people can trust.</Text>
        <Text style={styles.subtitle}>
          Start with your identity layer now, then add shared wishlists, claims,
          and reservation logic on top.
        </Text>
      </View>

      <SectionCard eyebrow="Sign In" title="Welcome back">
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
          autoComplete="password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          label="Sign in with email"
          loading={loadingAction === "email"}
          onPress={handleEmailSignIn}
        />
        <PrimaryButton
          disabled={!googleStatus.enabled}
          label="Continue with Google"
          loading={loadingAction === "google"}
          onPress={handleGoogleSignIn}
          variant="secondary"
        />
        {!googleStatus.enabled ? (
          <Text style={styles.hint}>{googleStatus.reason}</Text>
        ) : null}
        {Platform.OS === "ios" && appleAvailable ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            cornerRadius={999}
            onPress={() => void handleAppleSignIn()}
            style={styles.appleButton}
          />
        ) : null}
        <Text style={styles.linkRow}>
          New here?{" "}
          <Link href="/(auth)/register" style={styles.link}>
            Create your account
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
    paddingBottom: theme.spacing.sm,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(217, 120, 75, 0.12)",
    color: theme.colors.clayDark,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40,
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
  hint: {
    color: theme.colors.mutedInk,
    fontSize: 13,
    lineHeight: 18,
  },
  linkRow: {
    color: theme.colors.mutedInk,
    fontSize: 14,
  },
  link: {
    color: theme.colors.clayDark,
    fontWeight: "700",
  },
  appleButton: {
    width: "100%",
    height: 54,
  },
});
