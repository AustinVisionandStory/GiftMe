import { PrimaryButton } from "./PrimaryButton";

import type { AppleSignInButtonProps } from "./AppleSignInButton.contract";

export function AppleSignInButton(props: AppleSignInButtonProps) {
  return (
    <PrimaryButton
      disabled={props.disabled}
      label="Continue with Apple"
      loading={props.loading}
      onPress={props.onPress}
      variant="ghost"
    />
  );
}
