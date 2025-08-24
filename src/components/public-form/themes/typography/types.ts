// src/components/public-form/themes/typography/types.ts - Clean Version

export type FontSizeScale = 'small' | 'medium' | 'large';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

// Font family configuration
export interface FontFamilyConfig {
  id: string;
  name: string;
  family: string;
  fallbacks: string[];
  weights: FontWeight[];
  googleFont?: {
    family: string;
    weights: FontWeight[];
    subsets: string[];
    display: FontDisplay;
  };
  preview: {
    text: string;
    size: number;
  };
}

// Typography scale configuration
export interface TypographyScale {
  id: string;
  name: string;
  baseSize: number; // in px
  ratio: number; // scaling ratio (e.g., 1.2 for major third)
  sizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
  lineHeights: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
  letterSpacing: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
}

export interface TypographyValidationError {
  type: 'validation' | 'accessibility' | 'performance';
  field: string;
  message: string;
}

export interface TypographyValidationWarning {
  type: 'warning' | 'accessibility' | 'performance';
  field: string;
  message: string;
}

export interface TypographyValidationResult {
  isValid: boolean;
  errors: TypographyValidationError[];
  warnings: TypographyValidationWarning[];
}

// Text element types in forms
export type TextElementType = 
  | 'formTitle'
  | 'formDescription'
  | 'sectionTitle'
  | 'questionLabel'
  | 'questionDescription'
  | 'inputText'
  | 'inputPlaceholder'
  | 'buttonText'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'caption'
  | 'legal';

// Typography mapping for form elements - Fixed approach
export interface FormTypographyMapping {
  formTitle: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  formDescription: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  sectionTitle: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  questionLabel: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  questionDescription: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  inputText: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  inputPlaceholder: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  buttonText: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  helpText: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  errorText: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  successText: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  caption: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
  legal: {
    fontSize: keyof TypographyScale['sizes'];
    lineHeight: keyof TypographyScale['lineHeights'];
    letterSpacing: keyof TypographyScale['letterSpacing'];
    fontWeight: FontWeight;
    fontFamily: 'primary' | 'secondary' | 'mono';
  };
}

// Complete typography configuration
export interface TypographyConfig {
  scale: FontSizeScale;
  customScale?: TypographyScale;
  primary: FontFamilyConfig;
  secondary: FontFamilyConfig;
  mono: FontFamilyConfig;
  mapping: FormTypographyMapping;
  responsive: {
    enableScaling: boolean;
    breakpoints: {
      sm: number; // scale factor for small screens
      md: number; // scale factor for medium screens
      lg: number; // scale factor for large screens
    };
  };
  accessibility: {
    enforceMinSize: boolean;
    minBodySize: number; // minimum px for body text
    maxLineLength: number; // maximum characters per line
    contrastRatio: number; // minimum contrast ratio
  };
  performance: {
    preloadFonts: boolean;
    fontDisplay: FontDisplay;
    loadTimeout: number; // ms
  };
}

// Font loading states
export interface FontLoadingState {
  family: string;
  status: 'loading' | 'loaded' | 'error' | 'timeout';
  error?: string;
  loadTime?: number;
}

// Typography CSS custom properties
export interface TypographyCustomProperties {
  // Font families
  '--form-font-primary': string;
  '--form-font-secondary': string;
  '--form-font-mono': string;
  
  // Font sizes for each element type
  '--form-font-size-form-title': string;
  '--form-font-size-form-description': string;
  '--form-font-size-section-title': string;
  '--form-font-size-question-label': string;
  '--form-font-size-question-description': string;
  '--form-font-size-input-text': string;
  '--form-font-size-input-placeholder': string;
  '--form-font-size-button-text': string;
  '--form-font-size-help-text': string;
  '--form-font-size-error-text': string;
  '--form-font-size-success-text': string;
  '--form-font-size-caption': string;
  '--form-font-size-legal': string;
  
  // Line heights
  '--form-line-height-form-title': string;
  '--form-line-height-form-description': string;
  '--form-line-height-section-title': string;
  '--form-line-height-question-label': string;
  '--form-line-height-question-description': string;
  '--form-line-height-input-text': string;
  '--form-line-height-button-text': string;
  '--form-line-height-help-text': string;
  '--form-line-height-error-text': string;
  '--form-line-height-success-text': string;
  '--form-line-height-caption': string;
  '--form-line-height-legal': string;
  
  // Letter spacing
  '--form-letter-spacing-form-title': string;
  '--form-letter-spacing-form-description': string;
  '--form-letter-spacing-section-title': string;
  '--form-letter-spacing-question-label': string;
  '--form-letter-spacing-question-description': string;
  '--form-letter-spacing-input-text': string;
  '--form-letter-spacing-button-text': string;
  '--form-letter-spacing-help-text': string;
  '--form-letter-spacing-error-text': string;
  '--form-letter-spacing-success-text': string;
  '--form-letter-spacing-caption': string;
  '--form-letter-spacing-legal': string;
  
  // Font weights
  '--form-font-weight-form-title': string;
  '--form-font-weight-form-description': string;
  '--form-font-weight-section-title': string;
  '--form-font-weight-question-label': string;
  '--form-font-weight-question-description': string;
  '--form-font-weight-input-text': string;
  '--form-font-weight-button-text': string;
  '--form-font-weight-help-text': string;
  '--form-font-weight-error-text': string;
  '--form-font-weight-success-text': string;
  '--form-font-weight-caption': string;
  '--form-font-weight-legal': string;
  
  // Responsive modifiers
  '--form-font-scale-sm': string;
  '--form-font-scale-md': string;
  '--form-font-scale-lg': string;
}
