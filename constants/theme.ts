import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

/**
 * @const COLORS
 * @description A collection of color constants used throughout the application.
 */
export const COLORS = {
  // Primary colors
  primary: '#1E88E5',
  lightPrimary: '#E3F2FD',
  darkPrimary: '#1565C0',
  
  // Secondary colors
  secondary: '#43A047',
  lightSecondary: '#E8F5E9',
  darkSecondary: '#2E7D32',
  
  // Accent colors
  accent: '#FB8C00',
  lightAccent: '#FFF3E0',
  darkAccent: '#EF6C00',
  
  // Status colors
  success: '#4CAF50',
  lightSuccess: '#E8F5E9',
  darkSuccess: '#388E3C',
  
  warning: '#FFC107',
  lightWarning: '#FFF8E1',
  darkWarning: '#FFA000',
  
  error: '#F44336',
  lightError: '#FFEBEE',
  darkError: '#D32F2F',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  gray: '#9E9E9E',
  lightGray: '#F5F5F5',
  darkGray: '#616161',
  
  // Background
  background: '#F9FAFB',
  
  // Transparent
  transparent: 'transparent',
};

/**
 * @const SIZES
 * @description A collection of size constants used for layout and typography.
 */
export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,
  
  // Font sizes
  largeTitle: 32,
  h1: 30,
  h2: 24,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  
  // App dimensions
  width,
  height,
};

/**
 * @const FONTS
 * @description A collection of font styles used for typography.
 */
export const FONTS = {
  largeTitle: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.largeTitle, lineHeight: 40 },
  h1: { fontFamily: 'Poppins_700Bold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Poppins_600SemiBold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Poppins_600SemiBold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Poppins_500Medium', fontSize: SIZES.h4, lineHeight: 20 },
  h5: { fontFamily: 'Poppins_500Medium', fontSize: SIZES.h5, lineHeight: 18 },
  body1: { fontFamily: 'Inter_400Regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Inter_400Regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Inter_400Regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Inter_400Regular', fontSize: SIZES.body4, lineHeight: 18 },
  body5: { fontFamily: 'Inter_400Regular', fontSize: SIZES.body5, lineHeight: 16 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;