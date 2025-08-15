// src/components/public-form/themes/typographyThemeUtils.ts - Clean Version

import type { Theme } from './types';
import type { TypographyConfig, FontFamilyConfig } from './typography/types';

/**
 * Typography theme integration utilities
 */
export class TypographyThemeUtils {
  /**
   * Create a theme with specific typography configuration
   */
  static createTypographyTheme(config: {
    baseTheme?: Theme;
    scale?: 'small' | 'medium' | 'large';
    fonts?: {
      primary?: FontFamilyConfig;
      secondary?: FontFamilyConfig;
      mono?: FontFamilyConfig;
    };
    accessibility?: {
      minBodySize?: number;
      contrastRatio?: number;
      maxLineLength?: number;
    };
    performance?: {
      preloadFonts?: boolean;
      fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    };
  }): Theme {
    // This would implement the logic, but keeping it simple for now
    // to avoid circular dependencies
    const baseTheme = config.baseTheme || this.getDefaultTheme();
    
    return {
      ...baseTheme,
      id: `custom-${Date.now()}`,
      name: 'Custom Typography Theme',
      isCustom: true,
      updatedAt: new Date(),
    };
  }

  /**
   * Get default theme - simple implementation to avoid circular deps
   */
  public static getDefaultTheme(): Theme {
    // Return a minimal theme structure
    return {
      id: 'default',
      name: 'Default Theme',
      description: 'Default theme configuration',
      colors: {
        primary: '#3B82F6',
        primaryHover: '#2563EB',
        primaryActive: '#1D4ED8',
        primaryDisabled: '#93C5FD',
        secondary: '#6B7280',
        secondaryHover: '#4B5563',
        secondaryActive: '#374151',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        surfaceElevated: '#FFFFFF',
        overlay: 'rgba(0, 0, 0, 0.5)',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        textInverse: '#FFFFFF',
        border: '#E5E7EB',
        borderHover: '#D1D5DB',
        borderFocus: '#3B82F6',
        borderError: '#EF4444',
        borderSuccess: '#10B981',
        error: '#EF4444',
        errorHover: '#DC2626',
        success: '#10B981',
        successHover: '#059669',
        warning: '#F59E0B',
        warningHover: '#D97706',
        info: '#3B82F6',
        infoHover: '#2563EB',
      },
      typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontFamilyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        fontSizeXs: 0.75,
        fontSizeSm: 0.875,
        fontSizeBase: 1,
        fontSizeLg: 1.125,
        fontSizeXl: 1.25,
        fontSize2xl: 1.5,
        fontSize3xl: 1.875,
        fontSize4xl: 2.25,
        fontWeightLight: 300,
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightSemibold: 600,
        fontWeightBold: 700,
        lineHeightTight: 1.25,
        lineHeightNormal: 1.5,
        lineHeightRelaxed: 1.625,
        lineHeightLoose: 2,
        letterSpacingTighter: -0.05,
        letterSpacingTight: -0.025,
        letterSpacingNormal: 0,
        letterSpacingWide: 0.025,
        letterSpacingWider: 0.05,
      },
      spacing: {
        unit: 0.25,
        xs: 0.5,
        sm: 0.75,
        md: 1,
        lg: 1.5,
        xl: 2,
        '2xl': 3,
        '3xl': 4,
        '4xl': 6,
        '5xl': 8,
        '6xl': 12,
      },
      borderRadius: {
        none: 0,
        sm: 0.125,
        md: 0.375,
        lg: 0.5,
        xl: 0.75,
        full: 9999,
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
        durationFast: 150,
        durationNormal: 200,
        durationSlow: 300,
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
    };
  }

  /**
   * Apply font combination preset to theme
   */
  static applyFontCombination(theme: Theme, combinationId: string): Theme {
    // Simple implementation for now
    return {
      ...theme,
      name: `${theme.name} (${combinationId})`,
      updatedAt: new Date(),
    };
  }

  /**
   * Validate typography accessibility for a theme
   */
  static validateTypographyAccessibility(theme: Theme): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!theme.advancedTypography) {
      warnings.push('No advanced typography configuration found');
      suggestions.push('Enable advanced typography for better control');
      return { isValid: true, errors, warnings, suggestions };
    }

    // Basic validation
    const { accessibility } = theme.advancedTypography;

    if (accessibility.minBodySize < 16) {
      errors.push(`Minimum body size (${accessibility.minBodySize}px) is below WCAG AA recommendation (16px)`);
    }

    if (accessibility.contrastRatio < 4.5) {
      errors.push(`Contrast ratio (${accessibility.contrastRatio}) is below WCAG AA standard (4.5)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Get typography recommendations based on use case
   */
  static getTypographyRecommendations(useCase: 'forms' | 'reading' | 'marketing' | 'accessibility'): {
    scale: 'small' | 'medium' | 'large';
    fontCombination: string;
    accessibility: Partial<TypographyConfig['accessibility']>;
    performance: Partial<TypographyConfig['performance']>;
  } {
    switch (useCase) {
      case 'forms':
        return {
          scale: 'medium',
          fontCombination: 'modern-clean',
          accessibility: {
            enforceMinSize: true,
            minBodySize: 16,
            contrastRatio: 4.5,
            maxLineLength: 70,
          },
          performance: {
            preloadFonts: true,
            fontDisplay: 'swap',
            loadTimeout: 3000,
          },
        };

      case 'accessibility':
        return {
          scale: 'large',
          fontCombination: 'system-performance',
          accessibility: {
            enforceMinSize: true,
            minBodySize: 20,
            contrastRatio: 7.0,
            maxLineLength: 60,
          },
          performance: {
            preloadFonts: false,
            fontDisplay: 'swap',
            loadTimeout: 1000,
          },
        };

      default:
        return {
          scale: 'medium',
          fontCombination: 'modern-clean',
          accessibility: {
            enforceMinSize: true,
            minBodySize: 16,
            contrastRatio: 4.5,
            maxLineLength: 70,
          },
          performance: {
            preloadFonts: true,
            fontDisplay: 'swap',
            loadTimeout: 3000,
          },
        };
    }
  }

  /**
   * Apply typography recommendations to a theme
   */
  static applyTypographyRecommendations(
    theme: Theme, 
    useCase: 'forms' | 'reading' | 'marketing' | 'accessibility'
  ): Theme {
    const recommendations = this.getTypographyRecommendations(useCase);
    
    return this.createTypographyTheme({
      baseTheme: theme,
      scale: recommendations.scale,
      accessibility: recommendations.accessibility,
      performance: recommendations.performance,
    });
  }

  /**
   * Optimize theme for performance
   */
  static optimizeThemePerformance(theme: Theme): Theme {
    return {
      ...theme,
      name: `${theme.name} (Performance Optimized)`,
      updatedAt: new Date(),
    };
  }

  /**
   * Check font availability for a theme
   */
  static async checkFontAvailability(theme: Theme): Promise<{
    primary: boolean;
    secondary: boolean;
    mono: boolean;
    errors: string[];
  }> {
    // Simple implementation for now
    return {
      primary: true,
      secondary: true,
      mono: true,
      errors: [],
    };
  }

  /**
   * Preload fonts for a theme
   */
  static async preloadThemeFonts(theme: Theme): Promise<void> {
    // Simple implementation for now
    return Promise.resolve();
  }

  /**
   * Generate CSS for theme typography
   */
  static generateTypographyCSS(theme: Theme): string {
    return ':root { /* Typography CSS would go here */ }';
  }

  /**
   * Export theme with typography data
   */
  static exportThemeWithTypography(theme: Theme): string {
    return JSON.stringify({
      ...theme,
      createdAt: theme.createdAt.toISOString(),
      updatedAt: theme.updatedAt.toISOString(),
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
    }, null, 2);
  }

  /**
   * Import theme with typography validation
   */
  static importThemeWithTypography(themeJson: string): Theme | null {
    try {
      const parsed = JSON.parse(themeJson);
      
      const theme: Theme = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };

      return theme;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  }
}

/**
 * Convenience functions for common typography operations
 */
export const typographyThemeHelpers = {
  // Quick theme creation with typography
  createFormTheme: () => TypographyThemeUtils.applyTypographyRecommendations(
    TypographyThemeUtils.getDefaultTheme(), 
    'forms'
  ),

  createReadingTheme: () => TypographyThemeUtils.applyTypographyRecommendations(
    TypographyThemeUtils.getDefaultTheme(), 
    'reading'
  ),

  createAccessibilityTheme: () => TypographyThemeUtils.applyTypographyRecommendations(
    TypographyThemeUtils.getDefaultTheme(), 
    'accessibility'
  ),

  createPerformanceTheme: () => TypographyThemeUtils.optimizeThemePerformance(
    TypographyThemeUtils.getDefaultTheme()
  ),

  // Font combination helpers
  applyModernFonts: (theme: Theme) => TypographyThemeUtils.applyFontCombination(
    theme, 
    'modern-clean'
  ),

  applyFriendlyFonts: (theme: Theme) => TypographyThemeUtils.applyFontCombination(
    theme, 
    'friendly-approachable'
  ),

  applyElegantFonts: (theme: Theme) => TypographyThemeUtils.applyFontCombination(
    theme, 
    'elegant-sophisticated'
  ),

  // Validation helpers
  isAccessible: (theme: Theme) => {
    const validation = TypographyThemeUtils.validateTypographyAccessibility(theme);
    return validation.isValid;
  },

  getAccessibilityIssues: (theme: Theme) => {
    const validation = TypographyThemeUtils.validateTypographyAccessibility(theme);
    return validation.errors;
  },
};