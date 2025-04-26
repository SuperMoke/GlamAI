import { MD3LightTheme, configureFonts } from "react-native-paper";

// Font configuration
const fontConfig = {
  displayLarge: {
    fontFamily: "System",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 0.25,
  },
  displayMedium: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0.25,
  },
  displaySmall: {
    fontFamily: "System",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.25,
  },
  headlineLarge: {
    fontFamily: "System",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  headlineMedium: {
    fontFamily: "System",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  headlineSmall: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  titleLarge: {
    fontFamily: "System",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  titleMedium: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.15,
  },
  bodyMedium: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
};

// GLAMAI theme
const GLAMAITheme = {
  ...MD3LightTheme,

  // Customize your colors
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF6B8B", // Soft pink - main brand color
    primaryContainer: "#FFE9EE", // Light pink for containers
    secondary: "#7B68EE", // Soft purple for accents
    secondaryContainer: "#EDE9FF", // Light purple container
    tertiary: "#4ECDC4", // Teal for highlights
    tertiaryContainer: "#E0F7F5", // Light teal container
    surface: "#FFFFFF",
    surfaceVariant: "#F7F7F7",
    background: "#FCFCFC",
    error: "#FF5252",
    errorContainer: "#FFEDED",
    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#4A0015",
    onSecondary: "#FFFFFF",
    onSecondaryContainer: "#1A1145",
    onTertiary: "#FFFFFF",
    onTertiaryContainer: "#023E3A",
    onSurface: "#1C1B1F",
    onSurfaceVariant: "#49454F",
    outline: "#DEDDDD",
    outlineVariant: "#C4C4C4",
    shadow: "rgba(0, 0, 0, 0.15)",
    scrim: "rgba(0, 0, 0, 0.3)",
    inverseSurface: "#313033",
    inverseOnSurface: "#F5F5F5",
    inversePrimary: "#FFB1C8",
  },

  // Apply custom fonts
  fonts: configureFonts({ config: fontConfig }),

  // Customize roundness
  roundness: 12,

  // Animation
  animation: {
    scale: 1.0,
  },

  // Custom properties for your app
  custom: {
    gradients: {
      primary: ["#FF6B8B", "#FF8E8E"],
      secondary: ["#7B68EE", "#A191F4"],
      tertiary: ["#4ECDC4", "#92E3DD"],
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    shadows: {
      small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.0,
        elevation: 3,
      },
      large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 5.0,
        elevation: 5,
      },
    },
  },
};

export default GLAMAITheme;
