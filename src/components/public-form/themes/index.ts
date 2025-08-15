// src/components/public-form/themes/index.ts - Complete Version

// Core exports
export * from './types';
export * from './defaultTheme';
export * from './cssProperties';
export * from './themeReducer';

// Button customization exports
export * from './buttons/types';
export { ButtonCustomizer } from './buttons/ButtonCustomizer';

// Color management exports
export * from './colors/types';
export { ColorManager } from './colors/ColorManager';

// CSS generation exports
export { ButtonColorCSSGenerator } from './css/buttonColorGenerator';

// Brand customization exports
export { BrandCustomizationPanel } from './BrandCustomizationPanel';
export * from './hooks/useBrandCustomization';

// Typography system exports
export * from './typography/types';
export * from './typography/fontLoader';
export * from './typography/fontPresets';
export * from './typography/scales';
export * from './typography/cssGenerator';
export * from './typography/TypographyProvider';

// Typography integration utilities
export * from './typographyThemeUtils';

// Enhanced Theme Provider exports with typography
export {
  ThemeProvider,
  useTheme,
  useCurrentTheme,
  useThemeUpdates,
  useThemePreview,
  useCSSProperties,
  useThemeBreakpoints,
  useThemePerformance,
  useTypographyUpdates,
  useTypographyUtils,
  withTheme,
} from './ThemeProvider';

// Separate imports for utility creation
import { cssPropertyUtils } from './cssProperties';
import { themeValidation, themePersistence } from './themeReducer';
import { createDefaultTheme, createDarkTheme, themePresets } from './defaultTheme';
import { TypographyThemeUtils, typographyThemeHelpers } from './typographyThemeUtils';
import { fontCombinations, FontPresetManager } from './typography/fontPresets';
import { typographyScales, TypographyScaleGenerator } from './typography/scales';

// Enhanced utility functions with typography and button/color support
export const themeUtils = {
  // Quick theme application
  applyTheme: cssPropertyUtils.applyTheme,
  resetTheme: cssPropertyUtils.resetTheme,
  
  // Theme validation
  validateTheme: themeValidation.validateTheme,
  
  // Persistence helpers
  saveTheme: themePersistence.saveTheme,
  loadTheme: themePersistence.loadTheme,
  getAllThemes: themePersistence.getAllThemes,
  exportTheme: themePersistence.exportTheme,
  importTheme: themePersistence.importTheme,
  
  // CSS property generation
  generateCSS: cssPropertyUtils.themeToCSS,
  updateTypographyProperties: cssPropertyUtils.updateTypographyProperties,
  
  // Theme creation helpers
  createLightTheme: createDefaultTheme,
  createDarkTheme: createDarkTheme,
  getThemePresets: () => themePresets,

  // Typography utilities
  createTypographyTheme: TypographyThemeUtils.createTypographyTheme,
  applyFontCombination: TypographyThemeUtils.applyFontCombination,
  validateTypographyAccessibility: TypographyThemeUtils.validateTypographyAccessibility,
  getTypographyRecommendations: TypographyThemeUtils.getTypographyRecommendations,
  applyTypographyRecommendations: TypographyThemeUtils.applyTypographyRecommendations,
  optimizeThemePerformance: TypographyThemeUtils.optimizeThemePerformance,
  checkFontAvailability: TypographyThemeUtils.checkFontAvailability,
  preloadThemeFonts: TypographyThemeUtils.preloadThemeFonts,
  generateTypographyCSS: TypographyThemeUtils.generateTypographyCSS,
  exportThemeWithTypography: TypographyThemeUtils.exportThemeWithTypography,
  importThemeWithTypography: TypographyThemeUtils.importThemeWithTypography,
};

// Typography-specific utilities - renamed to avoid conflicts
export const fontUtils = {
  // Font management
  getFontById: FontPresetManager.getFontById,
  getFontsByCategory: FontPresetManager.getFontsByCategory,
  searchFonts: FontPresetManager.searchFonts,
  getRecommendedFonts: FontPresetManager.getRecommendedFonts,
  validateFontAvailability: FontPresetManager.validateFontAvailability,
  
  // Font combinations
  getFontCombinations: () => fontCombinations,
  getFontCombination: FontPresetManager.getFontCombination,
  
  // Typography scales
  getTypographyScales: () => typographyScales,
  generateCustomScale: TypographyScaleGenerator.generateScale,
  
  // Quick helpers
  ...typographyThemeHelpers,
};

// Pre-built theme collections for easy access
export const themeCollections = {
  // Basic themes
  basic: {
    light: themePresets.default,
    dark: themePresets.dark,
    highContrast: themePresets.highContrast(),
    performance: themePresets.performance(),
  },
  
  // Scale variants
  scales: {
    small: {
      light: themePresets.defaultSmall,
      dark: themePresets.darkSmall,
    },
    medium: {
      light: themePresets.default,
      dark: themePresets.dark,
    },
    large: {
      light: themePresets.defaultLarge,
      dark: themePresets.darkLarge,
    },
  },
  
  // Use case optimized themes
  useCase: {
    forms: typographyThemeHelpers.createFormTheme(),
    reading: typographyThemeHelpers.createReadingTheme(),
    accessibility: typographyThemeHelpers.createAccessibilityTheme(),
    performance: typographyThemeHelpers.createPerformanceTheme(),
  },
  
  // Font combination themes
  fonts: {
    modern: typographyThemeHelpers.applyModernFonts(themePresets.default),
    friendly: typographyThemeHelpers.applyFriendlyFonts(themePresets.default),
    elegant: typographyThemeHelpers.applyElegantFonts(themePresets.default),
  },
};

// Migration helpers for upgrading from basic to advanced typography
export const migrationHelpers = {
  /**
   * Upgrade theme from basic to advanced typography
   */
  upgradeToAdvancedTypography: (theme: import('./types').Theme): import('./types').Theme => {
    if (theme.advancedTypography) {
      return theme; // Already has advanced typography
    }

    const defaultAdvancedTypography = createDefaultTheme().advancedTypography!;
    
    return {
      ...theme,
      advancedTypography: {
        ...defaultAdvancedTypography,
        // Map basic typography to advanced where possible
        primary: {
          ...defaultAdvancedTypography.primary,
          family: theme.typography.fontFamily.split(',')[0].trim(),
        },
        mono: {
          ...defaultAdvancedTypography.mono,
          family: theme.typography.fontFamilyMono.split(',')[0].trim(),
        },
      },
      updatedAt: new Date(),
    };
  },

  /**
   * Downgrade theme from advanced to basic typography
   */
  downgradeToBasicTypography: (theme: import('./types').Theme): import('./types').Theme => {
    if (!theme.advancedTypography) {
      return theme; // Already basic
    }

    return {
      ...theme,
      typography: {
        ...theme.typography,
        fontFamily: [
          theme.advancedTypography.primary.family,
          ...theme.advancedTypography.primary.fallbacks
        ].join(', '),
        fontFamilyMono: [
          theme.advancedTypography.mono.family,
          ...theme.advancedTypography.mono.fallbacks
        ].join(', '),
      },
      advancedTypography: undefined,
      updatedAt: new Date(),
    };
  },

  /**
   * Check if theme needs migration
   */
  needsMigration: (theme: import('./types').Theme): boolean => {
    return !theme.advancedTypography;
  },

  /**
   * Get migration recommendations
   */
  getMigrationRecommendations: (theme: import('./types').Theme): string[] => {
    const recommendations: string[] = [];
    
    if (!theme.advancedTypography) {
      recommendations.push('Upgrade to advanced typography for better control and accessibility');
      recommendations.push('Consider adding font preloading for better performance');
      recommendations.push('Enable responsive typography scaling');
    }
    
    if (theme.advancedTypography && !theme.advancedTypography.performance.preloadFonts) {
      recommendations.push('Enable font preloading for better performance');
    }
    
    if (theme.advancedTypography && theme.advancedTypography.accessibility.contrastRatio < 4.5) {
      recommendations.push('Increase contrast ratio to meet WCAG AA standards');
    }

    return recommendations;
  },
};

// Development and debugging utilities
export const devUtils = {
  /**
   * Log theme information for debugging
   */
  inspectTheme: (theme: import('./types').Theme): void => {
    console.group(`🎨 Theme Inspection: ${theme.name}`);
    console.log('Theme ID:', theme.id);
    console.log('Is Dark:', theme.isDark);
    console.log('Is Custom:', theme.isCustom);
    console.log('Created:', theme.createdAt);
    console.log('Updated:', theme.updatedAt);
    
    if (theme.advancedTypography) {
      console.group('📝 Typography');
      console.log('Scale:', theme.advancedTypography.scale);
      console.log('Primary Font:', theme.advancedTypography.primary.family);
      console.log('Secondary Font:', theme.advancedTypography.secondary.family);
      console.log('Mono Font:', theme.advancedTypography.mono.family);
      console.log('Accessibility:', theme.advancedTypography.accessibility);
      console.log('Performance:', theme.advancedTypography.performance);
      console.groupEnd();
    } else {
      console.log('📝 Typography: Basic (consider upgrading)');
    }

    if (theme.buttonCustomization) {
      console.group('🔘 Button Customization');
      console.log('Variant:', theme.buttonCustomization.variant);
      console.log('Size:', theme.buttonCustomization.size);
      console.log('Border Radius:', theme.buttonCustomization.borderRadius);
      console.log('Min Height:', theme.buttonCustomization.minHeight);
      console.groupEnd();
    }

    if (theme.colorPalette) {
      console.group('🎨 Color Palette');
      console.log('Primary:', theme.colorPalette.primary);
      console.log('Secondary:', theme.colorPalette.secondary);
      console.log('Background:', theme.colorPalette.background);
      console.groupEnd();
    }
    
    console.groupEnd();
  },

  /**
   * Compare two themes
   */
  compareThemes: (theme1: import('./types').Theme, theme2: import('./types').Theme): void => {
    console.group(`🔍 Theme Comparison: ${theme1.name} vs ${theme2.name}`);
    
    const differences: string[] = [];
    
    if (theme1.isDark !== theme2.isDark) {
      differences.push(`Dark mode: ${theme1.isDark} vs ${theme2.isDark}`);
    }
    
    if (theme1.colors.primary !== theme2.colors.primary) {
      differences.push(`Primary color: ${theme1.colors.primary} vs ${theme2.colors.primary}`);
    }
    
    // Compare typography
    if (theme1.advancedTypography && theme2.advancedTypography) {
      if (theme1.advancedTypography.scale !== theme2.advancedTypography.scale) {
        differences.push(`Typography scale: ${theme1.advancedTypography.scale} vs ${theme2.advancedTypography.scale}`);
      }
      
      if (theme1.advancedTypography.primary.family !== theme2.advancedTypography.primary.family) {
        differences.push(`Primary font: ${theme1.advancedTypography.primary.family} vs ${theme2.advancedTypography.primary.family}`);
      }
    } else if (theme1.advancedTypography !== theme2.advancedTypography) {
      differences.push(`Typography system: ${theme1.advancedTypography ? 'Advanced' : 'Basic'} vs ${theme2.advancedTypography ? 'Advanced' : 'Basic'}`);
    }

    // Compare button customization
    if (theme1.buttonCustomization && theme2.buttonCustomization) {
      if (theme1.buttonCustomization.variant !== theme2.buttonCustomization.variant) {
        differences.push(`Button variant: ${theme1.buttonCustomization.variant} vs ${theme2.buttonCustomization.variant}`);
      }
    } else if (theme1.buttonCustomization !== theme2.buttonCustomization) {
      differences.push(`Button customization: ${theme1.buttonCustomization ? 'Custom' : 'Default'} vs ${theme2.buttonCustomization ? 'Custom' : 'Default'}`);
    }

    // Compare color palette
    if (theme1.colorPalette && theme2.colorPalette) {
      if (theme1.colorPalette.primary !== theme2.colorPalette.primary) {
        differences.push(`Color palette primary: ${theme1.colorPalette.primary} vs ${theme2.colorPalette.primary}`);
      }
    } else if (theme1.colorPalette !== theme2.colorPalette) {
      differences.push(`Color palette: ${theme1.colorPalette ? 'Extended' : 'Basic'} vs ${theme2.colorPalette ? 'Extended' : 'Basic'}`);
    }
    
    if (differences.length === 0) {
      console.log('✅ Themes are identical');
    } else {
      console.log('📋 Differences found:');
      differences.forEach(diff => console.log(`  • ${diff}`));
    }
    
    console.groupEnd();
  },

  /**
   * Generate theme documentation
   */
  generateThemeDoc: (theme: import('./types').Theme): string => {
    let doc = `# ${theme.name}\n\n`;
    doc += `**ID:** ${theme.id}\n`;
    doc += `**Description:** ${theme.description || 'No description provided'}\n`;
    doc += `**Type:** ${theme.isDark ? 'Dark' : 'Light'} theme\n`;
    doc += `**Custom:** ${theme.isCustom ? 'Yes' : 'No'}\n\n`;
    
    doc += `## Colors\n\n`;
    doc += `- **Primary:** ${theme.colors.primary}\n`;
    doc += `- **Secondary:** ${theme.colors.secondary}\n`;
    doc += `- **Background:** ${theme.colors.background}\n`;
    doc += `- **Text:** ${theme.colors.textPrimary}\n\n`;
    
    if (theme.advancedTypography) {
      doc += `## Typography\n\n`;
      doc += `- **Scale:** ${theme.advancedTypography.scale}\n`;
      doc += `- **Primary Font:** ${theme.advancedTypography.primary.family}\n`;
      doc += `- **Secondary Font:** ${theme.advancedTypography.secondary.family}\n`;
      doc += `- **Monospace Font:** ${theme.advancedTypography.mono.family}\n`;
      doc += `- **Min Body Size:** ${theme.advancedTypography.accessibility.minBodySize}px\n`;
      doc += `- **Contrast Ratio:** ${theme.advancedTypography.accessibility.contrastRatio}\n\n`;
    }

    if (theme.buttonCustomization) {
      doc += `## Button Customization\n\n`;
      doc += `- **Variant:** ${theme.buttonCustomization.variant}\n`;
      doc += `- **Size:** ${theme.buttonCustomization.size}\n`;
      doc += `- **Border Radius:** ${theme.buttonCustomization.borderRadius}px\n`;
      doc += `- **Min Height:** ${theme.buttonCustomization.minHeight}px\n`;
      doc += `- **Font Weight:** ${theme.buttonCustomization.fontWeight}\n\n`;
    }

    if (theme.colorPalette) {
      doc += `## Extended Color Palette\n\n`;
      doc += `- **Primary:** ${theme.colorPalette.primary}\n`;
      doc += `- **Secondary:** ${theme.colorPalette.secondary}\n`;
      doc += `- **Tertiary:** ${theme.colorPalette.tertiary}\n`;
      doc += `- **Success:** ${theme.colorPalette.success}\n`;
      doc += `- **Warning:** ${theme.colorPalette.warning}\n`;
      doc += `- **Error:** ${theme.colorPalette.error}\n\n`;
    }
    
    doc += `## Accessibility\n\n`;
    if (theme.advancedTypography) {
      const validation = TypographyThemeUtils.validateTypographyAccessibility(theme);
      doc += `- **Status:** ${validation.isValid ? '✅ Compliant' : '⚠️ Issues found'}\n`;
      if (validation.errors.length > 0) {
        doc += `- **Errors:** ${validation.errors.join(', ')}\n`;
      }
      if (validation.warnings.length > 0) {
        doc += `- **Warnings:** ${validation.warnings.join(', ')}\n`;
      }
    } else {
      doc += `- **Status:** ⚠️ Basic typography (limited accessibility features)\n`;
    }
    
    doc += `\n---\n`;
    doc += `*Generated on ${new Date().toLocaleDateString()}*\n`;
    
    return doc;
  },

  /**
   * Validate theme completeness
   */
  validateThemeCompleteness: (theme: import('./types').Theme): {
    isComplete: boolean;
    missingFeatures: string[];
    recommendations: string[];
  } => {
    const missingFeatures: string[] = [];
    const recommendations: string[] = [];

    if (!theme.advancedTypography) {
      missingFeatures.push('Advanced Typography');
      recommendations.push('Enable advanced typography for better control');
    }

    if (!theme.buttonCustomization) {
      missingFeatures.push('Button Customization');
      recommendations.push('Add button customization for consistent branding');
    }

    if (!theme.colorPalette) {
      missingFeatures.push('Extended Color Palette');
      recommendations.push('Use extended color palette for more design options');
    }

    if (theme.buttonCustomization && theme.buttonCustomization.minHeight < 44) {
      recommendations.push('Increase button minimum height to 44px for accessibility');
    }

    return {
      isComplete: missingFeatures.length === 0,
      missingFeatures,
      recommendations,
    };
  },
};

// Re-export specific utilities for convenience
export { TypographyThemeUtils, typographyThemeHelpers };

// Brand customization utilities
export const brandUtils = {
  /**
   * Create a brand theme from color and button preferences
   */
  createBrandTheme: (config: {
    name: string;
    colors: {
      primary: string;
      secondary?: string;
      background?: string;
    };
    buttons: {
      variant?: 'filled' | 'outlined' | 'flat' | 'rounded' | 'pill' | 'square';
      borderRadius?: number;
      fontWeight?: number;
    };
  }) => {
    const baseTheme = createDefaultTheme();
    
    return {
      ...baseTheme,
      id: `brand-${Date.now()}`,
      name: config.name,
      isCustom: true,
      colors: {
        ...baseTheme.colors,
        primary: config.colors.primary,
        secondary: config.colors.secondary || baseTheme.colors.secondary,
        background: config.colors.background || baseTheme.colors.background,
      },
      buttonCustomization: {
        variant: config.buttons.variant || 'filled',
        size: 'medium' as const,
        borderRadius: config.buttons.borderRadius || 8,
        borderWidth: 1,
        paddingMultiplier: 1,
        fontWeight: config.buttons.fontWeight || 500,
        hoverScale: 1.02,
        transitionDuration: 200,
        minHeight: 44,
        focusRingWidth: 2,
        hoverOpacity: 0.9,
        activeOpacity: 0.95,
        disabledOpacity: 0.5,
      },
      colorPalette: {
        primary: config.colors.primary,
        secondary: config.colors.secondary || baseTheme.colors.secondary,
        tertiary: baseTheme.colors.border,
        textPrimary: baseTheme.colors.textPrimary,
        textSecondary: baseTheme.colors.textSecondary,
        textTertiary: baseTheme.colors.textMuted,
        textInverse: baseTheme.colors.textInverse,
        background: config.colors.background || baseTheme.colors.background,
        surface: baseTheme.colors.surface,
        surfaceElevated: baseTheme.colors.surfaceElevated,
        success: baseTheme.colors.success,
        warning: baseTheme.colors.warning,
        error: baseTheme.colors.error,
        info: baseTheme.colors.info,
        focus: config.colors.primary,
        selection: `${config.colors.primary}20`,
        overlay: baseTheme.colors.overlay,
      },
      updatedAt: new Date(),
    };
  },

  /**
   * Extract brand colors from theme
   */
  extractBrandColors: (theme: import('./types').Theme) => {
    return {
      primary: theme.colorPalette?.primary || theme.colors.primary,
      secondary: theme.colorPalette?.secondary || theme.colors.secondary,
      background: theme.colorPalette?.background || theme.colors.background,
      text: theme.colorPalette?.textPrimary || theme.colors.textPrimary,
    };
  },

  /**
   * Generate brand guidelines document
   */
  generateBrandGuidelines: (theme: import('./types').Theme): string => {
    const colors = brandUtils.extractBrandColors(theme);
    
    let guidelines = `# Brand Guidelines - ${theme.name}\n\n`;
    
    guidelines += `## Color Palette\n\n`;
    guidelines += `### Primary Colors\n`;
    guidelines += `- **Primary:** ${colors.primary}\n`;
    guidelines += `- **Secondary:** ${colors.secondary}\n`;
    guidelines += `- **Background:** ${colors.background}\n`;
    guidelines += `- **Text:** ${colors.text}\n\n`;
    
    if (theme.buttonCustomization) {
      guidelines += `## Button Guidelines\n\n`;
      guidelines += `- **Style:** ${theme.buttonCustomization.variant}\n`;
      guidelines += `- **Border Radius:** ${theme.buttonCustomization.borderRadius}px\n`;
      guidelines += `- **Minimum Height:** ${theme.buttonCustomization.minHeight}px\n`;
      guidelines += `- **Font Weight:** ${theme.buttonCustomization.fontWeight}\n\n`;
    }
    
    if (theme.advancedTypography) {
      guidelines += `## Typography Guidelines\n\n`;
      guidelines += `- **Primary Font:** ${theme.advancedTypography.primary.family}\n`;
      guidelines += `- **Scale:** ${theme.advancedTypography.scale}\n`;
      guidelines += `- **Minimum Text Size:** ${theme.advancedTypography.accessibility.minBodySize}px\n\n`;
    }
    
    guidelines += `## Usage Guidelines\n\n`;
    guidelines += `1. Always maintain minimum contrast ratios for accessibility\n`;
    guidelines += `2. Use consistent button styles throughout the application\n`;
    guidelines += `3. Ensure touch targets meet minimum size requirements (44px)\n`;
    guidelines += `4. Test color combinations for accessibility compliance\n\n`;
    
    guidelines += `---\n`;
    guidelines += `*Generated on ${new Date().toLocaleDateString()}*\n`;
    
    return guidelines;
  },
};