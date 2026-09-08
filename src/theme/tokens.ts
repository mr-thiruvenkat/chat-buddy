import { TextStyle } from "react-native";

export const colors = {
  primary: "#007BFF",
  primarySoft: "#80B8FF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",
  text: "#334155",
  textStrong: "#111827",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  border: "#E2E8F0",
  borderInput: "#D7DEE8",
  success: "#16A34A",
  danger: "#B42318",
  dangerSurface: "#FEECEC",
  primarySurface: "#E8F1FF",
  white: "#FFFFFF",
  darkBackground: "#171916",
  darkSurface: "#252724",
  darkBorder: "#30342E",
  darkText: "#F9FAFB",
} as const;

export const spacing = {
  extraSmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,
} as const;

export const sizes = {
  extraSmall: 12,
  small: 20,
  medium: 44,
  large: 58,
  extraLarge: 112,
} as const;

export const radii = {
  small: 10,
  medium: 15,
  large: 20,
  round: 999,
} as const;

export const typography = {
  light: "300" as TextStyle["fontWeight"],
  semibold: "600" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
  extraBold: "800" as TextStyle["fontWeight"],
  body: 15,
  caption: 12,
  label: 11,
  title: 34,
} as const;

export const icons = {
  back: "‹",
  add: "+",
  close: "×",
  search: "⌕",
  send: "↑",
  more: "•••",
} as const;
