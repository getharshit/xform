// src/components/public-form/themes/css/buttonColorGenerator.ts

import { ButtonCustomization, ButtonVariant, ButtonSize } from '../buttons/types';
import { ColorPalette } from '../colors/types';

/**
 * Generate CSS custom properties for button and color systems
 */
export class ButtonColorCSSGenerator {
  /**
   * Generate comprehensive CSS custom properties for buttons and colors
   */
  static generateCSS(
    buttonCustomization: ButtonCustomization,
    colorPalette: ColorPalette
  ): string {
    const colorProperties = this.generateColorProperties(colorPalette);
    const buttonProperties = this.generateButtonProperties(buttonCustomization);
    const buttonClasses = this.generateButtonClasses(buttonCustomization);
    
    return `
      :root {
        ${colorProperties}
        ${buttonProperties}
      }
      
      ${buttonClasses}
      
      /* Color-aware component styles */
      ${this.generateComponentStyles()}
      
      /* Accessibility styles */
      ${this.generateAccessibilityStyles()}
    `;
  }

  /**
   * Generate color custom properties
   */
  private static generateColorProperties(palette: ColorPalette): string {
    return `
      /* Brand Colors */
      --form-color-primary: ${palette.primary};
      --form-color-secondary: ${palette.secondary};
      --form-color-tertiary: ${palette.tertiary};
      
      /* Text Colors */
      --form-color-text-primary: ${palette.textPrimary};
      --form-color-text-secondary: ${palette.textSecondary};
      --form-color-text-tertiary: ${palette.textTertiary};
      --form-color-text-inverse: ${palette.textInverse};
      
      /* Background Colors */
      --form-color-background: ${palette.background};
      --form-color-surface: ${palette.surface};
      --form-color-surface-elevated: ${palette.surfaceElevated};
      
      /* State Colors */
      --form-color-success: ${palette.success};
      --form-color-warning: ${palette.warning};
      --form-color-error: ${palette.error};
      --form-color-info: ${palette.info};
      
      /* Interactive Colors */
      --form-color-focus: ${palette.focus};
      --form-color-selection: ${palette.selection};
      --form-color-overlay: ${palette.overlay};
      
      /* Auto-generated color variations */
      ${this.generateColorVariations(palette)}
    `;
  }

  /**
   * Generate color variations (hover, active, disabled states)
   */
  private static generateColorVariations(palette: ColorPalette): string {
    const variations = [];
    
    // Primary variations
    variations.push(`--form-color-primary-hover: ${this.darkenColor(palette.primary, 10)};`);
    variations.push(`--form-color-primary-active: ${this.darkenColor(palette.primary, 20)};`);
    variations.push(`--form-color-primary-disabled: ${this.lightenColor(palette.primary, 30)};`);
    
    // Secondary variations
    variations.push(`--form-color-secondary-hover: ${this.darkenColor(palette.secondary, 10)};`);
    variations.push(`--form-color-secondary-active: ${this.darkenColor(palette.secondary, 20)};`);
    
    // State variations
    variations.push(`--form-color-success-hover: ${this.darkenColor(palette.success, 10)};`);
    variations.push(`--form-color-error-hover: ${this.darkenColor(palette.error, 10)};`);
    variations.push(`--form-color-warning-hover: ${this.darkenColor(palette.warning, 10)};`);
    
    // Background variations
    variations.push(`--form-color-surface-hover: ${this.darkenColor(palette.surface, 5)};`);
    
    return variations.join('\n      ');
  }

  /**
   * Generate button custom properties
   */
  private static generateButtonProperties(customization: ButtonCustomization): string {
    return `
      /* Button Customization */
      --form-button-border-radius: ${customization.borderRadius}px;
      --form-button-border-width: ${customization.borderWidth}px;
      --form-button-font-weight: ${customization.fontWeight};
      --form-button-transition-duration: ${customization.transitionDuration}ms;
      --form-button-hover-scale: ${customization.hoverScale};
      --form-button-min-height: ${customization.minHeight}px;
      --form-button-focus-ring-width: ${customization.focusRingWidth}px;
      --form-button-hover-opacity: ${customization.hoverOpacity};
      --form-button-active-opacity: ${customization.activeOpacity};
      --form-button-disabled-opacity: ${customization.disabledOpacity};
      --form-button-padding-multiplier: ${customization.paddingMultiplier};
    `;
  }

  /**
   * Generate button CSS classes
   */
  private static generateButtonClasses(customization: ButtonCustomization): string {
    return `
      /* Base button styles */
      .form-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-weight: var(--form-button-font-weight);
        line-height: 1;
        text-decoration: none;
        border: var(--form-button-border-width) solid transparent;
        border-radius: var(--form-button-border-radius);
        cursor: pointer;
        transition: all var(--form-button-transition-duration) ease-in-out;
        min-height: var(--form-button-min-height);
        user-select: none;
        position: relative;
        overflow: hidden;
      }

      .form-button:focus {
        outline: none;
        box-shadow: 0 0 0 var(--form-button-focus-ring-width) var(--form-color-focus);
      }

      .form-button:disabled {
        cursor: not-allowed;
        opacity: var(--form-button-disabled-opacity);
        transform: none !important;
      }

      .form-button:not(:disabled):hover {
        transform: scale(var(--form-button-hover-scale));
        opacity: var(--form-button-hover-opacity);
      }

      .form-button:not(:disabled):active {
        transform: scale(0.98);
        opacity: var(--form-button-active-opacity);
      }

      /* Button Sizes */
      .form-button-small {
        padding: calc(6px * var(--form-button-padding-multiplier)) calc(12px * var(--form-button-padding-multiplier));
        font-size: 14px;
        min-height: 36px;
      }

      .form-button-medium {
        padding: calc(8px * var(--form-button-padding-multiplier)) calc(16px * var(--form-button-padding-multiplier));
        font-size: 16px;
        min-height: var(--form-button-min-height);
      }

      .form-button-large {
        padding: calc(12px * var(--form-button-padding-multiplier)) calc(24px * var(--form-button-padding-multiplier));
        font-size: 18px;
        min-height: 52px;
      }

      /* Button Variants */
      .form-button-filled {
        background-color: var(--form-color-primary);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-primary);
      }

      .form-button-filled:not(:disabled):hover {
        background-color: var(--form-color-primary-hover);
        border-color: var(--form-color-primary-hover);
      }

      .form-button-filled:not(:disabled):active {
        background-color: var(--form-color-primary-active);
        border-color: var(--form-color-primary-active);
      }

      .form-button-filled:disabled {
        background-color: var(--form-color-primary-disabled);
        border-color: var(--form-color-primary-disabled);
      }

      .form-button-outlined {
        background-color: transparent;
        color: var(--form-color-primary);
        border-color: var(--form-color-primary);
      }

      .form-button-outlined:not(:disabled):hover {
        background-color: var(--form-color-primary);
        color: var(--form-color-text-inverse);
      }

      .form-button-flat {
        background-color: transparent;
        color: var(--form-color-primary);
        border-color: transparent;
      }

      .form-button-flat:not(:disabled):hover {
        background-color: var(--form-color-surface-hover);
      }

      .form-button-rounded {
        background-color: var(--form-color-primary);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-primary);
        border-radius: calc(var(--form-button-border-radius) * 2);
      }

      .form-button-pill {
        background-color: var(--form-color-primary);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-primary);
        border-radius: 50px;
      }

      .form-button-square {
        background-color: var(--form-color-primary);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-primary);
        border-radius: 2px;
      }

      /* Secondary button variants */
      .form-button-secondary {
        background-color: var(--form-color-secondary);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-secondary);
      }

      .form-button-secondary:not(:disabled):hover {
        background-color: var(--form-color-secondary-hover);
        border-color: var(--form-color-secondary-hover);
      }

      /* State button variants */
      .form-button-success {
        background-color: var(--form-color-success);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-success);
      }

      .form-button-error {
        background-color: var(--form-color-error);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-error);
      }

      .form-button-warning {
        background-color: var(--form-color-warning);
        color: var(--form-color-text-inverse);
        border-color: var(--form-color-warning);
      }
    `;
  }

  /**
   * Generate color-aware component styles
   */
  private static generateComponentStyles(): string {
    return `
      /* Form Input Styles */
      .form-input {
        background-color: var(--form-color-surface);
        color: var(--form-color-text-primary);
        border: 1px solid var(--form-color-tertiary);
        border-radius: var(--form-button-border-radius);
      }

      .form-input:focus {
        border-color: var(--form-color-focus);
        box-shadow: 0 0 0 var(--form-button-focus-ring-width) var(--form-color-focus);
      }

      .form-input::placeholder {
        color: var(--form-color-text-tertiary);
      }

      /* Form Labels */
      .form-label {
        color: var(--form-color-text-primary);
        font-weight: var(--form-button-font-weight);
      }

      .form-label-secondary {
        color: var(--form-color-text-secondary);
      }

      /* Progress Bar */
      .form-progress-bar {
        background-color: var(--form-color-tertiary);
        border-radius: var(--form-button-border-radius);
      }

      .form-progress-fill {
        background-color: var(--form-color-primary);
        border-radius: var(--form-button-border-radius);
        transition: width var(--form-button-transition-duration) ease-in-out;
      }

      /* Links */
      .form-link {
        color: var(--form-color-primary);
        text-decoration: none;
        transition: color var(--form-button-transition-duration) ease-in-out;
      }

      .form-link:hover {
        color: var(--form-color-primary-hover);
        text-decoration: underline;
      }

      /* Cards and Surfaces */
      .form-card {
        background-color: var(--form-color-surface);
        border: 1px solid var(--form-color-tertiary);
        border-radius: calc(var(--form-button-border-radius) * 1.5);
      }

      .form-card-elevated {
        background-color: var(--form-color-surface-elevated);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      /* State Messages */
      .form-message {
        padding: 12px 16px;
        border-radius: var(--form-button-border-radius);
        font-size: 14px;
        border: 1px solid;
      }

      .form-message-success {
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--form-color-success);
        border-color: var(--form-color-success);
      }

      .form-message-error {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--form-color-error);
        border-color: var(--form-color-error);
      }

      .form-message-warning {
        background-color: rgba(245, 158, 11, 0.1);
        color: var(--form-color-warning);
        border-color: var(--form-color-warning);
      }

      .form-message-info {
        background-color: rgba(59, 130, 246, 0.1);
        color: var(--form-color-info);
        border-color: var(--form-color-info);
      }

      /* Form Field Groups */
      .form-field-group {
        margin-bottom: 1.5rem;
      }

      .form-field-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--form-color-text-primary);
        font-weight: var(--form-button-font-weight);
      }

      .form-field-group .form-help-text {
        margin-top: 0.25rem;
        font-size: 12px;
        color: var(--form-color-text-tertiary);
      }

      /* Radio and Checkbox Styles */
      .form-radio,
      .form-checkbox {
        accent-color: var(--form-color-primary);
      }

      .form-radio:focus,
      .form-checkbox:focus {
        outline: var(--form-button-focus-ring-width) solid var(--form-color-focus);
        outline-offset: 2px;
      }

      /* Select Dropdown */
      .form-select {
        background-color: var(--form-color-surface);
        color: var(--form-color-text-primary);
        border: 1px solid var(--form-color-tertiary);
        border-radius: var(--form-button-border-radius);
      }

      .form-select:focus {
        border-color: var(--form-color-focus);
        box-shadow: 0 0 0 var(--form-button-focus-ring-width) var(--form-color-focus);
      }

      /* Rating Components */
      .form-rating-star {
        color: var(--form-color-tertiary);
        transition: color var(--form-button-transition-duration) ease-in-out;
      }

      .form-rating-star.active {
        color: var(--form-color-primary);
      }

      .form-rating-star:hover {
        color: var(--form-color-primary-hover);
      }

      /* Toggle Switch */
      .form-toggle {
        background-color: var(--form-color-tertiary);
        border-radius: 50px;
        transition: background-color var(--form-button-transition-duration) ease-in-out;
      }

      .form-toggle.active {
        background-color: var(--form-color-primary);
      }

      .form-toggle-handle {
        background-color: var(--form-color-surface);
        border-radius: 50%;
        transition: transform var(--form-button-transition-duration) ease-in-out;
      }
    `;
  }

  /**
   * Generate accessibility styles
   */
  private static generateAccessibilityStyles(): string {
    return `
      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .form-button {
          border-width: 2px;
        }
        
        .form-input {
          border-width: 2px;
        }
        
        .form-button:focus,
        .form-input:focus {
          outline: 3px solid var(--form-color-focus);
          outline-offset: 2px;
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .form-button,
        .form-input,
        .form-progress-fill,
        .form-link,
        .form-rating-star,
        .form-toggle,
        .form-toggle-handle {
          transition: none !important;
          animation: none !important;
        }
        
        .form-button:hover {
          transform: none !important;
        }
      }

      /* Focus Visible */
      .form-button:focus-visible,
      .form-input:focus-visible,
      .form-radio:focus-visible,
      .form-checkbox:focus-visible,
      .form-select:focus-visible {
        outline: var(--form-button-focus-ring-width) solid var(--form-color-focus);
        outline-offset: 2px;
      }

      /* Touch Targets */
      @media (pointer: coarse) {
        .form-button {
          min-height: 44px;
          min-width: 44px;
        }
        
        .form-radio,
        .form-checkbox {
          min-width: 24px;
          min-height: 24px;
        }
      }

      /* Dark Mode Adjustments */
      @media (prefers-color-scheme: dark) {
        .form-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
        .form-input {
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
    `;
  }

  /**
   * Utility function to darken a color
   */
  private static darkenColor(color: string, percent: number): string {
    // Simple color darkening (in real app, use a proper color library)
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = (100 - percent) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Utility function to lighten a color
   */
  private static lightenColor(color: string, percent: number): string {
    // Simple color lightening (in real app, use a proper color library)
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = percent / 100;
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Generate CSS for a specific button configuration
   */
  static generateButtonCSS(
    variant: ButtonVariant,
    size: ButtonSize,
    customization: ButtonCustomization
  ): Record<string, string> {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
      fontWeight: customization.fontWeight.toString(),
      lineHeight: '1',
      textDecoration: 'none',
      border: `${customization.borderWidth}px solid transparent`,
      borderRadius: `${customization.borderRadius}px`,
      cursor: 'pointer',
      transition: `all ${customization.transitionDuration}ms ease-in-out`,
      minHeight: `${customization.minHeight}px`,
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
    };

    const sizeStyles = {
      small: {
        padding: `${6 * customization.paddingMultiplier}px ${12 * customization.paddingMultiplier}px`,
        fontSize: '14px',
        minHeight: '36px',
      },
      medium: {
        padding: `${8 * customization.paddingMultiplier}px ${16 * customization.paddingMultiplier}px`,
        fontSize: '16px',
        minHeight: `${customization.minHeight}px`,
      },
      large: {
        padding: `${12 * customization.paddingMultiplier}px ${24 * customization.paddingMultiplier}px`,
        fontSize: '18px',
        minHeight: '52px',
      },
    };

    const variantStyles = {
      filled: {
        backgroundColor: 'var(--form-color-primary)',
        color: 'var(--form-color-text-inverse)',
        borderColor: 'var(--form-color-primary)',
      },
      outlined: {
        backgroundColor: 'transparent',
        color: 'var(--form-color-primary)',
        borderColor: 'var(--form-color-primary)',
      },
      flat: {
        backgroundColor: 'transparent',
        color: 'var(--form-color-primary)',
        borderColor: 'transparent',
      },
      rounded: {
        backgroundColor: 'var(--form-color-primary)',
        color: 'var(--form-color-text-inverse)',
        borderColor: 'var(--form-color-primary)',
        borderRadius: `${Math.max(customization.borderRadius * 2, 16)}px`,
      },
      pill: {
        backgroundColor: 'var(--form-color-primary)',
        color: 'var(--form-color-text-inverse)',
        borderColor: 'var(--form-color-primary)',
        borderRadius: '50px',
      },
      square: {
        backgroundColor: 'var(--form-color-primary)',
        color: 'var(--form-color-text-inverse)',
        borderColor: 'var(--form-color-primary)',
        borderRadius: '2px',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  }

  /**
   * Inject CSS into the document
   */
  static injectCSS(
    buttonCustomization: ButtonCustomization,
    colorPalette: ColorPalette
  ): void {
    const css = this.generateCSS(buttonCustomization, colorPalette);
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('form-button-color-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'form-button-color-styles';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  /**
   * Validate color accessibility
   */
  static validateColorAccessibility(
    foreground: string,
    background: string
  ): { isAccessible: boolean; contrastRatio: number; recommendation: string } {
    // This is a simplified implementation
    // In a real app, use a proper contrast calculation library
    
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };
    
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    
    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);
    const isAccessible = contrastRatio >= 4.5;
    
    let recommendation = '';
    if (contrastRatio < 3) {
      recommendation = 'Poor contrast. Consider using a different color combination.';
    } else if (contrastRatio < 4.5) {
      recommendation = 'Below WCAG AA standards. Consider increasing contrast.';
    } else if (contrastRatio < 7) {
      recommendation = 'Good contrast. Meets WCAG AA standards.';
    } else {
      recommendation = 'Excellent contrast. Meets WCAG AAA standards.';
    }
    
    return {
      isAccessible,
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      recommendation,
    };
  }
}