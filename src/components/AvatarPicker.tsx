import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/src/theme";

interface AvatarPickerProps {
  photoURL?: string | null;
  onPress: () => void | Promise<void>;
  busy?: boolean;
}

export function AvatarPicker({
  photoURL,
  onPress,
  busy = false,
}: AvatarPickerProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => void onPress()}
        style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
      >
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.image} />
        ) : (
          <Text style={styles.initials}>GM</Text>
        )}
      </Pressable>
      <Text style={styles.label}>
        {busy ? "Uploading photo..." : "Tap to add or replace your avatar"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "#eadcc7",
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initials: {
    color: theme.colors.clayDark,
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: "700",
  },
  label: {
    color: theme.colors.mutedInk,
    fontSize: 13,
    textAlign: "center",
  },
});
