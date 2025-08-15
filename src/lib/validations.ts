// ============================================================================
// FORM TYPES - Current Enhanced Forms System
// ============================================================================

/**
 * All supported field types in the forms system
 */
export type FieldType = 
  | 'shortText'       // Single line text input
  | 'longText'        // Multi-line textarea
  | 'multipleChoice'  // Radio buttons
  | 'statement'       // Display-only text/HTML
  | 'dropdown'        // Select dropdown
  | 'yesNo'          // Boolean yes/no choice
  | 'numberRating'    // Numeric rating scale
  | 'email'          // Email input with validation
  | 'opinionScale'    // 1-10 opinion rating
  | 'website'        // URL input with validation
  | 'legal'          // Checkbox for legal acceptance
  | 'phoneNumber'    // Phone number input
  | 'fileUpload'     // File upload field
  | 'pageBreak'      // Multi-step page separator
  | 'startingPage'   // Welcome screen
  | 'postSubmission'; // Thank you screen

/**
 * Validation rules for form fields
 */
export interface ValidationRules {
  pattern?: string;                    // Regex pattern for validation
  min?: number;                       // Min value for numbers/min length for text
  max?: number;                       // Max value for numbers/max length for text
  customMessage?: string;             // Custom validation error message
  requireScrollToAccept?: boolean;    // For legal fields - user must scroll to bottom
}

/**
 * Display options for different field types
 */
export interface DisplayOptions {
  width?: 'full' | 'half' | 'third';
  showLabel?: boolean;
  showDescription?: boolean;
  inline?: boolean;                   // For yes/no, checkboxes
  
  // Statement field options
  variant?: 'default' | 'highlighted' | 'info' | 'warning';
  imageUrl?: string;
  imageAlt?: string;
  links?: Array<{
    text: string;
    url: string;
    external?: boolean;
  }>;
  
  // Legal field options
  termsTitle?: string;
  externalLinks?: Array<{
    text: string;
    url: string;
  }>;
  
  // Starting page options
  estimatedTime?: string;
  participantCount?: number;
  features?: string[];
  
  // Post submission options
  showDownload?: boolean;
  showShare?: boolean;
  showFeedback?: boolean;
  redirectUrl?: string;
  redirectDelay?: number;
  customActions?: Array<{
    type: string;
    label: string;
    icon?: 'external' | 'home' | 'mail' | 'message';
    style?: 'primary' | 'secondary';
    data?: any;
  }>;
}

/**
 * Conditional logic for showing/hiding fields
 */
export interface ConditionalLogic {
  showWhen?: Array<{
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  }>;
  hideWhen?: Array<{
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  }>;
}

/**
 * Form field interface supporting all field types
 */
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required: boolean;
  
  // Field-specific properties
  placeholder?: string;              // For text inputs
  options?: string[];               // For choice fields (multipleChoice, dropdown)
  maxRating?: number;               // For rating fields
  minRating?: number;               // For rating fields
  maxLength?: number;               // For text fields
  minLength?: number;               // For text fields
  acceptedFileTypes?: string[];      // For file uploads (e.g., ['.pdf', '.jpg'])
  maxFileSize?: number;             // For file uploads (in MB)
  defaultValue?: any;               // Default field value
  helpText?: string;                // Additional help text
  
  // Validation and display
  validationRules?: ValidationRules;
  displayOptions?: DisplayOptions;
  conditionalLogic?: ConditionalLogic;
}

/**
 * Field group for multi-step forms
 */
export interface FieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  showProgressBar?: boolean;
  allowBackNavigation?: boolean;
}

/**
 * Form theme configuration
 */
export interface FormTheme {
  primaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  
  // Enhanced theme properties
  secondaryColor?: string;
  tertiaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Typography
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
  
  // Spacing and layout
  borderRadius?: number;
  spacing?: number;
  
  // Advanced styling
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Form customization options
 */
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
    backgroundType?: 'solid' | 'gradient' | 'pattern';
    backgroundValue?: string;
    backgroundPattern?: string;
    backgroundGradientDirection?: string;
    backgroundGradientColor1?: string;
    backgroundGradientColor2?: string;
    backgroundPatternColor?: string;
    backgroundPatternSize?: string;
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

  maxWidth?: number;
  alignment?: 'left' | 'center' | 'right';
  buttonStyle?: 'filled' | 'outlined' | 'ghost';
  buttonSize?: 'sm' | 'md' | 'lg';
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  logoSize?: number;

  animations?: {
    intensity?: 'none' | 'subtle' | 'moderate' | 'playful';
    enableAnimations?: boolean;
    respectReducedMotion?: boolean;
  };
}

/**
 * Form layout configuration
 */
export interface FormLayoutConfig {
  type: 'singleColumn' | 'multiStep' | 'custom';
  options: {
    maxWidth?: number;
    padding?: number;
    backgroundColor?: string;
    
    // Single column specific
    singleColumn?: {
      showQuestionNumbers?: boolean;
      questionSpacing?: number;
      submitButtonPosition?: 'left' | 'center' | 'right';
    };
    
    // Multi-step specific
    multiStep?: {
      showProgressBar?: boolean;
      progressBarStyle?: 'bar' | 'dots' | 'numbers';
      allowBackNavigation?: boolean;
      showStepTitles?: boolean;
    };
  };
}

/**
 * Form behavior settings
 */
export interface FormSettings {
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  requireAllFields?: boolean;
  shuffleQuestions?: boolean;
  timeLimit?: number;                    // In minutes
  redirectUrl?: string;                  // After submission
  customSubmissionMessage?: string;
  collectIPAddress?: boolean;
  collectUserAgent?: boolean;
  enableSaveAndContinue?: boolean;
  
  // Submission handling
  submitButtonText?: string;
  showResetButton?: boolean;
  confirmBeforeSubmit?: boolean;
  
  // Privacy and compliance
  showPrivacyNotice?: boolean;
  privacyNoticeText?: string;
  gdprCompliant?: boolean;
}

/**
 * Complete form structure
 */
export interface Form {
  id: string;
  title: string;
  description?: string;
  prompt?: string;                       // Original AI prompt
  fields: FormField[];
  fieldGroups?: FieldGroup[];            // For multi-step forms
  theme: FormTheme;
  customization?: FormCustomization;     // Advanced styling
  layout?: FormLayoutConfig;             // Layout configuration
  settings?: FormSettings;               // Form behavior
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form response structure
 */
export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;             // Field ID -> User answer
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Form list item for homepage display
 */
export interface FormListItem {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  responseCount: number;
  theme: FormTheme;
  settings?: FormSettings;
}

/**
 * Form analytics data
 */
export interface FormAnalytics {
  formId: string;
  totalResponses: number;
  completionRate: number;
  averageTimeToComplete: number;        // In seconds
  abandonmentRate: number;
  popularFields: Array<{
    fieldId: string;
    label: string;
    responseRate: number;
  }>;
  responsesByDate: Array<{
    date: string;
    count: number;
  }>;
}