// src/types/index.ts - UPDATED VERSION - Single Source of Truth
// Unified type system serving as single source of truth for all form-related types

// =============================================================================
// MAIN EXPORTS - THESE ARE THE ONLY IMPORTS COMPONENTS SHOULD USE
// =============================================================================

// Core field types
export type {
  // Main field types
  ExtendedFieldType,
  LegacyFieldType,
  FormField,
  
  // Field configuration
  FieldValidationRules,
  FieldDisplayOptions,
  FieldConditionalLogic,
  FieldGroup,
  
  // Field events and validation
  FieldValidationError,
  FieldChangeEvent,

  
  // Legacy compatibility
  ExtendedFormField
} from './fields';

// Main form types
export type {
  // Core form interfaces
  Form,
  LegacyForm,
  BasicForm,
  ExtendedForm,
  
  // Form configuration
  FormSettings,
  FormMetadata,
  FormBuilderConfig,
  
  // Form responses
  FormResponse,
  Response,
  
  // Analytics and insights
  FormAnalytics,
  Analytics,
  
  // Validation
  FormValidationResult,
  
  // State management
  FormState,
  State,
  FormContextValue,
  
  // Utility types
  FormId,
  ResponseId,
  FieldId,
  StepIndex
} from './forms';

// Theme types
export type {
  // Core theme interfaces
  FormTheme,
  BasicFormTheme,
  ExtendedFormTheme,
  
  // Theme components
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeShadows,
  ThemeTransitions,
  ThemeBreakpoints,
  ThemeZIndex,
  
  // Theme management
  PrebuiltThemeType,
  ThemeCategory,
  ThemeCustomizationState,
  ThemeState,
  ThemeAction,
  
  // Theme application
  ThemeCSSProperties,
  ThemeValidationError,
  ThemeValidationResult,
  ThemeExportData,
  ThemeContextValue,
  
  // Utility interfaces
} from './theme';

// Customization types
export type {
  // Main customization interface
  FormCustomization,
  BasicCustomization,
  
  // Customization categories
  ColorCustomization,
  TypographyCustomization,
  SpacingCustomization,
  ButtonCustomization,
  InputCustomization,
  LayoutCustomization,
  AnimationCustomization,
  BrandingCustomization,
  
  // Advanced features
  AnimatedBackgroundConfig,
  
  // Validation and events
  CustomizationValidationError,
  CustomizationValidationResult,
  CustomizationChangeEvent
} from './customization';

// Layout types
export type {
  // Core layout configuration
  FormLayoutConfig,
  LegacyFormLayoutConfig,
  BasicFormLayoutConfig,
  ExtendedFormLayoutConfig,
  FormLayoutType,
  
  // Layout options
  LayoutOptions,
  SingleColumnOptions,
  MultiStepOptions,
  WizardOptions,
  ConversationalOptions,
  CustomLayoutOptions,
  
  // Navigation and progress
  NavigationConfig,
  ProgressConfig,
  ResponsiveConfig,
  AccessibilityConfig,
  
  // Layout state management
  LayoutState,
  LayoutValidationError,
  LayoutTransition,
  LayoutContextValue
} from './layout';

export * from './renderer';

// =============================================================================
// CONVENIENCE TYPE GROUPS (for specific use cases)
// =============================================================================

// Import types for convenience groups
import type { 
  Form, 
  FormResponse, 
  FormSettings,
  FormBuilderConfig,
  FormValidationResult,
  FormState,
  FormContextValue,
  FormAnalytics,
  FormMetadata,
} from './forms';

import type {
  FormField,
  ExtendedFieldType,
  LegacyFieldType,
  FieldGroup,
  FieldValidationRules,
  FieldDisplayOptions,
  FieldValidationError,
  FieldChangeEvent
} from './fields';

import type {
  FormCustomization,
  BasicCustomization
} from './customization';

import type {
  FormTheme,
  BasicFormTheme,
  ThemeContextValue
} from './theme';

import type {
  FormLayoutConfig,
  LegacyFormLayoutConfig,
  BasicFormLayoutConfig,
  LayoutState,
  LayoutContextValue,
  NavigationConfig,
  ProgressConfig
} from './layout';

// Core types needed by most components
export type CoreFormTypes = {
  Form: Form;
  FormField: FormField;
  FormResponse: FormResponse;
  FormTheme: FormTheme;
  FormLayoutConfig: FormLayoutConfig;
  FormSettings: FormSettings;
};

// Types for form building/editing
export type FormBuilderTypes = {
  Form: Form;
  FormField: FormField;
  FieldGroup: FieldGroup;
  FormCustomization: FormCustomization;
  FormTheme: FormTheme;
  FormLayoutConfig: FormLayoutConfig;
  FormSettings: FormSettings;
  FormBuilderConfig: FormBuilderConfig;
  FormValidationResult: FormValidationResult;
  ExtendedFieldType: ExtendedFieldType;
  FieldValidationRules: FieldValidationRules;
  FieldDisplayOptions: FieldDisplayOptions;
  ThemeContextValue: ThemeContextValue;
  LayoutContextValue: LayoutContextValue;
};

// Types for form rendering/completion
export type FormRendererTypes = {
  Form: Form;
  FormField: FormField;
  FormResponse: FormResponse;
  FormState: FormState;
  FormContextValue: FormContextValue;
  FieldValidationError: FieldValidationError;
  FieldChangeEvent: FieldChangeEvent;
  LayoutState: LayoutState;
  NavigationConfig: NavigationConfig;
  ProgressConfig: ProgressConfig;
};

// Types for analytics and insights
export type AnalyticsTypes = {
  FormAnalytics: FormAnalytics;
  FormResponse: FormResponse;
  FormMetadata: FormMetadata;
  FieldValidationError: FieldValidationError;
};



// =============================================================================
// UTILITY FUNCTIONS AND CONSTANTS
// =============================================================================

// Field type categories for UI organization
export const FIELD_CATEGORIES = {
  text: ['shortText', 'longText', 'email', 'website', 'phoneNumber'] as ExtendedFieldType[],
  choice: ['multipleChoice', 'dropdown', 'yesNo', 'opinionScale'] as ExtendedFieldType[],
  rating: ['numberRating'] as ExtendedFieldType[],
  special: ['statement', 'legal', 'fileUpload'] as ExtendedFieldType[],
  structure: ['pageBreak', 'startingPage', 'postSubmission'] as ExtendedFieldType[]
};

// Type guards
export const isTextField = (type: ExtendedFieldType): boolean => 
  FIELD_CATEGORIES.text.includes(type);

export const isChoiceField = (type: ExtendedFieldType): boolean => 
  FIELD_CATEGORIES.choice.includes(type);

export const isRatingField = (type: ExtendedFieldType): boolean => 
  FIELD_CATEGORIES.rating.includes(type);

export const isSpecialField = (type: ExtendedFieldType): boolean => 
  FIELD_CATEGORIES.special.includes(type);

export const isStructureField = (type: ExtendedFieldType): boolean => 
  FIELD_CATEGORIES.structure.includes(type);

// Get field category for a given field type
export const getFieldCategory = (type: ExtendedFieldType): string => {
  for (const [category, types] of Object.entries(FIELD_CATEGORIES)) {
    if (types.includes(type)) {
      return category;
    }
  }
  return 'unknown';
};

// Get all field types grouped by category
export const getFieldTypesByCategory = () => FIELD_CATEGORIES;

// Default field creation helper
export const createDefaultField = (type: ExtendedFieldType, id: string): FormField => {
  const baseField: FormField = {
    id,
    type,
    label: `New ${type} field`,
    description: '',
    required: false,
    displayOptions: {
      width: 'full',
      showLabel: true,
      showDescription: true,
    },
    validationRules: {},
  };

  // Add type-specific defaults
  switch (type) {
    case 'multipleChoice':
    case 'dropdown':
      return { ...baseField, options: ['Option 1', 'Option 2'] };
    case 'numberRating':
      return { ...baseField, minRating: 1, maxRating: 5 };
    case 'opinionScale':
      return { ...baseField, minRating: 1, maxRating: 10 };
    case 'shortText':
    case 'longText':
      return { ...baseField, placeholder: `Enter ${baseField.label.toLowerCase()}` };
    case 'email':
      return { 
        ...baseField, 
        placeholder: 'Enter your email address',
        validationRules: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          customMessage: 'Please enter a valid email address'
        }
      };
    case 'phoneNumber':
      return { 
        ...baseField, 
        placeholder: 'Enter your phone number',
        validationRules: { autoFormat: true }
      };
    case 'website':
      return { 
        ...baseField, 
        placeholder: 'https://example.com',
        validationRules: { 
          autoAddProtocol: true,
          allowedProtocols: ['http', 'https']
        }
      };
    case 'fileUpload':
      return { 
        ...baseField, 
        acceptedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
        maxFileSize: 10,
        helpText: 'Maximum file size: 10MB'
      };
    case 'legal':
      return { 
        ...baseField, 
        required: true,
        validationRules: { requireScrollToAccept: true }
      };
    case 'yesNo':
      return { 
        ...baseField, 
        options: ['Yes', 'No'],
        displayOptions: { ...baseField.displayOptions, inline: true }
      };
    default:
      return baseField;
  }
};

// =============================================================================
// DEPRECATED EXPORTS (for backward compatibility)
// =============================================================================

/**
 * @deprecated Use ExtendedFieldType instead
 */
export type { LegacyFieldType as FieldType } from './fields';

/**
 * @deprecated Use FormField instead
 */
export type { FormField as Field } from './fields';

/**
 * @deprecated Use Form instead
 */
export type { Form as BuilderForm } from './forms';

/**
 * @deprecated Use LegacyFormTheme instead
 */
export type { LegacyFormTheme as BasicTheme } from './theme';

// =============================================================================
// ANIMATION TYPES
// =============================================================================

export type {
  // Core animation types
  AnimationIntensity,
  AnimationPreset,
  AnimationEasing,
  AnimationTiming,
  IntensitySettings,
  
  // Configuration and context
  AnimationConfig,
  AnimationContextValue,
  AnimationVariants,
  AnimationTransitions,
  
  // Component props
  AnimatedComponentProps,
  
  // Hook return types
  UseAnimationReturn,
  UseButtonAnimationReturn,
  UseErrorAnimationReturn,
  UseSuccessAnimationReturn,
  
  // Provider props
  AnimationProviderProps,
  
  // Form integration
  FormAnimationCustomization
} from './animation';

// =============================================================================
// RE-EXPORTS FOR CONVENIENCE
// =============================================================================

// Export everything from each module for direct access
export * from './fields';
export * from './customization';
export * from './theme';
export * from './layout';
export * from './forms';
export * from './animation';

// =============================================================================
// VERSION AND MIGRATION UTILITIES
// =============================================================================

/**
 * Current type system version
 */
export const TYPE_SYSTEM_VERSION = '2.0.0';

/**
 * Supported legacy versions for migration
 */
export const SUPPORTED_LEGACY_VERSIONS = ['1.0.0', '1.1.0', '1.2.0'];

/**
 * Migration information for breaking changes
 */
export const MIGRATION_INFO = {
  '1.x.x_to_2.0.0': {
    breaking_changes: [
      'FormCustomization interface restructured',
      'FormTheme properties moved to nested objects',
      'FormLayoutConfig enhanced with navigation and progress',
      'ExtendedFieldType expanded to 16 field types'
    ],
    migration_path: 'Use legacy interfaces and conversion utilities',
    deprecated_types: ['FieldType', 'BasicFormTheme'],
    new_features: [
      'Advanced customization system',
      'Comprehensive theme management',
      'Enhanced layout configurations',
      'Form analytics and insights',
      'State management interfaces'
    ]
  }
};