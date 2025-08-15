// src/components/public-form/themes/buttons/types.ts

export type ButtonVariant = 
  | 'filled'      // Solid background
  | 'outlined'    // Border with transparent background
  | 'flat'        // No border, transparent background
  | 'rounded'     // Filled with more rounded corners
  | 'pill'        // Fully rounded ends
  | 'square';     // Sharp corners, minimal border radius

export type ButtonSize = 
  | 'small'       // Compact for secondary actions
  | 'medium'      // Default size
  | 'large';      // Prominent for primary actions

export type ButtonState = 
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled';

export interface ButtonCustomization {
  // Variant and sizing
  variant: ButtonVariant;
  size: ButtonSize;
  
  // Border and shape
  borderRadius: number;        // Custom radius override
  borderWidth: number;         // Border thickness
  
  // Spacing and typography
  paddingMultiplier: number;   // Adjusts internal padding
  fontWeight: number;          // Button text weight
  
  // Animation and interaction
  hoverScale: number;          // Slight scale on hover (1.0 = no scale)
  transitionDuration: number;  // Animation speed in ms
  
  // Accessibility
  minHeight: number;           // Minimum touch target size
  focusRingWidth: number;      // Focus outline width
  
  // States configuration
  hoverOpacity: number;        // Opacity change on hover
  activeOpacity: number;       // Opacity when pressed
  disabledOpacity: number;     // Disabled state opacity
}

export interface ButtonColors {
  // Primary button colors
  primary: {
    background: string;
    text: string;
    border: string;
    hover: {
      background: string;
      text: string;
      border: string;
    };
    active: {
      background: string;
      text: string;
      border: string;
    };
    disabled: {
      background: string;
      text: string;
      border: string;
    };
  };
  
  // Secondary button colors
  secondary: {
    background: string;
    text: string;
    border: string;
    hover: {
      background: string;
      text: string;
      border: string;
    };
    active: {
      background: string;
      text: string;
      border: string;
    };
    disabled: {
      background: string;
      text: string;
      border: string;
    };
  };
}

// Predefined button configurations
export interface ButtonPreset {
  id: string;
  name: string;
  description: string;
  customization: ButtonCustomization;
}

// Button style generation result
export interface ButtonStyles {
  className: string;
  cssProperties: Record<string, string>;
  accessibilityProps: {
    minContrastRatio: number;
    touchTargetSize: string;
    focusIndicator: string;
  };
}