// Font configuration for Dorminder app
// This provides consistent font families throughout the app

import { Platform } from 'react-native';

// Helper to check if font is loaded (will use system font as fallback)
const getFontFamily = (fontName, fallback) => {
  try {
    return fontName;
  } catch {
    return fallback;
  }
};

export const fonts = {
  // Primary font family - Newsreader with fallbacks
  primary: Platform.select({
    ios: 'Newsreader-Regular',
    android: 'Newsreader-Regular',
    default: 'System'
  }),
  
  // Font weights - Using exact names as registered in App.js with system fallbacks
  regular: Platform.select({
    ios: 'Newsreader-Regular',
    android: 'Newsreader-Regular', 
    default: 'System'
  }),
  
  medium: Platform.select({
    ios: 'Newsreader-Medium',
    android: 'Newsreader-Medium',
    default: 'System'
  }),
  
  semiBold: Platform.select({
    ios: 'Newsreader-SemiBold',
    android: 'Newsreader-SemiBold',
    default: 'System'
  }),
  
  bold: Platform.select({
    ios: 'Newsreader-Bold',
    android: 'Newsreader-Bold',
    default: 'System'
  }),
  
  // Fallback fonts (system fonts similar to Newsreader)
  fallback: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, serif',
    default: 'serif'
  })
};

// Common text styles with Newsreader font
export const textStyles = {
  // Headers
  h1: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  
  // Body text
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 26,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Labels and UI text
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonLarge: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
};
