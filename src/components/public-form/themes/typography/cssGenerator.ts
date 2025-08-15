// src/components/public-form/themes/typography/cssGenerator.ts

import { 
    TypographyConfig, 
    TypographyCustomProperties, 
    TextElementType,
    FormTypographyMapping,
    FontFamilyConfig 
  } from './types';
  import { FontFallbackManager } from './fontLoader';
  
  /**
   * Typography CSS custom properties generator
   */
  export class TypographyCSSGenerator {
    /**
     * Generate CSS custom properties from typography configuration
     */
    static generateCSSProperties(config: TypographyConfig): TypographyCustomProperties {
      const scale = config.customScale || this.getScaleForConfig(config);
      
      return {
        // Font families with fallbacks
        '--form-font-primary': this.buildFontStack(config.primary),
        '--form-font-secondary': this.buildFontStack(config.secondary),
        '--form-font-mono': this.buildFontStack(config.mono),
        
        // Font sizes for each element type
        '--form-font-size-form-title': this.getFontSizeForElement('formTitle', config, scale),
        '--form-font-size-form-description': this.getFontSizeForElement('formDescription', config, scale),
        '--form-font-size-section-title': this.getFontSizeForElement('sectionTitle', config, scale),
        '--form-font-size-question-label': this.getFontSizeForElement('questionLabel', config, scale),
        '--form-font-size-question-description': this.getFontSizeForElement('questionDescription', config, scale),
        '--form-font-size-input-text': this.getFontSizeForElement('inputText', config, scale),
        '--form-font-size-input-placeholder': this.getFontSizeForElement('inputPlaceholder', config, scale),
        '--form-font-size-button-text': this.getFontSizeForElement('buttonText', config, scale),
        '--form-font-size-help-text': this.getFontSizeForElement('helpText', config, scale),
        '--form-font-size-error-text': this.getFontSizeForElement('errorText', config, scale),
        '--form-font-size-success-text': this.getFontSizeForElement('successText', config, scale),
        '--form-font-size-caption': this.getFontSizeForElement('caption', config, scale),
        '--form-font-size-legal': this.getFontSizeForElement('legal', config, scale),
        
        // Line heights
        '--form-line-height-form-title': this.getLineHeightForElement('formTitle', config, scale),
        '--form-line-height-form-description': this.getLineHeightForElement('formDescription', config, scale),
        '--form-line-height-section-title': this.getLineHeightForElement('sectionTitle', config, scale),
        '--form-line-height-question-label': this.getLineHeightForElement('questionLabel', config, scale),
        '--form-line-height-question-description': this.getLineHeightForElement('questionDescription', config, scale),
        '--form-line-height-input-text': this.getLineHeightForElement('inputText', config, scale),
        '--form-line-height-button-text': this.getLineHeightForElement('buttonText', config, scale),
        '--form-line-height-help-text': this.getLineHeightForElement('helpText', config, scale),
        '--form-line-height-error-text': this.getLineHeightForElement('errorText', config, scale),
        '--form-line-height-success-text': this.getLineHeightForElement('successText', config, scale),
        '--form-line-height-caption': this.getLineHeightForElement('caption', config, scale),
        '--form-line-height-legal': this.getLineHeightForElement('legal', config, scale),
        
        // Letter spacing
        '--form-letter-spacing-form-title': this.getLetterSpacingForElement('formTitle', config, scale),
        '--form-letter-spacing-form-description': this.getLetterSpacingForElement('formDescription', config, scale),
        '--form-letter-spacing-section-title': this.getLetterSpacingForElement('sectionTitle', config, scale),
        '--form-letter-spacing-question-label': this.getLetterSpacingForElement('questionLabel', config, scale),
        '--form-letter-spacing-question-description': this.getLetterSpacingForElement('questionDescription', config, scale),
        '--form-letter-spacing-input-text': this.getLetterSpacingForElement('inputText', config, scale),
        '--form-letter-spacing-button-text': this.getLetterSpacingForElement('buttonText', config, scale),
        '--form-letter-spacing-help-text': this.getLetterSpacingForElement('helpText', config, scale),
        '--form-letter-spacing-error-text': this.getLetterSpacingForElement('errorText', config, scale),
        '--form-letter-spacing-success-text': this.getLetterSpacingForElement('successText', config, scale),
        '--form-letter-spacing-caption': this.getLetterSpacingForElement('caption', config, scale),
        '--form-letter-spacing-legal': this.getLetterSpacingForElement('legal', config, scale),
        
        // Font weights
        '--form-font-weight-form-title': config.mapping.formTitle.fontWeight.toString(),
        '--form-font-weight-form-description': config.mapping.formDescription.fontWeight.toString(),
        '--form-font-weight-section-title': config.mapping.sectionTitle.fontWeight.toString(),
        '--form-font-weight-question-label': config.mapping.questionLabel.fontWeight.toString(),
        '--form-font-weight-question-description': config.mapping.questionDescription.fontWeight.toString(),
        '--form-font-weight-input-text': config.mapping.inputText.fontWeight.toString(),
        '--form-font-weight-button-text': config.mapping.buttonText.fontWeight.toString(),
        '--form-font-weight-help-text': config.mapping.helpText.fontWeight.toString(),
        '--form-font-weight-error-text': config.mapping.errorText.fontWeight.toString(),
        '--form-font-weight-success-text': config.mapping.successText.fontWeight.toString(),
        '--form-font-weight-caption': config.mapping.caption.fontWeight.toString(),
        '--form-font-weight-legal': config.mapping.legal.fontWeight.toString(),
        
        // Responsive modifiers
        '--form-font-scale-sm': config.responsive.breakpoints.sm.toString(),
        '--form-font-scale-md': config.responsive.breakpoints.md.toString(),
        '--form-font-scale-lg': config.responsive.breakpoints.lg.toString(),
      };
    }
  
    /**
     * Build font stack with proper fallbacks
     */
    private static buildFontStack(fontConfig: FontFamilyConfig): string {
      return [fontConfig.family, ...fontConfig.fallbacks].join(', ');
    }
  
    /**
     * Get scale configuration for typography config
     */
    private static getScaleForConfig(config: TypographyConfig) {
      // Import predefined scales
      const { typographyScales } = require('./scales');
      return typographyScales[config.scale];
    }
  
    /**
     * Get font size for specific element type
     */
    private static getFontSizeForElement(
      element: TextElementType,
      config: TypographyConfig,
      scale: any
    ): string {
      const mapping = config.mapping[element];
      const size = scale.sizes[mapping.fontSize];
      
      // Apply accessibility minimum
      let finalSize = size;
      if (config.accessibility.enforceMinSize) {
        if (element === 'inputText' || element === 'questionLabel') {
          finalSize = Math.max(size, config.accessibility.minBodySize);
        }
      }
      
      return `${finalSize}px`;
    }
  
    /**
     * Get line height for specific element type
     */
    private static getLineHeightForElement(
      element: TextElementType,
      config: TypographyConfig,
      scale: any
    ): string {
      const mapping = config.mapping[element];
      return scale.lineHeights[mapping.lineHeight].toString();
    }
  
    /**
     * Get letter spacing for specific element type
     */
    private static getLetterSpacingForElement(
      element: TextElementType,
      config: TypographyConfig,
      scale: any
    ): string {
      const mapping = config.mapping[element];
      return `${scale.letterSpacing[mapping.letterSpacing]}em`;
    }
  
    /**
     * Generate responsive CSS media queries
     */
    static generateResponsiveCSS(config: TypographyConfig): string {
      if (!config.responsive.enableScaling) return '';
  
      const { breakpoints } = config.responsive;
      
      return `
        @media (max-width: 640px) {
          :root {
            --form-font-scale-current: var(--form-font-scale-sm);
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          :root {
            --form-font-scale-current: var(--form-font-scale-md);
          }
        }
        
        @media (min-width: 1025px) {
          :root {
            --form-font-scale-current: var(--form-font-scale-lg);
          }
        }
        
        /* Apply scaling to all font sizes */
        .form-responsive-typography {
          --form-font-size-adjusted: calc(var(--form-font-size-base) * var(--form-font-scale-current));
        }
      `;
    }
  
    /**
     * Generate font loading CSS
     */
    static generateFontLoadingCSS(fonts: FontFamilyConfig[]): string {
      const googleFonts = fonts.filter(font => font.googleFont);
      
      if (googleFonts.length === 0) return '';
  
      const fontUrls = googleFonts.map(font => {
        const { family, weights, subsets, display } = font.googleFont!;
        const weightsParam = weights.join(',');
        const subsetsParam = subsets.join(',');
        
        return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weightsParam}&subset=${subsetsParam}&display=${display}`;
      });
  
      // Generate preload links
      const preloadLinks = fontUrls.map(url => 
        `<link rel="preload" href="${url}" as="style" onload="this.onload=null;this.rel='stylesheet'">`
      ).join('\n');
  
      // Generate fallback script
      const fallbackScript = `
        <script>
          // Font loading fallback
          setTimeout(function() {
            if (!document.fonts || !document.fonts.check) return;
            
            var fonts = ${JSON.stringify(googleFonts.map(f => f.family))};
            fonts.forEach(function(family) {
              if (!document.fonts.check('1em ' + family)) {
                console.warn('Font failed to load:', family);
                // Could trigger fallback UI here
              }
            });
          }, 3000);
        </script>
      `;
  
      return preloadLinks + fallbackScript;
    }
  }
  
  /**
   * Default form typography mapping
   */
  export const defaultFormTypographyMapping: FormTypographyMapping = {
    formTitle: {
      fontSize: '3xl',
      lineHeight: '3xl',
      letterSpacing: '3xl',
      fontWeight: 700,
      fontFamily: 'primary'
    },
    formDescription: {
      fontSize: 'lg',
      lineHeight: 'lg',
      letterSpacing: 'lg',
      fontWeight: 400,
      fontFamily: 'primary'
    },
    sectionTitle: {
      fontSize: '2xl',
      lineHeight: '2xl',
      letterSpacing: '2xl',
      fontWeight: 600,
      fontFamily: 'primary'
    },
    questionLabel: {
      fontSize: 'base',
      lineHeight: 'base',
      letterSpacing: 'base',
      fontWeight: 500,
      fontFamily: 'primary'
    },
    questionDescription: {
      fontSize: 'sm',
      lineHeight: 'sm',
      letterSpacing: 'sm',
      fontWeight: 400,
      fontFamily: 'secondary'
    },
    inputText: {
      fontSize: 'base',
      lineHeight: 'base',
      letterSpacing: 'base',
      fontWeight: 400,
      fontFamily: 'primary'
    },
    inputPlaceholder: {
      fontSize: 'base',
      lineHeight: 'base',
      letterSpacing: 'base',
      fontWeight: 400,
      fontFamily: 'primary'
    },
    buttonText: {
      fontSize: 'sm',
      lineHeight: 'sm',
      letterSpacing: 'sm',
      fontWeight: 500,
      fontFamily: 'primary'
    },
    helpText: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'xs',
      fontWeight: 400,
      fontFamily: 'secondary'
    },
    errorText: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'xs',
      fontWeight: 500,
      fontFamily: 'primary'
    },
    successText: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'xs',
      fontWeight: 500,
      fontFamily: 'primary'
    },
    caption: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'xs',
      fontWeight: 400,
      fontFamily: 'secondary'
    },
    legal: {
      fontSize: 'xs',
      lineHeight: 'xs',
      letterSpacing: 'xs',
      fontWeight: 400,
      fontFamily: 'secondary'
    }
  };
  
  /**
   * Typography CSS manager for real-time updates
   */
  export class TypographyCSSManager {
    private static instance: TypographyCSSManager;
    private styleElement: HTMLStyleElement | null = null;
    private currentConfig: TypographyConfig | null = null;
  
    static getInstance(): TypographyCSSManager {
      if (!TypographyCSSManager.instance) {
        TypographyCSSManager.instance = new TypographyCSSManager();
      }
      return TypographyCSSManager.instance;
    }
  
    private constructor() {
      this.initializeStyleElement();
    }
  
    /**
     * Initialize style element for typography CSS
     */
    private initializeStyleElement(): void {
      if (typeof document === 'undefined') return;
  
      let element = document.getElementById('form-typography-css') as HTMLStyleElement;
      
      if (!element) {
        element = document.createElement('style');
        element.id = 'form-typography-css';
        element.type = 'text/css';
        document.head.appendChild(element);
      }
  
      this.styleElement = element;
    }
  
    /**
     * Apply typography configuration
     */
    applyConfiguration(config: TypographyConfig): void {
      if (!this.styleElement) {
        this.initializeStyleElement();
      }
  
      this.currentConfig = config;
      const cssProperties = TypographyCSSGenerator.generateCSSProperties(config);
      const responsiveCSS = TypographyCSSGenerator.generateResponsiveCSS(config);
      
      // Generate CSS custom properties
      const propertiesCSS = this.generatePropertiesCSS(cssProperties);
      
      // Generate utility classes
      const utilityCSS = this.generateUtilityCSS(config);
      
      // Combine all CSS
      const fullCSS = `
        ${propertiesCSS}
        ${responsiveCSS}
        ${utilityCSS}
        ${this.generateAccessibilityCSS(config)}
      `;
  
      if (this.styleElement) {
        this.styleElement.textContent = fullCSS;
      }
    }
  
    /**
     * Update specific typography properties
     */
    updateProperties(updates: Partial<TypographyCustomProperties>): void {
      if (!this.currentConfig) return;
  
      // This would require a more complex implementation to merge updates
      // For now, we'll regenerate the full configuration
      console.warn('Partial typography updates not yet implemented');
    }
  
    /**
     * Generate CSS custom properties string
     */
    private generatePropertiesCSS(properties: TypographyCustomProperties): string {
      const cssDeclarations = Object.entries(properties)
        .map(([property, value]) => `  ${property}: ${value};`)
        .join('\n');
  
      return `:root {\n${cssDeclarations}\n}`;
    }
  
    /**
     * Generate utility CSS classes
     */
    private generateUtilityCSS(config: TypographyConfig): string {
      return `
        /* Typography utility classes */
        .form-text-form-title {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-form-title);
          font-weight: var(--form-font-weight-form-title);
          line-height: var(--form-line-height-form-title);
          letter-spacing: var(--form-letter-spacing-form-title);
        }
        
        .form-text-form-description {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-form-description);
          font-weight: var(--form-font-weight-form-description);
          line-height: var(--form-line-height-form-description);
          letter-spacing: var(--form-letter-spacing-form-description);
        }
        
        .form-text-section-title {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-section-title);
          font-weight: var(--form-font-weight-section-title);
          line-height: var(--form-line-height-section-title);
          letter-spacing: var(--form-letter-spacing-section-title);
        }
        
        .form-text-question-label {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-question-label);
          font-weight: var(--form-font-weight-question-label);
          line-height: var(--form-line-height-question-label);
          letter-spacing: var(--form-letter-spacing-question-label);
        }
        
        .form-text-question-description {
          font-family: var(--form-font-secondary);
          font-size: var(--form-font-size-question-description);
          font-weight: var(--form-font-weight-question-description);
          line-height: var(--form-line-height-question-description);
          letter-spacing: var(--form-letter-spacing-question-description);
        }
        
        .form-text-input {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-input-text);
          font-weight: var(--form-font-weight-input-text);
          line-height: var(--form-line-height-input-text);
          letter-spacing: var(--form-letter-spacing-input-text);
        }
        
        .form-text-button {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-button-text);
          font-weight: var(--form-font-weight-button-text);
          line-height: var(--form-line-height-button-text);
          letter-spacing: var(--form-letter-spacing-button-text);
        }
        
        .form-text-help {
          font-family: var(--form-font-secondary);
          font-size: var(--form-font-size-help-text);
          font-weight: var(--form-font-weight-help-text);
          line-height: var(--form-line-height-help-text);
          letter-spacing: var(--form-letter-spacing-help-text);
        }
        
        .form-text-error {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-error-text);
          font-weight: var(--form-font-weight-error-text);
          line-height: var(--form-line-height-error-text);
          letter-spacing: var(--form-letter-spacing-error-text);
        }
        
        .form-text-success {
          font-family: var(--form-font-primary);
          font-size: var(--form-font-size-success-text);
          font-weight: var(--form-font-weight-success-text);
          line-height: var(--form-line-height-success-text);
          letter-spacing: var(--form-letter-spacing-success-text);
        }
        
        .form-text-caption {
          font-family: var(--form-font-secondary);
          font-size: var(--form-font-size-caption);
          font-weight: var(--form-font-weight-caption);
          line-height: var(--form-line-height-caption);
          letter-spacing: var(--form-letter-spacing-caption);
        }
        
        .form-text-legal {
          font-family: var(--form-font-secondary);
          font-size: var(--form-font-size-legal);
          font-weight: var(--form-font-weight-legal);
          line-height: var(--form-line-height-legal);
          letter-spacing: var(--form-letter-spacing-legal);
        }
      `;
    }
  
    /**
     * Generate accessibility CSS
     */
    private generateAccessibilityCSS(config: TypographyConfig): string {
      const minSize = config.accessibility.minBodySize;
      
      return `
        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
          .form-text-animated {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .form-text-question-label,
          .form-text-input,
          .form-text-button {
            font-weight: var(--form-font-weight-question-label);
          }
        }
        
        /* Enforce minimum font sizes */
        .form-text-input,
        .form-text-question-label {
          font-size: max(var(--form-font-size-input-text), ${minSize}px);
        }
        
        /* Focus indicators for typography */
        .form-text-input:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      `;
    }
  
    /**
     * Get current configuration
     */
    getCurrentConfiguration(): TypographyConfig | null {
      return this.currentConfig;
    }
  
    /**
     * Reset typography styles
     */
    reset(): void {
      if (this.styleElement) {
        this.styleElement.textContent = '';
      }
      this.currentConfig = null;
    }
  }
  
  // Export singleton instance
  export const typographyCSSManager = TypographyCSSManager.getInstance();