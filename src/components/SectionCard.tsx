import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/src/theme";

interface SectionCardProps {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
}

export function SectionCard({ title, eyebrow, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  eyebrow: {
    color: theme.colors.clayDark,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 24,
    fontWeight: "700",
  },
  body: {
    gap: theme.spacing.sm,
  },
});
