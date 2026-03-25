import { Platform } from "react-native";

export const theme = {
  colors: {
    ink: "#201c18",
    mutedInk: "#62584f",
    sand: "#f6f2e8",
    card: "#fffaf2",
    clay: "#d9784b",
    clayDark: "#b65b31",
    moss: "#5f7653",
    border: "#e6dac7",
    line: "#d7c7b1",
    error: "#b33f3f",
    success: "#3e7c5a",
    white: "#ffffff",
    shadow: "rgba(32, 28, 24, 0.08)",
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 26,
    pill: 999,
  },
  typography: {
    display: Platform.select({
      ios: "Avenir Next",
      android: "sans-serif-medium",
      default: "System",
    }),
    body: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "System",
    }),
  },
};

export const appShell = {
  maxWidth: 560,
};
