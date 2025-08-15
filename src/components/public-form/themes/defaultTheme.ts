// src/components/public-form/themes/defaultTheme.ts - Updated with Typography Integration

import { Theme } from './types';
import { TypographyConfig } from './typography/types';
import { defaultFormTypographyMapping } from './typography/cssGenerator';
import { typographyScales } from './typography/scales';
import { defaultFonts } from './typography/fontPresets';
import { systemFonts } from './typography/fontPresets';

/**
 * Create default advanced typography configuration
 */
const createDefaultAdvancedTypography = (): TypographyConfig => ({
  scale: 'medium',
  primary: defaultFonts.primary,
  secondary: defaultFonts.secondary,
  mono: defaultFonts.mono,
  mapping: defaultFormTypographyMapping,
  responsive: {
    enableScaling: true,
    breakpoints: {
      sm: 0.875,
      md: 1.0,
      lg: 1.125,
    },
  },
  accessibility: {
    enforceMinSize: true,
    minBodySize: 16,
    maxLineLength: 75,
    contrastRatio: 4.5,
  },
  performance: {
    preloadFonts: true,
    fontDisplay: 'swap',
    loadTimeout: 3000,
  },
});

export const createDefaultTheme = (): Theme => ({
  id: 'default',
  name: 'Default Theme',
  description: 'Clean and modern theme with excellent accessibility',
  
  colors: {
    // Primary colors
    primary: '#3B82F6',           // Blue 500
    primaryHover: '#2563EB',      // Blue 600
    primaryActive: '#1D4ED8',     // Blue 700
    primaryDisabled: '#93C5FD',   // Blue 300
    
    // Secondary colors
    secondary: '#6B7280',         // Gray 500
    secondaryHover: '#4B5563',    // Gray 600
    secondaryActive: '#374151',   // Gray 700
    
    // Background colors
    background: '#FFFFFF',        // White
    surface: '#F9FAFB',          // Gray 50
    surfaceElevated: '#FFFFFF',   // White
    overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    
    // Text colors
    textPrimary: '#111827',       // Gray 900
    textSecondary: '#6B7280',     // Gray 500
    textMuted: '#9CA3AF',         // Gray 400
    textInverse: '#FFFFFF',       // White
    
    // Border colors
    border: '#E5E7EB',           // Gray 200
    borderHover: '#D1D5DB',      // Gray 300
    borderFocus: '#3B82F6',      // Blue 500
    borderError: '#EF4444',      // Red 500
    borderSuccess: '#10B981',    // Emerald 500
    
    // State colors
    error: '#EF4444',            // Red 500
    errorHover: '#DC2626',       // Red 600
    success: '#10B981',          // Emerald 500
    successHover: '#059669',     // Emerald 600
    warning: '#F59E0B',          // Amber 500
    warningHover: '#D97706',     // Amber 600
    info: '#3B82F6',             // Blue 500
    infoHover: '#2563EB',        // Blue 600
  },
  
  typography: {
    // Font families
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    
    // Font sizes (in rem)
    fontSizeXs: 0.75,    // 12px
    fontSizeSm: 0.875,   // 14px
    fontSizeBase: 1,     // 16px
    fontSizeLg: 1.125,   // 18px
    fontSizeXl: 1.25,    // 20px
    fontSize2xl: 1.5,    // 24px
    fontSize3xl: 1.875,  // 30px
    fontSize4xl: 2.25,   // 36px
    
    // Font weights
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    
    // Line heights
    lineHeightTight: 1.25,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.625,
    lineHeightLoose: 2,
    
    // Letter spacing (in em)
    letterSpacingTighter: -0.05,
    letterSpacingTight: -0.025,
    letterSpacingNormal: 0,
    letterSpacingWide: 0.025,
    letterSpacingWider: 0.05,
  },
  
  // Advanced typography configuration
  advancedTypography: createDefaultAdvancedTypography(),
  
  spacing: {
    // Base spacing unit (in rem)
    unit: 0.25,  // 4px
    
    // Spacing scale (in rem)
    xs: 0.5,     // 8px
    sm: 0.75,    // 12px
    md: 1,       // 16px
    lg: 1.5,     // 24px
    xl: 2,       // 32px
    '2xl': 3,    // 48px
    '3xl': 4,    // 64px
    '4xl': 6,    // 96px
    '5xl': 8,    // 128px
    '6xl': 12,   // 192px
  },
  
  borderRadius: {
    none: 0,
    sm: 0.125,   // 2px
    md: 0.375,   // 6px
    lg: 0.5,     // 8px
    xl: 0.75,    // 12px
    full: 9999,  // Full rounded
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  transitions: {
    // Duration (in ms)
    durationFast: 150,
    durationNormal: 200,
    durationSlow: 300,
    
    // Easing functions
    easingLinear: 'linear',
    easingEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easingEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easingEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easingElastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    modal: 1050,
    popover: 1100,
    tooltip: 1150,
    toast: 1200,
    overlay: 1250,
  },
  
  isDark: false,
  isCustom: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const createDarkTheme = (): Theme => {
  const baseTheme = createDefaultTheme();
  
  return {
    ...baseTheme,
    
    id: 'dark',
    name: 'Dark Theme',
    description: 'Modern dark theme optimized for low-light environments',
    
    colors: {
      // Primary colors (same as light)
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      primaryActive: '#1D4ED8',
      primaryDisabled: '#1E3A8A',
      
      // Secondary colors
      secondary: '#9CA3AF',
      secondaryHover: '#D1D5DB',
      secondaryActive: '#F3F4F6',
      
      // Background colors
      background: '#111827',        // Gray 900
      surface: '#1F2937',          // Gray 800
      surfaceElevated: '#374151',   // Gray 700
      overlay: 'rgba(0, 0, 0, 0.8)', // Darker overlay
      
      // Text colors
      textPrimary: '#F9FAFB',       // Gray 50
      textSecondary: '#D1D5DB',     // Gray 300
      textMuted: '#9CA3AF',         // Gray 400
      textInverse: '#111827',       // Gray 900
      
      // Border colors
      border: '#374151',           // Gray 700
      borderHover: '#4B5563',      // Gray 600
      borderFocus: '#3B82F6',      // Blue 500
      borderError: '#EF4444',      // Red 500
      borderSuccess: '#10B981',    // Emerald 500
      
      // State colors (same as light)
      error: '#EF4444',
      errorHover: '#F87171',
      success: '#10B981',
      successHover: '#34D399',
      warning: '#F59E0B',
      warningHover: '#FBBF24',
      info: '#3B82F6',
      infoHover: '#60A5FA',
    },
    
    isDark: true,
  };
};

/**
 * Create theme with custom typography scale
 */
export const createThemeWithTypographyScale = (
  baseTheme: Theme,
  scale: 'small' | 'medium' | 'large'
): Theme => {
  if (!baseTheme.advancedTypography) {
    return baseTheme;
  }

  return {
    ...baseTheme,
    advancedTypography: {
      ...baseTheme.advancedTypography,
      scale,
      customScale: typographyScales[scale],
    },
    updatedAt: new Date(),
  };
};

/**
 * Create theme with custom font families
 */
export const createThemeWithFonts = (
  baseTheme: Theme,
  fonts: {
    primary?: typeof defaultFonts.primary;
    secondary?: typeof defaultFonts.secondary;
    mono?: typeof defaultFonts.mono;
  }
): Theme => {
  if (!baseTheme.advancedTypography) {
    return baseTheme;
  }

  return {
    ...baseTheme,
    advancedTypography: {
      ...baseTheme.advancedTypography,
      primary: fonts.primary || baseTheme.advancedTypography.primary,
      secondary: fonts.secondary || baseTheme.advancedTypography.secondary,
      mono: fonts.mono || baseTheme.advancedTypography.mono,
    },
    // Update basic typography for backward compatibility
    typography: {
      ...baseTheme.typography,
      fontFamily: fonts.primary ? 
        [fonts.primary.family, ...fonts.primary.fallbacks].join(', ') : 
        baseTheme.typography.fontFamily,
      fontFamilyMono: fonts.mono ? 
        [fonts.mono.family, ...fonts.mono.fallbacks].join(', ') : 
        baseTheme.typography.fontFamilyMono,
    },
    updatedAt: new Date(),
  };
};

/**
 * Theme presets with different typography configurations
 */
export const themePresets = {
  // Default themes
  default: createDefaultTheme(),
  dark: createDarkTheme(),
  
  // Typography scale variants
  defaultSmall: createThemeWithTypographyScale(createDefaultTheme(), 'small'),
  defaultLarge: createThemeWithTypographyScale(createDefaultTheme(), 'large'),
  darkSmall: createThemeWithTypographyScale(createDarkTheme(), 'small'),
  darkLarge: createThemeWithTypographyScale(createDarkTheme(), 'large'),
  
  // High contrast themes for accessibility
  highContrast: (): Theme => {
    const theme = createDefaultTheme();
    return {
      ...theme,
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'High contrast theme for accessibility',
      colors: {
        ...theme.colors,
        primary: '#000000',
        primaryHover: '#333333',
        primaryActive: '#000000',
        background: '#FFFFFF',
        textPrimary: '#000000',
        border: '#000000',
        borderFocus: '#000000',
      },
      advancedTypography: theme.advancedTypography ? {
        ...theme.advancedTypography,
        accessibility: {
          ...theme.advancedTypography.accessibility,
          contrastRatio: 7.0, // WCAG AAA level
          enforceMinSize: true,
          minBodySize: 18, // Larger minimum for high contrast
        },
      } : undefined,
    };
  },
  
  // Performance optimized theme (system fonts only)
  performance: (): Theme => {
    const theme = createDefaultTheme();
    
    return createThemeWithFonts(theme, {
      primary: systemFonts[0], // System UI
      secondary: systemFonts[0], // System UI
      mono: systemFonts[4], // Courier New
    });
  },
};

export const defaultTheme = createDefaultTheme();
export const darkTheme = createDarkTheme();