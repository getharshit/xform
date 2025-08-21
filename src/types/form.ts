

// Base form field interface
export interface FormField {
  id: string;
  type: ExtendedFieldType;
  label: string;
  description?: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  
  // Choice field properties
  options?: string[];
  allowOther?: boolean; // NEW: Allow "Other" option with text input
  maxSelections?: number; // NEW: For future multi-select support (1 = single select)
  
  // Rating field properties
  maxRating?: number;
  minRating?: number;
  displayStyle?: 'numbers' | 'stars';
  
  // Text field properties
  maxLength?: number;
  minLength?: number;
  
  // File upload properties
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  
  // Validation rules
  validationRules?: {
    pattern?: string;
    min?: number;
    max?: number;
    customMessage?: string;
    requireScrollToAccept?: boolean;

    blockedDomains?: string[];
    allowedProtocols?: string[];
    autoAddProtocol?: boolean;
    autoFormat?: boolean;
    allowedCountries?: string[];
    autoDetectCountry?: boolean;
     minSelections?: number;
  maxSelections?: number;
    
  };
  
  // Display options
  displayOptions?: {
    width?: 'full' | 'half' | 'third';
    showLabel?: boolean;
    showDescription?: boolean;
    inline?: boolean; // For choice fields: vertical vs horizontal layout
    variant?: string;
    imageUrl?: string;
    imageAlt?: string;
    showCountryCode?: boolean;
  defaultCountry?: string;
  enableRichText?: boolean;
    links?: Array<{
      text: string;
      url: string;
      external?: boolean;
    }>;
    estimatedTime?: string;
    participantCount?: number;
    features?: string[];
    showDownload?: boolean;
    showShare?: boolean;
    showFeedback?: boolean;
    redirectUrl?: string;
    redirectDelay?: number;
    customActions?: any[];
    termsTitle?: string;
    ratingStyle?: 'stars' | 'hearts' | 'thumbs' | 'smiley' | 'fire' | 'numbers';
     layout?: "vertical" | "horizontal";
  randomizeOrder?: boolean;
  otherLabel?: string;
  requireOtherText?: boolean;
  externalLinks?: string[];
  enableMultipleCheckboxes?: boolean;
  additionalAgreements?: string[];
    sectionTitle?: string;
  sectionDescription?: string;
  continueButtonText?: string;
  };
  
  // Default value
  defaultValue?: any;
}

// All supported field types (16 total)
export type ExtendedFieldType = 
  // Text fields
  | 'shortText'
  | 'longText' 
  | 'email'
  | 'website'
  | 'phoneNumber'
  
  // Choice fields
  | 'multipleChoice'
  | 'dropdown'
  | 'yesNo'
  | 'opinionScale'
  
  // Rating fields
  | 'numberRating'
  
  // Special fields
  | 'statement'
  | 'legal'
  | 'fileUpload'
  
  // Structure fields
  | 'pageBreak'
  | 'startingPage'
  | 'postSubmission';

// Legacy field type (for backward compatibility)
export type FieldType = 'text' | 'multipleChoice' | 'dropdown' | 'rating' | 'date';

// Form theme configuration
export interface FormTheme {
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontFamily: string;
  fontSize?: {
    title?: number;
    question?: number;
    input?: number;
    small?: number;
  };
  fontWeight?: {
    normal?: number;
    medium?: number;
    bold?: number;
  };
  borderRadius?: number;
  spacing?: number;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  showQuestionNumbers?: boolean;
  showProgressBar?: boolean;
  centerForm?: boolean;
  logoUrl?: string;
}

// Form customization (advanced styling)
export interface FormCustomization {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    error?: string;
    success?: string;
    warning?: string;
    backgroundType?: 'solid' | 'gradient' | 'pattern' | 'animated';
    backgroundGradientDirection?: string;
    backgroundGradientColor1?: string;
    backgroundGradientColor2?: string;
    
    animatedConfig?: {
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
    };

  };
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, number>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
  };
  spacing?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  borders?: {
    radius?: number;
    width?: number;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  buttons?: Record<string, any>;
  inputs?: Record<string, any>;
  layout?: Record<string, any>;
  animations?: Record<string, any>;
  branding?: Record<string, any>;
}

// Form layout configuration
export interface FormLayoutConfig {
  type: 'singleColumn' | 'multiStep' | 'custom';
  options: {
    maxWidth?: number;
    padding?: number;
    backgroundColor?: string;
    singleColumn?: {
      showQuestionNumbers?: boolean;
      questionSpacing?: number;
      submitButtonPosition?: 'left' | 'center' | 'right';
    };
    multiStep?: {
      showProgressBar?: boolean;
      progressBarStyle?: 'bar' | 'dots' | 'numbers';
      allowBackNavigation?: boolean;
      showStepTitles?: boolean;
    };
  };
}

// Form settings
export interface FormSettings {
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  requireAllFields?: boolean;
  shuffleQuestions?: boolean;
  timeLimit?: number; // in minutes
  redirectUrl?: string;
  customSubmissionMessage?: string;
  collectIPAddress?: boolean;
  collectUserAgent?: boolean;
  enableSaveAndContinue?: boolean;
  submitButtonText?: string;
  showResetButton?: boolean;
  confirmBeforeSubmit?: boolean;
  showPrivacyNotice?: boolean;
  privacyNoticeText?: string;
  gdprCompliant?: boolean;
}

// Field group for multi-step forms
export interface FieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  showProgressBar?: boolean;
  allowBackNavigation?: boolean;
}

// Main form interface
export interface Form {
  id: string;
  title: string;
  description?: string | null;
  prompt?: string | null; // AI generation prompt
  fields: FormField[];
  fieldGroups?: FieldGroup[];
  theme: FormTheme;
  customization?: FormCustomization;
  layout?: FormLayoutConfig;
  settings?: FormSettings;
  createdAt: Date | string;
  updatedAt: Date | string;
    published?: boolean;           // 🆕 ADD THIS
  publishedAt?: Date | string;
  responseCount?: number;
}

// Form response
export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date | string;
  ipAddress?: string;
  userAgent?: string;
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: Array<{
    fieldId: string;
    message: string;
  }>;
  warnings: Array<{
    fieldId: string;
    message: string;
  }>;
}

// Export default types for backward compatibility
export type { FormField as Field,Form as BuilderForm,  FormResponse as Response };