// src/types/forms.ts - Main Form Interfaces
// Consolidated form structures using all unified types

import { FormField, FieldGroup, FieldValidationError, FieldChangeEvent } from './fields';
import { FormCustomization, CustomizationValidationError } from './customization';
import { FormTheme, ThemeValidationError } from './theme';
import { FormLayoutConfig, LegacyFormLayoutConfig, LayoutState, LayoutValidationError } from './layout';

/**
 * Form settings configuration
 * Controls form behavior and submission handling
 */
export interface FormSettings {
  // Submission settings
  allowMultipleSubmissions?: boolean;   // Allow multiple submissions from same user
  requireAllFields?: boolean;           // Make all fields required regardless of individual settings
  shuffleQuestions?: boolean;           // Randomize question order
  timeLimit?: number;                   // Time limit in minutes
  redirectUrl?: string;                 // Redirect URL after submission
  customSubmissionMessage?: string;     // Custom thank you message
  
  // Data collection settings
  collectIPAddress?: boolean;           // Collect submitter IP address
  collectUserAgent?: boolean;           // Collect browser/device information
  collectTimestamp?: boolean;           // Collect submission timestamp
  collectFormVersion?: boolean;         // Track form version for submissions
  
  // User experience settings
  enableSaveAndContinue?: boolean;      // Allow saving progress and continuing later
  showProgressBar?: boolean;            // Show progress indicator
  submitButtonText?: string;            // Custom submit button text
  showResetButton?: boolean;            // Show form reset button
  confirmBeforeSubmit?: boolean;        // Show confirmation dialog before submit
  autoSave?: boolean;                   // Auto-save form progress
  autoSaveInterval?: number;            // Auto-save interval in seconds
  
  // Privacy and compliance
  showPrivacyNotice?: boolean;          // Display privacy notice
  privacyNoticeText?: string;           // Custom privacy notice text
  gdprCompliant?: boolean;              // GDPR compliance mode
  dataRetentionDays?: number;           // Data retention period in days
  anonymizeResponses?: boolean;         // Remove identifying information
  
  // Notification settings
  sendEmailNotification?: boolean;      // Send email on submission
  notificationEmail?: string;           // Email address for notifications
  sendConfirmationEmail?: boolean;      // Send confirmation to submitter
  confirmationEmailTemplate?: string;   // Custom confirmation email template
  
  // Advanced settings
  enableWebhooks?: boolean;             // Enable webhook notifications
  webhookUrl?: string;                  // Webhook endpoint URL
  enableAPIAccess?: boolean;            // Allow API access to responses
  apiAccessLevel?: 'read' | 'write' | 'admin'; // API access level
  rateLimitSubmissions?: boolean;       // Rate limit form submissions
  maxSubmissionsPerHour?: number;       // Maximum submissions per hour
  enableCaptcha?: boolean;              // Enable CAPTCHA verification
  captchaProvider?: 'recaptcha' | 'hcaptcha' | 'turnstile'; // CAPTCHA provider
    thankYouMessage?: string;
  requireCaptcha?: boolean;
  encryptData?: boolean;
  acceptResponses?: boolean;
  closedMessage?: string;
  responseLimit?: number;
  autoCloseDate?: string | Date;
}

/**
 * Form metadata and tracking information
 */
export interface FormMetadata {
  // Basic metadata
  id: string;                           // Unique form identifier
  title: string;                        // Form title
  description?: string;                 // Form description
  prompt?: string;                      // AI generation prompt (if AI-generated)
  
  // Versioning and tracking
  version: string;                      // Form version number
  slug?: string;                        // URL-friendly identifier
  tags?: string[];                      // Categorization tags
  category?: string;                    // Form category
  
  // Timestamps
  createdAt: Date | string;             // Creation timestamp
  updatedAt: Date | string;             // Last update timestamp
  publishedAt?: Date | string;          // Publication timestamp
  lastSubmissionAt?: Date | string;     // Last submission timestamp
  
  // Authorship
  createdBy?: string;                   // Creator user ID
  lastModifiedBy?: string;              // Last modifier user ID
  collaborators?: string[];             // Collaborator user IDs
  
  // Status and visibility
  status: 'draft' | 'published' | 'archived' | 'deleted'; // Form status
  visibility: 'public' | 'private' | 'unlisted' | 'password'; // Visibility setting
  password?: string;                    // Password for protected forms
  expiresAt?: Date | string;            // Form expiration date
  
  // Analytics and metrics
  responseCount: number;                // Total response count
  viewCount: number;                    // Total view count
  completionRate: number;               // Completion rate percentage
  averageCompletionTime: number;        // Average completion time in seconds
  bounceRate: number;                   // Bounce rate percentage
  
  // SEO and sharing
  metaTitle?: string;                   // SEO title
  metaDescription?: string;             // SEO description
  socialImage?: string;                 // Social sharing image URL
  canonicalUrl?: string;                // Canonical URL
}

/**
 * Complete form structure
 * Main interface combining all form components
 */
export interface Form {
  // Core form structure
  id: string;
  title: string;
  description?: string | null;
  prompt?: string | null;               // AI generation prompt
  
  // Form content
  fields: FormField[];                  // Individual form fields
  fieldGroups?: FieldGroup[];           // Multi-step form groups
  
  // Visual and behavioral configuration
  theme?: FormTheme;                     // Theme configuration
  customization?: FormCustomization;    // Advanced customization
  layout?: FormLayoutConfig;            // Layout configuration
  settings?: FormSettings;              // Form settings
  
  // Metadata and tracking
  createdAt: Date | string;
  updatedAt: Date | string;
    published?: boolean;           // 🆕 ADD THIS
  publishedAt?: Date | string;
  responseCount?: number;
  
  // Extended metadata (optional)
  metadata?: Partial<FormMetadata>;
}





/**
 * Form response structure
 * Represents a submitted form response
 */
export interface FormResponse {
  // Response identification
  id: string;                           // Unique response identifier
  formId: string;                       // Form ID this response belongs to
  formVersion?: string;                 // Form version at time of submission
  
  // Response data
  data: Record<string, any>;            // Field ID -> value mapping
  rawData?: Record<string, any>;        // Raw unprocessed data
  processedData?: Record<string, any>;  // Processed/validated data
  
  // Submission metadata
  submittedAt: Date | string;           // Submission timestamp
  completedAt?: Date | string;          // Completion timestamp (for multi-step)
  startedAt?: Date | string;            // Start timestamp
  
  // User tracking
  ipAddress?: string;                   // Submitter IP address
  userAgent?: string;                   // Browser/device information
  userId?: string;                      // User ID (if authenticated)
  sessionId?: string;                   // Session identifier
  
  // Response state
  status: 'draft' | 'partial' | 'completed' | 'abandoned'; // Response status
  currentStep?: number;                 // Current step (for multi-step forms)
  completedSteps?: number[];            // Completed steps
  
  // Validation and quality
  isValid: boolean;                     // Whether response passed validation
  validationErrors?: FieldValidationError[]; // Validation errors
  qualityScore?: number;                // Response quality score (0-100)
  flagged?: boolean;                    // Flagged for review
  flagReason?: string;                  // Reason for flagging
  
  // Processing metadata
  processedAt?: Date | string;          // Processing timestamp
  exported?: boolean;                   // Whether response was exported
  exportedAt?: Date | string;           // Export timestamp
}

/**
 * Form analytics and insights
 */
export interface FormAnalytics {
  formId: string;                       // Form identifier
  period: {                             // Analysis period
    start: Date | string;
    end: Date | string;
  };
  
  // Response metrics
  totalResponses: number;               // Total response count
  completedResponses: number;           // Completed response count
  partialResponses: number;             // Partial response count
  abandonedResponses: number;           // Abandoned response count
  
  // Engagement metrics
  totalViews: number;                   // Total form views
  uniqueViews: number;                  // Unique visitor count
  completionRate: number;               // Completion rate percentage
  bounceRate: number;                   // Bounce rate percentage
  averageTimeToComplete: number;        // Average completion time (seconds)
  
  // Field analytics
  fieldAnalytics: Array<{
    fieldId: string;                    // Field identifier
    fieldLabel: string;                 // Field label
    fieldType: string;                  // Field type
    responseRate: number;               // Response rate for this field
    abandonmentRate: number;            // Abandonment rate at this field
    averageTime: number;                // Average time spent on field
    mostCommonValues?: any[];           // Most common responses
    validationErrors: number;           // Number of validation errors
  }>;
  
  // Step analytics (for multi-step forms)
  stepAnalytics?: Array<{
    stepIndex: number;                  // Step index
    stepTitle: string;                  // Step title
    completionRate: number;             // Step completion rate
    dropoffRate: number;                // Drop-off rate at this step
    averageTime: number;                // Average time on step
    backNavigationRate: number;         // Rate of back navigation
  }>;
  
  // Device and browser analytics
  deviceBreakdown: Record<string, number>; // Device type breakdown
  browserBreakdown: Record<string, number>; // Browser breakdown
  
  // Geographic analytics
  countryBreakdown?: Record<string, number>; // Country breakdown
  cityBreakdown?: Record<string, number>;    // City breakdown
  
  // Time-based analytics
  responsesByHour: Array<{ hour: number; count: number }>; // Hourly response distribution
  responsesByDay: Array<{ date: string; count: number }>;  // Daily response distribution
  responsesByWeek: Array<{ week: string; count: number }>; // Weekly response distribution
}

/**
 * Form validation result
 * Comprehensive validation feedback
 */
export interface FormValidationResult {
  isValid: boolean;                     // Overall validation status
  
  // Field validation
  fieldErrors: FieldValidationError[];  // Field-specific errors
  fieldWarnings: FieldValidationError[]; // Field-specific warnings
  
  // Theme validation
  themeErrors: ThemeValidationError[];  // Theme validation errors
  
  // Customization validation
  customizationErrors: CustomizationValidationError[]; // Customization errors
  
  // Layout validation
  layoutErrors: LayoutValidationError[]; // Layout validation errors
  
  // General validation
  generalErrors: Array<{                // General form errors
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  
  // Validation summary
  summary: {
    totalErrors: number;                // Total error count
    totalWarnings: number;              // Total warning count
    criticalErrors: number;             // Critical error count
    validationScore: number;            // Validation score (0-100)
  };
}

/**
 * Form state management
 * For tracking form state during completion
 */
export interface FormState {
  // Current state
  currentStep: number;                  // Current step index
  totalSteps: number;                   // Total number of steps
  currentStepFields: FormField[];       // Fields in current step
  
  // Form data
  formData: Record<string, any>;        // Current form data
  initialData?: Record<string, any>;    // Initial form data
  changedFields: Set<string>;           // Changed field IDs
  touchedFields: Set<string>;           // Touched field IDs
  
  // Validation state
  errors: FieldValidationError[];       // Current validation errors
  isValid: boolean;                     // Whether form is currently valid
  isValidating: boolean;                // Whether validation is in progress
  
  // Submission state
  isSubmitting: boolean;                // Whether form is being submitted
  isSubmitted: boolean;                 // Whether form has been submitted
  submissionAttempts: number;           // Number of submission attempts
  
  // Navigation state
  visitedSteps: Set<number>;            // Visited step indices
  canGoBack: boolean;                   // Whether back navigation is allowed
  canGoForward: boolean;                // Whether forward navigation is allowed
  
  // Progress state
  completionPercentage: number;         // Completion percentage (0-100)
  timeSpent: number;                    // Time spent on form (seconds)
  lastActivity: Date;                   // Last activity timestamp
  
  // Auto-save state
  isSaving: boolean;                    // Whether auto-save is in progress
  lastSaved?: Date;                     // Last auto-save timestamp
  hasUnsavedChanges: boolean;           // Whether there are unsaved changes
}

/**
 * Form context value for React context
 * Provides form state and methods to components
 */
export interface FormContextValue {
  // Form configuration
  form: Form;                           // Current form configuration
  state: FormState;                     // Current form state
  layoutState: LayoutState;             // Layout-specific state
  
  // Form data methods
  updateField: (fieldId: string, value: any) => void;
  getFieldValue: (fieldId: string) => any;
  setFieldValue: (fieldId: string, value: any) => void;
  resetField: (fieldId: string) => void;
  resetForm: () => void;
  
  // Validation methods
  validateField: (fieldId: string) => FieldValidationError | null;
  validateStep: (step?: number) => FieldValidationError[];
  validateForm: () => FormValidationResult;
  clearFieldError: (fieldId: string) => void;
  
  // Navigation methods
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  
  // Submission methods
  submitForm: () => Promise<void>;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  
  // Event handlers
  onFieldChange?: (event: FieldChangeEvent) => void;
  onStepChange?: (step: number) => void;
  onValidationError?: (errors: FieldValidationError[]) => void;
  onSubmit?: (data: Record<string, any>) => Promise<void>;
}

/**
 * Form builder configuration
 * Configuration for form building interface
 */
export interface FormBuilderConfig {
  // Editor settings
  enableDragDrop: boolean;              // Enable drag-and-drop field reordering
  enableLivePreview: boolean;           // Enable live form preview
  enableAutoSave: boolean;              // Enable auto-save functionality
  autoSaveInterval: number;             // Auto-save interval in milliseconds
  
  // Field configuration
  availableFieldTypes: string[];        // Available field types for building
  customFieldTypes?: Record<string, any>; // Custom field type definitions
  fieldTemplates?: Record<string, FormField>; // Pre-configured field templates
  
  // Theme and customization
  enableAdvancedTheming: boolean;       // Enable advanced theming options
  availableThemes: string[];            // Available theme options
  customThemes?: Record<string, FormTheme>; // Custom theme definitions
  
  // Layout options
  enableAdvancedLayouts: boolean;       // Enable advanced layout options
  availableLayouts: string[];           // Available layout types
  
  // Integration settings
  enableWebhooks: boolean;              // Enable webhook configuration
  enableAPIAccess: boolean;             // Enable API access configuration
  enableAnalytics: boolean;             // Enable analytics features
  
  // Validation and publishing
  requireValidation: boolean;           // Require validation before publishing
  enablePreview: boolean;               // Enable form preview functionality
  enablePublishing: boolean;            // Enable form publishing
  enableSharing: boolean;               // Enable form sharing features
}

// Export types for external use
export type { Form as ExtendedForm };
export type { FormResponse as Response };
export type { FormAnalytics as Analytics };
export type { FormState as State };

// Export utility types
export type FormId = string;
export type ResponseId = string;
export type FieldId = string;
export type StepIndex = number;