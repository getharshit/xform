import { FormCustomization } from './customization';

// Theme structure
export interface FormTheme {
  id: string;
  name: string;
  description?: string;
  customization: FormCustomization;
  isDefault: boolean;
  isCustom: boolean;
  previewImage?: string;
}

// Pre-built theme types
export type PrebuiltThemeType = 
  | 'minimal'
  | 'modern' 
  | 'classic'
  | 'colorful'
  | 'dark'
  | 'professional'
  | 'creative'
  | 'compact';

// Theme category for organization
export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  themes: FormTheme[];
}

// Theme customization state
export interface ThemeCustomizationState {
  currentTheme: FormTheme;
  customizations: Partial<FormCustomization>;
  previewMode: boolean;
  isDirty: boolean; // Has unsaved changes
}