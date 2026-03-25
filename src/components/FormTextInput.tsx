import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { theme } from "@/src/theme";

interface FormTextInputProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string | null;
}

export function FormTextInput({
  label,
  hint,
  error,
  style,
  ...props
}: FormTextInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#8a7f73"
        style={[styles.input, props.multiline && styles.multiline, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    color: theme.colors.ink,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: 16,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  hint: {
    color: theme.colors.mutedInk,
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
});
