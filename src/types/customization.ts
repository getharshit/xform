// src/types/customization.ts - Unified Form Customization Types
// Consolidates customization interfaces from both src/types/form.ts and src/components/public-form/types/

/**
 * Advanced animated background configurations
 * From form.ts - supports complex animated backgrounds
 */
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
    resolutionScale?: number; // Resolution scale (0.5-2)
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

/**
 * Comprehensive color customization
 * Merged from both type systems with advanced background support
 */
export interface ColorCustomization {
  // Primary brand colors
  primary: string;           // Main brand color
  secondary: string;         // Secondary color
  accent?: string;           // Accent color (optional)
  
  // Background configuration
  background: string;        // Form background color
  backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image' | 'animated';
  backgroundGradientDirection?: string;     // Gradient direction
  backgroundGradientColor1?: string;        // Gradient first color
  backgroundGradientColor2?: string;        // Gradient second color
  
  // Advanced animated background support
  animatedConfig?: AnimatedBackgroundConfig;
  
  // Surface and layout colors
  surface: string;          // Card/field backgrounds
  
  // Text colors
  text: {
    primary: string;        // Main text color
    secondary: string;      // Secondary text color
    muted: string;         // Muted text color
    error: string;         // Error text color
    success: string;       // Success text color
  };
  
  // Border colors
  border: {
    default: string;       // Default border color
    focus: string;         // Focused border color
    error: string;         // Error border color
    hover: string;         // Hover border color
  };
  
  // State colors
  error?: string;           // Error state color
  success?: string;         // Success state color
  warning?: string;         // Warning state color
  
  // Button color configurations
  button: {
    primary: {
      background: string;
      text: string;
      border: string;
      hover: {
        background: string;
        text: string;
        border: string;
      };
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hover: {
        background: string;
        text: string;
        border: string;
      };
    };
  };
}

/**
 * Typography customization with comprehensive font control
 */
export interface TypographyCustomization {
  fontFamily: string;       // Primary font family
  
  // Font sizes for different elements
  fontSize: {
    title: number;          // Form title
    question: number;       // Question labels
    description: number;    // Descriptions
    input: number;          // Input text
    button: number;         // Button text
  };
  
  // Font weights
  fontWeight: {
    title: 'normal' | 'medium' | 'semibold' | 'bold';
    question: 'normal' | 'medium' | 'semibold' | 'bold';
    description: 'normal' | 'medium' | 'semibold' | 'bold';
  };
  
  // Line heights
  lineHeight: {
    title: number;
    question: number;
    description: number;
  };
  
  // Letter spacing (optional)
  letterSpacing?: {
    title: number;
    question: number;
    description: number;
  };
}

/**
 * Spacing and layout customization
 */
export interface SpacingCustomization {
  // Container spacing
  container: {
    padding: number;       // Container padding
    maxWidth: number;      // Max form width
  };
  
  // Question spacing
  questions: {
    marginBottom: number;  // Space between questions
    padding: number;       // Question padding
  };
  
  // Input field spacing
  inputs: {
    padding: number;       // Input padding
    marginTop: number;     // Space between label and input
  };
  
  // Button spacing
  buttons: {
    padding: {
      x: number;          // Horizontal padding
      y: number;          // Vertical padding
    };
    marginTop: number;    // Space above buttons
    gap: number;          // Space between buttons
  };
}

/**
 * Button customization options
 */
export interface ButtonCustomization {
  borderRadius: number;   // Button border radius
  borderWidth: number;    // Button border width
  boxShadow?: string;     // Button shadow
  transition?: string;    // Transition effects
  size: 'small' | 'medium' | 'large'; // Button size
  fullWidth?: boolean;    // Full width buttons
  iconPosition?: 'left' | 'right'; // Icon position
}

/**
 * Input field customization
 */
export interface InputCustomization {
  borderRadius: number;   // Input border radius
  borderWidth: number;    // Input border width
  boxShadow?: string;     // Input shadow
  
  // Focus ring customization
  focusRing?: {
    width: number;        // Focus ring width
    color: string;        // Focus ring color
    offset: number;       // Focus ring offset
  };
  
  // Placeholder customization
  placeholder: {
    color: string;        // Placeholder text color
    opacity: number;      // Placeholder opacity
  };
}

/**
 * Layout and positioning customization
 */
export interface LayoutCustomization {
  questionAlignment: 'left' | 'center' | 'right'; // Question alignment
  inputAlignment: 'left' | 'center' | 'right';   // Input alignment
  
  // Card styling (optional)
  cardStyle?: {
    background: string;   // Card background
    borderRadius: number; // Card border radius
    boxShadow: string;    // Card shadow
    border: string;       // Card border
  };
  
  // Background image (optional)
  backgroundImage?: {
    url: string;          // Image URL
    opacity: number;      // Image opacity
    position: 'center' | 'top' | 'bottom'; // Image position
    size: 'cover' | 'contain' | 'auto';    // Image size
  };
}

/**
 * Animation and transition customization
 */
export interface AnimationCustomization {
  enableAnimations: boolean; // Enable/disable animations
  
  // Transition settings
  transitions: {
    duration: number;     // Duration in milliseconds
    easing: string;       // CSS easing function
  };
  
  // Question entrance animations (optional)
  questionEntrance?: {
    type: 'fade' | 'slide' | 'scale' | 'none'; // Animation type
    duration: number;     // Animation duration
    delay: number;        // Animation delay
  };
  
  // Button hover effects (optional)
  buttonHover?: {
    scale: number;        // Hover scale effect
    duration: number;     // Hover animation duration
  };
  
  // Input focus effects (optional)
  inputFocus?: {
    scale: number;        // Focus scale effect
    duration: number;     // Focus animation duration
  };
}

/**
 * Branding and custom content
 */
export interface BrandingCustomization {
  // Logo configuration
  logo?: {
    url: string;          // Logo image URL
    width: number;        // Logo width
    height: number;       // Logo height
    position: 'top-left' | 'top-center' | 'top-right' | 'bottom-center'; // Logo position
  };
  
  favicon?: string;       // Custom favicon URL
  customCSS?: string;     // Custom CSS injection
  
  // Custom HTML sections
  customHTML?: {
    header?: string;      // Custom HTML in header
    footer?: string;      // Custom HTML in footer
  };
  
  // Watermark configuration
  watermark?: {
    show: boolean;        // Show watermark
    text: string;         // Watermark text
    position: 'bottom-left' | 'bottom-right' | 'bottom-center'; // Watermark position
  };
}

/**
 * Complete form customization interface
 * Consolidates all customization options from both type systems
 */
export interface FormCustomization {
  // Core customization categories
  typography: TypographyCustomization;
  colors: ColorCustomization;
  spacing: SpacingCustomization;
  buttons: ButtonCustomization;
  inputs: InputCustomization;
  layout: LayoutCustomization;
  animations: AnimationCustomization;
  branding: BrandingCustomization;
  
  // Generic extensibility (for backward compatibility)
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  borders?: {
    radius?: number;
    width?: number;
  };
}

/**
 * Lightweight customization interface for basic theming
 * Backward compatibility with simple color/typography changes
 */
export interface BasicCustomization {
  colors?: Partial<ColorCustomization>;
  typography?: Partial<TypographyCustomization>;
  spacing?: Partial<SpacingCustomization>;
  buttons?: Partial<ButtonCustomization>;
  inputs?: Partial<InputCustomization>;
  layout?: Partial<LayoutCustomization>;
  animations?: Partial<AnimationCustomization>;
  branding?: Partial<BrandingCustomization>;
}

/**
 * Customization validation error
 */
export interface CustomizationValidationError {
  category: keyof FormCustomization;
  field: string;
  message: string;
  value?: any;
}

/**
 * Customization validation result
 */
export interface CustomizationValidationResult {
  isValid: boolean;
  errors: CustomizationValidationError[];
  warnings: CustomizationValidationError[];
}

/**
 * Customization change event
 */
export interface CustomizationChangeEvent {
  category: keyof FormCustomization;
  field: string;
  value: any;
  previousValue?: any;
  timestamp: number;
}