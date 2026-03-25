import "react-native-url-polyfill/auto";

import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Screen } from "@/src/components/Screen";
import { SectionCard } from "@/src/components/SectionCard";
import { SessionProvider, useSession } from "@/src/context/SessionProvider";
import { theme } from "@/src/theme";

function Gate() {
  const router = useRouter();
  const segments = useSegments();
  const { authStatus, onboardingStatus } = useSession();

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    const topSegment = segments[0];
    const inAuth = topSegment === "(auth)";
    const inApp = topSegment === "(app)";
    const inOnboarding = topSegment === "(onboarding)";
    const inPublicProfile = topSegment === "profile";

    if (authStatus === "signed_out") {
      if (!inAuth && !inPublicProfile) {
        router.replace("/(auth)");
      }
      return;
    }

    if (onboardingStatus === "loading") {
      return;
    }

    if (onboardingStatus !== "complete") {
      if (!inOnboarding) {
        router.replace("/(onboarding)");
      }
      return;
    }

    if (inAuth || inOnboarding) {
      router.replace("/(app)");
      return;
    }

    if (!inApp && !inPublicProfile) {
      router.replace("/(app)");
    }
  }, [authStatus, onboardingStatus, router, segments]);

  if (
    authStatus === "loading" ||
    (authStatus === "signed_in" && onboardingStatus === "loading")
  ) {
    return (
      <Screen scroll={false}>
        <SectionCard eyebrow="GiftMe" title="Loading your gift universe">
          <ActivityIndicator color={theme.colors.clayDark} size="large" />
          <Text style={styles.loadingCopy}>
            We&apos;re restoring your session and profile state.
          </Text>
        </SectionCard>
      </Screen>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <Gate />
      </SessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingCopy: {
    color: theme.colors.mutedInk,
    fontSize: 15,
    lineHeight: 22,
  },
});
