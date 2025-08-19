// src/components/public-form/themes/cssProperties.ts - Updated with Typography Integration

import { Theme, CSSCustomProperties } from './types';
import { TypographyCSSGenerator } from './typography/cssGenerator';
import { defaultTheme } from './defaultTheme';
/**
 * Enhanced CSS properties generator with typography integration
 */

// Add this function at the top of the file, before the themeToCSSProperties function:
const generateBackgroundPattern = (patternType?: string, patternColor?: string): string => {
  if (!patternType || patternType === 'none') return 'none';
  
  const color = patternColor || '#00000';
  
  switch (patternType) {
    case 'dots':
      return `linear-gradient(circle, ${color} 1px, transparent 1px)`;
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



/**
 * Simplified CSS properties generator that works directly with customization
 */
export const customizationToCSSProperties = (customization?: any): CSSCustomProperties => {
  // Import defaultTheme for fallbacks
  
  const colors = customization?.colors || {};
  const typography = customization?.typography || {};
  const spacing = customization?.spacing || {};
  const borders = customization?.borders || {};
  const shadows = customization?.shadows || {};

  console.log('🔧 CSS Generator received customization:', customization);

  // Generate basic properties with fallbacks to defaultTheme - use any type to avoid interface issues
  const basicProperties: any = {
    // Colors with fallbacks
    '--form-color-primary': colors.primary || defaultTheme.colors.primary,
    '--form-color-secondary': colors.secondary || defaultTheme.colors.secondary,
    '--form-color-background': colors.background || defaultTheme.colors.background,
    '--form-color-text': colors.text || defaultTheme.colors.textPrimary,
    '--form-color-border': colors.border || defaultTheme.colors.border,
    '--form-color-error': colors.error || defaultTheme.colors.error,
    '--form-color-success': colors.success || defaultTheme.colors.success,
    '--form-color-warning': colors.warning || defaultTheme.colors.warning,
    
    // Add more complete color properties
    '--form-color-primary-hover': colors.primaryHover || defaultTheme.colors.primaryHover,
    '--form-color-primary-active': colors.primaryActive || defaultTheme.colors.primaryActive,
    '--form-color-secondary-hover': colors.secondaryHover || defaultTheme.colors.secondaryHover,
    '--form-color-text-primary': colors.text || defaultTheme.colors.textPrimary,
    '--form-color-text-secondary': colors.textSecondary || defaultTheme.colors.textSecondary,
    '--form-color-surface': colors.surface || defaultTheme.colors.surface,
    
    // Typography
    '--form-font-family': typography.fontFamily || defaultTheme.typography.fontFamily,
    '--form-font-size-base': `${typography.fontSize?.base || defaultTheme.typography.fontSizeBase}rem`,
    '--form-font-size-lg': `${typography.fontSize?.lg || defaultTheme.typography.fontSizeLg}rem`,
    '--form-font-size-xl': `${typography.fontSize?.xl || defaultTheme.typography.fontSizeXl}rem`,
    '--form-font-size-xs': `${typography.fontSize?.xs || defaultTheme.typography.fontSizeXs}rem`,
    '--form-font-size-sm': `${typography.fontSize?.sm || defaultTheme.typography.fontSizeSm}rem`,
    '--form-font-size-2xl': `${typography.fontSize?.['2xl'] || defaultTheme.typography.fontSize2xl}rem`,
    '--form-font-size-3xl': `${typography.fontSize?.['3xl'] || defaultTheme.typography.fontSize3xl}rem`,
    '--form-font-size-4xl': `${typography.fontSize?.['4xl'] || defaultTheme.typography.fontSize4xl}rem`,
    
    // Font weights
    '--form-font-weight-light': typography.fontWeight?.light || defaultTheme.typography.fontWeightLight,
    '--form-font-weight-normal': typography.fontWeight?.normal || defaultTheme.typography.fontWeightNormal,
    '--form-font-weight-medium': typography.fontWeight?.medium || defaultTheme.typography.fontWeightMedium,
    '--form-font-weight-semibold': typography.fontWeight?.semibold || defaultTheme.typography.fontWeightSemibold,
    '--form-font-weight-bold': typography.fontWeight?.bold || defaultTheme.typography.fontWeightBold,
    
    // Spacing
    '--form-spacing-unit': `${spacing.unit || defaultTheme.spacing.unit}rem`,
    '--form-spacing-xs': `${spacing.xs || defaultTheme.spacing.xs}rem`,
    '--form-spacing-sm': `${spacing.sm || defaultTheme.spacing.sm}rem`,
    '--form-spacing-md': `${spacing.md || defaultTheme.spacing.md}rem`,
    '--form-spacing-lg': `${spacing.lg || defaultTheme.spacing.lg}rem`,
    '--form-spacing-xl': `${spacing.xl || defaultTheme.spacing.xl}rem`,
    '--form-spacing-2xl': `${spacing['2xl'] || defaultTheme.spacing['2xl']}rem`,
    '--form-spacing-3xl': `${spacing['3xl'] || defaultTheme.spacing['3xl']}rem`,
    
    // Border radius
    '--form-border-radius-none': `${borders.radius?.none || defaultTheme.borderRadius.none}px`,
    '--form-border-radius-sm': `${borders.radius?.sm || defaultTheme.borderRadius.sm}rem`,
    '--form-border-radius-md': `${borders.radius?.md || defaultTheme.borderRadius.md}rem`,
    '--form-border-radius-lg': `${borders.radius?.lg || defaultTheme.borderRadius.lg}rem`,
    '--form-border-radius-xl': `${borders.radius?.xl || defaultTheme.borderRadius.xl}rem`,
    '--form-border-radius-full': `${borders.radius?.full || defaultTheme.borderRadius.full}px`,
    
    // Shadows
    '--form-shadow-none': shadows.none || defaultTheme.shadows.none,
    '--form-shadow-sm': shadows.sm || defaultTheme.shadows.sm,
    '--form-shadow-md': shadows.md || defaultTheme.shadows.md,
    '--form-shadow-lg': shadows.lg || defaultTheme.shadows.lg,
    '--form-shadow-xl': shadows.xl || defaultTheme.shadows.xl,
    '--form-shadow-2xl': shadows['2xl'] || defaultTheme.shadows['2xl'],
    '--form-shadow-inner': shadows.inner || defaultTheme.shadows.inner,
  };

// Handle background type and image specifically
  basicProperties['--form-background-type'] = colors.backgroundType || 'solid';
  
  if (colors.backgroundType === 'gradient') {
    basicProperties['--form-background-image'] = `linear-gradient(${colors.backgroundGradientDirection || '135deg'}, ${colors.backgroundGradientColor1 || '#3B82F6'}, ${colors.backgroundGradientColor2 || '#6B7280'})`;
    // For gradients, don't use the solid background color
    basicProperties['--form-color-background'] = 'transparent';
  } else if (colors.backgroundType === 'animated' && colors.animatedConfig) {
  basicProperties['--form-background-image'] = 'none';
  basicProperties['--form-background-animated'] = 'true';
  basicProperties['--form-background-animated-type'] = colors.animatedConfig.type;
  
  // Add animated-specific properties
    // Add animated-specific properties with proper null checking
  if (colors.animatedConfig.type === 'aurora' && colors.animatedConfig.aurora) {
    const aurora = colors.animatedConfig.aurora;
    basicProperties['--form-aurora-colors'] = aurora.colorStops?.join(',') || '';
    basicProperties['--form-aurora-amplitude'] = String(aurora.amplitude ?? 1.0);
    basicProperties['--form-aurora-blend'] = String(aurora.blend ?? 0.5);
    basicProperties['--form-aurora-speed'] = String(aurora.speed ?? 1.0);
  }
  
  if (colors.animatedConfig.type === 'darkVeil' && colors.animatedConfig.darkVeil) {
    const darkVeil = colors.animatedConfig.darkVeil;
    basicProperties['--form-darkveil-hue'] = String(darkVeil.hueShift ?? 0);
    basicProperties['--form-darkveil-noise'] = String(darkVeil.noiseIntensity ?? 0);
    basicProperties['--form-darkveil-scanline'] = String(darkVeil.scanlineIntensity ?? 0);
    basicProperties['--form-darkveil-speed'] = String(darkVeil.speed ?? 0.5);
    basicProperties['--form-darkveil-frequency'] = String(darkVeil.scanlineFrequency ?? 0);
    basicProperties['--form-darkveil-warp'] = String(darkVeil.warpAmount ?? 0);
  }
  
  if (colors.animatedConfig.type === 'lightRays' && colors.animatedConfig.lightRays) {
    const lightRays = colors.animatedConfig.lightRays;
    basicProperties['--form-lightrays-origin'] = lightRays.raysOrigin ?? 'top-center';
    basicProperties['--form-lightrays-color'] = lightRays.raysColor ?? '#ffffff';
    basicProperties['--form-lightrays-speed'] = String(lightRays.raysSpeed ?? 1);
    basicProperties['--form-lightrays-spread'] = String(lightRays.lightSpread ?? 1);
    basicProperties['--form-lightrays-length'] = String(lightRays.rayLength ?? 2);
    basicProperties['--form-lightrays-pulsating'] = String(lightRays.pulsating ?? false);
    basicProperties['--form-lightrays-fade'] = String(lightRays.fadeDistance ?? 1.0);
    basicProperties['--form-lightrays-saturation'] = String(lightRays.saturation ?? 1.0);
    basicProperties['--form-lightrays-follow-mouse'] = String(lightRays.followMouse ?? true);
    basicProperties['--form-lightrays-mouse-influence'] = String(lightRays.mouseInfluence ?? 0.1);
    basicProperties['--form-lightrays-noise'] = String(lightRays.noiseAmount ?? 0.0);
    basicProperties['--form-lightrays-distortion'] = String(lightRays.distortion ?? 0.0);
  }
  Object.entries(colors.animatedConfig).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
  Object.entries(value).forEach(([subKey, subValue]) => {
    basicProperties[`--form-bg-animated-${key}-${subKey}`] = String(subValue);
  });
} else if (value !== null && value !== undefined) {
  basicProperties[`--form-bg-animated-${key}`] = String(value);
} 
  });
} else {
    basicProperties['--form-background-image'] = 'none';
    basicProperties['--form-color-background'] = colors.background || defaultTheme.colors.background;
  }
  // Use type assertion to convert to CSSCustomProperties
  return basicProperties as CSSCustomProperties;
};


/**
 * Creates a theme wrapper style object that includes background and container styling
 */
// REPLACE the existing createThemeWrapperStyle function with this:
export function createThemeWrapperStyle(customization?: any): React.CSSProperties {

  console.log('🔧 createThemeWrapperStyle called with:', customization);

  if (!customization) {
    return {
      backgroundColor: '#ffffff',
      color: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '100vh',
    };
  }

  // Use the simplified CSS generator
  const cssProperties = customizationToCSSProperties(customization);
  
  // Apply CSS properties to document
  Object.entries(cssProperties).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });

  // Handle background styling in React styles
  const colors = customization.colors || {};
  const backgroundStyle: React.CSSProperties = {};
  
  if (colors.backgroundType === 'gradient') {
    backgroundStyle.backgroundImage = `linear-gradient(${colors.backgroundGradientDirection || '135deg'}, ${colors.backgroundGradientColor1 || '#3B82F6'}, ${colors.backgroundGradientColor2 || '#6B7280'})`;
    backgroundStyle.backgroundColor = 'transparent';
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  } else if (colors.backgroundType === 'pattern') {
    backgroundStyle.backgroundColor = colors.background || '#ffffff';
    backgroundStyle.backgroundImage = generateBackgroundPattern(colors.backgroundPattern, colors.backgroundPatternColor);
    backgroundStyle.backgroundSize = colors.backgroundPatternSize || '20px';
    backgroundStyle.backgroundRepeat = 'repeat';
  } else if (colors.backgroundType === 'animated') {
  // For animated backgrounds, set transparent background and let the animated component handle it
  backgroundStyle.backgroundColor = 'transparent';
  backgroundStyle.backgroundImage = 'none';
  
  // Store animated config for the component to use
(backgroundStyle as any)['--animated-type'] = colors.animatedConfig?.type || 'aurora';
} 
  else {
    backgroundStyle.backgroundColor = colors.background || '#ffffff';
    backgroundStyle.backgroundImage = 'none';
  }
  
  return {
    ...cssProperties,
    ...backgroundStyle,
    color: colors.text || '#1f2937',
    fontFamily: customization?.typography?.fontFamily || 'Inter, system-ui, sans-serif',
    minHeight: '100vh',
  } as React.CSSProperties;
}

/**
 * Gets animation configuration for components
 */
export function getAnimationConfig(customization?: any) {
  if (!customization) {
    return {
      intensity: 'moderate' as const,
      enableAnimations: true,
      respectReducedMotion: true,
    };
  }

  const animations = customization.animations;
  
  return {
    intensity: animations?.intensity || 'moderate',
    enableAnimations: animations?.enableAnimations ?? true,
    respectReducedMotion: animations?.respectReducedMotion ?? true,
  };
}

/**
 * Gets container alignment classes
 */
export function getContainerClasses(customization?: any): string {
  if (!customization) {
    return 'max-w-[100vw] mx-auto';
  }

  const alignment = customization.alignment || 'center';
  
  const alignmentClasses: Record<string, string> = {
    left: 'mx-0',
    center: 'mx-auto',
    right: 'ml-auto mr-0'
  };

  // Type-safe access to alignment classes
  const alignmentClass = alignmentClasses[alignment] || alignmentClasses.center;

  return `max-w-[100vw] ${alignmentClass}`;
}




export const themeToCSSProperties = (theme?: any): CSSCustomProperties => {
  if (!theme) {
    return customizationToCSSProperties();
  }
  
  // If it's a theme object, extract customization
  const customization = (theme as any).customization || theme;
  return customizationToCSSProperties(customization);
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

// Add these utility functions at the end of the file
/**
 * Generates React style object from theme
 */
// REPLACE the existing generateThemeStyle function with this:
export const generateThemeStyle = (theme?: any): React.CSSProperties => {
  if (!theme) {
    return {
      '--form-color-primary': '#3b82f6',
      '--form-color-background': '#ffffff',
    } as React.CSSProperties;
  }

  const cssProperties = themeToCSSProperties(theme);
  
  Object.entries(cssProperties).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
    
  return cssProperties as React.CSSProperties;
};

/**
 * Gets button classes based on theme
 */
export const getButtonClasses = (theme?: Theme): string => {
  const baseClasses = 'transition-all duration-200 font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const styleClasses = {
    filled: 'bg-[var(--form-color-primary)] text-white hover:opacity-90 focus:ring-[var(--form-color-primary)]',
    outlined: 'border-2 border-[var(--form-color-primary)] text-[var(--form-color-primary)] bg-transparent hover:bg-[var(--form-color-primary)] hover:text-white focus:ring-[var(--form-color-primary)]',
    ghost: 'text-[var(--form-color-primary)] bg-transparent hover:bg-[var(--form-color-primary)]/10 focus:ring-[var(--form-color-primary)]'
  };

  return `${baseClasses} ${sizeClasses.md} ${styleClasses.filled}`;
};


// Check if these properties exist
// Add these exports at the very end of cssProperties.ts

export const convertCustomizationToCSS = (customization: any) => {
  // Convert old customization format to new theme format
  const theme = {
    colors: customization?.colors || {},
    typography: customization?.typography || {},
    spacing: customization?.spacing || {},
    shadows: customization?.shadows || {},
    borderRadius: customization?.borders || {},
    customization: customization
  };
  
  return themeToCSSProperties(theme);
};
