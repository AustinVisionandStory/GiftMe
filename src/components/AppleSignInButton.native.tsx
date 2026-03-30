import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet } from "react-native";

import { theme } from "@/src/theme";

import { PrimaryButton } from "./PrimaryButton";

import type { AppleSignInButtonProps } from "./AppleSignInButton.contract";

export function AppleSignInButton({
  disabled = false,
  loading = false,
  onPress,
}: AppleSignInButtonProps) {
  if (disabled || loading) {
    return (
      <PrimaryButton
        disabled={disabled}
        label="Continue with Apple"
        loading={loading}
        onPress={onPress}
        variant="ghost"
      />
    );
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      cornerRadius={theme.radius.pill}
      onPress={() => void onPress()}
      style={styles.button}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 54,
  },
});
