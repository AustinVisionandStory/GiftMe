export interface AppleSignInButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void | Promise<void>;
}
