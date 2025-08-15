// Comprehensive customization options
export interface FormCustomization {
    typography: TypographyCustomization;
    colors: ColorCustomization;
    spacing: SpacingCustomization;
    buttons: ButtonCustomization;
    inputs: InputCustomization;
    layout: LayoutCustomization;
    animations: AnimationCustomization;
    branding: BrandingCustomization;
  }
  
  // Typography settings
  export interface TypographyCustomization {
    fontFamily: string;
    fontSize: {
      title: number;        // Form title
      question: number;     // Question labels
      description: number;  // Descriptions
      input: number;        // Input text
      button: number;       // Button text
    };
    fontWeight: {
      title: 'normal' | 'medium' | 'semibold' | 'bold';
      question: 'normal' | 'medium' | 'semibold' | 'bold';
      description: 'normal' | 'medium' | 'semibold' | 'bold';
    };
    lineHeight: {
      title: number;
      question: number;
      description: number;
    };
    letterSpacing?: {
      title: number;
      question: number;
      description: number;
    };
  }
  
  // Color customization
  export interface ColorCustomization {
    primary: string;           // Main brand color
    secondary: string;         // Secondary color
    background: string;        // Form background
    surface: string;          // Card/field backgrounds
    text: {
      primary: string;        // Main text color
      secondary: string;      // Secondary text color
      muted: string;         // Muted text color
      error: string;         // Error text color
      success: string;       // Success text color
    };
    border: {
      default: string;       // Default border color
      focus: string;         // Focused border color
      error: string;         // Error border color
      hover: string;         // Hover border color
    };
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
  
  // Spacing customization
  export interface SpacingCustomization {
    container: {
      padding: number;       // Container padding
      maxWidth: number;      // Max form width
    };
    questions: {
      marginBottom: number;  // Space between questions
      padding: number;       // Question padding
    };
    inputs: {
      padding: number;       // Input padding
      marginTop: number;     // Space between label and input
    };
    buttons: {
      padding: {
        x: number;          // Horizontal padding
        y: number;          // Vertical padding
      };
      marginTop: number;    // Space above buttons
      gap: number;          // Space between buttons
    };
  }
  
  // Button customization
  export interface ButtonCustomization {
    borderRadius: number;
    borderWidth: number;
    boxShadow?: string;
    transition?: string;
    size: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    iconPosition?: 'left' | 'right';
  }
  
  // Input field customization
  export interface InputCustomization {
    borderRadius: number;
    borderWidth: number;
    boxShadow?: string;
    focusRing?: {
      width: number;
      color: string;
      offset: number;
    };
    placeholder: {
      color: string;
      opacity: number;
    };
  }
  
  // Layout customization
  export interface LayoutCustomization {
    questionAlignment: 'left' | 'center' | 'right';
    inputAlignment: 'left' | 'center' | 'right';
    cardStyle?: {
      background: string;
      borderRadius: number;
      boxShadow: string;
      border: string;
    };
    backgroundImage?: {
      url: string;
      opacity: number;
      position: 'center' | 'top' | 'bottom';
      size: 'cover' | 'contain' | 'auto';
    };
  }
  
  // Animation settings
  export interface AnimationCustomization {
    enableAnimations: boolean;
    transitions: {
      duration: number;      // In milliseconds
      easing: string;        // CSS easing function
    };
    questionEntrance?: {
      type: 'fade' | 'slide' | 'scale' | 'none';
      duration: number;
      delay: number;
    };
    buttonHover?: {
      scale: number;
      duration: number;
    };
    inputFocus?: {
      scale: number;
      duration: number;
    };
  }
  
  // Branding customization
  export interface BrandingCustomization {
    logo?: {
      url: string;
      width: number;
      height: number;
      position: 'top-left' | 'top-center' | 'top-right' | 'bottom-center';
    };
    favicon?: string;
    customCSS?: string;      // Custom CSS injection
    customHTML?: {
      header?: string;       // Custom HTML in header
      footer?: string;       // Custom HTML in footer
    };
    watermark?: {
      show: boolean;
      text: string;
      position: 'bottom-left' | 'bottom-right' | 'bottom-center';
    };
  }