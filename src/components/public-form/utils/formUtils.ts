import { ExtendedForm, ExtendedFormField, FormSettings, FormCustomization } from '../types';
import { FormLayoutConfig } from '../types/layout';
import { Form as BaseForm, FormField as BaseFormField } from '@/types/form';

// Utility to convert existing forms to extended format
export const convertToExtendedForm = (baseForm: BaseForm): ExtendedForm => {
  const convertedFields: ExtendedFormField[] = baseForm.fields.map((field: BaseFormField) => {
    let convertedType: ExtendedFormField['type'];
    
    // Map old field types to new extended types
    switch (field.type) {
      case 'text':
        convertedType = 'shortText';
        break;
      case 'multipleChoice':
        convertedType = 'multipleChoice';
        break;
      case 'dropdown':
        convertedType = 'dropdown';
        break;
      case 'rating':
        convertedType = 'numberRating';
        break;
      case 'date':
        // For now, treat dates as short text since we need to implement date field
        convertedType = 'shortText';
        break;
      default:
        convertedType = 'shortText';
    }

    return {
      ...field,
      type: convertedType,
      description: undefined,
      maxLength: field.type === 'text' ? 255 : undefined,
      displayOptions: {
        width: 'full',
        showLabel: true,
        showDescription: true,
        inline: false
      }
    } as ExtendedFormField;
  });

  // Get primary color from theme or customization (with proper type checking)
  const getPrimaryColor = (): string => {
    if (baseForm.theme?.primaryColor) {
      return baseForm.theme.primaryColor;
    }
    if (baseForm.customization?.colors && typeof baseForm.customization.colors === 'object' && 'primary' in baseForm.customization.colors) {
      return (baseForm.customization.colors as any).primary;
    }
    return '#3B82F6';
  };

  const primaryColor = getPrimaryColor();

  // Create default customization object matching FormCustomization interface exactly
  const defaultCustomization: FormCustomization = {
    typography: {
      fontFamily: baseForm.theme?.fontFamily || 'Inter, sans-serif',
      fontSize: {
        title: 24,
        question: 16,
        description: 14,
        input: 16,
        button: 16
      },
      fontWeight: {
        title: 'bold',
        question: 'medium',
        description: 'normal'
      },
      lineHeight: {
        title: 1.2,
        question: 1.4,
        description: 1.5
      }
    },
    colors: {
      primary: primaryColor,
      secondary: '#6B7280',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: {
        primary: '#111827',
        secondary: '#6B7280',
        muted: '#9CA3AF',
        error: '#EF4444',
        success: '#10B981'
      },
      border: {
        default: '#D1D5DB',
        focus: primaryColor,
        error: '#EF4444',
        hover: '#9CA3AF'
      },
      button: {
        primary: {
          background: primaryColor,
          text: '#FFFFFF',
          border: primaryColor,
          hover: {
            background: '#2563EB',
            text: '#FFFFFF',
            border: '#2563EB'
          }
        },
        secondary: {
          background: '#F3F4F6',
          text: '#374151',
          border: '#D1D5DB',
          hover: {
            background: '#E5E7EB',
            text: '#374151',
            border: '#9CA3AF'
          }
        }
      }
    },
    spacing: {
      container: {
        padding: 32,
        maxWidth: 768
      },
      questions: {
        marginBottom: 24,
        padding: 0
      },
      inputs: {
        padding: 12,
        marginTop: 8
      },
      buttons: {
        padding: {
          x: 24,
          y: 12
        },
        marginTop: 24,
        gap: 16
      }
    },
    buttons: {
      borderRadius: 8,
      borderWidth: 1,
      size: 'medium',
      fullWidth: false
    },
    inputs: {
      borderRadius: 8,
      borderWidth: 1,
      focusRing: {
        width: 2,
        color: primaryColor,
        offset: 0
      },
      placeholder: {
        color: '#9CA3AF',
        opacity: 1
      }
    },
    layout: {
      questionAlignment: 'left',
      inputAlignment: 'left'
    },
    animations: {
      enableAnimations: true,
      transitions: {
        duration: 200,
        easing: 'ease-in-out'
      }
    },
    branding: {
      logo: baseForm.theme?.logoUrl ? {
        url: baseForm.theme.logoUrl,
        width: 120,
        height: 40,
        position: 'top-center'
      } : undefined,
      watermark: {
        show: false,
        text: '',
        position: 'bottom-right'
      }
    }
  };

  // Create default layout matching FormLayoutConfig interface exactly
  const defaultLayout: FormLayoutConfig = {
    type: 'singleColumn',
    options: {
      singleColumn: {
        maxWidth: baseForm.layout?.options?.maxWidth || 768,
        questionSpacing: 24,
        showAllQuestions: true
      }
    }
  };

  // Create default settings with proper boolean values
  const defaultSettings: FormSettings = {
    allowMultipleSubmissions: baseForm.settings?.allowMultipleSubmissions ?? true,
    showProgressBar: baseForm.settings?.showProgressBar ?? false,
    requireAllFields: baseForm.settings?.requireAllFields ?? false,
    shuffleQuestions: baseForm.settings?.shuffleQuestions ?? false,
    collectIPAddress: baseForm.settings?.collectIPAddress ?? false,
    collectUserAgent: baseForm.settings?.collectUserAgent ?? false,
    enableSaveAndContinue: baseForm.settings?.enableSaveAndContinue ?? false
  };

  // Convert fieldGroups if they exist (handle type conversion)
  const convertedFieldGroups = baseForm.fieldGroups ? baseForm.fieldGroups.map(group => ({
    ...group,
    fields: group.fields.map(field => {
      let convertedType: ExtendedFormField['type'];
      
      switch (field.type) {
        case 'text':
          convertedType = 'shortText';
          break;
        case 'multipleChoice':
          convertedType = 'multipleChoice';
          break;
        case 'dropdown':
          convertedType = 'dropdown';
          break;
        case 'rating':
          convertedType = 'numberRating';
          break;
        case 'date':
          convertedType = 'shortText';
          break;
        default:
          convertedType = 'shortText';
      }

      return {
        ...field,
        type: convertedType,
        description: undefined,
        maxLength: field.type === 'text' ? 255 : undefined,
        displayOptions: {
          width: 'full',
          showLabel: true,
          showDescription: true,
          inline: false
        }
      } as ExtendedFormField;
    })
  })) : undefined;

  return {
    id: baseForm.id,
    title: baseForm.title,
    description: baseForm.description,
    fields: convertedFields,
    customization: defaultCustomization,
    layout: defaultLayout,
    theme: {
      id: 'converted-theme',
      name: 'Converted Theme',
      customization: defaultCustomization,
      isDefault: false,
      isCustom: true
    },
    settings: defaultSettings,
    fieldGroups: convertedFieldGroups,
    createdAt: baseForm.createdAt,
    updatedAt: baseForm.updatedAt
  };
};

// Utility to check if form is multi-step
export const isMultiStepForm = (form: ExtendedForm): boolean => {
  return !!(form.fieldGroups && form.fieldGroups.length > 1);
};

// Utility to get field by ID
export const getFieldById = (form: ExtendedForm, fieldId: string): ExtendedFormField | undefined => {
  return form.fields.find(field => field.id === fieldId);
};

// Utility to validate field visibility based on conditional logic
export const isFieldVisible = (
  field: ExtendedFormField, 
  formData: Record<string, any>
): boolean => {
  if (!field.conditionalLogic) return true;

  const { showWhen, hideWhen } = field.conditionalLogic;

  // Check show conditions
  if (showWhen && showWhen.length > 0) {
    const shouldShow = showWhen.some(condition => 
      evaluateCondition(condition, formData)
    );
    if (!shouldShow) return false;
  }

  // Check hide conditions
  if (hideWhen && hideWhen.length > 0) {
    const shouldHide = hideWhen.some(condition => 
      evaluateCondition(condition, formData)
    );
    if (shouldHide) return false;
  }

  return true;
};

// Helper function to evaluate conditions
const evaluateCondition = (
  condition: { fieldId: string; operator: string; value: any },
  formData: Record<string, any>
): boolean => {
  const fieldValue = formData[condition.fieldId];
  
  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    case 'notEquals':
      return fieldValue !== condition.value;
    case 'contains':
      return String(fieldValue).includes(String(condition.value));
    case 'greaterThan':
      return Number(fieldValue) > Number(condition.value);
    case 'lessThan':
      return Number(fieldValue) < Number(condition.value);
    default:
      return false;
  }
};

// NEW: Utility to ensure form has complete structure for PublicFormRenderer
export const ensureCompleteFormStructure = (form: any): ExtendedForm => {
  // If the form is already complete, return as is
  if (form.customization && form.layout && form.settings) {
    return form as ExtendedForm;
  }
  
  // Otherwise, run full conversion
  return convertToExtendedForm(form);
};