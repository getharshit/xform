// src/components/public-form/themes/logos/cssGenerator.ts

import {
    LogoConfig,
    LogoDisplay,
    LogoPosition,
    LogoSize,
    LogoResponsive,
    BrandWatermark,
    WatermarkPosition,
    WatermarkSize,
    LogoCSSProperties,
  } from './types';
  
  /**
   * Logo CSS Generator
   * Converts logo configurations to CSS properties and styles
   */
  export class LogoCSSGenerator {
    /**
     * Generate complete CSS for a logo configuration
     */
    static generateCSS(config: LogoConfig): {
      logoCSS: string;
      watermarkCSS?: string;
      customProperties: LogoCSSProperties;
    } {
      const customProperties = this.generateCustomProperties(config);
      const logoCSS = this.generateLogoCSS(config);
      
      const result: any = {
        logoCSS,
        customProperties,
      };
  
      return result;
    }
  
    /**
     * Generate logo CSS styles
     */
    private static generateLogoCSS(config: LogoConfig): string {
      if (!config.enabled || !config.file) {
        return '';
      }
  
      const { display, responsive } = config;
      let css = '';
  
      // Base logo container styles
      css += this.generateLogoContainerCSS(display);
      
      // Logo image styles
      css += this.generateLogoImageCSS(config);
      
      // Position-specific styles
      css += this.generatePositionCSS(display.position, display);
      
      // Responsive styles
      css += this.generateResponsiveCSS(responsive);
      
      // Hover effects
      if (display.hover?.enabled) {
        css += this.generateHoverCSS(display.hover);
      }
  
      // Link styles if logo is clickable
      if (config.link?.enabled) {
        css += this.generateLinkCSS(config.link);
      }
  
      return css;
    }
  
    /**
     * Generate logo container CSS
     */
    private static generateLogoContainerCSS(display: LogoDisplay): string {
      const containerClass = this.getLogoContainerClass(display.position);
      
      return `
  .${containerClass} {
    position: ${this.getPositionType(display.position)};
    display: flex;
    align-items: center;
    justify-content: ${this.getJustifyContent(display.alignment)};
    z-index: var(--form-z-index-base, 10);
    padding: ${display.padding.top}px ${display.padding.right}px ${display.padding.bottom}px ${display.padding.left}px;
    margin: ${display.margin.top}px ${display.margin.right}px ${display.margin.bottom}px ${display.margin.left}px;
    pointer-events: auto;
  }
  `;
    }
  
    /**
     * Generate logo image CSS
     */
    private static generateLogoImageCSS(config: LogoConfig): string {
      const { display, file, accessibility } = config;
      const dimensions = this.calculateLogoDimensions(display.size, display.customSize, file?.dimensions);
      
      let css = `
  .form-logo-image {
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    opacity: ${display.opacity};
    transition: var(--form-logo-transition, all 200ms ease-in-out);
  `;
  
      // Add border if configured
      if (display.border?.enabled) {
        css += `
    border: ${display.border.width}px ${display.border.style} ${display.border.color};
    border-radius: ${display.border.radius}px;
  `;
      }
  
      // Add shadow if configured
      if (display.shadow?.enabled) {
        const shadowCSS = `${display.shadow.offsetX}px ${display.shadow.offsetY}px ${display.shadow.blur}px ${display.shadow.color}`;
        css += `
    box-shadow: ${shadowCSS};
    filter: drop-shadow(${shadowCSS});
  `;
      }
  
      // Performance optimizations
      if (config.performance.lazy) {
        css += `
    loading: lazy;
  `;
      }
  
      // Accessibility attributes
      css += `
    alt: "${accessibility.altText}";
  `;
  
      if (accessibility.ariaLabel) {
        css += `
    aria-label: "${accessibility.ariaLabel}";
  `;
      }
  
      if (accessibility.hideFromScreenReaders) {
        css += `
    aria-hidden: "true";
  `;
      }
  
      css += `
  }
  `;
  
      return css;
    }
  
    /**
     * Generate position-specific CSS
     */
    private static generatePositionCSS(position: LogoPosition, display: LogoDisplay): string {
      const containerClass = this.getLogoContainerClass(position);
      
      switch (position) {
        case 'header-left':
          return `
  .${containerClass} {
    top: 0;
    left: 0;
    width: auto;
  }
  `;
  
        case 'header-center':
          return `
  .${containerClass} {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
  }
  `;
  
        case 'header-right':
          return `
  .${containerClass} {
    top: 0;
    right: 0;
    width: auto;
  }
  `;
  
        case 'floating-tl':
          return `
  .${containerClass} {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: var(--form-z-index-overlay, 1000);
  }
  `;
  
        case 'floating-tr':
          return `
  .${containerClass} {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: var(--form-z-index-overlay, 1000);
  }
  `;
  
        case 'floating-bl':
          return `
  .${containerClass} {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: var(--form-z-index-overlay, 1000);
  }
  `;
  
        case 'floating-br':
          return `
  .${containerClass} {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: var(--form-z-index-overlay, 1000);
  }
  `;
  
        case 'inline-title':
          return `
  .${containerClass} {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 12px;
  }
  `;
  
        case 'above-title':
          return `
  .${containerClass} {
    margin-bottom: 16px;
  }
  `;
  
        case 'below-title':
          return `
  .${containerClass} {
    margin-top: 16px;
  }
  `;
  
        case 'footer-left':
          return `
  .${containerClass} {
    justify-self: start;
  }
  `;
  
        case 'footer-center':
          return `
  .${containerClass} {
    justify-self: center;
  }
  `;
  
        case 'footer-right':
          return `
  .${containerClass} {
    justify-self: end;
  }
  `;
  
        default:
          return '';
      }
    }
  
    /**
     * Generate responsive CSS
     */
    private static generateResponsiveCSS(responsive: LogoResponsive): string {
      let css = '';
  
      // Mobile styles
      if (responsive.mobile.enabled) {
        css += `
  @media (max-width: ${responsive.breakpoints.mobile}px) {
    .form-logo-container {
  `;
  
        if (responsive.mobile.position) {
          const mobileContainerClass = this.getLogoContainerClass(responsive.mobile.position);
          css += `
      /* Override position for mobile */
  `;
          css += this.generatePositionCSS(responsive.mobile.position, {} as LogoDisplay);
        }
  
        if (responsive.mobile.customSize) {
          css += `
      width: ${responsive.mobile.customSize.width}px !important;
      height: ${responsive.mobile.customSize.height}px !important;
  `;
        } else if (responsive.mobile.size) {
          const mobileDimensions = this.calculateLogoDimensions(responsive.mobile.size);
          css += `
      width: ${mobileDimensions.width}px !important;
      height: ${mobileDimensions.height}px !important;
  `;
        }
  
        css += `
    }
  `;
  
        // Hide logo below certain width if specified
        if (responsive.mobile.hideBelow) {
          css += `
    @media (max-width: ${responsive.mobile.hideBelow}px) {
      .form-logo-container {
        display: none !important;
      }
    }
  `;
        }
  
        css += `
  }
  `;
      } else {
        // Hide on mobile if disabled
        css += `
  @media (max-width: ${responsive.breakpoints.mobile}px) {
    .form-logo-container {
      display: none !important;
    }
  }
  `;
      }
  
      // Tablet styles
      if (responsive.tablet.enabled) {
        css += `
  @media (min-width: ${responsive.breakpoints.mobile + 1}px) and (max-width: ${responsive.breakpoints.tablet}px) {
    .form-logo-container {
  `;
  
        if (responsive.tablet.position) {
          css += this.generatePositionCSS(responsive.tablet.position, {} as LogoDisplay);
        }
  
        if (responsive.tablet.customSize) {
          css += `
      width: ${responsive.tablet.customSize.width}px !important;
      height: ${responsive.tablet.customSize.height}px !important;
  `;
        } else if (responsive.tablet.size) {
          const tabletDimensions = this.calculateLogoDimensions(responsive.tablet.size);
          css += `
      width: ${tabletDimensions.width}px !important;
      height: ${tabletDimensions.height}px !important;
  `;
        }
  
        css += `
    }
  }
  `;
      } else {
        // Hide on tablet if disabled
        css += `
  @media (min-width: ${responsive.breakpoints.mobile + 1}px) and (max-width: ${responsive.breakpoints.tablet}px) {
    .form-logo-container {
      display: none !important;
    }
  }
  `;
      }
  
      // Desktop styles
      if (!responsive.desktop.enabled) {
        css += `
  @media (min-width: ${responsive.breakpoints.desktop}px) {
    .form-logo-container {
      display: none !important;
    }
  }
  `;
      }
  
      return css;
    }
  
    /**
     * Generate hover effect CSS
     */
    private static generateHoverCSS(hover: LogoDisplay['hover']): string {
      if (!hover?.enabled) return '';
  
      return `
  .form-logo-image:hover {
    transform: scale(${hover.scale});
    opacity: ${hover.opacity};
    transition: all ${hover.transition}ms ease-in-out;
  }
  `;
    }
  
    /**
     * Generate link CSS
     */
    private static generateLinkCSS(link: any): string {
      return `
  .form-logo-link {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
    outline: none;
    border: none;
    background: transparent;
  }
  
  .form-logo-link:focus {
    outline: 2px solid var(--form-color-border-focus, #3B82F6);
    outline-offset: 2px;
    border-radius: 4px;
  }
  
  .form-logo-link:focus:not(:focus-visible) {
    outline: none;
  }
  `;
    }
  
    /**
     * Generate watermark CSS
     */
    static generateWatermarkCSS(watermark: BrandWatermark): string {
      if (!watermark.enabled) return '';
  
      const position = this.getWatermarkPosition(watermark.position);
      const size = this.calculateWatermarkSize(watermark.size, watermark.customSize);
  
      return `
  .form-watermark {
    position: fixed;
    ${position}
    width: ${size}px;
    height: ${size}px;
    opacity: ${watermark.opacity};
    pointer-events: none;
    z-index: var(--form-z-index-base, 1);
    transform: translate(${watermark.offset.x}px, ${watermark.offset.y}px) rotate(${watermark.rotation || 0}deg);
    transition: opacity 0.3s ease-in-out;
  }
  
  .form-watermark img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  /* Hide watermark on mobile if disabled */
  ${!watermark.showOnMobile ? `
  @media (max-width: 768px) {
    .form-watermark {
      display: none;
    }
  }
  ` : ''}
  
  /* Fade on scroll if enabled */
  ${watermark.fadeOnScroll ? `
  .form-watermark.faded {
    opacity: ${watermark.opacity * 0.3};
  }
  ` : ''}
  
  /* Print styles */
  ${watermark.showOnPrint ? `
  @media print {
    .form-watermark {
      display: block !important;
      opacity: ${watermark.opacity * 0.5} !important;
    }
  }
  ` : `
  @media print {
    .form-watermark {
      display: none !important;
    }
  }
  `}
  
  /* Text watermark styles */
  ${watermark.textWatermark?.enabled ? `
  .form-watermark-text {
    position: fixed;
    ${position}
    font-family: ${watermark.textWatermark.font};
    font-size: ${watermark.textWatermark.size}px;
    color: ${watermark.textWatermark.color};
    opacity: ${watermark.opacity};
    pointer-events: none;
    z-index: var(--form-z-index-base, 1);
    transform: translate(${watermark.offset.x}px, ${watermark.offset.y}px) rotate(${watermark.textWatermark.rotation}deg);
    user-select: none;
    white-space: nowrap;
  }
  ` : ''}
  `;
    }
  
    /**
     * Generate CSS custom properties
     */
    private static generateCustomProperties(config: LogoConfig): LogoCSSProperties {
      const properties: LogoCSSProperties = {
        '--form-logo-width': '0px',
        '--form-logo-height': '0px',
        '--form-logo-position': config.display.position,
        '--form-logo-alignment': config.display.alignment,
        '--form-logo-opacity': config.display.opacity.toString(),
        '--form-logo-padding-top': `${config.display.padding.top}px`,
        '--form-logo-padding-right': `${config.display.padding.right}px`,
        '--form-logo-padding-bottom': `${config.display.padding.bottom}px`,
        '--form-logo-padding-left': `${config.display.padding.left}px`,
        '--form-logo-margin-top': `${config.display.margin.top}px`,
        '--form-logo-margin-right': `${config.display.margin.right}px`,
        '--form-logo-margin-bottom': `${config.display.margin.bottom}px`,
        '--form-logo-margin-left': `${config.display.margin.left}px`,
      };
  
      if (config.enabled && config.file) {
        const dimensions = this.calculateLogoDimensions(
          config.display.size,
          config.display.customSize,
          config.file.dimensions
        );
        
        properties['--form-logo-width'] = `${dimensions.width}px`;
        properties['--form-logo-height'] = `${dimensions.height}px`;
      }
  
      // Add shadow properties
      if (config.display.shadow?.enabled) {
        const shadow = config.display.shadow;
        properties['--form-logo-shadow'] = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}`;
      }
  
      // Add border properties
      if (config.display.border?.enabled) {
        const border = config.display.border;
        properties['--form-logo-border'] = `${border.width}px ${border.style} ${border.color}`;
        properties['--form-logo-border-radius'] = `${border.radius}px`;
      }
  
      // Add hover properties
      if (config.display.hover?.enabled) {
        const hover = config.display.hover;
        properties['--form-logo-hover-scale'] = hover.scale.toString();
        properties['--form-logo-transition'] = `all ${hover.transition}ms ease-in-out`;
      }
  
      // Add responsive properties
      if (config.responsive.mobile.customSize) {
        properties['--form-logo-mobile-width'] = `${config.responsive.mobile.customSize.width}px`;
        properties['--form-logo-mobile-height'] = `${config.responsive.mobile.customSize.height}px`;
      }
  
      if (config.responsive.tablet.customSize) {
        properties['--form-logo-tablet-width'] = `${config.responsive.tablet.customSize.width}px`;
        properties['--form-logo-tablet-height'] = `${config.responsive.tablet.customSize.height}px`;
      }
  
      return properties;
    }
  
    /**
     * Calculate logo dimensions based on size configuration
     */
    private static calculateLogoDimensions(
      size: LogoSize,
      customSize?: LogoDisplay['customSize'],
      originalDimensions?: { width: number; height: number; aspectRatio: number }
    ): { width: number; height: number } {
      // Use custom size if provided
      if (size === 'custom' && customSize) {
        if (customSize.maintainAspectRatio && originalDimensions) {
          const aspectRatio = originalDimensions.aspectRatio;
          if (customSize.width) {
            return {
              width: customSize.width,
              height: Math.round(customSize.width / aspectRatio),
            };
          } else if (customSize.height) {
            return {
              width: Math.round(customSize.height * aspectRatio),
              height: customSize.height,
            };
          }
        }
        
        return {
          width: customSize.width || 48,
          height: customSize.height || 48,
        };
      }
  
      // Use predefined sizes
      const sizeMap: Record<Exclude<LogoSize, 'custom'>, number> = {
        xs: 24,
        sm: 32,
        md: 48,
        lg: 64,
        xl: 96,
      };
  
      const maxSize = sizeMap[size as Exclude<LogoSize, 'custom'>] || 48;
  
      // Maintain aspect ratio if original dimensions are available
      if (originalDimensions) {
        const aspectRatio = originalDimensions.aspectRatio;
        if (aspectRatio > 1) {
          // Wider than tall
          return {
            width: maxSize,
            height: Math.round(maxSize / aspectRatio),
          };
        } else {
          // Taller than wide or square
          return {
            width: Math.round(maxSize * aspectRatio),
            height: maxSize,
          };
        }
      }
  
      // Default to square
      return { width: maxSize, height: maxSize };
    }
  
    /**
     * Calculate watermark size
     */
    private static calculateWatermarkSize(size: WatermarkSize, customSize?: number): number {
      if (size === 'custom' && customSize) {
        return customSize;
      }
  
      const sizeMap: Record<Exclude<WatermarkSize, 'custom'>, number> = {
        xs: 16,
        sm: 24,
        md: 32,
        lg: 48,
      };
  
      return sizeMap[size as Exclude<WatermarkSize, 'custom'>] || 32;
    }
  
    /**
     * Get watermark position CSS
     */
    private static getWatermarkPosition(position: WatermarkPosition): string {
      switch (position) {
        case 'top-left':
          return 'top: 20px; left: 20px;';
        case 'top-right':
          return 'top: 20px; right: 20px;';
        case 'bottom-left':
          return 'bottom: 20px; left: 20px;';
        case 'bottom-right':
          return 'bottom: 20px; right: 20px;';
        case 'center':
          return 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
        default:
          return 'bottom: 20px; right: 20px;';
      }
    }
  
    /**
     * Get logo container class name
     */
    private static getLogoContainerClass(position: LogoPosition): string {
      const baseClass = 'form-logo-container';
      const positionClass = position.replace(/[^a-zA-Z0-9]/g, '-');
      return `${baseClass}-${positionClass}`;
    }
  
    /**
     * Get CSS position type for logo position
     */
    private static getPositionType(position: LogoPosition): string {
      if (position.startsWith('floating')) {
        return 'fixed';
      }
      if (position.startsWith('header') || position.startsWith('footer')) {
        return 'absolute';
      }
      return 'relative';
    }
  
    /**
     * Get justify-content value for alignment
     */
    private static getJustifyContent(alignment: LogoDisplay['alignment']): string {
      switch (alignment) {
        case 'left':
          return 'flex-start';
        case 'center':
          return 'center';
        case 'right':
          return 'flex-end';
        default:
          return 'center';
      }
    }
  }
  
  /**
   * CSS Property Manager for logos
   */
  export class LogoCSSManager {
    private static instance: LogoCSSManager;
    private currentConfig: LogoConfig | null = null;
    private currentWatermark: BrandWatermark | null = null;
  
    static getInstance(): LogoCSSManager {
      if (!LogoCSSManager.instance) {
        LogoCSSManager.instance = new LogoCSSManager();
      }
      return LogoCSSManager.instance;
    }
  
    /**
     * Apply logo configuration
     */
    applyConfiguration(config: LogoConfig, watermark?: BrandWatermark): void {
      const { logoCSS, customProperties } = LogoCSSGenerator.generateCSS(config);
      
      let combinedCSS = logoCSS;
      
      if (watermark) {
        const watermarkCSS = LogoCSSGenerator.generateWatermarkCSS(watermark);
        combinedCSS += watermarkCSS;
        this.currentWatermark = watermark;
      }
  
      this.injectCSS(combinedCSS, customProperties);
      this.currentConfig = config;
    }
  
    /**
     * Apply watermark only
     */
    applyWatermark(watermark: BrandWatermark): void {
      const watermarkCSS = LogoCSSGenerator.generateWatermarkCSS(watermark);
      this.injectWatermarkCSS(watermarkCSS);
      this.currentWatermark = watermark;
    }
  
    /**
     * Remove watermark
     */
    removeWatermark(): void {
      if (typeof document !== 'undefined') {
        const watermarkElement = document.getElementById('form-watermark-css');
        if (watermarkElement) {
          watermarkElement.textContent = '';
        }
      }
      this.currentWatermark = null;
    }
  
    /**
     * Inject CSS into document
     */
    private injectCSS(css: string, customProperties: LogoCSSProperties): void {
      if (typeof document === 'undefined') return;
  
      // Inject custom properties
      this.injectCustomProperties(customProperties);
  
      // Inject logo CSS
      let styleElement = document.getElementById('form-logo-css') as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'form-logo-css';
        styleElement.type = 'text/css';
        document.head.appendChild(styleElement);
      }
  
      styleElement.textContent = css;
    }
  
    /**
     * Inject watermark CSS separately
     */
    private injectWatermarkCSS(css: string): void {
      if (typeof document === 'undefined') return;
  
      let styleElement = document.getElementById('form-watermark-css') as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'form-watermark-css';
        styleElement.type = 'text/css';
        document.head.appendChild(styleElement);
      }
  
      styleElement.textContent = css;
    }
  
    /**
     * Inject custom properties
     */
    private injectCustomProperties(properties: LogoCSSProperties): void {
      if (typeof document === 'undefined') return;
  
      let styleElement = document.getElementById('form-logo-properties') as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'form-logo-properties';
        styleElement.type = 'text/css';
        document.head.appendChild(styleElement);
      }
  
      // Build CSS custom properties
      let css = ':root {\n';
      Object.entries(properties).forEach(([property, value]) => {
        if (value !== undefined) {
          css += `  ${property}: ${value};\n`;
        }
      });
      css += '}\n';
  
      styleElement.textContent = css;
    }
  
    /**
     * Get current configuration
     */
    getCurrentConfiguration(): { logo: LogoConfig | null; watermark: BrandWatermark | null } {
      return {
        logo: this.currentConfig,
        watermark: this.currentWatermark,
      };
    }
  
    /**
     * Reset all logo styles
     */
    reset(): void {
      if (typeof document !== 'undefined') {
        const logoElement = document.getElementById('form-logo-css');
        const watermarkElement = document.getElementById('form-watermark-css');
        const propertiesElement = document.getElementById('form-logo-properties');
        
        if (logoElement) logoElement.textContent = '';
        if (watermarkElement) watermarkElement.textContent = '';
        if (propertiesElement) propertiesElement.textContent = '';
      }
      
      this.currentConfig = null;
      this.currentWatermark = null;
    }
  
    /**
     * Update watermark opacity on scroll (for fade effect)
     */
    updateWatermarkOnScroll(scrollY: number, threshold: number = 100): void {
      if (!this.currentWatermark?.fadeOnScroll) return;
  
      if (typeof document !== 'undefined') {
        const watermarkElement = document.querySelector('.form-watermark') as HTMLElement;
        if (watermarkElement) {
          const opacity = Math.max(0.1, this.currentWatermark.opacity - (scrollY / threshold) * 0.5);
          watermarkElement.style.opacity = opacity.toString();
        }
      }
    }
  }