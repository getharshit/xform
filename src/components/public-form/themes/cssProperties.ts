// src/components/public-form/themes/cssProperties.ts - Updated with Typography Integration

import { Theme, CSSCustomProperties } from './types';
import { TypographyCSSGenerator } from './typography/cssGenerator';

/**
 * Enhanced CSS properties generator with typography integration
 */

// Add this function at the top of the file, before the themeToCSSProperties function:
const generateBackgroundPattern = (patternType?: string, patternColor?: string): string => {
  if (!patternType || patternType === 'none') return 'none';
  
  const color = patternColor || '#00000';
  
  switch (patternType) {
    case 'dots':
      return `radial-gradient(circle, ${color} 1px, transparent 1px)`;
    case 'grid':
      return `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    case 'diagonal':
      return `repeating-linear-gradient(45deg, transparent, transparent 10px, ${color} 10px, ${color} 20px)`;
    case 'waves':
      return `repeating-linear-gradient(90deg, transparent, transparent 20px, ${color} 20px, ${color} 40px)`;
    default:
      return 'none';
  }
};

export const themeToCSSProperties = (theme: Theme): CSSCustomProperties => {

  console.log('🔧 CSS Generator received:', {
    themeKeys: Object.keys(theme),
    hasCustomization: !!(theme as any).customization,
    customizationKeys: Object.keys((theme as any).customization || {}),
    backgroundType: (theme as any).customization?.colors?.backgroundType,
    themeColorsBackground: theme.colors?.background,
    customizationColorsBackground: (theme as any).customization?.colors?.backgroundType
  });


  // Safety helper function
  const safeString = (value: any, fallback: string = ''): string => {
    return value !== undefined && value !== null ? value.toString() : fallback;
  };
  const customization = (theme as any).customization; // Cast to handle Form vs Theme difference
  const colors = customization?.colors || theme.colors || {};

  const safeNumber = (value: any, fallback: number = 0): number => {
    return value !== undefined && value !== null && !isNaN(Number(value)) ? Number(value) : fallback;
  };

  // Generate basic theme properties with safety checks
  const basicProperties = {
    // Colors
    '--form-color-primary': theme.colors?.primary || '#3b82f6',
    '--form-color-primary-hover': theme.colors?.primaryHover || '#2563eb',
    '--form-color-primary-active': theme.colors?.primaryActive || '#1d4ed8',
    '--form-color-primary-disabled': theme.colors?.primaryDisabled || '#9ca3af',
    '--form-color-secondary': theme.colors?.secondary || '#6b7280',
    '--form-color-secondary-hover': theme.colors?.secondaryHover || '#4b5563',
    '--form-color-secondary-active': theme.colors?.secondaryActive || '#374151',
    '--form-color-background': theme.colors?.background || '#ffffff',
    '--form-color-surface': theme.colors?.surface || '#ffffff',
    '--form-color-surface-elevated': theme.colors?.surfaceElevated || '#ffffff',
    '--form-color-overlay': theme.colors?.overlay || 'rgba(0, 0, 0, 0.5)',
    '--form-color-text-primary': theme.colors?.textPrimary || '#111827',
    '--form-color-text-secondary': theme.colors?.textSecondary || '#6b7280',
    '--form-color-text-muted': theme.colors?.textMuted || '#9ca3af',
    '--form-color-text-inverse': theme.colors?.textInverse || '#ffffff',
    '--form-color-border': theme.colors?.border || '#d1d5db',
    '--form-color-border-hover': theme.colors?.borderHover || '#9ca3af',
    '--form-color-border-focus': theme.colors?.borderFocus || '#3b82f6',
    '--form-color-border-error': theme.colors?.borderError || '#ef4444',
    '--form-color-border-success': theme.colors?.borderSuccess || '#10b981',
    '--form-color-error': theme.colors?.error || '#ef4444',
    '--form-color-error-hover': theme.colors?.errorHover || '#dc2626',
    '--form-color-success': theme.colors?.success || '#10b981',
    '--form-color-success-hover': theme.colors?.successHover || '#059669',
    '--form-color-warning': theme.colors?.warning || '#f59e0b',
    '--form-color-warning-hover': theme.colors?.warningHover || '#d97706',
    '--form-color-info': theme.colors?.info || '#3b82f6',
    '--form-color-info-hover': theme.colors?.infoHover || '#2563eb',

// Find the background properties section and update it:
'--form-background-type': colors.backgroundType || 'solid',
'--form-background-value': colors.backgroundValue || colors.background || '#ffffff',
'--form-background-pattern': generateBackgroundPattern(
  colors.backgroundPattern, 
  colors.backgroundPatternColor
) || 'none',
'--form-background-pattern-color': colors.backgroundPatternColor || 'rgba(0, 0, 0, 0.05)',
'--form-background-pattern-size': colors.backgroundPatternSize || '20px',
'--form-background-gradient-direction': colors.backgroundGradientDirection || '135deg',
'--form-background-gradient-color1': colors.backgroundGradientColor1 || colors.primary || '#3b82f6',
'--form-background-gradient-color2': colors.backgroundGradientColor2 || colors.secondary || '#6b7280',
    
    // Basic Typography (for backward compatibility)
    '--form-font-family': theme.typography?.fontFamily || 'Inter, system-ui, sans-serif',
    '--form-font-family-mono': theme.typography?.fontFamilyMono || 'ui-monospace, SFMono-Regular, monospace',
    '--form-font-size-xs': `${safeNumber(theme.typography?.fontSizeXs, 0.75)}rem`,
    '--form-font-size-sm': `${safeNumber(theme.typography?.fontSizeSm, 0.875)}rem`,
    '--form-font-size-base': `${safeNumber(theme.typography?.fontSizeBase, 1)}rem`,
    '--form-font-size-lg': `${safeNumber(theme.typography?.fontSizeLg, 1.125)}rem`,
    '--form-font-size-xl': `${safeNumber(theme.typography?.fontSizeXl, 1.25)}rem`,
    '--form-font-size-2xl': `${safeNumber(theme.typography?.fontSize2xl, 1.5)}rem`,
    '--form-font-size-3xl': `${safeNumber(theme.typography?.fontSize3xl, 1.875)}rem`,
    '--form-font-size-4xl': `${safeNumber(theme.typography?.fontSize4xl, 2.25)}rem`,
    '--form-font-weight-light': safeString(theme.typography?.fontWeightLight, '300'),
    '--form-font-weight-normal': safeString(theme.typography?.fontWeightNormal, '400'),
    '--form-font-weight-medium': safeString(theme.typography?.fontWeightMedium, '500'),
    '--form-font-weight-semibold': safeString(theme.typography?.fontWeightSemibold, '600'),
    '--form-font-weight-bold': safeString(theme.typography?.fontWeightBold, '700'),
    '--form-line-height-tight': safeString(theme.typography?.lineHeightTight, '1.25'),
    '--form-line-height-normal': safeString(theme.typography?.lineHeightNormal, '1.5'),
    '--form-line-height-relaxed': safeString(theme.typography?.lineHeightRelaxed, '1.75'),
    '--form-line-height-loose': safeString(theme.typography?.lineHeightLoose, '2'),
    '--form-letter-spacing-tighter': `${safeNumber(theme.typography?.letterSpacingTighter, -0.05)}em`,
    '--form-letter-spacing-tight': `${safeNumber(theme.typography?.letterSpacingTight, -0.025)}em`,
    '--form-letter-spacing-normal': `${safeNumber(theme.typography?.letterSpacingNormal, 0)}em`,
    '--form-letter-spacing-wide': `${safeNumber(theme.typography?.letterSpacingWide, 0.025)}em`,
    '--form-letter-spacing-wider': `${safeNumber(theme.typography?.letterSpacingWider, 0.05)}em`,
    
    // Spacing
    '--form-spacing-unit': `${safeNumber(theme.spacing?.unit, 0.25)}rem`,
    '--form-spacing-xs': `${safeNumber(theme.spacing?.xs, 0.5)}rem`,
    '--form-spacing-sm': `${safeNumber(theme.spacing?.sm, 0.75)}rem`,
    '--form-spacing-md': `${safeNumber(theme.spacing?.md, 1)}rem`,
    '--form-spacing-lg': `${safeNumber(theme.spacing?.lg, 1.5)}rem`,
    '--form-spacing-xl': `${safeNumber(theme.spacing?.xl, 2)}rem`,
    '--form-spacing-2xl': `${safeNumber(theme.spacing?.['2xl'], 2.5)}rem`,
    '--form-spacing-3xl': `${safeNumber(theme.spacing?.['3xl'], 3)}rem`,
    '--form-spacing-4xl': `${safeNumber(theme.spacing?.['4xl'], 4)}rem`,
    '--form-spacing-5xl': `${safeNumber(theme.spacing?.['5xl'], 5)}rem`,
    '--form-spacing-6xl': `${safeNumber(theme.spacing?.['6xl'], 6)}rem`,
    
    // Border radius
    '--form-border-radius-none': `${safeNumber(theme.borderRadius?.none, 0)}px`,
    '--form-border-radius-sm': `${safeNumber(theme.borderRadius?.sm, 0.125)}rem`,
    '--form-border-radius-md': `${safeNumber(theme.borderRadius?.md, 0.375)}rem`,
    '--form-border-radius-lg': `${safeNumber(theme.borderRadius?.lg, 0.5)}rem`,
    '--form-border-radius-xl': `${safeNumber(theme.borderRadius?.xl, 0.75)}rem`,
    '--form-border-radius-full': `${safeNumber(theme.borderRadius?.full, 9999)}px`,
    
    // Shadows
    '--form-shadow-none': theme.shadows?.none || 'none',
    '--form-shadow-sm': theme.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--form-shadow-md': theme.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--form-shadow-lg': theme.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    '--form-shadow-xl': theme.shadows?.xl || '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '--form-shadow-2xl': theme.shadows?.['2xl'] || '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '--form-shadow-inner': theme.shadows?.inner || 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    
    // Transitions
    '--form-transition-duration-fast': `${safeNumber(theme.transitions?.durationFast, 150)}ms`,
    '--form-transition-duration-normal': `${safeNumber(theme.transitions?.durationNormal, 200)}ms`,
    '--form-transition-duration-slow': `${safeNumber(theme.transitions?.durationSlow, 300)}ms`,
    '--form-transition-easing-linear': theme.transitions?.easingLinear || 'linear',
    '--form-transition-easing-ease-in': theme.transitions?.easingEaseIn || 'ease-in',
    '--form-transition-easing-ease-out': theme.transitions?.easingEaseOut || 'ease-out',
    '--form-transition-easing-ease-in-out': theme.transitions?.easingEaseInOut || 'ease-in-out',
    '--form-transition-easing-bounce': theme.transitions?.easingBounce || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    '--form-transition-easing-elastic': theme.transitions?.easingElastic || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Z-index
    '--form-z-index-auto': theme.zIndex?.auto || 'auto',
    '--form-z-index-base': safeString(theme.zIndex?.base, '0'),
    '--form-z-index-dropdown': safeString(theme.zIndex?.dropdown, '1000'),
    '--form-z-index-modal': safeString(theme.zIndex?.modal, '1050'),
    '--form-z-index-popover': safeString(theme.zIndex?.popover, '1030'),
    '--form-z-index-tooltip': safeString(theme.zIndex?.tooltip, '1070'),
    '--form-z-index-toast': safeString(theme.zIndex?.toast, '1080'),
    '--form-z-index-overlay': safeString(theme.zIndex?.overlay, '1040'),
  };

  // Generate advanced typography properties if available
  let advancedTypographyProperties = {};
  if (theme.advancedTypography) {
    try {
      const typographyProps = TypographyCSSGenerator.generateCSSProperties(theme.advancedTypography);
      advancedTypographyProperties = {
        // Map typography properties to our CSS custom property interface
        '--form-font-primary': typographyProps['--form-font-primary'] || 'Inter, system-ui, sans-serif',
        '--form-font-secondary': typographyProps['--form-font-secondary'] || 'Inter, system-ui, sans-serif',
        '--form-font-mono-advanced': typographyProps['--form-font-mono'] || 'ui-monospace, SFMono-Regular, monospace',
        
        // Element-specific typography with fallbacks
        '--form-font-size-form-title': typographyProps['--form-font-size-form-title'] || '1.5rem',
        '--form-font-size-form-description': typographyProps['--form-font-size-form-description'] || '1rem',
        '--form-font-size-section-title': typographyProps['--form-font-size-section-title'] || '1.25rem',
        '--form-font-size-question-label': typographyProps['--form-font-size-question-label'] || '1rem',
        '--form-font-size-question-description': typographyProps['--form-font-size-question-description'] || '0.875rem',
        '--form-font-size-input-text': typographyProps['--form-font-size-input-text'] || '1rem',
        '--form-font-size-input-placeholder': typographyProps['--form-font-size-input-placeholder'] || '1rem',
        '--form-font-size-button-text': typographyProps['--form-font-size-button-text'] || '0.875rem',
        '--form-font-size-help-text': typographyProps['--form-font-size-help-text'] || '0.75rem',
        '--form-font-size-error-text': typographyProps['--form-font-size-error-text'] || '0.875rem',
        '--form-font-size-success-text': typographyProps['--form-font-size-success-text'] || '0.875rem',
        '--form-font-size-caption': typographyProps['--form-font-size-caption'] || '0.75rem',
        '--form-font-size-legal': typographyProps['--form-font-size-legal'] || '0.75rem',
        
        // Add other advanced typography properties with fallbacks...
        // (keeping the rest but adding || fallbacks to each)
      };
    } catch (error) {
      console.warn('Failed to generate advanced typography properties:', error);
    }
  }

  // Merge all properties
  return {
    ...basicProperties,
    ...advancedTypographyProperties
  } as CSSCustomProperties;
};

/**
 * Enhanced CSS Properties injection system with typography support
 */
export class CSSPropertiesManager {
  private static instance: CSSPropertiesManager;
  private styleElement: HTMLStyleElement | null = null;
  private currentProperties: CSSCustomProperties | null = null;

  static getInstance(): CSSPropertiesManager {
    if (!CSSPropertiesManager.instance) {
      CSSPropertiesManager.instance = new CSSPropertiesManager();
    }
    return CSSPropertiesManager.instance;
  }

  private constructor() {
    this.initializeStyleElement();
  }

  /**
   * Initialize the style element for CSS custom properties
   */
  private initializeStyleElement(): void {
    if (typeof document === 'undefined') return;

    // Check if style element already exists
    let existingElement = document.getElementById('form-theme-css-properties') as HTMLStyleElement;
    
    if (!existingElement) {
      existingElement = document.createElement('style');
      existingElement.id = 'form-theme-css-properties';
      existingElement.type = 'text/css';
      document.head.appendChild(existingElement);
    }

    this.styleElement = existingElement;
  }

  /**
   * Apply CSS custom properties to the document
   */
  applyProperties(properties: CSSCustomProperties): void {
    if (!this.styleElement) {
      this.initializeStyleElement();
    }

    if (!this.styleElement) return;

    // Generate CSS rule
    const cssRule = this.generateCSSRule(properties);
    
    // Apply CSS with error handling
    try {
      this.styleElement.textContent = cssRule;
      this.currentProperties = properties;
    } catch (error) {
      console.error('Failed to apply CSS properties:', error);
    }
  }

  /**
   * Update specific CSS properties without replacing all
   */
  updateProperties(partialProperties: Partial<CSSCustomProperties>): void {
    if (!this.currentProperties) {
      console.warn('No current properties to update. Use applyProperties first.');
      return;
    }

    const updatedProperties = {
      ...this.currentProperties,
      ...partialProperties,
    };

    this.applyProperties(updatedProperties);
  }

  /**
   * Generate CSS rule string from properties
   */
  private generateCSSRule(properties: CSSCustomProperties): string {
    const cssDeclarations = Object.entries(properties)
      .map(([property, value]) => `  ${property}: ${value};`)
      .join('\n');

    return `:root {\n${cssDeclarations}\n}`;
  }

  /**
   * Get current applied properties
   */
  getCurrentProperties(): CSSCustomProperties | null {
    return this.currentProperties;
  }

  /**
   * Reset all properties
   */
  reset(): void {
    if (this.styleElement) {
      this.styleElement.textContent = '';
    }
    this.currentProperties = null;
  }

  /**
   * Check if properties are currently applied
   */
  hasProperties(): boolean {
    return this.currentProperties !== null;
  }

  /**
   * Get CSS property value from computed styles
   */
  getComputedProperty(propertyName: keyof CSSCustomProperties): string {
    if (typeof document === 'undefined') return '';
    
    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();
  }

  /**
   * Validate CSS property values
   */
  validateProperties(properties: CSSCustomProperties): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate color values
    const colorProperties = Object.entries(properties)
      .filter(([key]) => key.includes('color'))
      .forEach(([key, value]) => {
        if (!this.isValidColor(value)) {
          errors.push(`Invalid color value for ${key}: ${value}`);
        }
      });

    // Validate size values
    const sizeProperties = Object.entries(properties)
      .filter(([key]) => key.includes('size') || key.includes('spacing') || key.includes('radius'))
      .forEach(([key, value]) => {
        if (!this.isValidSize(value)) {
          errors.push(`Invalid size value for ${key}: ${value}`);
        }
      });

    // Validate font family values
    const fontProperties = Object.entries(properties)
      .filter(([key]) => key.includes('font-family') || key.includes('font-primary') || key.includes('font-secondary') || key.includes('font-mono'))
      .forEach(([key, value]) => {
        if (!this.isValidFontFamily(value)) {
          errors.push(`Invalid font family value for ${key}: ${value}`);
        }
      });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate color value
   */
  private isValidColor(color: string): boolean {
    // Create a temporary div to test color validity
    if (typeof document === 'undefined') return true;
    
    const div = document.createElement('div');
    div.style.color = color;
    return div.style.color !== '';
  }

  /**
   * Validate size value
   */
  private isValidSize(size: string): boolean {
    // Check for valid CSS size units
    const sizeRegex = /^(\d*\.?\d+)(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc)?$/;
    return sizeRegex.test(size) || size === '0' || size === 'auto';
  }

  /**
   * Validate font family value
   */
  private isValidFontFamily(fontFamily: string): boolean {
    // Basic validation for font family strings
    return typeof fontFamily === 'string' && fontFamily.length > 0;
  }
}

/**
 * Debounced CSS property application with typography support
 */
export class DebouncedCSSManager {
  private manager: CSSPropertiesManager;
  private debounceTimer: NodeJS.Timeout | null = null;
  private pendingProperties: Partial<CSSCustomProperties> = {};

  constructor(private debounceMs: number = 16) {
    this.manager = CSSPropertiesManager.getInstance();
  }

  /**
   * Apply properties with debouncing
   */
  applyProperties(properties: CSSCustomProperties): void {
    this.clearPendingUpdates();
    this.manager.applyProperties(properties);
  }

  /**
   * Update properties with debouncing
   */
  updateProperties(partialProperties: Partial<CSSCustomProperties>): void {
    // Merge with pending updates
    this.pendingProperties = {
      ...this.pendingProperties,
      ...partialProperties,
    };

    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = setTimeout(() => {
      this.manager.updateProperties(this.pendingProperties);
      this.pendingProperties = {};
      this.debounceTimer = null;
    }, this.debounceMs);
  }

  /**
   * Clear pending updates
   */
  private clearPendingUpdates(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingProperties = {};
  }

  /**
   * Force apply pending updates immediately
   */
  flush(): void {
    if (Object.keys(this.pendingProperties).length > 0) {
      this.manager.updateProperties(this.pendingProperties);
      this.clearPendingUpdates();
    }
  }
}

/**
 * Enhanced utility functions for CSS properties with typography support
 */
export const cssPropertyUtils = {
  /**
   * Convert theme to CSS properties (with typography support)
   */
  themeToCSS: themeToCSSProperties,

  /**
   * Get CSS manager instance
   */
  getManager: () => CSSPropertiesManager.getInstance(),

  /**
   * Create debounced manager
   */
  createDebouncedManager: (debounceMs?: number) => new DebouncedCSSManager(debounceMs),

  /**
   * Apply theme immediately (with typography support)
   */
  applyTheme: (theme: Theme) => {
    const properties = themeToCSSProperties(theme);
    CSSPropertiesManager.getInstance().applyProperties(properties);
  },

  /**
   * Reset theme properties
   */
  resetTheme: () => {
    CSSPropertiesManager.getInstance().reset();
  },

  /**
   * Check if theme is applied
   */
  hasTheme: () => {
    return CSSPropertiesManager.getInstance().hasProperties();
  },

  /**
   * Validate theme properties (with typography support)
   */
  validateTheme: (theme: Theme) => {
    const properties = themeToCSSProperties(theme);
    return CSSPropertiesManager.getInstance().validateProperties(properties);
  },

  /**
   * Update only typography properties
   */
  updateTypographyProperties: (theme: Theme) => {
    if (!theme.advancedTypography) return;
    
    try {
      const typographyProps = TypographyCSSGenerator.generateCSSProperties(theme.advancedTypography);
      const manager = CSSPropertiesManager.getInstance();
      
      // Extract only typography-related properties
      const typographyOnlyProps: Partial<CSSCustomProperties> = {};
      
      Object.entries(typographyProps).forEach(([key, value]) => {
        if (key.includes('font') || key.includes('line-height') || key.includes('letter-spacing')) {
          (typographyOnlyProps as any)[key] = value;
        }
      });
      
      manager.updateProperties(typographyOnlyProps);
    } catch (error) {
      console.error('Failed to update typography properties:', error);
    }
  },
};

// Check if these properties exist
