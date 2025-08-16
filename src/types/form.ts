// src/types/form.ts

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