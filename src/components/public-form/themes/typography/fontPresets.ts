// src/components/public-form/themes/typography/fontPresets.ts

import { FontFamilyConfig } from './types';

/**
 * System font configurations
 */
export const systemFonts: FontFamilyConfig[] = [
  {
    id: 'system-ui',
    name: 'System UI',
    family: 'system-ui',
    fallbacks: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
    weights: [400, 500, 600, 700],
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'georgia',
    name: 'Georgia',
    family: 'Georgia',
    fallbacks: ['Times New Roman', 'Times', 'serif'],
    weights: [400, 700],
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    family: 'Helvetica Neue',
    fallbacks: ['Helvetica', 'Arial', 'sans-serif'],
    weights: [300, 400, 500, 700],
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'times',
    name: 'Times New Roman',
    family: 'Times New Roman',
    fallbacks: ['Times', 'serif'],
    weights: [400, 700],
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'courier',
    name: 'Courier New',
    family: 'Courier New',
    fallbacks: ['Courier', 'monospace'],
    weights: [400, 700],
    preview: {
      text: 'The quick brown fox jumps',
      size: 14
    }
  }
];

/**
 * Popular Google Fonts configurations
 */
export const googleFonts: FontFamilyConfig[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 500, 600, 700],
    googleFont: {
      family: 'Inter',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'Roboto',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 500, 700],
    googleFont: {
      family: 'Roboto',
      weights: [300, 400, 500, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'Open Sans',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 600, 700],
    googleFont: {
      family: 'Open Sans',
      weights: [300, 400, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'lato',
    name: 'Lato',
    family: 'Lato',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 700],
    googleFont: {
      family: 'Lato',
      weights: [300, 400, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'source-sans-pro',
    name: 'Source Sans Pro',
    family: 'Source Sans Pro',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 600, 700],
    googleFont: {
      family: 'Source Sans Pro',
      weights: [300, 400, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'nunito',
    name: 'Nunito',
    family: 'Nunito',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 600, 700],
    googleFont: {
      family: 'Nunito',
      weights: [300, 400, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: 'Poppins',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 500, 600, 700],
    googleFont: {
      family: 'Poppins',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'Montserrat',
    fallbacks: ['system-ui', 'sans-serif'],
    weights: [300, 400, 500, 600, 700],
    googleFont: {
      family: 'Montserrat',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  // Serif fonts
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    family: 'Playfair Display',
    fallbacks: ['Georgia', 'serif'],
    weights: [400, 500, 600, 700],
    googleFont: {
      family: 'Playfair Display',
      weights: [400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: 'Merriweather',
    fallbacks: ['Georgia', 'serif'],
    weights: [300, 400, 700],
    googleFont: {
      family: 'Merriweather',
      weights: [300, 400, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  {
    id: 'lora',
    name: 'Lora',
    family: 'Lora',
    fallbacks: ['Georgia', 'serif'],
    weights: [400, 500, 600, 700],
    googleFont: {
      family: 'Lora',
      weights: [400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps over the lazy dog',
      size: 16
    }
  },
  // Monospace fonts
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: 'Fira Code',
    fallbacks: ['Monaco', 'Menlo', 'monospace'],
    weights: [300, 400, 500, 600, 700],
    googleFont: {
      family: 'Fira Code',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps',
      size: 14
    }
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    family: 'Source Code Pro',
    fallbacks: ['Monaco', 'Menlo', 'monospace'],
    weights: [300, 400, 500, 600, 700],
    googleFont: {
      family: 'Source Code Pro',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin', 'latin-ext'],
      display: 'swap'
    },
    preview: {
      text: 'The quick brown fox jumps',
      size: 14
    }
  }
];

/**
 * Font categories for organization
 */
export const fontCategories = {
  system: {
    name: 'System Fonts',
    description: 'Native fonts that load instantly',
    fonts: systemFonts
  },
  sansSerif: {
    name: 'Sans Serif',
    description: 'Clean, modern fonts without serifs',
    fonts: googleFonts.filter(font => ['inter', 'roboto', 'open-sans', 'lato', 'source-sans-pro', 'nunito', 'poppins', 'montserrat'].includes(font.id))
  },
  serif: {
    name: 'Serif',
    description: 'Traditional fonts with serifs',
    fonts: googleFonts.filter(font => ['playfair-display', 'merriweather', 'lora'].includes(font.id))
  },
  monospace: {
    name: 'Monospace',
    description: 'Fixed-width fonts for code',
    fonts: googleFonts.filter(font => ['fira-code', 'source-code-pro'].includes(font.id))
  }
};

/**
 * Default font combinations
 */
export const fontCombinations = [
  {
    id: 'modern-clean',
    name: 'Modern & Clean',
    description: 'Perfect for professional forms',
    primary: 'inter',
    secondary: 'inter',
    mono: 'fira-code'
  },
  {
    id: 'friendly-approachable',
    name: 'Friendly & Approachable',
    description: 'Great for surveys and feedback forms',
    primary: 'nunito',
    secondary: 'open-sans',
    mono: 'source-code-pro'
  },
  {
    id: 'elegant-sophisticated',
    name: 'Elegant & Sophisticated',
    description: 'Ideal for luxury or high-end forms',
    primary: 'playfair-display',
    secondary: 'lato',
    mono: 'source-code-pro'
  },
  {
    id: 'system-performance',
    name: 'System Performance',
    description: 'Maximum performance with system fonts',
    primary: 'system-ui',
    secondary: 'system-ui',
    mono: 'courier'
  },
  {
    id: 'readable-accessible',
    name: 'Readable & Accessible',
    description: 'Optimized for accessibility',
    primary: 'source-sans-pro',
    secondary: 'source-sans-pro',
    mono: 'source-code-pro'
  }
];

/**
 * Font utilities
 */
export class FontPresetManager {
  /**
   * Get all available fonts
   */
  static getAllFonts(): FontFamilyConfig[] {
    return [...systemFonts, ...googleFonts];
  }

  /**
   * Get font by ID
   */
  static getFontById(id: string): FontFamilyConfig | undefined {
    return this.getAllFonts().find(font => font.id === id);
  }

  /**
   * Get fonts by category
   */
  static getFontsByCategory(category: keyof typeof fontCategories): FontFamilyConfig[] {
    return fontCategories[category]?.fonts || [];
  }

  /**
   * Search fonts by name
   */
  static searchFonts(query: string): FontFamilyConfig[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllFonts().filter(font =>
      font.name.toLowerCase().includes(lowercaseQuery) ||
      font.family.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get font combination by ID
   */
  static getFontCombination(id: string) {
    return fontCombinations.find(combo => combo.id === id);
  }

  /**
   * Get recommended fonts for specific use cases
   */
  static getRecommendedFonts(useCase: 'forms' | 'reading' | 'display' | 'ui'): FontFamilyConfig[] {
    switch (useCase) {
      case 'forms':
        return this.getAllFonts().filter(font =>
          ['inter', 'roboto', 'open-sans', 'source-sans-pro', 'system-ui'].includes(font.id)
        );
      case 'reading':
        return this.getAllFonts().filter(font =>
          ['lora', 'merriweather', 'source-sans-pro', 'georgia'].includes(font.id)
        );
      case 'display':
        return this.getAllFonts().filter(font =>
          ['playfair-display', 'montserrat', 'poppins'].includes(font.id)
        );
      case 'ui':
        return this.getAllFonts().filter(font =>
          ['inter', 'system-ui', 'roboto', 'nunito'].includes(font.id)
        );
      default:
        return this.getAllFonts();
    }
  }

  /**
   * Validate font availability
   */
  static async validateFontAvailability(font: FontFamilyConfig): Promise<boolean> {
    // System fonts are always available
    if (systemFonts.some(f => f.id === font.id)) {
      return true;
    }

    // For Google Fonts, check if CSS is loadable
    if (font.googleFont) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFont.family)}:wght@400`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);
        return response.ok;
      } catch {
        return false;
      }
    }

    return false;
  }
}

// Export default fonts for quick access
export const defaultFonts = {
  primary: systemFonts[0], // System UI
  secondary: systemFonts[0], // System UI
  mono: systemFonts[4] // Courier New
};