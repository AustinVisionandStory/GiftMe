import { Platform } from "react-native";
import { useEffect, useState, type JSX } from "react";

import type { AppleSignInButtonProps } from "./AppleSignInButton.contract";
import { PrimaryButton } from "./PrimaryButton";

type AppleSignInButtonComponent = (props: AppleSignInButtonProps) => JSX.Element;

export function AppleSignInButton(props: AppleSignInButtonProps) {
  const [Component, setComponent] = useState<AppleSignInButtonComponent | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    const loadComponent = async () => {
      const module =
        Platform.OS === "web"
          ? await import("./AppleSignInButton.web")
          : await import("./AppleSignInButton.native");

      if (active) {
        setComponent(() => module.AppleSignInButton);
      }
    };

    void loadComponent();

    return () => {
      active = false;
    };
  }, []);

  if (!Component) {
    return (
      <PrimaryButton
        disabled
        label="Continue with Apple"
        loading={props.loading}
        onPress={props.onPress}
        variant="ghost"
      />
    );
  }

  return <Component {...props} />;
}
