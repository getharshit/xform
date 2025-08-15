// src/components/public-form/themes/logos/types.ts

export type LogoPosition = 
  | 'header-left'     // Header top-left
  | 'header-center'   // Header top-center
  | 'header-right'    // Header top-right
  | 'floating-tl'     // Floating top-left
  | 'floating-tr'     // Floating top-right
  | 'floating-bl'     // Floating bottom-left
  | 'floating-br'     // Floating bottom-right
  | 'inline-title'    // Inline with form title
  | 'above-title'     // Above form title
  | 'below-title'     // Below form title
  | 'footer-left'     // Footer left
  | 'footer-center'   // Footer center
  | 'footer-right';   // Footer right

export type LogoSize = 
  | 'xs'              // Extra small (24px max)
  | 'sm'              // Small (32px max)
  | 'md'              // Medium (48px max)
  | 'lg'              // Large (64px max)
  | 'xl'              // Extra large (96px max)
  | 'custom';         // Custom size

export type LogoFormat = 
  | 'svg'             // SVG format (preferred)
  | 'png'             // PNG with transparency
  | 'jpg'             // JPEG format
  | 'webp'            // WebP format
  | 'gif';            // GIF format (static only)

export type LogoAlignment = 
  | 'left'            // Left aligned
  | 'center'          // Center aligned
  | 'right';          // Right aligned

export type WatermarkPosition = 
  | 'top-left'        // Top left corner
  | 'top-right'       // Top right corner
  | 'bottom-left'     // Bottom left corner
  | 'bottom-right'    // Bottom right corner
  | 'center';         // Center of form

export type WatermarkSize = 
  | 'xs'              // 16px
  | 'sm'              // 24px
  | 'md'              // 32px
  | 'lg'              // 48px
  | 'custom';         // Custom size

// Logo file configuration
export interface LogoFile {
  id: string;                 // Unique identifier
  fileName: string;           // Original file name
  fileSize: number;           // File size in bytes
  mimeType: string;           // MIME type
  format: LogoFormat;         // Logo format
  url: string;                // File URL or data URL
  dataUrl?: string;           // Base64 data URL for previews
  
  // Image properties
  dimensions: {
    width: number;            // Original width in pixels
    height: number;           // Original height in pixels
    aspectRatio: number;      // Width/height ratio
  };
  
  // Optimization data
  isOptimized: boolean;       // Whether file is optimized
  originalSize?: number;      // Original file size before optimization
  compressionRatio?: number;  // Compression ratio applied
  
  // Upload metadata
  uploadedAt: Date;           // Upload timestamp
  uploadedBy?: string;        // User ID who uploaded
  
  // Validation status
  isValid: boolean;           // Whether file passed validation
  validationErrors?: string[]; // Any validation errors
}

// Logo display configuration
export interface LogoDisplay {
  position: LogoPosition;     // Logo position
  alignment: LogoAlignment;   // Logo alignment within position
  size: LogoSize;             // Predefined size
  customSize?: {
    width: number;            // Custom width in pixels
    height: number;           // Custom height in pixels
    maintainAspectRatio: boolean; // Whether to maintain aspect ratio
  };
  
  // Visual styling
  opacity: number;            // Logo opacity (0-1)
  padding: {
    top: number;              // Padding in pixels
    right: number;
    bottom: number;
    left: number;
  };
  margin: {
    top: number;              // Margin in pixels
    right: number;
    bottom: number;
    left: number;
  };
  
  // Effects
  shadow?: {
    enabled: boolean;
    offsetX: number;          // Shadow offset X
    offsetY: number;          // Shadow offset Y
    blur: number;             // Shadow blur radius
    color: string;            // Shadow color
    opacity: number;          // Shadow opacity
  };
  
  border?: {
    enabled: boolean;
    width: number;            // Border width
    style: 'solid' | 'dashed' | 'dotted'; // Border style
    color: string;            // Border color
    radius: number;           // Border radius
  };
  
  // Hover effects
  hover?: {
    enabled: boolean;
    scale: number;            // Scale on hover (0.5-2.0)
    opacity: number;          // Opacity on hover
    transition: number;       // Transition duration in ms
  };
}

// Responsive logo behavior
export interface LogoResponsive {
  mobile: {
    enabled: boolean;         // Show logo on mobile
    position?: LogoPosition;  // Override position for mobile
    size?: LogoSize;          // Override size for mobile
    customSize?: {
      width: number;
      height: number;
    };
    hideBelow?: number;       // Hide below this screen width (px)
  };
  
  tablet: {
    enabled: boolean;         // Show logo on tablet
    position?: LogoPosition;  // Override position for tablet
    size?: LogoSize;          // Override size for tablet
    customSize?: {
      width: number;
      height: number;
    };
  };
  
  desktop: {
    enabled: boolean;         // Show logo on desktop
  };
  
  // Breakpoints
  breakpoints: {
    mobile: number;           // Mobile breakpoint (px)
    tablet: number;           // Tablet breakpoint (px)
    desktop: number;          // Desktop breakpoint (px)
  };
}

// Logo link functionality
export interface LogoLink {
  enabled: boolean;           // Whether logo is clickable
  url: string;                // Link destination URL
  openInNewTab: boolean;      // Open in new tab/window
  rel: string;                // Link rel attribute (e.g., 'noopener noreferrer')
  title?: string;             // Link title for accessibility
  
  // Analytics tracking
  trackClicks?: boolean;      // Track logo clicks
  trackingEvent?: string;     // Custom tracking event name
  
  // Validation
  isValidUrl: boolean;        // Whether URL is valid
  urlValidation?: {
    errors: string[];         // URL validation errors
    warnings: string[];       // URL validation warnings
  };
}

// Brand watermark configuration
export interface BrandWatermark {
  enabled: boolean;           // Enable watermark
  logoFile: LogoFile;         // Watermark logo file
  position: WatermarkPosition; // Watermark position
  size: WatermarkSize;        // Watermark size
  customSize?: number;        // Custom size in pixels
  
  // Visual properties
  opacity: number;            // Watermark opacity (0-1)
  rotation?: number;          // Rotation in degrees
  
  // Positioning fine-tuning
  offset: {
    x: number;                // X offset in pixels
    y: number;                // Y offset in pixels
  };
  
  // Visibility
  showOnPrint: boolean;       // Show in print version
  showOnMobile: boolean;      // Show on mobile devices
  fadeOnScroll?: boolean;     // Fade out when scrolling
  
  // Text alternative
  textWatermark?: {
    enabled: boolean;
    text: string;             // Watermark text
    font: string;             // Font family
    size: number;             // Font size
    color: string;            // Text color
    rotation: number;         // Text rotation
  };
}

// Complete logo configuration
export interface LogoConfig {
  enabled: boolean;           // Whether logo is enabled
  file?: LogoFile;            // Logo file (optional if disabled)
  display: LogoDisplay;       // Display configuration
  responsive: LogoResponsive; // Responsive behavior
  link?: LogoLink;            // Link functionality (optional)
  
  // Accessibility
  accessibility: {
    altText: string;          // Alt text for logo
    ariaLabel?: string;       // ARIA label
    hideFromScreenReaders?: boolean; // Hide decorative logos
    focusable: boolean;       // Whether logo can receive focus
  };
  
  // Performance
  performance: {
    lazy: boolean;            // Lazy load logo
    preload: boolean;         // Preload logo
    optimizeForRetina: boolean; // Optimize for high-DPI displays
    
    // Loading states
    showPlaceholder: boolean; // Show placeholder while loading
    placeholderColor?: string; // Placeholder background color
    
    // Caching
    cacheKey?: string;        // Cache key for logo
    expires?: Date;           // Cache expiration
  };
}

// Logo upload validation configuration
export interface LogoUploadConfig {
  allowedFormats: LogoFormat[]; // Allowed file formats
  maxFileSize: number;        // Maximum file size in bytes
  maxDimensions: {
    width: number;            // Maximum width in pixels
    height: number;           // Maximum height in pixels
  };
  minDimensions: {
    width: number;            // Minimum width in pixels
    height: number;           // Minimum height in pixels
  };
  
  // Quality requirements
  quality: {
    minResolution: number;    // Minimum DPI/PPI
    allowTransparency: boolean; // Allow transparent backgrounds
    requireSquareAspect?: boolean; // Require square aspect ratio
    maxAspectRatioDiff?: number; // Max difference from 1:1 ratio
  };
  
  // Content validation
  contentValidation: {
    scanForText: boolean;     // Scan for text content
    maxTextPercentage?: number; // Max percentage that can be text
    requireVisualContent: boolean; // Require visual content
    blacklistWords: string[]; // Rejected text content
  };
  
  // Security
  security: {
    scanForMalware: boolean;  // Virus scan (if available)
    checkFileHeaders: boolean; // Validate file headers
    sanitizeFileName: boolean; // Sanitize file names
    allowExternalUrls: boolean; // Allow external logo URLs
  };
}

// Logo validation result
export interface LogoValidationResult {
  isValid: boolean;
  errors: LogoValidationError[];
  warnings: LogoValidationWarning[];
  
  // File analysis
  analysis: {
    hasTransparency: boolean;
    dominantColors: string[]; // Most common colors
    complexity: 'simple' | 'medium' | 'complex'; // Visual complexity
    textContent?: string;     // Detected text content
    estimatedLoadTime: number; // Estimated load time (ms)
  };
  
  // Optimization suggestions
  optimization: {
    canOptimize: boolean;
    suggestions: string[];
    potentialSavings: {
      sizeReduction: number;  // Percentage
      formatChange?: LogoFormat; // Recommended format
    };
  };
  
  // Accessibility assessment
  accessibility: {
    needsAltText: boolean;
    contrastIssues: string[];
    readabilityScore: number; // 0-100
  };
}

// Logo validation error types
export interface LogoValidationError {
  type: 'file' | 'dimension' | 'format' | 'content' | 'security' | 'performance';
  field: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface LogoValidationWarning {
  type: 'optimization' | 'accessibility' | 'performance' | 'usability';
  message: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}

// Logo preset configuration
export interface LogoPreset {
  id: string;
  name: string;
  description: string;
  category: 'corporate' | 'creative' | 'minimal' | 'bold' | 'elegant';
  
  // Preset configuration
  display: Partial<LogoDisplay>;
  responsive?: Partial<LogoResponsive>;
  
  // Preview
  preview: {
    thumbnailUrl: string;     // Preview thumbnail
    exampleLogo?: string;     // Example logo URL
  };
  
  // Metadata
  isPremium?: boolean;
  popularity: number;         // Usage popularity (0-100)
  tags: string[];             // Searchable tags
  createdAt: Date;
  updatedAt: Date;
}

// Logo manager state
export interface LogoManagerState {
  config: LogoConfig;
  watermark?: BrandWatermark;
  uploadState: {
    isUploading: boolean;
    progress: number;         // Upload progress (0-100)
    error?: string;           // Upload error message
  };
  validation?: LogoValidationResult;
  presets: LogoPreset[];
  isLoading: boolean;
  error: string | null;
}

// Logo action types
export type LogoAction = 
  | { type: 'SET_LOGO_CONFIG'; payload: LogoConfig }
  | { type: 'UPDATE_LOGO_CONFIG'; payload: Partial<LogoConfig> }
  | { type: 'SET_LOGO_FILE'; payload: LogoFile }
  | { type: 'UPDATE_DISPLAY'; payload: Partial<LogoDisplay> }
  | { type: 'UPDATE_RESPONSIVE'; payload: Partial<LogoResponsive> }
  | { type: 'SET_LOGO_LINK'; payload: LogoLink }
  | { type: 'SET_WATERMARK'; payload: BrandWatermark }
  | { type: 'UPLOAD_START'; payload: { fileName: string; fileSize: number } }
  | { type: 'UPLOAD_PROGRESS'; payload: number }
  | { type: 'UPLOAD_SUCCESS'; payload: LogoFile }
  | { type: 'UPLOAD_ERROR'; payload: string }
  | { type: 'SET_VALIDATION'; payload: LogoValidationResult }
  | { type: 'APPLY_PRESET'; payload: LogoPreset }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_LOGO' };

// Logo event handlers
export interface LogoEventHandlers {
  onLogoUpload: (file: File) => Promise<void>;
  onLogoChange: (config: LogoConfig) => void;
  onPositionChange: (position: LogoPosition) => void;
  onSizeChange: (size: LogoSize, customSize?: { width: number; height: number }) => void;
  onLinkChange: (link: LogoLink) => void;
  onWatermarkChange: (watermark: BrandWatermark) => void;
  onPresetApply: (preset: LogoPreset) => void;
  onValidationComplete: (result: LogoValidationResult) => void;
  onError: (error: string) => void;
}

// CSS properties for logo styling
export interface LogoCSSProperties {
  '--form-logo-width': string;
  '--form-logo-height': string;
  '--form-logo-position': string;
  '--form-logo-alignment': string;
  '--form-logo-opacity': string;
  '--form-logo-padding-top': string;
  '--form-logo-padding-right': string;
  '--form-logo-padding-bottom': string;
  '--form-logo-padding-left': string;
  '--form-logo-margin-top': string;
  '--form-logo-margin-right': string;
  '--form-logo-margin-bottom': string;
  '--form-logo-margin-left': string;
  '--form-logo-shadow'?: string;
  '--form-logo-border'?: string;
  '--form-logo-border-radius'?: string;
  '--form-logo-hover-scale'?: string;
  '--form-logo-transition'?: string;
  
  // Watermark properties
  '--form-watermark-position'?: string;
  '--form-watermark-size'?: string;
  '--form-watermark-opacity'?: string;
  '--form-watermark-rotation'?: string;
  
  // Responsive properties
  '--form-logo-mobile-width'?: string;
  '--form-logo-mobile-height'?: string;
  '--form-logo-tablet-width'?: string;
  '--form-logo-tablet-height'?: string;
}

// Utility functions interface
export interface LogoUtils {
  validateFile: (file: File, config: LogoUploadConfig) => Promise<LogoValidationResult>;
  optimizeFile: (file: File, options: { format?: LogoFormat; quality?: number }) => Promise<File>;
  generateThumbnail: (file: File, size: number) => Promise<string>;
  extractColors: (file: File) => Promise<string[]>;
  calculateLoadTime: (file: LogoFile, connection?: string) => number;
  generateCSS: (config: LogoConfig) => LogoCSSProperties;
  validateUrl: (url: string) => Promise<boolean>;
  sanitizeFileName: (fileName: string) => string;
}

// Combined brand customization (backgrounds + logos)
export interface BrandCustomization {
  backgrounds: import("../backgrounds/types").BackgroundCustomization;
  logos: {
    primary?: LogoConfig;     // Primary logo
    secondary?: LogoConfig;   // Secondary logo (if needed)
    watermark?: BrandWatermark; // Brand watermark
  };
  
  // Integration settings
  integration: {
    logoOverBackground: {
      enabled: boolean;       // Whether logo overlays background
      blendMode?: string;     // CSS blend mode
      dropShadow?: boolean;   // Add drop shadow for readability
    };
    
    harmonization: {
      enabled: boolean;       // Auto-harmonize colors
      preserveLogoBranding: boolean; // Keep original logo colors
      backgroundColorHints: string[]; // Colors to consider from logo
    };
  };
  
  // Metadata
  metadata: {
    brandName?: string;       // Brand name
    brandColors?: string[];   // Brand color palette
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

