// src/components/public-form/themes/typography/fontLoader.ts

import { FontFamilyConfig, FontLoadingState, FontDisplay } from './types';

/**
 * Font loading and management system
 */
export class FontLoader {
  private static instance: FontLoader;
  private loadedFonts = new Map<string, FontLoadingState>();
  private loadingPromises = new Map<string, Promise<FontFace>>();
  private observers: ((state: FontLoadingState) => void)[] = [];

  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }

  private constructor() {
    // Initialize font loading detection
    this.initializeFontLoadingDetection();
  }

  /**
   * Load a font family configuration
   */
  async loadFont(config: FontFamilyConfig): Promise<FontLoadingState> {
    const fontKey = this.getFontKey(config);
    
    // Return existing state if already loaded or loading
    if (this.loadedFonts.has(fontKey)) {
      return this.loadedFonts.get(fontKey)!;
    }

    // Set initial loading state
    const initialState: FontLoadingState = {
      family: config.family,
      status: 'loading'
    };
    this.loadedFonts.set(fontKey, initialState);
    this.notifyObservers(initialState);

    try {
      if (config.googleFont) {
        await this.loadGoogleFont(config);
      } else {
        await this.loadSystemFont(config);
      }

      const successState: FontLoadingState = {
        family: config.family,
        status: 'loaded',
        loadTime: Date.now()
      };
      this.loadedFonts.set(fontKey, successState);
      this.notifyObservers(successState);
      return successState;

    } catch (error) {
      const errorState: FontLoadingState = {
        family: config.family,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.loadedFonts.set(fontKey, errorState);
      this.notifyObservers(errorState);
      return errorState;
    }
  }

  /**
   * Load Google Font
   */
  private async loadGoogleFont(config: FontFamilyConfig): Promise<void> {
    if (!config.googleFont) return;

    const { family, weights, subsets, display } = config.googleFont;
    
    // Build Google Fonts URL
    const weightsParam = weights.join(',');
    const subsetsParam = subsets.join(',');
    const displayParam = display || 'swap';
    
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weightsParam}&subset=${subsetsParam}&display=${displayParam}`;

    // Load CSS
    await this.loadFontCSS(url);

    // Verify font loading with FontFace API
    for (const weight of weights) {
      const fontFace = new FontFace(family, `url(https://fonts.gstatic.com/...)`, {
        weight: weight.toString(),
        display: displayParam
      });
      
      await this.loadFontFace(fontFace);
    }
  }

  /**
   * Load system font
   */
  private async loadSystemFont(config: FontFamilyConfig): Promise<void> {
    // For system fonts, we just need to verify they exist
    const testFont = new FontFace(config.family, 'local(' + config.family + ')');
    await this.loadFontFace(testFont);
  }

  /**
   * Load font CSS file
   */
  private async loadFontCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existingLink = document.querySelector(`link[href="${url}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load font CSS: ${url}`));
      
      // Add preconnect for performance
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      preconnect.crossOrigin = 'anonymous';
      
      const preconnectGstatic = document.createElement('link');
      preconnectGstatic.rel = 'preconnect';
      preconnectGstatic.href = 'https://fonts.gstatic.com';
      preconnectGstatic.crossOrigin = 'anonymous';

      document.head.appendChild(preconnect);
      document.head.appendChild(preconnectGstatic);
      document.head.appendChild(link);
    });
  }

  /**
   * Load individual font face
   */
  private async loadFontFace(fontFace: FontFace): Promise<FontFace> {
    const fontKey = `${fontFace.family}-${fontFace.weight}`;
    
    // Return existing promise if already loading
    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!;
    }

    const promise = fontFace.load().then(() => {
      document.fonts.add(fontFace);
      return fontFace;
    });

    this.loadingPromises.set(fontKey, promise);
    
    try {
      return await promise;
    } finally {
      this.loadingPromises.delete(fontKey);
    }
  }

  /**
   * Preload fonts for performance
   */
  async preloadFonts(configs: FontFamilyConfig[]): Promise<void> {
    const promises = configs.map(config => this.loadFont(config));
    await Promise.allSettled(promises);
  }

  /**
   * Get font loading state
   */
  getFontState(config: FontFamilyConfig): FontLoadingState | null {
    const fontKey = this.getFontKey(config);
    return this.loadedFonts.get(fontKey) || null;
  }

  /**
   * Check if font is loaded
   */
  isFontLoaded(config: FontFamilyConfig): boolean {
    const state = this.getFontState(config);
    return state?.status === 'loaded';
  }

  /**
   * Get all loaded fonts
   */
  getAllLoadedFonts(): FontLoadingState[] {
    return Array.from(this.loadedFonts.values());
  }

  /**
   * Subscribe to font loading updates
   */
  subscribe(callback: (state: FontLoadingState) => void): () => void {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Clear font cache
   */
  clearCache(): void {
    this.loadedFonts.clear();
    this.loadingPromises.clear();
  }

  /**
   * Initialize font loading detection
   */
  private initializeFontLoadingDetection(): void {
    if (typeof document === 'undefined') return;

    // Listen for font loading events
    document.fonts.addEventListener('loadingdone', (event) => {
      console.log('Font loading completed');
    });

    document.fonts.addEventListener('loadingerror', (event) => {
      console.error('Font loading error:', event);
    });
  }

  /**
   * Notify observers of state changes
   */
  private notifyObservers(state: FontLoadingState): void {
    this.observers.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in font loading observer:', error);
      }
    });
  }

  /**
   * Generate unique key for font configuration
   */
  private getFontKey(config: FontFamilyConfig): string {
    return `${config.family}-${config.weights.join('-')}`;
  }
}

/**
 * Font fallback system
 */
export class FontFallbackManager {
  private static webSafeFallbacks = {
    serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
    sansSerif: ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
    monospace: ['Monaco', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
    cursive: ['Apple Chancery', 'Dancing Script', 'cursive'],
    fantasy: ['Papyrus', 'Herculanum', 'fantasy']
  };

  /**
   * Build font stack with fallbacks
   */
  static buildFontStack(primary: string, category: keyof typeof FontFallbackManager.webSafeFallbacks = 'sansSerif'): string {
    const fallbacks = this.webSafeFallbacks[category];
    return [primary, ...fallbacks].join(', ');
  }

  /**
   * Get system font stack
   */
  static getSystemFontStack(): string {
    return [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(', ');
  }

  /**
   * Validate font availability
   */
  static async validateFont(fontFamily: string): Promise<boolean> {
    if (typeof document === 'undefined') return false;

    try {
      const testText = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const testSize = '72px';
      
      // Create test elements
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.fontSize = testSize;
      testElement.style.fontFamily = fontFamily;
      testElement.innerHTML = testText;
      
      const fallbackElement = document.createElement('div');
      fallbackElement.style.position = 'absolute';
      fallbackElement.style.left = '-9999px';
      fallbackElement.style.fontSize = testSize;
      fallbackElement.style.fontFamily = 'serif';
      fallbackElement.innerHTML = testText;
      
      document.body.appendChild(testElement);
      document.body.appendChild(fallbackElement);
      
      // Compare dimensions
      const fontExists = testElement.offsetWidth !== fallbackElement.offsetWidth ||
                        testElement.offsetHeight !== fallbackElement.offsetHeight;
      
      // Cleanup
      document.body.removeChild(testElement);
      document.body.removeChild(fallbackElement);
      
      return fontExists;
    } catch (error) {
      console.error('Font validation error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const fontLoader = FontLoader.getInstance();