import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/src/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: PrimaryButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={() => void onPress()}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        inactive && styles.inactive,
        pressed && !inactive && styles.pressed,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator
            color={variant === "ghost" ? theme.colors.ink : theme.colors.white}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            variant === "ghost" ? styles.ghostLabel : styles.filledLabel,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: theme.colors.clay,
    borderColor: theme.colors.clay,
  },
  secondary: {
    backgroundColor: theme.colors.moss,
    borderColor: theme.colors.moss,
  },
  ghost: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderColor: theme.colors.line,
  },
  danger: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  inactive: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  filledLabel: {
    color: theme.colors.white,
  },
  ghostLabel: {
    color: theme.colors.ink,
  },
});
