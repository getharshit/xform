// src/components/public-form/themes/colors/types.ts

export interface ColorPalette {
    // Brand colors
    primary: string;           // Main brand color (buttons, links, progress)
    secondary: string;         // Accent color (highlights, hover states)
    tertiary: string;          // Subtle color (borders, dividers)
    
    // Text colors
    textPrimary: string;       // Main text color
    textSecondary: string;     // Subdued text color
    textTertiary: string;      // Very light text (captions, hints)
    textInverse: string;       // Text on colored backgrounds
    
    // Background colors
    background: string;        // Main page background
    surface: string;           // Card/form backgrounds
    surfaceElevated: string;   // Elevated surfaces (modals, dropdowns)
    
    // State colors
    success: string;           // Success states and messages
    warning: string;           // Warning states and messages
    error: string;             // Error states and messages
    info: string;              // Informational states and messages
    
    // Interactive colors
    focus: string;             // Focus ring color
    selection: string;         // Text selection background
    overlay: string;           // Modal overlay background
  }
  
  export interface ColorAccessibility {
    contrastRatio: number;     // Calculated contrast ratio
    isAccessible: boolean;     // Meets WCAG AA (4.5:1)
    isHighContrast: boolean;   // Meets WCAG AAA (7:1)
    recommendation?: string;   // Suggested improvement
  }
  
  export interface ColorAnalysis {
    color: string;
    accessibility: Record<string, ColorAccessibility>; // Against each background
    harmony: {
      complementary: string;
      analogous: string[];
      triadic: string[];
      monochromatic: string[];
    };
    variations: {
      lighter: string[];        // 5 lighter variants
      darker: string[];         // 5 darker variants
      saturated: string[];      // More saturated variants
      desaturated: string[];    // Less saturated variants
    };
  }
  
  export interface ColorCustomization {
    palette: ColorPalette;
    
    // Color generation settings
    autoGenerateVariants: boolean;    // Auto-create hover/active states
    contrastThreshold: number;        // Minimum acceptable contrast
    harmonizeColors: boolean;         // Keep colors harmonious
    
    // Accessibility settings
    enforceAccessibility: boolean;    // Block inaccessible combinations
    showContrastWarnings: boolean;    // Display contrast warnings
    highContrastMode: boolean;        // Enable high contrast mode
    
    // Color space preferences
    colorSpace: 'rgb' | 'hsl' | 'oklch';  // Preferred color manipulation space
    gamutMapping: 'clip' | 'compress';    // How to handle out-of-gamut colors
  }
  
  export interface ColorPreset {
    id: string;
    name: string;
    description: string;
    category: 'light' | 'dark' | 'colorful' | 'minimal' | 'accessible';
    palette: ColorPalette;
    accessibility: {
      minimumContrast: number;
      supportedStandards: ('AA' | 'AAA')[];
    };
  }
  
  // Color picker configuration
  export interface ColorPickerConfig {
    format: 'hex' | 'rgb' | 'hsl';
    showAlpha: boolean;
    showPalette: boolean;
    showPresets: boolean;
    eyedropperEnabled: boolean;
    recentColors: string[];
  }
  
  // Real-time color update event
  export interface ColorUpdateEvent {
    colorKey: keyof ColorPalette;
    oldValue: string;
    newValue: string;
    accessibility: ColorAccessibility[];
    affectedElements: string[];
  }