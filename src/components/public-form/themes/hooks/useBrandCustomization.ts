// src/components/public-form/themes/hooks/useBrandCustomization.ts

"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTheme } from '../ThemeProvider';
import { ButtonCustomization } from '../buttons/types';
import { ColorPalette } from '../colors/types';
import { ButtonColorCSSGenerator } from '../css/buttonColorGenerator';

export interface BrandCustomizationState {
  buttons: ButtonCustomization;
  colors: ColorPalette;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  accessibility: {
    isCompliant: boolean;
    issues: string[];
    score: number;
  };
}

export interface BrandCustomizationActions {
  updateButtonCustomization: (updates: Partial<ButtonCustomization>) => void;
  updateColorPalette: (updates: Partial<ColorPalette>) => void;
  applyPreset: (presetId: string) => void;
  resetToDefaults: () => void;
  exportConfiguration: () => string;
  importConfiguration: (config: string) => boolean;
  validateAccessibility: () => void;
  applyChanges: () => Promise<void>;
}

/**
 * Hook for managing brand customization state and actions
 */
export const useBrandCustomization = (): BrandCustomizationState & BrandCustomizationActions => {
  const { updateTheme, state } = useTheme();

  // State management
  const [buttonCustomization, setButtonCustomization] = useState<ButtonCustomization>({
    variant: 'filled',
    size: 'medium',
    borderRadius: 8,
    borderWidth: 1,
    paddingMultiplier: 1,
    fontWeight: 500,
    hoverScale: 1.02,
    transitionDuration: 200,
    minHeight: 44,
    focusRingWidth: 2,
    hoverOpacity: 0.9,
    activeOpacity: 0.95,
    disabledOpacity: 0.5,
  });

  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: '#3B82F6',
    secondary: '#6B7280',
    tertiary: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceElevated: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    focus: '#3B82F6',
    selection: 'rgba(59, 130, 246, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load initial values from theme
  useEffect(() => {
    const currentTheme = state.currentTheme;
    
    // Update color palette from theme
    setColorPalette({
      primary: currentTheme.colors.primary,
      secondary: currentTheme.colors.secondary,
      tertiary: currentTheme.colors.border,
      textPrimary: currentTheme.colors.textPrimary,
      textSecondary: currentTheme.colors.textSecondary,
      textTertiary: currentTheme.colors.textMuted,
      textInverse: currentTheme.colors.textInverse,
      background: currentTheme.colors.background,
      surface: currentTheme.colors.surface,
      surfaceElevated: currentTheme.colors.surfaceElevated,
      success: currentTheme.colors.success,
      warning: currentTheme.colors.warning,
      error: currentTheme.colors.error,
      info: currentTheme.colors.info,
      focus: currentTheme.colors.borderFocus,
      selection: 'rgba(59, 130, 246, 0.1)',
      overlay: currentTheme.colors.overlay,
    });

    // Load button customization if available
    if ((currentTheme as any).buttonCustomization) {
      setButtonCustomization((currentTheme as any).buttonCustomization);
    }
  }, [state.currentTheme]);

  // Accessibility validation
  const accessibility = useMemo(() => {
    const issues: string[] = [];
    let score = 100;

    // Check button size accessibility
    if (buttonCustomization.minHeight < 44) {
      issues.push('Button height below 44px minimum touch target');
      score -= 20;
    }

    // Check color contrast
    const primaryButtonContrast = ButtonColorCSSGenerator.validateColorAccessibility(
      colorPalette.textInverse,
      colorPalette.primary
    );
    
    if (!primaryButtonContrast.isAccessible) {
      issues.push('Primary button contrast below WCAG AA standards');
      score -= 25;
    }

    const textContrast = ButtonColorCSSGenerator.validateColorAccessibility(
      colorPalette.textPrimary,
      colorPalette.background
    );
    
    if (!textContrast.isAccessible) {
      issues.push('Text contrast below WCAG AA standards');
      score -= 25;
    }

    // Check focus indicator
    if (buttonCustomization.focusRingWidth < 2) {
      issues.push('Focus ring width below 2px recommendation');
      score -= 10;
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      score: Math.max(0, score),
    };
  }, [buttonCustomization, colorPalette]);

  // Action handlers
  const updateButtonCustomization = useCallback((updates: Partial<ButtonCustomization>) => {
    setButtonCustomization(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const updateColorPalette = useCallback((updates: Partial<ColorPalette>) => {
    setColorPalette(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    // Define presets
    const presets: Record<string, { buttons: Partial<ButtonCustomization>; colors: Partial<ColorPalette> }> = {
      modern: {
        buttons: { variant: 'filled', borderRadius: 8, hoverScale: 1.02 },
        colors: { primary: '#3B82F6', secondary: '#6B7280' }
      },
      rounded: {
        buttons: { variant: 'pill', borderRadius: 24, hoverScale: 1.05 },
        colors: { primary: '#10B981', secondary: '#059669' }
      },
      minimal: {
        buttons: { variant: 'flat', borderRadius: 4, hoverScale: 1.0 },
        colors: { primary: '#6B7280', secondary: '#9CA3AF' }
      },
      bold: {
        buttons: { variant: 'square', borderRadius: 2, fontWeight: 600 },
        colors: { primary: '#DC2626', secondary: '#B91C1C' }
      }
    };

    const preset = presets[presetId];
    if (preset) {
      if (preset.buttons) {
        updateButtonCustomization(preset.buttons);
      }
      if (preset.colors) {
        updateColorPalette(preset.colors);
      }
    }
  }, [updateButtonCustomization, updateColorPalette]);

  const resetToDefaults = useCallback(() => {
    setButtonCustomization({
      variant: 'filled',
      size: 'medium',
      borderRadius: 8,
      borderWidth: 1,
      paddingMultiplier: 1,
      fontWeight: 500,
      hoverScale: 1.02,
      transitionDuration: 200,
      minHeight: 44,
      focusRingWidth: 2,
      hoverOpacity: 0.9,
      activeOpacity: 0.95,
      disabledOpacity: 0.5,
    });

    setColorPalette({
      primary: '#3B82F6',
      secondary: '#6B7280',
      tertiary: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      textInverse: '#FFFFFF',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      surfaceElevated: '#FFFFFF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      focus: '#3B82F6',
      selection: 'rgba(59, 130, 246, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.5)',
    });

    setHasUnsavedChanges(true);
  }, []);

  const exportConfiguration = useCallback((): string => {
    const config = {
      buttons: buttonCustomization,
      colors: colorPalette,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(config, null, 2);
  }, [buttonCustomization, colorPalette]);

  const importConfiguration = useCallback((configString: string): boolean => {
    try {
      const config = JSON.parse(configString);
      
      if (config.buttons) {
        setButtonCustomization(config.buttons);
      }
      
      if (config.colors) {
        setColorPalette(config.colors);
      }
      
      setHasUnsavedChanges(true);
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }, []);

  const validateAccessibility = useCallback(() => {
    // The accessibility object is automatically calculated in the useMemo above
    console.log('Accessibility validation:', accessibility);
  }, [accessibility]);

  const applyChanges = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Generate and inject CSS
      ButtonColorCSSGenerator.injectCSS(buttonCustomization, colorPalette);
      
      // Update theme
      updateTheme({
        colors: {
          ...state.currentTheme.colors,
          primary: colorPalette.primary,
          secondary: colorPalette.secondary,
          background: colorPalette.background,
          surface: colorPalette.surface,
          textPrimary: colorPalette.textPrimary,
          textSecondary: colorPalette.textSecondary,
          textInverse: colorPalette.textInverse,
          success: colorPalette.success,
          warning: colorPalette.warning,
          error: colorPalette.error,
          info: colorPalette.info,
          border: colorPalette.tertiary,
          borderFocus: colorPalette.focus,
          overlay: colorPalette.overlay,
        },
        buttonCustomization: buttonCustomization as any,
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to apply changes:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [buttonCustomization, colorPalette, updateTheme, state.currentTheme.colors]);

  return {
    // State
    buttons: buttonCustomization,
    colors: colorPalette,
    isLoading,
    hasUnsavedChanges,
    accessibility,
    
    // Actions
    updateButtonCustomization,
    updateColorPalette,
    applyPreset,
    resetToDefaults,
    exportConfiguration,
    importConfiguration,
    validateAccessibility,
    applyChanges,
  };
};

/**
 * Hook for getting pre-defined brand presets
 */
export const useBrandPresets = () => {
  return useMemo(() => [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, contemporary design with subtle interactions',
      preview: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        buttonStyle: 'filled',
      },
    },
    {
      id: 'rounded',
      name: 'Friendly & Approachable',
      description: 'Rounded buttons with warm, welcoming colors',
      preview: {
        primary: '#10B981',
        secondary: '#059669',
        buttonStyle: 'pill',
      },
    },
    {
      id: 'minimal',
      name: 'Minimal & Clean',
      description: 'Understated design focusing on content',
      preview: {
        primary: '#6B7280',
        secondary: '#9CA3AF',
        buttonStyle: 'flat',
      },
    },
    {
      id: 'bold',
      name: 'Bold & Confident',
      description: 'Strong visual presence with sharp edges',
      preview: {
        primary: '#DC2626',
        secondary: '#B91C1C',
        buttonStyle: 'square',
      },
    },
    {
      id: 'elegant',
      name: 'Elegant & Sophisticated',
      description: 'Refined design with premium feel',
      preview: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        buttonStyle: 'rounded',
      },
    },
    {
      id: 'energetic',
      name: 'Energetic & Dynamic',
      description: 'Vibrant colors with dynamic interactions',
      preview: {
        primary: '#EA580C',
        secondary: '#FB923C',
        buttonStyle: 'filled',
      },
    },
  ], []);
};

/**
 * Hook for accessibility utilities
 */
export const useAccessibilityUtils = () => {
  const checkColorContrast = useCallback((foreground: string, background: string) => {
    return ButtonColorCSSGenerator.validateColorAccessibility(foreground, background);
  }, []);

  const getAccessibilityRecommendations = useCallback((customization: BrandCustomizationState) => {
    const recommendations: string[] = [];

    if (customization.buttons.minHeight < 44) {
      recommendations.push('Increase button minimum height to 44px for better touch accessibility');
    }

    if (customization.buttons.focusRingWidth < 2) {
      recommendations.push('Increase focus ring width to at least 2px for better visibility');
    }

    if (!customization.accessibility.isCompliant) {
      recommendations.push('Address color contrast issues to meet WCAG AA standards');
    }

    return recommendations;
  }, []);

  return {
    checkColorContrast,
    getAccessibilityRecommendations,
  };
};