import { Image, StyleSheet, Text, View } from "react-native";

import type { PublicProfile } from "@/src/lib/firebase/types";
import { theme } from "@/src/theme";

export function ProfileSummary(props: {
  profile: PublicProfile;
  subtitle?: string;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.avatar}>
        {props.profile.photoURL ? (
          <Image source={{ uri: props.profile.photoURL }} style={styles.image} />
        ) : (
          <Text style={styles.avatarText}>
            {props.profile.displayName.slice(0, 2).toUpperCase()}
          </Text>
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{props.profile.displayName}</Text>
        <Text style={styles.username}>@{props.profile.usernameLower}</Text>
        {props.subtitle ? <Text style={styles.subtitle}>{props.subtitle}</Text> : null}
        {props.profile.bio ? <Text style={styles.bio}>{props.profile.bio}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ecd9c0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: theme.colors.clayDark,
    fontFamily: theme.typography.display,
    fontSize: 26,
    fontWeight: "700",
  },
  copy: {
    gap: 6,
  },
  name: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 28,
    fontWeight: "700",
  },
  username: {
    color: theme.colors.clayDark,
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.moss,
    fontSize: 14,
    fontWeight: "600",
  },
  bio: {
    color: theme.colors.mutedInk,
    fontSize: 15,
    lineHeight: 22,
  },
});
