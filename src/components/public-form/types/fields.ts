import { FormField as BaseFormField } from "@/types/form";
import type { FormCustomization } from './customization';
import type { FormLayoutConfig } from './layout';
import type { FormTheme } from './theme';

// Extended field types (updated with new types)
export type ExtendedFieldType = 
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
  | 'startingPage'   // Welcome screen (NEW)
  | 'postSubmission'; // Thank you screen (NEW)

// Extended field interface
export interface ExtendedFormField extends Omit<BaseFormField, 'type'> {
  id: string;
  type: ExtendedFieldType;
  label: string;
  description?: string;
  required: boolean;
  
  // Field-specific properties
  placeholder?: string;           // For text inputs
  options?: string[];            // For choice fields
  maxRating?: number;            // For rating fields
  minRating?: number;            // For rating fields
  maxLength?: number;            // For text fields
  minLength?: number;            // For text fields
  acceptedFileTypes?: string[];   // For file uploads
  maxFileSize?: number;          // For file uploads (in MB)
  defaultValue?: any;            // Default field value
  helpText?: string;             // Additional help text
  
  // Validation rules
validationRules?: {
  pattern?: string;            // Regex pattern
  min?: number;               // Min value for numbers
  max?: number;               // Max value for numbers
  customMessage?: string;      // Custom validation message
  requireScrollToAccept?: boolean; // For legal fields
  
  // Email field validation
  allowedDomains?: string[];   // Allowed email domains
  blockedDomains?: string[];   // Blocked email domains
};
  
  // Display options (enhanced for new field types)
  // Display options (enhanced for new field types)
displayOptions?: {
  width?: 'full' | 'half' | 'third';
  showLabel?: boolean;
  showDescription?: boolean;
  inline?: boolean;           // For yes/no, checkboxes
  
  // Text field options
  rows?: number;             // For textarea height
  
  // Choice field options
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;          // For grid layout
  allowOther?: boolean;      // Allow "Other" option
  otherLabel?: string;       // Custom "Other" label
  randomizeOptions?: boolean; // Randomize option order
  
  // Dropdown specific options
  searchable?: boolean;      // Make dropdown searchable
  maxHeight?: number;        // Dropdown max height
  
  // Rating field options
  style?: 'numbers' | 'stars' | 'emoji';
  labels?: {
    low?: string;           // Label for minimum value
    high?: string;          // Label for maximum value
  };
  showValue?: boolean;      // Display selected value
  allowHalf?: boolean;      // Allow half-star ratings
  
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
  };
  
  // Logic and conditions
  conditionalLogic?: {
    showWhen?: {
      fieldId: string;
      operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
      value: any;
    }[];
    hideWhen?: {
      fieldId: string;
      operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
      value: any;
    }[];
  };
}

// Field group for multi-step forms
export interface FieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: ExtendedFormField[];
  showProgressBar?: boolean;
  allowBackNavigation?: boolean;
}

// Form structure with extended capabilities
export interface ExtendedForm {
  id: string;
  title: string;
  description?: string;
  fields: ExtendedFormField[];
  fieldGroups?: FieldGroup[];     // For multi-step forms
  customization: FormCustomization;
  layout: FormLayoutConfig;
  theme: FormTheme;
  settings: FormSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Form settings
export interface FormSettings {
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  requireAllFields?: boolean;
  shuffleQuestions?: boolean;
  timeLimit?: number;            // In minutes
  redirectUrl?: string;          // After submission
  customSubmissionMessage?: string;
  collectIPAddress?: boolean;
  collectUserAgent?: boolean;
  enableSaveAndContinue?: boolean;
}