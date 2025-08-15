// src/shared/ui/theme.ts
import { Theme } from "@emotion/react";

export const colors = {
  primary: "#4A90E2",
  secondary: "#50E3C2",
  background: "#FFFFFF",
  text: "#333333",
  error: "#FF4D4D",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  fontFamily: {
    regular: "System",
    bold: "System",
  },
  fontSize: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
};

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export const theme: Theme = {
  colors,
  spacing,
  typography,
  breakpoints,
};

export type AppTheme = typeof theme;
declare module "@emotion/react" {
  export interface Theme {
    colors: typeof colors;
    spacing: typeof spacing;
    typography: typeof typography;
    breakpoints: typeof breakpoints;
  }
}
