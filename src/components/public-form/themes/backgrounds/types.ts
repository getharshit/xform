// src/components/public-form/themes/backgrounds/types.ts

export type BackgroundType = 
  | 'solid'       // Single color background
  | 'gradient'    // Linear or radial gradient
  | 'pattern'     // Repeating patterns/textures
  | 'image'     // Custom uploaded image
  | 'animated';

export type GradientType = 
  | 'linear'      // Linear gradient
  | 'radial';     // Radial gradient

export type PatternType = 
  | 'dots'        // Polka dots pattern
  | 'lines'       // Diagonal lines
  | 'grid'        // Grid pattern
  | 'waves'       // Wave pattern
  | 'geometric'   // Geometric shapes
  | 'texture'     // Textured patterns
  | 'custom';     // Custom uploaded pattern

export type ImagePosition = 
  | 'center'      // Center the image
  | 'top'         // Top center
  | 'bottom'      // Bottom center
  | 'left'        // Left center
  | 'right'       // Right center
  | 'top-left'    // Top left corner
  | 'top-right'   // Top right corner
  | 'bottom-left' // Bottom left corner
  | 'bottom-right'; // Bottom right corner

export type ImageSize = 
  | 'auto'        // Original size
  | 'cover'       // Cover entire area
  | 'contain'     // Fit within area
  | 'fill'        // Stretch to fill
  | 'scale-down'; // Scale down if larger

export type ImageRepeat = 
  | 'no-repeat'   // Don't repeat
  | 'repeat'      // Repeat both directions
  | 'repeat-x'    // Repeat horizontally
  | 'repeat-y';   // Repeat vertically

// Gradient configuration
export interface GradientStop {
  color: string;              // Color at this stop
  position: number;           // Position from 0-100%
  opacity?: number;           // Optional opacity 0-1
}

export interface LinearGradient {
  type: 'linear';
  angle: number;              // Angle in degrees (0-360)
  stops: GradientStop[];     // Array of color stops
}

export interface RadialGradient {
  type: 'radial';
  centerX: number;           // Center X position (0-100%)
  centerY: number;           // Center Y position (0-100%)
  shape: 'circle' | 'ellipse'; // Gradient shape
  size: 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner';
  stops: GradientStop[];     // Array of color stops
}

export type GradientConfig = LinearGradient | RadialGradient;

// Pattern configuration
export interface PatternConfig {
  type: PatternType;
  primaryColor: string;       // Main pattern color
  secondaryColor?: string;    // Secondary pattern color (if applicable)
  scale: number;              // Pattern scale (0.1-5.0)
  opacity: number;            // Pattern opacity (0-1)
  rotation?: number;          // Pattern rotation in degrees
  spacing?: number;           // Spacing between pattern elements
  thickness?: number;         // Line thickness for line patterns
  customSvg?: string;         // Custom SVG pattern (for custom type)
}

// Image background configuration
export interface ImageConfig {
  url: string;                // Image URL or data URL
  fileName?: string;          // Original file name
  fileSize?: number;          // File size in bytes
  position: ImagePosition;    // Image positioning
  size: ImageSize;            // Image sizing
  repeat: ImageRepeat;        // Image repeat behavior
  opacity?: number;           // Image opacity (0-1)
  blur?: number;              // Blur effect (0-10px)
  brightness?: number;        // Brightness adjustment (0-2)
  contrast?: number;          // Contrast adjustment (0-2)
  saturation?: number;        // Saturation adjustment (0-2)
  focalPoint?: {              // Custom focal point for 'cover' sizing
    x: number;                // X position (0-100%)
    y: number;                // Y position (0-100%)
  };
}

// Background overlay for text readability
export interface BackgroundOverlay {
  enabled: boolean;
  color: string;              // Overlay color
  opacity: number;            // Overlay opacity (0-1)
  blendMode?: 'normal' | 'multiply' | 'overlay' | 'soft-light' | 'hard-light';
  gradientOverlay?: {         // Optional gradient overlay
    enabled: boolean;
    gradient: GradientConfig;
  };
}

export interface AnimatedBackgroundConfig {
  type: 'aurora' | 'darkVeil' | 'lightRays';
  
  // Aurora-specific properties
  aurora?: {
    colorStops: string[];     // Array of colors for the aurora
    amplitude: number;        // Animation amplitude (0-2)
    blend: number;           // Blend factor (0-1)
    speed: number;           // Animation speed (0-2)
  };
  
  // DarkVeil-specific properties
  darkVeil?: {
    hueShift: number;        // Hue shift (0-360)
    noiseIntensity: number;  // Noise intensity (0-1)
    scanlineIntensity: number; // Scanline intensity (0-1)
    speed: number;           // Animation speed (0-2)
    scanlineFrequency: number; // Scanline frequency (0-10)
    warpAmount: number;      // Warp distortion (0-1)
  };
  
  // LightRays-specific properties
  lightRays?: {
    raysOrigin: 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
    raysColor: string;       // Color of the rays
    raysSpeed: number;       // Animation speed (0-2)
    lightSpread: number;     // Light spread (0-2)
    rayLength: number;       // Ray length (0-3)
    pulsating: boolean;      // Whether rays pulsate
    fadeDistance: number;    // Fade distance (0-2)
    saturation: number;      // Color saturation (0-2)
    followMouse: boolean;    // Whether rays follow mouse
    mouseInfluence: number;  // Mouse influence (0-1)
    noiseAmount: number;     // Noise amount (0-1)
    distortion: number;      // Distortion amount (0-1)
  };
}

// Main background configuration
export interface BackgroundConfig {
  type: BackgroundType;
  
  // Type-specific configurations
  solid?: {
    color: string;            // Solid background color
  };
  
  gradient?: GradientConfig;  // Gradient configuration
  pattern?: PatternConfig;    // Pattern configuration
  image?: ImageConfig;        // Image configuration
  animated?: AnimatedBackgroundConfig;
  
  // Overlay for better text readability
  overlay?: BackgroundOverlay;
  
  // Accessibility and validation
  accessibility: {
    contrastRatio: number;    // Calculated contrast ratio with text
    isReadable: boolean;      // Whether text is readable on this background
    wcagLevel: 'A' | 'AA' | 'AAA' | 'FAIL'; // WCAG compliance level
  };
  
  // Performance considerations
  performance: {
    isOptimized: boolean;     // Whether images are optimized
    loadTime?: number;        // Estimated load time (ms)
    fileSize?: number;        // Total file size (bytes)
  };
}

// Background preset for quick selection
export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  category: 'solid' | 'gradient' | 'pattern' | 'image' | 'professional' | 'creative';
  config: BackgroundConfig;
  preview: string;            // Preview image URL or data URL
  isPremium?: boolean;        // Whether this is a premium preset
  tags: string[];             // Searchable tags
}

// File upload configuration and validation
export interface FileUploadConfig {
  allowedTypes: string[];     // Allowed MIME types
  maxFileSize: number;        // Maximum file size in bytes
  maxDimensions: {
    width: number;            // Maximum width in pixels
    height: number;           // Maximum height in pixels
  };
  quality: {
    compression: number;      // JPEG compression quality (0-1)
    format: 'original' | 'webp' | 'jpeg' | 'png'; // Preferred output format
  };
  validation: {
    requireDimensions: boolean; // Whether to validate image dimensions
    requireAspectRatio?: number; // Required aspect ratio (width/height)
    blacklistKeywords: string[]; // Keywords to reject in filenames
  };
}

// Background validation result
export interface BackgroundValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  accessibility: {
    contrastIssues: string[];
    readabilityScore: number; // 0-100
    recommendations: string[];
  };
  performance: {
    optimizationSuggestions: string[];
    estimatedLoadTime: number;
    sizereduction: {
      possible: boolean;
      currentSize: number;
      optimizedSize: number;
      savings: number;        // Percentage savings
    };
  };
}

// Background generation utilities
export interface BackgroundGeneratorOptions {
  type: BackgroundType;
  seed?: string;              // Random seed for consistent generation
  colorScheme?: string[];     // Base colors to use
  complexity?: 'simple' | 'medium' | 'complex'; // Pattern complexity
  accessibility?: {
    ensureReadability: boolean;
    targetContrast: number;
    textColor: string;
  };
}

// CSS generation result
export interface BackgroundCSS {
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  background?: string;        // Combined background shorthand
  overlay?: {
    background: string;
    mixBlendMode?: string;
    opacity: number;
  };
  customProperties: Record<string, string>; // CSS custom properties
}

// Background animation configuration
export interface BackgroundAnimation {
  enabled: boolean;
  type: 'none' | 'parallax' | 'floating' | 'pulse' | 'wave' | 'rotate';
  duration: number;           // Animation duration in ms
  easing: string;             // CSS easing function
  intensity: number;          // Animation intensity (0-1)
  respectReducedMotion: boolean; // Honor prefers-reduced-motion
}

// Complete background customization state
export interface BackgroundCustomization {
  config: BackgroundConfig;
  animation?: BackgroundAnimation;
  responsive: {
    mobile: Partial<BackgroundConfig>; // Mobile-specific overrides
    tablet: Partial<BackgroundConfig>; // Tablet-specific overrides
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    customizerId?: string;    // ID of user who customized
  };
}

// Background manager state
export interface BackgroundManagerState {
  current: BackgroundCustomization;
  presets: BackgroundPreset[];
  isLoading: boolean;
  uploadProgress?: number;    // File upload progress (0-100)
  error: string | null;
  validation: BackgroundValidationResult | null;
  preview: {
    enabled: boolean;
    url?: string;             // Preview image URL
    isGenerating: boolean;
  };
}

// Background update actions
export type BackgroundAction = 
  | { type: 'SET_BACKGROUND'; payload: BackgroundConfig }
  | { type: 'UPDATE_BACKGROUND'; payload: Partial<BackgroundConfig> }
  | { type: 'SET_ANIMATION'; payload: BackgroundAnimation }
  | { type: 'SET_OVERLAY'; payload: BackgroundOverlay }
  | { type: 'UPLOAD_START'; payload: { fileName: string; fileSize: number } }
  | { type: 'UPLOAD_PROGRESS'; payload: number }
  | { type: 'UPLOAD_SUCCESS'; payload: { url: string; config: ImageConfig } }
  | { type: 'UPLOAD_ERROR'; payload: string }
  | { type: 'SET_VALIDATION'; payload: BackgroundValidationResult }
  | { type: 'SET_PREVIEW'; payload: { enabled: boolean; url?: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_BACKGROUND' };

// Event handlers for background management
export interface BackgroundEventHandlers {
  onBackgroundChange: (config: BackgroundConfig) => void;
  onUploadStart: (file: File) => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (url: string, config: ImageConfig) => void;
  onUploadError: (error: string) => void;
  onValidationChange: (result: BackgroundValidationResult) => void;
  onPreviewGenerate: () => void;
  onPresetSelect: (preset: BackgroundPreset) => void;
}

// Utility type for background CSS custom properties
export interface BackgroundCSSProperties {
  '--form-bg-type': string;
  '--form-bg-color'?: string;
  '--form-bg-image'?: string;
  '--form-bg-size'?: string;
  '--form-bg-position'?: string;
  '--form-bg-repeat'?: string;
  '--form-bg-gradient'?: string;
  '--form-bg-pattern'?: string;
  '--form-bg-overlay-color'?: string;
  '--form-bg-overlay-opacity'?: string;
  '--form-bg-animation'?: string;
  '--form-bg-mobile-image'?: string;
  '--form-bg-tablet-image'?: string;
}
