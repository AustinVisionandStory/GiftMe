import type { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { appShell, theme } from "@/src/theme";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  const content = (
    <View style={styles.shell}>
      <View style={styles.content}>{children}</View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#fff8ef", "#f4ecdd", "#efe6d7"]}
      locations={[0, 0.48, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  shell: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: appShell.maxWidth,
    gap: theme.spacing.md,
  },
});
