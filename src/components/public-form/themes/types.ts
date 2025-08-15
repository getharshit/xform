// src/components/public-form/themes/types.ts - Extended with Button Customization

import { TypographyConfig } from './typography/types';
import { ButtonCustomization } from './buttons/types';
import { ColorPalette } from './colors/types';
import { LogoConfig } from './logos/types';           // ADD THIS
import { BackgroundConfig } from './backgrounds/types';

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
    backgroundType?: 'solid' | 'gradient' | 'pattern';
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

export interface ThemeBorderRadius {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}

export interface ThemeShadows {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
}

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

export interface ThemeBreakpoints {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}

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

// Extended theme configuration with button customization
export interface Theme {
    id: string;
    name: string;
    description?: string;
    colors: ThemeColors;
    typography: ThemeTypography;
    advancedTypography?: TypographyConfig; // Optional advanced typography configuration
    buttonCustomization?: ButtonCustomization; // NEW: Button customization
    colorPalette?: ColorPalette; // NEW: Extended color palette
    logoConfig?: LogoConfig;              // NEW
    backgroundConfig?: BackgroundConfig;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    shadows: ThemeShadows;
    transitions: ThemeTransitions;
    breakpoints: ThemeBreakpoints;
    zIndex: ThemeZIndex;
    isDark: boolean;
    isCustom: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Theme state management with typography and button customization
export interface ThemeState {
    currentTheme: Theme;
    isLoading: boolean;
    error: string | null;
    previewMode: boolean;
    previewTheme: Theme | null;
    hasUnsavedChanges: boolean;
    // Typography-specific state
    typographyLoading: boolean;
    fontLoadingStates: Map<string, 'loading' | 'loaded' | 'error'>;
}

export type ThemeAction =
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'UPDATE_THEME'; payload: Partial<Theme> }
    | { type: 'UPDATE_TYPOGRAPHY'; payload: Partial<TypographyConfig> }
    | { type: 'UPDATE_BUTTON_CUSTOMIZATION'; payload: Partial<ButtonCustomization> } // NEW
    | { type: 'UPDATE_COLOR_PALETTE'; payload: Partial<ColorPalette> } // NEW
    | { type: 'SET_FONT_LOADING_STATE'; payload: { fontFamily: string; state: 'loading' | 'loaded' | 'error' } }
    | { type: 'SET_PREVIEW_MODE'; payload: boolean }
    | { type: 'SET_PREVIEW_THEME'; payload: Theme | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_TYPOGRAPHY_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_THEME' }
    | { type: 'SAVE_THEME' };

// Extended CSS Custom Properties to include button and extended color properties
export interface CSSCustomProperties {
    // Colors
    '--form-color-primary': string;
    '--form-color-primary-hover': string;
    '--form-color-primary-active': string;
    '--form-color-primary-disabled': string;
    '--form-color-secondary': string;
    '--form-color-secondary-hover': string;
    '--form-color-secondary-active': string;
    '--form-color-background': string;
    '--form-color-surface': string;
    '--form-color-surface-elevated': string;
    '--form-color-overlay': string;
    '--form-color-text-primary': string;
    '--form-color-text-secondary': string;
    '--form-color-text-muted': string;
    '--form-color-text-inverse': string;
    '--form-color-border': string;
    '--form-color-border-hover': string;
    '--form-color-border-focus': string;
    '--form-color-border-error': string;
    '--form-color-border-success': string;
    '--form-color-error': string;
    '--form-color-error-hover': string;
    '--form-color-success': string;
    '--form-color-success-hover': string;
    '--form-color-warning': string;
    '--form-color-warning-hover': string;
    '--form-color-info': string;
    '--form-color-info-hover': string;
    
    // Extended color palette properties (NEW)
    '--form-color-tertiary'?: string;
    '--form-color-text-tertiary'?: string;
    '--form-color-selection'?: string;
    
    // Button customization properties (NEW)
    '--form-button-border-radius'?: string;
    '--form-button-border-width'?: string;
    '--form-button-font-weight'?: string;
    '--form-button-transition-duration'?: string;
    '--form-button-hover-scale'?: string;
    '--form-button-min-height'?: string;
    '--form-button-focus-ring-width'?: string;
    '--form-button-hover-opacity'?: string;
    '--form-button-active-opacity'?: string;
    '--form-button-disabled-opacity'?: string;
    '--form-button-padding-multiplier'?: string;
    
    // Basic Typography (for backward compatibility)
    '--form-font-family': string;
    '--form-font-family-mono': string;
    '--form-font-size-xs': string;
    '--form-font-size-sm': string;
    '--form-font-size-base': string;
    '--form-font-size-lg': string;
    '--form-font-size-xl': string;
    '--form-font-size-2xl': string;
    '--form-font-size-3xl': string;
    '--form-font-size-4xl': string;
    '--form-font-weight-light': string;
    '--form-font-weight-normal': string;
    '--form-font-weight-medium': string;
    '--form-font-weight-semibold': string;
    '--form-font-weight-bold': string;
    '--form-line-height-tight': string;
    '--form-line-height-normal': string;
    '--form-line-height-relaxed': string;
    '--form-line-height-loose': string;
    '--form-letter-spacing-tighter': string;
    '--form-letter-spacing-tight': string;
    '--form-letter-spacing-normal': string;
    '--form-letter-spacing-wide': string;
    '--form-letter-spacing-wider': string;
    
    // Advanced Typography Properties (optional)
    '--form-font-primary'?: string;
    '--form-font-secondary'?: string;
    '--form-font-mono-advanced'?: string;
    
    // Element-specific typography (optional)
    '--form-font-size-form-title'?: string;
    '--form-font-size-form-description'?: string;
    '--form-font-size-section-title'?: string;
    '--form-font-size-question-label'?: string;
    '--form-font-size-question-description'?: string;
    '--form-font-size-input-text'?: string;
    '--form-font-size-input-placeholder'?: string;
    '--form-font-size-button-text'?: string;
    '--form-font-size-help-text'?: string;
    '--form-font-size-error-text'?: string;
    '--form-font-size-success-text'?: string;
    '--form-font-size-caption'?: string;
    '--form-font-size-legal'?: string;
    
    // Line heights for elements (optional)
    '--form-line-height-form-title'?: string;
    '--form-line-height-form-description'?: string;
    '--form-line-height-section-title'?: string;
    '--form-line-height-question-label'?: string;
    '--form-line-height-question-description'?: string;
    '--form-line-height-input-text'?: string;
    '--form-line-height-button-text'?: string;
    '--form-line-height-help-text'?: string;
    '--form-line-height-error-text'?: string;
    '--form-line-height-success-text'?: string;
    '--form-line-height-caption'?: string;
    '--form-line-height-legal'?: string;
    
    // Letter spacing for elements (optional)
    '--form-letter-spacing-form-title'?: string;
    '--form-letter-spacing-form-description'?: string;
    '--form-letter-spacing-section-title'?: string;
    '--form-letter-spacing-question-label'?: string;
    '--form-letter-spacing-question-description'?: string;
    '--form-letter-spacing-input-text'?: string;
    '--form-letter-spacing-button-text'?: string;
    '--form-letter-spacing-help-text'?: string;
    '--form-letter-spacing-error-text'?: string;
    '--form-letter-spacing-success-text'?: string;
    '--form-letter-spacing-caption'?: string;
    '--form-letter-spacing-legal'?: string;
    
    // Font weights for elements (optional)
    '--form-font-weight-form-title'?: string;
    '--form-font-weight-form-description'?: string;
    '--form-font-weight-section-title'?: string;
    '--form-font-weight-question-label'?: string;
    '--form-font-weight-question-description'?: string;
    '--form-font-weight-input-text'?: string;
    '--form-font-weight-button-text'?: string;
    '--form-font-weight-help-text'?: string;
    '--form-font-weight-error-text'?: string;
    '--form-font-weight-success-text'?: string;
    '--form-font-weight-caption'?: string;
    '--form-font-weight-legal'?: string;
    
    // Responsive modifiers (optional)
    '--form-font-scale-sm'?: string;
    '--form-font-scale-md'?: string;
    '--form-font-scale-lg'?: string;
    
    // Spacing
    '--form-spacing-unit': string;
    '--form-spacing-xs': string;
    '--form-spacing-sm': string;
    '--form-spacing-md': string;
    '--form-spacing-lg': string;
    '--form-spacing-xl': string;
    '--form-spacing-2xl': string;
    '--form-spacing-3xl': string;
    '--form-spacing-4xl': string;
    '--form-spacing-5xl': string;
    '--form-spacing-6xl': string;
    
    // Border radius
    '--form-border-radius-none': string;
    '--form-border-radius-sm': string;
    '--form-border-radius-md': string;
    '--form-border-radius-lg': string;
    '--form-border-radius-xl': string;
    '--form-border-radius-full': string;
    
    // Shadows
    '--form-shadow-none': string;
    '--form-shadow-sm': string;
    '--form-shadow-md': string;
    '--form-shadow-lg': string;
    '--form-shadow-xl': string;
    '--form-shadow-2xl': string;
    '--form-shadow-inner': string;
    
    // Transitions
    '--form-transition-duration-fast': string;
    '--form-transition-duration-normal': string;
    '--form-transition-duration-slow': string;
    '--form-transition-easing-linear': string;
    '--form-transition-easing-ease-in': string;
    '--form-transition-easing-ease-out': string;
    '--form-transition-easing-ease-in-out': string;
    '--form-transition-easing-bounce': string;
    '--form-transition-easing-elastic': string;
    
    // Z-index
    '--form-z-index-auto': string;
    '--form-z-index-base': string;
    '--form-z-index-dropdown': string;
    '--form-z-index-modal': string;
    '--form-z-index-popover': string;
    '--form-z-index-tooltip': string;
    '--form-z-index-toast': string;
    '--form-z-index-overlay': string;
}

// Theme validation schema
export interface ThemeValidationError {
    field: string;
    message: string;
    value?: any;
}

export interface ThemeValidationResult {
    isValid: boolean;
    errors: ThemeValidationError[];
}

// Theme persistence options
export interface ThemePersistenceOptions {
    key: string;
    storage: 'localStorage' | 'sessionStorage';
    serializer: {
        stringify: (value: any) => string;
        parse: (value: string) => any;
    };
    debounceMs: number;
}

// Enhanced theme context value with typography and button customization support
export interface ThemeContextValue {
    // Current state
    state: ThemeState;
    
    // Theme management
    setTheme: (theme: Theme) => void;
    updateTheme: (updates: Partial<Theme>) => void;
    resetTheme: () => void;
    
    // Typography management
    updateTypography: (updates: Partial<TypographyConfig>) => void;
    resetTypography: () => void;
    
    // Button customization management (NEW)
    updateButtonCustomization: (updates: Partial<ButtonCustomization>) => void;
    resetButtonCustomization: () => void;
    
    // Color palette management (NEW)
    updateColorPalette: (updates: Partial<ColorPalette>) => void;
    resetColorPalette: () => void;
    
    // Preview mode
    enablePreviewMode: (theme: Theme) => void;
    disablePreviewMode: () => void;
    commitPreview: () => void;
    
    // Persistence
    saveTheme: () => Promise<void>;
    loadTheme: (themeId: string) => Promise<void>;
    
    // Utilities
    validateTheme: (theme: Partial<Theme>) => ThemeValidationResult;
    generateCSSProperties: (theme: Theme) => CSSCustomProperties;

    // File upload methods (NEW)
    uploadLogo: (file: File) => Promise<void>;
    uploadBackground: (file: File) => Promise<void>;
    
    // Error handling
    clearError: () => void;
}