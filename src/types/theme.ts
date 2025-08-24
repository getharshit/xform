// src/types/theme.ts - Unified Theme System Types
// Consolidates theme interfaces from both src/types/form.ts and src/components/public-form/themes/types.ts

import { FormCustomization } from './customization';

/**
 * Basic form theme configuration (legacy compatibility)
 * Simplified theme interface from form.ts
 */
export interface BasicFormTheme {
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontFamily: string;
  fontSize?: {
    title?: number;
    question?: number;
    input?: number;
    small?: number;
  };
  fontWeight?: {
    normal?: number;
    medium?: number;
    bold?: number;
  };
  borderRadius?: number;
  spacing?: number;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  showQuestionNumbers?: boolean;
  showProgressBar?: boolean;
  centerForm?: boolean;
  logoUrl?: string;
}

/**
 * Extended theme colors with comprehensive color system
 * Enhanced from both type systems
 */
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryDisabled: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  
  // Background colors
  background: string;
  surface: string;
  surfaceElevated: string;
  overlay: string;
  
  // Background type and configuration
  backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image' | 'animated';
  backgroundValue?: string;
  backgroundPattern?: string;
  backgroundGradientDirection?: string;
  backgroundGradientColor1?: string;
  backgroundGradientColor2?: string;
  backgroundPatternColor?: string;
  backgroundPatternSize?: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderHover: string;
  borderFocus: string;
  borderError: string;
  borderSuccess: string;
  
  // State colors
  error: string;
  errorHover: string;
  success: string;
  successHover: string;
  warning: string;
  warningHover: string;
  info: string;
  infoHover: string;
}

/**
 * Theme typography configuration
 */
export interface ThemeTypography {
  // Font families
  fontFamily: string;
  fontFamilyMono: string;
  
  // Font sizes (in rem)
  fontSizeXs: number;
  fontSizeSm: number;
  fontSizeBase: number;
  fontSizeLg: number;
  fontSizeXl: number;
  fontSize2xl: number;
  fontSize3xl: number;
  fontSize4xl: number;
  
  // Font weights
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  
  // Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  lineHeightLoose: number;
  
  // Letter spacing (in em)
  letterSpacingTighter: number;
  letterSpacingTight: number;
  letterSpacingNormal: number;
  letterSpacingWide: number;
  letterSpacingWider: number;
}

/**
 * Theme spacing configuration
 */
export interface ThemeSpacing {
  // Base spacing unit (in rem)
  unit: number;
  
  // Spacing scale
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
  '6xl': number;
}

/**
 * Border radius configuration
 */
export interface ThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

/**
 * Shadow configuration
 */
export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

/**
 * Transition and animation configuration
 */
export interface ThemeTransitions {
  // Duration (in ms)
  durationFast: number;
  durationNormal: number;
  durationSlow: number;
  
  // Easing functions
  easingLinear: string;
  easingEaseIn: string;
  easingEaseOut: string;
  easingEaseInOut: string;
  easingBounce: string;
  easingElastic: string;
}

/**
 * Responsive breakpoints
 */
export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Z-index configuration
 */
export interface ThemeZIndex {
  auto: string;
  base: number;
  dropdown: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
  overlay: number;
}

/**
 * Advanced form theme with comprehensive customization
 * Unified theme structure combining both type systems
 */
export interface FormTheme {
  // Theme metadata
  id: string;
  name: string;
  description?: string;
  
  // Core theme configuration
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
  breakpoints: ThemeBreakpoints;
  zIndex: ThemeZIndex;
  
  // Advanced customization integration
  customization?: FormCustomization;
  
  // Theme properties
  isDark: boolean;
  isCustom: boolean;
  isDefault?: boolean;
  previewImage?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Basic theme properties for simple theming
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  showQuestionNumbers?: boolean;
  showProgressBar?: boolean;
  centerForm?: boolean;
  logoUrl?: string;
}



/**
 * Pre-built theme types for easy selection
 */
export type PrebuiltThemeType = 
  | 'minimal'
  | 'modern' 
  | 'classic'
  | 'colorful'
  | 'dark'
  | 'professional'
  | 'creative'
  | 'compact';

/**
 * Theme category for organization and browsing
 */
export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  themes: FormTheme[];
}

/**
 * Theme customization state management
 */
export interface ThemeCustomizationState {
  currentTheme: FormTheme;
  customizations: Partial<FormCustomization>;
  previewMode: boolean;
  isDirty: boolean; // Has unsaved changes
  originalTheme?: FormTheme; // For reverting changes
}

/**
 * Theme state for advanced theme provider
 */
export interface ThemeState {
  currentTheme: FormTheme;
  isLoading: boolean;
  error: string | null;
  previewMode: boolean;
  previewTheme: FormTheme | null;
  hasUnsavedChanges: boolean;
  
  // Typography-specific state
  typographyLoading: boolean;
  fontLoadingStates: Map<string, 'loading' | 'loaded' | 'error'>;
}

/**
 * Theme actions for state management
 */
export type ThemeAction =
  | { type: 'SET_THEME'; payload: FormTheme }
  | { type: 'UPDATE_THEME'; payload: Partial<FormTheme> }
  | { type: 'UPDATE_COLORS'; payload: Partial<ThemeColors> }
  | { type: 'UPDATE_TYPOGRAPHY'; payload: Partial<ThemeTypography> }
  | { type: 'UPDATE_CUSTOMIZATION'; payload: Partial<FormCustomization> }
  | { type: 'SET_FONT_LOADING_STATE'; payload: { fontFamily: string; state: 'loading' | 'loaded' | 'error' } }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_PREVIEW_THEME'; payload: FormTheme | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TYPOGRAPHY_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_THEME' }
  | { type: 'SAVE_THEME' };

/**
 * CSS Custom Properties interface for theme application
 */
export interface ThemeCSSProperties {
  // Color properties
  '--form-color-primary': string;
  '--form-color-primary-hover': string;
  '--form-color-primary-active': string;
  '--form-color-secondary': string;
  '--form-color-background': string;
  '--form-color-surface': string;
  '--form-color-text-primary': string;
  '--form-color-text-secondary': string;
  '--form-color-border': string;
  '--form-color-error': string;
  '--form-color-success': string;
  
  // Typography properties
  '--form-font-family': string;
  '--form-font-family-mono': string;
  '--form-font-size-base': string;
  '--form-font-size-lg': string;
  '--form-font-size-xl': string;
  '--form-font-weight-normal': string;
  '--form-font-weight-medium': string;
  '--form-font-weight-bold': string;
  
  // Spacing properties
  '--form-spacing-xs': string;
  '--form-spacing-sm': string;
  '--form-spacing-md': string;
  '--form-spacing-lg': string;
  '--form-spacing-xl': string;
  
  // Border radius properties
  '--form-border-radius-sm': string;
  '--form-border-radius-md': string;
  '--form-border-radius-lg': string;
  
  // Shadow properties
  '--form-shadow-sm': string;
  '--form-shadow-md': string;
  '--form-shadow-lg': string;
  
  // Transition properties
  '--form-transition-duration-fast': string;
  '--form-transition-duration-normal': string;
  '--form-transition-easing': string;
  
  // Extended properties for advanced features
  [key: string]: string;
}

/**
 * Theme validation error
 */
export interface ThemeValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Theme validation result
 */
export interface ThemeValidationResult {
  isValid: boolean;
  errors: ThemeValidationError[];
}

/**
 * Theme export/import format
 */
export interface ThemeExportData {
  theme: FormTheme;
  version: string;
  exportedAt: Date;
  exportedBy?: string;
}

/**
 * Theme context value for React context
 */
export interface ThemeContextValue {
  // Current state
  state: ThemeState;
  
  // Theme management
  setTheme: (theme: FormTheme) => void;
  updateTheme: (updates: Partial<FormTheme>) => void;
  updateColors: (colors: Partial<ThemeColors>) => void;
  updateTypography: (typography: Partial<ThemeTypography>) => void;
  updateCustomization: (customization: Partial<FormCustomization>) => void;
  resetTheme: () => void;
  
  // Preview mode
  enablePreviewMode: (theme: FormTheme) => void;
  disablePreviewMode: () => void;
  commitPreview: () => void;
  
  // Persistence
  saveTheme: () => Promise<void>;
  loadTheme: (themeId: string) => Promise<void>;
  exportTheme: () => ThemeExportData;
  importTheme: (data: ThemeExportData) => void;
  
  // Utilities
  validateTheme: (theme: Partial<FormTheme>) => ThemeValidationResult;
  generateCSSProperties: (theme: FormTheme) => ThemeCSSProperties;
  
  // Error handling
  clearError: () => void;
}

// Export backward compatibility types
export type { FormTheme as ExtendedFormTheme };

/**
 * Utility functions for theme conversion
 */
