// src/components/public-form/themes/typography/scales.ts - Complete Version

import { TypographyScale, FontSizeScale } from './types';

/**
 * Typography scale generator and management
 */
export class TypographyScaleGenerator {
  /**
   * Generate typography scale from base size and ratio
   */
  static generateScale(baseSize: number, ratio: number, id: string, name: string): TypographyScale {
    const sizes = {
      xs: Math.round(baseSize / Math.pow(ratio, 2) * 100) / 100,
      sm: Math.round(baseSize / ratio * 100) / 100,
      base: baseSize,
      lg: Math.round(baseSize * ratio * 100) / 100,
      xl: Math.round(baseSize * Math.pow(ratio, 2) * 100) / 100,
      '2xl': Math.round(baseSize * Math.pow(ratio, 3) * 100) / 100,
      '3xl': Math.round(baseSize * Math.pow(ratio, 4) * 100) / 100,
      '4xl': Math.round(baseSize * Math.pow(ratio, 5) * 100) / 100,
      '5xl': Math.round(baseSize * Math.pow(ratio, 6) * 100) / 100,
      '6xl': Math.round(baseSize * Math.pow(ratio, 7) * 100) / 100,
    };

    const lineHeights = {
      xs: this.calculateLineHeight(sizes.xs),
      sm: this.calculateLineHeight(sizes.sm),
      base: this.calculateLineHeight(sizes.base),
      lg: this.calculateLineHeight(sizes.lg),
      xl: this.calculateLineHeight(sizes.xl),
      '2xl': this.calculateLineHeight(sizes['2xl']),
      '3xl': this.calculateLineHeight(sizes['3xl']),
      '4xl': this.calculateLineHeight(sizes['4xl']),
      '5xl': this.calculateLineHeight(sizes['5xl']),
      '6xl': this.calculateLineHeight(sizes['6xl']),
    };

    const letterSpacing = {
      xs: this.calculateLetterSpacing(sizes.xs),
      sm: this.calculateLetterSpacing(sizes.sm),
      base: this.calculateLetterSpacing(sizes.base),
      lg: this.calculateLetterSpacing(sizes.lg),
      xl: this.calculateLetterSpacing(sizes.xl),
      '2xl': this.calculateLetterSpacing(sizes['2xl']),
      '3xl': this.calculateLetterSpacing(sizes['3xl']),
      '4xl': this.calculateLetterSpacing(sizes['4xl']),
      '5xl': this.calculateLetterSpacing(sizes['5xl']),
      '6xl': this.calculateLetterSpacing(sizes['6xl']),
    };

    return {
      id,
      name,
      baseSize,
      ratio,
      sizes,
      lineHeights,
      letterSpacing
    };
  }

  /**
   * Calculate optimal line height for font size
   */
  private static calculateLineHeight(fontSize: number): number {
    // Optimal line height formula: smaller fonts need more line height
    if (fontSize <= 12) return 1.6;
    if (fontSize <= 16) return 1.5;
    if (fontSize <= 20) return 1.4;
    if (fontSize <= 24) return 1.3;
    if (fontSize <= 32) return 1.25;
    return 1.2;
  }

  /**
   * Calculate optimal letter spacing for font size
   */
  private static calculateLetterSpacing(fontSize: number): number {
    // Letter spacing in em units - larger fonts need less spacing
    if (fontSize <= 12) return 0.025;
    if (fontSize <= 16) return 0.015;
    if (fontSize <= 20) return 0.01;
    if (fontSize <= 24) return 0.005;
    if (fontSize <= 32) return 0;
    return -0.01;
  }

  /**
   * Get recommended ratios for different use cases
   */
  static getRecommendedRatios() {
    return {
      minorSecond: 1.067,    // Subtle, conservative
      majorSecond: 1.125,    // Slight, conservative
      minorThird: 1.2,       // Balanced, popular
      majorThird: 1.25,      // Moderate, versatile
      perfectFourth: 1.333,  // Strong, clear hierarchy
      augmentedFourth: 1.414, // Distinct, bold
      perfectFifth: 1.5,     // Bold, dramatic
      goldenRatio: 1.618     // Natural, pleasing
    };
  }
}

/**
 * Predefined typography scales
 */
export const typographyScales: Record<FontSizeScale, TypographyScale> = {
  small: TypographyScaleGenerator.generateScale(14, 1.2, 'small', 'Small Scale'),
  medium: TypographyScaleGenerator.generateScale(16, 1.25, 'medium', 'Medium Scale'),
  large: TypographyScaleGenerator.generateScale(18, 1.333, 'large', 'Large Scale')
};

/**
 * Accessibility-compliant minimum sizes
 */
export const accessibilityConstraints = {
  minBodySize: 16, // WCAG AA minimum
  minButtonSize: 14,
  minCaptionSize: 12,
  maxLineLength: 75, // characters
  minContrastRatio: 4.5, // WCAG AA for normal text
  minContrastRatioLarge: 3.0 // WCAG AA for large text (18pt+)
};

/**
 * Responsive typography utilities
 */
export class ResponsiveTypography {
  /**
   * Calculate responsive font size
   */
  static calculateResponsiveSize(
    baseSize: number,
    screenWidth: number,
    minSize: number = 14,
    maxSize: number = 24
  ): number {
    const minWidth = 320; // Mobile minimum
    const maxWidth = 1200; // Desktop maximum
    
    if (screenWidth <= minWidth) return minSize;
    if (screenWidth >= maxWidth) return maxSize;
    
    // Linear interpolation
    const ratio = (screenWidth - minWidth) / (maxWidth - minWidth);
    const size = minSize + (maxSize - minSize) * ratio;
    
    return Math.round(size * 100) / 100;
  }

  /**
   * Generate responsive scale factors
   */
  static generateScaleFactors(baseScale: TypographyScale) {
    return {
      sm: 0.875,  // 87.5% on small screens
      md: 1.0,    // 100% on medium screens
      lg: 1.125,  // 112.5% on large screens
    };
  }

  /**
   * Apply responsive scaling to typography scale
   */
  static applyResponsiveScaling(
    scale: TypographyScale,
    scaleFactor: number
  ): TypographyScale {
    const scaledSizes = Object.fromEntries(
      Object.entries(scale.sizes).map(([key, value]) => [
        key,
        Math.round(value * scaleFactor * 100) / 100
      ])
    ) as TypographyScale['sizes'];

    return {
      ...scale,
      sizes: scaledSizes,
      baseSize: scale.baseSize * scaleFactor
    };
  }
}

/**
 * Typography validation utilities
 */
export class TypographyValidator {
  /**
   * Validate typography scale for accessibility
   */
  static validateScale(scale: TypographyScale): {
    isValid: boolean;
    errors: any;
    warnings: any;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check minimum sizes
    if (scale.sizes.base < accessibilityConstraints.minBodySize) {
      errors.push(`Base font size (${scale.sizes.base}px) is below WCAG minimum (${accessibilityConstraints.minBodySize}px)`);
    }

    if (scale.sizes.xs < 12) {
      warnings.push(`Extra small font size (${scale.sizes.xs}px) may be too small for some users`);
    }

    // Check line heights
    Object.entries(scale.lineHeights).forEach(([size, lineHeight]) => {
      if (lineHeight < 1.2) {
        warnings.push(`Line height for ${size} (${lineHeight}) is below recommended minimum (1.2)`);
      }
      if (lineHeight > 2.0) {
        warnings.push(`Line height for ${size} (${lineHeight}) may be too large`);
      }
    });

    // Check scale progression
    const sizeValues = Object.values(scale.sizes);
    for (let i = 1; i < sizeValues.length; i++) {
      const ratio = sizeValues[i] / sizeValues[i - 1];
      if (ratio < 1.1) {
        warnings.push('Font size progression may be too subtle for clear hierarchy');
        break;
      }
      if (ratio > 2.0) {
        warnings.push('Font size progression may be too dramatic');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate color contrast
   */
  static validateContrast(
    foreground: string,
    background: string,
    fontSize: number
  ): {
    ratio: number;
    isValid: boolean;
    level: 'AA' | 'AAA' | 'fail';
  } {
    const ratio = this.calculateContrastRatio(foreground, background);
    const isLargeText = fontSize >= 18 || fontSize >= 14; // 18pt or 14pt bold
    
    let level: 'AA' | 'AAA' | 'fail';
    let isValid: boolean;

    if (isLargeText) {
      if (ratio >= 4.5) level = 'AAA';
      else if (ratio >= 3.0) level = 'AA';
      else level = 'fail';
      isValid = ratio >= 3.0;
    } else {
      if (ratio >= 7.0) level = 'AAA';
      else if (ratio >= 4.5) level = 'AA';
      else level = 'fail';
      isValid = ratio >= 4.5;
    }

    return { ratio, isValid, level };
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private static calculateContrastRatio(color1: string, color2: string): number {
    // Simple contrast ratio calculation - in real implementation
    // you would use a proper color library
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get relative luminance of a color
   */
  private static getLuminance(color: string): number {
    // Simplified luminance calculation
    // In a real implementation, you'd properly parse hex/rgb values
    return 0.5; // Placeholder
  }
}