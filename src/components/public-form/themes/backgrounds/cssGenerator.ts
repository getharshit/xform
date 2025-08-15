// src/components/public-form/themes/backgrounds/cssGenerator.ts

import {
    BackgroundConfig,
    BackgroundCSS,
    BackgroundCSSProperties,
    GradientConfig,
    LinearGradient,
    RadialGradient,
    PatternConfig,
    ImageConfig,
    BackgroundOverlay,
    BackgroundAnimation,
    GradientStop,
  } from './types';
  
  /**
   * Background CSS Generator
   * Converts background configurations to CSS properties and styles
   */
  export class BackgroundCSSGenerator {
    /**
     * Generate complete CSS for a background configuration
     */
    static generateCSS(config: BackgroundConfig): BackgroundCSS {
      const css: BackgroundCSS = {
        customProperties: {},
      };
  
      // Generate base background CSS based on type
      switch (config.type) {
        case 'solid':
          this.generateSolidCSS(css, config);
          break;
        case 'gradient':
          this.generateGradientCSS(css, config);
          break;
        case 'pattern':
          this.generatePatternCSS(css, config);
          break;
        case 'image':
          this.generateImageCSS(css, config);
          break;
      }
  
      // Add overlay if configured
      if (config.overlay?.enabled) {
        this.generateOverlayCSS(css, config.overlay);
      }
  
      // Generate CSS custom properties
      css.customProperties = this.generateCustomProperties(config);
  
      return css;
    }
  
    /**
     * Generate CSS for solid color background
     */
    private static generateSolidCSS(css: BackgroundCSS, config: BackgroundConfig): void {
      if (config.solid) {
        css.backgroundColor = config.solid.color;
        css.background = config.solid.color;
      }
    }
  
    /**
     * Generate CSS for gradient background
     */
    private static generateGradientCSS(css: BackgroundCSS, config: BackgroundConfig): void {
      if (!config.gradient) return;
  
      const gradientCSS = this.buildGradientString(config.gradient);
      css.backgroundImage = gradientCSS;
      css.background = gradientCSS;
    }
  
    /**
     * Generate CSS for pattern background
     */
    private static generatePatternCSS(css: BackgroundCSS, config: BackgroundConfig): void {
      if (!config.pattern) return;
  
      const patternCSS = this.buildPatternString(config.pattern);
      css.backgroundImage = patternCSS;
      css.backgroundSize = this.calculatePatternSize(config.pattern);
      css.backgroundRepeat = 'repeat';
      css.background = `${patternCSS} repeat`;
    }
  
    /**
     * Generate CSS for image background
     */
    private static generateImageCSS(css: BackgroundCSS, config: BackgroundConfig): void {
      if (!config.image) return;
  
      const image = config.image;
      
      // Basic image properties
      css.backgroundImage = `url(${image.url})`;
      css.backgroundSize = this.mapImageSize(image.size);
      css.backgroundPosition = this.mapImagePosition(image.position, image.focalPoint);
      css.backgroundRepeat = image.repeat;
      css.backgroundAttachment = 'scroll';
  
      // Apply image filters if specified
      const filters = this.buildImageFilters(image);
      if (filters) {
        css.customProperties['--form-bg-image-filter'] = filters;
      }
  
      // Build complete background shorthand
      css.background = [
        `url(${image.url})`,
        css.backgroundRepeat,
        css.backgroundPosition,
        '/',
        css.backgroundSize,
        css.backgroundAttachment
      ].join(' ');
    }
  
    /**
     * Generate CSS for background overlay
     */
    private static generateOverlayCSS(css: BackgroundCSS, overlay: BackgroundOverlay): void {
      css.overlay = {
        background: overlay.color,
        opacity: overlay.opacity,
      };
  
      // Add blend mode if specified
      if (overlay.blendMode && overlay.blendMode !== 'normal') {
        css.overlay.mixBlendMode = overlay.blendMode;
      }
  
      // Add gradient overlay if configured
      if (overlay.gradientOverlay?.enabled && overlay.gradientOverlay.gradient) {
        const gradientOverlay = this.buildGradientString(overlay.gradientOverlay.gradient);
        css.overlay.background = `${gradientOverlay}, ${overlay.color}`;
      }
    }
  
    /**
     * Build gradient CSS string
     */
    private static buildGradientString(gradient: GradientConfig): string {
      if (gradient.type === 'linear') {
        return this.buildLinearGradientString(gradient);
      } else {
        return this.buildRadialGradientString(gradient);
      }
    }
  
    /**
     * Build linear gradient CSS string
     */
    private static buildLinearGradientString(gradient: LinearGradient): string {
      const angle = gradient.angle;
      const stops = gradient.stops
        .map(stop => this.buildGradientStop(stop))
        .join(', ');
      
      return `linear-gradient(${angle}deg, ${stops})`;
    }
  
    /**
     * Build radial gradient CSS string
     */
    private static buildRadialGradientString(gradient: RadialGradient): string {
      const shape = gradient.shape;
      const size = gradient.size;
      const centerX = gradient.centerX;
      const centerY = gradient.centerY;
      const stops = gradient.stops
        .map(stop => this.buildGradientStop(stop))
        .join(', ');
      
      const position = `at ${centerX}% ${centerY}%`;
      return `radial-gradient(${shape} ${size} ${position}, ${stops})`;
    }
  
    /**
     * Build gradient stop string
     */
    private static buildGradientStop(stop: GradientStop): string {
      const color = stop.opacity !== undefined 
        ? this.addOpacityToColor(stop.color, stop.opacity)
        : stop.color;
      
      return `${color} ${stop.position}%`;
    }
  
    /**
     * Add opacity to color string
     */
    private static addOpacityToColor(color: string, opacity: number): string {
      // Handle hex colors
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      
      // Handle rgb/rgba colors
      if (color.startsWith('rgb')) {
        if (color.includes('rgba')) {
          // Replace existing alpha value
          return color.replace(/[\d\.]+\)$/, `${opacity})`);
        } else {
          // Convert rgb to rgba
          return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
        }
      }
      
      // For other color formats, wrap in rgba if possible
      return color;
    }
  
    /**
     * Build pattern CSS string
     */
    private static buildPatternString(pattern: PatternConfig): string {
      switch (pattern.type) {
        case 'dots':
          return this.buildDotsPattern(pattern);
        case 'lines':
          return this.buildLinesPattern(pattern);
        case 'grid':
          return this.buildGridPattern(pattern);
        case 'waves':
          return this.buildWavesPattern(pattern);
        case 'geometric':
          return this.buildGeometricPattern(pattern);
        case 'texture':
          return this.buildTexturePattern(pattern);
        case 'custom':
          return pattern.customSvg ? `url("data:image/svg+xml,${encodeURIComponent(pattern.customSvg)}")` : '';
        default:
          return '';
      }
    }
  
    /**
     * Build dots pattern
     */
    private static buildDotsPattern(pattern: PatternConfig): string {
      const size = pattern.scale * 20; // Base size of 20px
      const spacing = pattern.spacing || 1;
      const dotSize = size * 0.2;
      const center = size / 2;
      
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${center}" cy="${center}" r="${dotSize}" 
                  fill="${pattern.primaryColor}" opacity="${pattern.opacity}"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Build lines pattern
     */
    private static buildLinesPattern(pattern: PatternConfig): string {
      const size = pattern.scale * 20;
      const thickness = pattern.thickness || 1;
      const spacing = pattern.spacing || 10;
      const rotation = pattern.rotation || 45;
      
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="${spacing}" 
                    stroke="${pattern.primaryColor}" 
                    stroke-width="${thickness}" 
                    opacity="${pattern.opacity}"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" transform="rotate(${rotation} ${size/2} ${size/2})"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Build grid pattern
     */
    private static buildGridPattern(pattern: PatternConfig): string {
      const size = pattern.scale * 20;
      const thickness = pattern.thickness || 1;
      const spacing = pattern.spacing || 20;
      
      const svg = `
        <svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
              <path d="M ${spacing} 0 L 0 0 0 ${spacing}" 
                    fill="none" 
                    stroke="${pattern.primaryColor}" 
                    stroke-width="${thickness}" 
                    opacity="${pattern.opacity}"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Build waves pattern
     */
    private static buildWavesPattern(pattern: PatternConfig): string {
      const size = pattern.scale * 40;
      const amplitude = size * 0.3;
      const frequency = pattern.spacing || 1;
      
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,${size/2} Q${size/4},${size/2 - amplitude} ${size/2},${size/2} T${size},${size/2}" 
                stroke="${pattern.primaryColor}" 
                stroke-width="${pattern.thickness || 2}" 
                fill="none" 
                opacity="${pattern.opacity}"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Build geometric pattern
     */
    private static buildGeometricPattern(pattern: PatternConfig): string {
      const size = pattern.scale * 30;
      const center = size / 2;
      const radius = size * 0.3;
      
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <polygon points="${center},${center-radius} ${center+radius},${center+radius/2} ${center-radius},${center+radius/2}" 
                   fill="${pattern.primaryColor}" 
                   opacity="${pattern.opacity}"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Build texture pattern (noise-like)
     */
    private static buildTexturePattern(pattern: PatternConfig): string {
      const size = pattern.scale * 10;
      
      // Create a simple noise-like pattern
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence baseFrequency="0.9" numOctaves="1" result="noise"/>
            <feColorMatrix in="noise" type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 .5 0 .5 0 .5 0 .5"/>
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" 
                fill="${pattern.primaryColor}" opacity="${pattern.opacity}"/>
        </svg>
      `;
      
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  
    /**
     * Calculate pattern size for CSS
     */
    private static calculatePatternSize(pattern: PatternConfig): string {
      const baseSize = 20;
      const size = pattern.scale * baseSize;
      return `${size}px ${size}px`;
    }
  
    /**
     * Map image size to CSS background-size
     */
    private static mapImageSize(size: ImageConfig['size']): string {
      switch (size) {
        case 'auto':
          return 'auto';
        case 'cover':
          return 'cover';
        case 'contain':
          return 'contain';
        case 'fill':
          return '100% 100%';
        case 'scale-down':
          return 'contain'; // Fallback to contain
        default:
          return 'cover';
      }
    }
  
    /**
     * Map image position to CSS background-position
     */
    private static mapImagePosition(
      position: ImageConfig['position'], 
      focalPoint?: ImageConfig['focalPoint']
    ): string {
      // Use focal point if provided
      if (focalPoint) {
        return `${focalPoint.x}% ${focalPoint.y}%`;
      }
  
      // Map predefined positions
      switch (position) {
        case 'center':
          return 'center center';
        case 'top':
          return 'center top';
        case 'bottom':
          return 'center bottom';
        case 'left':
          return 'left center';
        case 'right':
          return 'right center';
        case 'top-left':
          return 'left top';
        case 'top-right':
          return 'right top';
        case 'bottom-left':
          return 'left bottom';
        case 'bottom-right':
          return 'right bottom';
        default:
          return 'center center';
      }
    }
  
    /**
     * Build image filters CSS
     */
    private static buildImageFilters(image: ImageConfig): string {
      const filters: string[] = [];
  
      if (image.blur && image.blur > 0) {
        filters.push(`blur(${image.blur}px)`);
      }
  
      if (image.brightness && image.brightness !== 1) {
        filters.push(`brightness(${image.brightness})`);
      }
  
      if (image.contrast && image.contrast !== 1) {
        filters.push(`contrast(${image.contrast})`);
      }
  
      if (image.saturation && image.saturation !== 1) {
        filters.push(`saturate(${image.saturation})`);
      }
  
      if (image.opacity && image.opacity !== 1) {
        filters.push(`opacity(${image.opacity})`);
      }
  
      return filters.length > 0 ? filters.join(' ') : '';
    }
  
    /**
     * Generate CSS custom properties
     */
    private static generateCustomProperties(config: BackgroundConfig): Record<string, string> {
      const properties: Record<string, string> = {
        '--form-bg-type': config.type,
      };
  
      // Add type-specific properties
      switch (config.type) {
        case 'solid':
          if (config.solid) {
            properties['--form-bg-color'] = config.solid.color;
          }
          break;
  
        case 'gradient':
          if (config.gradient) {
            properties['--form-bg-gradient'] = this.buildGradientString(config.gradient);
          }
          break;
  
        case 'pattern':
          if (config.pattern) {
            properties['--form-bg-pattern'] = this.buildPatternString(config.pattern);
            properties['--form-bg-pattern-scale'] = config.pattern.scale.toString();
            properties['--form-bg-pattern-opacity'] = config.pattern.opacity.toString();
          }
          break;
  
        case 'image':
          if (config.image) {
            properties['--form-bg-image'] = `url(${config.image.url})`;
            properties['--form-bg-size'] = this.mapImageSize(config.image.size);
            properties['--form-bg-position'] = this.mapImagePosition(config.image.position, config.image.focalPoint);
            properties['--form-bg-repeat'] = config.image.repeat;
            
            const filters = this.buildImageFilters(config.image);
            if (filters) {
              properties['--form-bg-image-filter'] = filters;
            }
          }
          break;
      }
  
      // Add overlay properties
      if (config.overlay?.enabled) {
        properties['--form-bg-overlay-color'] = config.overlay.color;
        properties['--form-bg-overlay-opacity'] = config.overlay.opacity.toString();
        
        if (config.overlay.blendMode) {
          properties['--form-bg-overlay-blend-mode'] = config.overlay.blendMode;
        }
      }
  
      return properties;
    }
  
    /**
     * Generate responsive CSS
     */
    static generateResponsiveCSS(
      config: BackgroundConfig,
      mobileConfig?: Partial<BackgroundConfig>,
      tabletConfig?: Partial<BackgroundConfig>
    ): { desktop: BackgroundCSS; tablet?: BackgroundCSS; mobile?: BackgroundCSS } {
      const desktop = this.generateCSS(config);
      
      const result: { desktop: BackgroundCSS; tablet?: BackgroundCSS; mobile?: BackgroundCSS } = {
        desktop
      };
  
      if (tabletConfig) {
        const mergedTabletConfig = { ...config, ...tabletConfig };
        result.tablet = this.generateCSS(mergedTabletConfig);
      }
  
      if (mobileConfig) {
        const mergedMobileConfig = { ...config, ...mobileConfig };
        result.mobile = this.generateCSS(mergedMobileConfig);
      }
  
      return result;
    }
  
    /**
     * Generate CSS with animation
     */
    static generateAnimatedCSS(config: BackgroundConfig, animation?: BackgroundAnimation): BackgroundCSS {
      const css = this.generateCSS(config);
  
      if (animation?.enabled && animation.type !== 'none') {
        css.customProperties['--form-bg-animation'] = this.buildAnimationCSS(animation);
        
        // Add animation-specific properties
        switch (animation.type) {
          case 'parallax':
            css.backgroundAttachment = 'fixed';
            break;
          case 'floating':
            css.customProperties['--form-bg-animation-duration'] = `${animation.duration}ms`;
            css.customProperties['--form-bg-animation-easing'] = animation.easing;
            break;
        }
      }
  
      return css;
    }
  
    /**
     * Build animation CSS
     */
    private static buildAnimationCSS(animation: BackgroundAnimation): string {
      const keyframes = this.generateAnimationKeyframes(animation);
      const animationCSS = `${keyframes} ${animation.duration}ms ${animation.easing} infinite`;
      
      return animationCSS;
    }
  
    /**
     * Generate animation keyframes name
     */
    private static generateAnimationKeyframes(animation: BackgroundAnimation): string {
      switch (animation.type) {
        case 'floating':
          return 'formBgFloating';
        case 'pulse':
          return 'formBgPulse';
        case 'wave':
          return 'formBgWave';
        case 'rotate':
          return 'formBgRotate';
        default:
          return 'formBgDefault';
      }
    }
  
    /**
     * Inject CSS keyframes for animations
     */
    static injectAnimationKeyframes(): void {
      if (typeof document === 'undefined') return;
  
      const keyframes = `
        @keyframes formBgFloating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes formBgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes formBgWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes formBgRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
  
      let styleElement = document.getElementById('form-bg-animations') as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'form-bg-animations';
        styleElement.type = 'text/css';
        document.head.appendChild(styleElement);
      }
  
      styleElement.textContent = keyframes;
    }
  
    /**
     * Validate background accessibility
     */
    static validateAccessibility(
      config: BackgroundConfig,
      textColor: string = '#000000'
    ): { contrastRatio: number; isAccessible: boolean; recommendation: string } {
      // This is a simplified version - in production you'd want more sophisticated contrast calculation
      let backgroundColor = '#ffffff';
  
      if (config.type === 'solid' && config.solid) {
        backgroundColor = config.solid.color;
      }
  
      // Calculate contrast ratio (simplified)
      const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor);
      const isAccessible = contrastRatio >= 4.5;
  
      return {
        contrastRatio,
        isAccessible,
        recommendation: isAccessible 
          ? 'Good contrast ratio for accessibility'
          : 'Consider using a darker text color or lighter background for better readability'
      };
    }
  
    /**
     * Calculate contrast ratio between two colors (simplified)
     */
    private static calculateContrastRatio(color1: string, color2: string): number {
      // This is a simplified implementation
      // In production, you'd want to use a proper color contrast library
      
      const getLuminance = (color: string): number => {
        // Convert hex to RGB and calculate relative luminance
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
  
        const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
        return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
      };
  
      const l1 = getLuminance(color1);
      const l2 = getLuminance(color2);
  
      const brightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);
  
      return (brightest + 0.05) / (darkest + 0.05);
    }
  }
  
  /**
   * CSS Property Manager for backgrounds
   */
  export class BackgroundCSSManager {
    private static instance: BackgroundCSSManager;
    private currentConfig: BackgroundConfig | null = null;
  
    static getInstance(): BackgroundCSSManager {
      if (!BackgroundCSSManager.instance) {
        BackgroundCSSManager.instance = new BackgroundCSSManager();
      }
      return BackgroundCSSManager.instance;
    }
  
    /**
     * Apply background configuration
     */
    applyConfiguration(config: BackgroundConfig, animation?: BackgroundAnimation): void {
      const css = animation 
        ? BackgroundCSSGenerator.generateAnimatedCSS(config, animation)
        : BackgroundCSSGenerator.generateCSS(config);
  
      this.injectCSS(css);
      this.currentConfig = config;
  
      // Inject animation keyframes if needed
      if (animation?.enabled) {
        BackgroundCSSGenerator.injectAnimationKeyframes();
      }
    }
  
    /**
     * Inject CSS into document
     */
    private injectCSS(css: BackgroundCSS): void {
      if (typeof document === 'undefined') return;
  
      let styleElement = document.getElementById('form-background-css') as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'form-background-css';
        styleElement.type = 'text/css';
        document.head.appendChild(styleElement);
      }
  
      // Build CSS rules
      const cssRules = this.buildCSSRules(css);
      styleElement.textContent = cssRules;
    }
  
    /**
     * Build CSS rules from BackgroundCSS object
     */
    private buildCSSRules(css: BackgroundCSS): string {
      let rules = '';
  
      // Root variables
      if (Object.keys(css.customProperties).length > 0) {
        rules += ':root {\n';
        Object.entries(css.customProperties).forEach(([property, value]) => {
          rules += `  ${property}: ${value};\n`;
        });
        rules += '}\n\n';
      }
  
      // Form container background
      rules += '.form-theme-container {\n';
      
      if (css.backgroundColor) {
        rules += `  background-color: ${css.backgroundColor};\n`;
      }
      
      if (css.backgroundImage) {
        rules += `  background-image: ${css.backgroundImage};\n`;
      }
      
      if (css.backgroundSize) {
        rules += `  background-size: ${css.backgroundSize};\n`;
      }
      
      if (css.backgroundPosition) {
        rules += `  background-position: ${css.backgroundPosition};\n`;
      }
      
      if (css.backgroundRepeat) {
        rules += `  background-repeat: ${css.backgroundRepeat};\n`;
      }
      
      if (css.backgroundAttachment) {
        rules += `  background-attachment: ${css.backgroundAttachment};\n`;
      }
  
      rules += '}\n\n';
  
      // Overlay styles
      if (css.overlay) {
        rules += '.form-theme-container::before {\n';
        rules += '  content: "";\n';
        rules += '  position: absolute;\n';
        rules += '  top: 0;\n';
        rules += '  left: 0;\n';
        rules += '  right: 0;\n';
        rules += '  bottom: 0;\n';
        rules += `  background: ${css.overlay.background};\n`;
        rules += `  opacity: ${css.overlay.opacity};\n`;
        
        if (css.overlay.mixBlendMode) {
          rules += `  mix-blend-mode: ${css.overlay.mixBlendMode};\n`;
        }
        
        rules += '  pointer-events: none;\n';
        rules += '}\n\n';
      }
  
      return rules;
    }
  
    /**
     * Get current configuration
     */
    getCurrentConfiguration(): BackgroundConfig | null {
      return this.currentConfig;
    }
  
    /**
     * Reset background styles
     */
    reset(): void {
      if (typeof document !== 'undefined') {
        const styleElement = document.getElementById('form-background-css');
        if (styleElement) {
          styleElement.textContent = '';
        }
      }
      
      this.currentConfig = null;
    }
  }