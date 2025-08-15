// Export all types
export type { ExtendedFormField, ExtendedFieldType, FieldGroup, ExtendedForm, FormSettings } from './fields';
export type { 
  FormCustomization, 
  TypographyCustomization, 
  ColorCustomization,
  SpacingCustomization,
  ButtonCustomization,
  InputCustomization,
  LayoutCustomization,
  AnimationCustomization,
  BrandingCustomization
} from './customization';
export type { 
  FormLayoutConfig, 
  FormLayoutType, 
  LayoutOptions, 
  NavigationConfig, 
  ProgressConfig 
} from './layout';
export type { FormTheme, PrebuiltThemeType, ThemeCategory, ThemeCustomizationState } from './theme';

// Validation types
export interface ExtendedValidationError {
  fieldId: string;
  message: string;
  type: 'required' | 'format' | 'length' | 'custom';
}

// Form state management
export interface FormState {
  currentStep: number;
  totalSteps: number;
  formData: Record<string, any>;
  errors: ExtendedValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
  touchedFields: Set<string>;
  visitedSteps: Set<number>;
}

// Form context
export interface FormContextValue {
  form: ExtendedForm;
  state: FormState;
  theme: FormTheme;
  updateField: (fieldId: string, value: any) => void;
  validateField: (fieldId: string) => ExtendedValidationError | null;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
}

// Renderer props
export interface PublicFormRendererProps {
  form: ExtendedForm;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onFieldChange?: (fieldId: string, value: any) => void;
  onStepChange?: (step: number) => void;
  initialData?: Record<string, any>;
  readonly?: boolean;
  showValidation?: boolean;
}