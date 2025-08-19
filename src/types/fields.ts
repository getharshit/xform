// src/types/fields.ts - Unified Field Type Definitions
// This file consolidates field types from both src/types/form.ts and src/components/public-form/types/

/**
 * Extended field types supporting 16 different field types
 * Combines all field types from both existing type systems
 */
export type ExtendedFieldType = 
  // Text-based fields (5 types)
  | 'shortText'       // Single line text input
  | 'longText'        // Multi-line textarea
  | 'email'          // Email input with validation
  | 'website'        // URL input with validation
  | 'phoneNumber'    // Phone number input with formatting
  
  // Choice-based fields (4 types)
  | 'multipleChoice'  // Radio buttons (single selection)
  | 'dropdown'        // Select dropdown menu
  | 'yesNo'          // Boolean yes/no choice
  | 'opinionScale'    // 1-10 opinion rating scale
  
  // Rating fields (1 type)
  | 'numberRating'    // Numeric rating scale (customizable range)
  
  // Special fields (3 types)
  | 'statement'       // Display-only text/HTML content
  | 'legal'          // Terms acceptance checkbox with scrollable content
  | 'fileUpload'     // File upload with validation
  
  // Structure fields (3 types)
  | 'pageBreak'      // Multi-step form section separator
  | 'startingPage'   // Welcome/intro screen
  | 'postSubmission'; // Thank you/completion screen

/**
 * Legacy field types for backward compatibility
 * Maps to ExtendedFieldType internally
 */
export type LegacyFieldType = 'text' | 'multipleChoice' | 'dropdown' | 'rating' | 'date';

/**
 * Validation rules for form fields
 * Consolidated from both type systems with all validation options
 */
export interface FieldValidationRules {
  // Basic validation
  pattern?: string;                    // Regex pattern for text validation
  min?: number;                       // Minimum value/length
  max?: number;                       // Maximum value/length
  customMessage?: string;             // Custom error message
  
  // Specific field validation
  requireScrollToAccept?: boolean;    // For legal fields - require full scroll
  
  // Email field validation
  allowedDomains?: string[];          // Allowed email domains
  blockedDomains?: string[];          // Blocked email domains
  
  // URL field validation
  allowedProtocols?: string[];        // Allowed URL protocols (http, https, etc.)
  autoAddProtocol?: boolean;          // Automatically add https:// if missing
  
  // Phone field validation
  autoFormat?: boolean;               // Auto-format phone number as user types
  allowedCountries?: string[];        // Allowed country codes
  autoDetectCountry?: boolean;        // Auto-detect country from input
  
  // Choice field validation
  minSelections?: number;             // Minimum selections required
  maxSelections?: number;             // Maximum selections allowed
}

/**
 * Display options for form fields
 * Merged and enhanced from both type systems
 */
export interface FieldDisplayOptions {
  // Layout options
  width?: 'full' | 'half' | 'third';  // Field width in form
  showLabel?: boolean;                 // Show/hide field label
  showDescription?: boolean;           // Show/hide field description
  inline?: boolean;                    // Inline layout for choice fields
  variant?: string;                    // Generic variant property
  
  // Text field specific
  rows?: number;                       // Textarea height (number of rows)
  enableRichText?: boolean;            // Enable rich text editing for long text
  
  // Choice field specific
  layout?: 'vertical' | 'horizontal' | 'grid'; // Layout for options
  columns?: number;                    // Number of columns for grid layout
  allowOther?: boolean;               // Allow "Other" option with text input
  otherLabel?: string;                // Custom label for "Other" option
  requireOtherText?: boolean;         // Require text when "Other" is selected
  randomizeOrder?: boolean;           // Randomize option order
  
  // Dropdown specific
  searchable?: boolean;               // Make dropdown searchable
  maxHeight?: number;                 // Dropdown max height in pixels
  
  // Rating field specific
  ratingStyle?: 'numbers' | 'stars' | 'hearts' | 'thumbs' | 'smiley' | 'fire'; // Visual style
  displayStyle?: 'numbers' | 'stars'; // Alternative naming for rating style (backward compatibility)
  labels?: {
    low?: string;                     // Label for minimum rating
    high?: string;                    // Label for maximum rating
  };
  showValue?: boolean;                // Display selected rating value
  allowHalf?: boolean;                // Allow half-star ratings
  
  // Phone field specific
  showCountryCode?: boolean;          // Show country code selector
  defaultCountry?: string;            // Default country code
  
  // Statement field specific
  imageUrl?: string;                  // Header image URL
  imageAlt?: string;                  // Image alt text
  links?: Array<{                     // External links within statement
    text: string;
    url: string;
    external?: boolean;
  }>;
  
  // Legal field specific
  termsTitle?: string;                // Title for terms section
  externalLinks?: string[] | Array<{  // Links to external legal documents (flexible format)
    text: string;
    url: string;
  }>;
  enableMultipleCheckboxes?: boolean; // Multiple agreement checkboxes
  additionalAgreements?: string[];    // Additional agreement texts
  
  // Starting page specific
  estimatedTime?: string;             // Estimated completion time
  participantCount?: number;          // Number of participants (social proof)
  features?: string[];                // Form features to highlight
  
  // Post submission specific
  showDownload?: boolean;             // Show download receipt option
  showShare?: boolean;                // Show social sharing options
  showFeedback?: boolean;            // Show feedback collection
  redirectUrl?: string;               // Redirect URL after submission
  redirectDelay?: number;             // Delay before redirect (seconds)
  customActions?: any[];              // Custom action buttons (flexible structure)
  
  // Page break specific
  sectionTitle?: string;              // Section title
  sectionDescription?: string;        // Section description
  continueButtonText?: string;        // Custom continue button text
}

/**
 * Conditional logic configuration for fields
 * Controls when fields are shown/hidden based on other field values
 */
export interface FieldConditionalLogic {
  showWhen?: Array<{
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: any;
  }>;
  hideWhen?: Array<{
    fieldId: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value: any;
  }>;
}

/**
 * Complete form field interface
 * Consolidates and enhances field definitions from both type systems
 */
export interface FormField {
  // Core properties
  id: string;                         // Unique field identifier
  type: ExtendedFieldType;            // Field type (one of 16 supported types)
  label: string;                      // Field label (supports HTML)
  description?: string;               // Field description/help text (supports HTML)
  required: boolean;                  // Whether field is required
  
  // Input properties
  placeholder?: string;               // Input placeholder text
  defaultValue?: any;                 // Default field value
  helpText?: string;                  // Additional help text
  
  // Choice field properties
  options?: string[];                 // Options for choice fields (multipleChoice, dropdown)
  allowOther?: boolean;               // Allow "Other" option with text input (from form.ts)
  maxSelections?: number;             // For future multi-select support (1 = single select) (from form.ts)
  
  // Numeric field properties
  maxRating?: number;                 // Maximum rating value
  minRating?: number;                 // Minimum rating value
  displayStyle?: 'numbers' | 'stars'; // Rating display style (from form.ts)
  
  // Text field properties
  maxLength?: number;                 // Maximum character length
  minLength?: number;                 // Minimum character length
  
  // File upload properties
  acceptedFileTypes?: string[];       // Allowed file extensions (.pdf, .jpg, etc.)
  maxFileSize?: number;               // Maximum file size in MB
  
  // Validation configuration
  validationRules?: FieldValidationRules;
  
  // Display configuration
  displayOptions?: FieldDisplayOptions;
  
  // Conditional logic
  conditionalLogic?: FieldConditionalLogic;
}

/**
 * Field group for multi-step forms
 * Groups related fields into logical sections
 */
export interface FieldGroup {
  id: string;                         // Unique group identifier
  title: string;                      // Group/step title
  description?: string;               // Group description
  fields: FormField[];                // Fields in this group
  showProgressBar?: boolean;          // Show progress indicator
  allowBackNavigation?: boolean;      // Allow going back to this step
}

/**
 * Form validation error
 */
export interface FieldValidationError {
  fieldId: string;                    // Field that has the error
  message: string;                    // Error message
  type: 'required' | 'format' | 'length' | 'custom' | 'file'; // Error type
}

/**
 * Field value change event
 */
export interface FieldChangeEvent {
  fieldId: string;                    // Field that changed
  value: any;                         // New field value
  previousValue?: any;                // Previous field value
  isValid: boolean;                   // Whether new value is valid
  errors: FieldValidationError[];     // Validation errors (if any)
}

// Export legacy types for backward compatibility
export type { FormField as ExtendedFormField };
export type { LegacyFieldType as FieldType };