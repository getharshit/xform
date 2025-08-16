// src/components/form-builder/field-types/registry/fieldRegistry.ts

import { FormField } from "@/types/form";

// Property schema interface
export interface FieldPropertySchema {
  id: string;
  section: 'basic' | 'options' | 'validation' | 'display' | 'advanced';
  component: 'input' | 'textarea' | 'switch' | 'select' | 'number' | 'custom';
  label: string;
  description?: string;
  placeholder?: string;
  props?: any;
  customComponent?: string; // For custom components
}

// Field type configuration
export interface FieldTypeConfig {
  propertySchema: FieldPropertySchema[];
  defaultValues: Partial<FormField>;
  displayName: string;
  description: string;
  category: string;
}

// Central field registry with all 14 implemented field types
export const FIELD_TYPE_REGISTRY: Record<string, FieldTypeConfig> = {
  // ========== TEXT FIELDS ==========
  
  // Short Text Field
  shortText: {
    displayName: "Short Text",
    description: "Single-line text input with character limits",
    category: "text-fields",
    defaultValues: {
      type: "shortText",
      label: "Untitled Question",
      required: false,
      placeholder: "",
      maxLength: undefined,
      minLength: undefined,
      defaultValue: "",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
      validationRules: {
        pattern: "",
        customMessage: "",
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        description: "Placeholder text shown in the input field",
        placeholder: "Enter placeholder text",
      },
      {
        id: "defaultValue",
        section: "basic",
        component: "input",
        label: "Default Value",
        description: "Pre-filled value for the field",
        placeholder: "Enter default value",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text",
        placeholder: "Additional help for users",
      },
      {
        id: "minLength",
        section: "validation",
        component: "number",
        label: "Minimum Length",
        description: "Minimum number of characters required",
        placeholder: "0",
      },
      {
        id: "maxLength",
        section: "validation",
        component: "number",
        label: "Maximum Length", 
        description: "Maximum number of characters allowed",
        placeholder: "100",
      },
      {
        id: "validationRules.pattern",
        section: "validation",
        component: "input",
        label: "Validation Pattern (Regex)",
        description: "Regular expression pattern for validation",
        placeholder: "^[a-zA-Z\\s]+$",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please enter a valid value",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        description: "Width of the field in the form",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
        description: "Display the field label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
        description: "Display the field description",
      },
    ],
  },

  // Email Field
  email: {
    displayName: "Email",
    description: "Email address input with validation",
    category: "text-fields",
    defaultValues: {
      type: "email",
      label: "Email Address",
      required: false,
      placeholder: "name@example.com",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        placeholder: "name@example.com",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        placeholder: "Please enter a valid email address",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // Website Field
  website: {
    displayName: "Website",
    description: "Website URL input with validation",
    category: "text-fields",
    defaultValues: {
      type: "website",
      label: "Website",
      required: false,
      placeholder: "https://example.com",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        placeholder: "https://example.com",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        placeholder: "Please enter a valid website URL",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // Phone Number Field
  phoneNumber: {
    displayName: "Phone Number",
    description: "Phone number input with formatting",
    category: "text-fields",
    defaultValues: {
      type: "phoneNumber",
      label: "Phone Number",
      required: false,
      placeholder: "(555) 123-4567",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        placeholder: "(555) 123-4567",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        placeholder: "Please enter a valid phone number",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // Long Text Field
  longText: {
    displayName: "Long Text",
    description: "Multi-line text input with rich text support",
    category: "text-fields",
    defaultValues: {
      type: "longText",
      label: "Untitled Question",
      required: false,
      placeholder: "Enter your detailed response...",
      maxLength: 1000,
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        placeholder: "Enter your detailed response...",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "minLength",
        section: "validation",
        component: "number",
        label: "Minimum Length",
        placeholder: "0",
      },
      {
        id: "maxLength",
        section: "validation",
        component: "number",
        label: "Maximum Length",
        placeholder: "1000",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        placeholder: "Please enter a valid response",
      },
      {
        id: "displayOptions.richText",
        section: "display",
        component: "switch",
        label: "Enable Rich Text",
        description: "Allow rich text formatting",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // ========== CHOICE FIELDS ==========

  // Multiple Choice Field (Already exists - keeping as is)
  multipleChoice: {
    displayName: "Multiple Choice",
    description: "Radio button selection (single choice)",
    category: "choice-fields",
    defaultValues: {
      type: "multipleChoice",
      label: "Untitled Question",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      allowOther: false,
      displayOptions: {
        width: "full",
        inline: false,
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text",
        placeholder: "Additional help for users",
      },
      {
        id: "options",
        section: "options",
        component: "custom",
        label: "Options",
        description: "Manage choice options",
        customComponent: "OptionsManager",
      },
      {
        id: "allowOther",
        section: "options",
        component: "switch",
        label: "Allow Other Option",
        description: "Add an 'Other' option with text input",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.inline",
        section: "display",
        component: "select",
        label: "Layout Direction",
        props: {
          options: [
            { value: false, label: "Vertical" },
            { value: true, label: "Horizontal" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
        description: "Display the field label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
        description: "Display the field description",
      },
    ],
  },

  // Dropdown Field
  dropdown: {
    displayName: "Dropdown",
    description: "Select dropdown with comma-separated options",
    category: "choice-fields",
    defaultValues: {
      type: "dropdown",
      label: "Untitled Question",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      placeholder: "Choose an option...",
      defaultValue: "",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        placeholder: "Choose an option...",
      },
      {
        id: "defaultValue",
        section: "basic",
        component: "input",
        label: "Default Selection",
        description: "Pre-selected option",
        placeholder: "Default option",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // Yes/No Field
  yesNo: {
    displayName: "Yes/No",
    description: "Binary choice field",
    category: "choice-fields",
    defaultValues: {
      type: "yesNo",
      label: "Untitled Question",
      required: false,
      defaultValue: undefined,
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "defaultValue",
        section: "basic",
        component: "select",
        label: "Default Selection",
        props: {
          options: [
            { value: undefined, label: "No Default" },
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ],
        },
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // Opinion Scale Field
  opinionScale: {
    displayName: "Opinion Scale",
    description: "1-10 opinion scale with customizable range",
    category: "choice-fields",
    defaultValues: {
      type: "opinionScale",
      label: "Untitled Question",
      required: false,
      minRating: 1,
      maxRating: 10,
      defaultValue: undefined,
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "defaultValue",
        section: "basic",
        component: "number",
        label: "Default Rating",
        description: "Pre-selected rating value",
        placeholder: "No default",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // ========== RATING FIELDS ==========

  // Number Rating Field (Already exists - keeping as is)
  numberRating: {
    displayName: "Rating Scale",
    description: "Numeric rating scale with emoji options",
    category: "rating-fields",
    defaultValues: {
      type: "numberRating",
      label: "Untitled Question",
      required: false,
      minRating: 1,
      maxRating: 5,
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
        ratingStyle: "stars",
      },
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "defaultValue",
        section: "basic",
        component: "number",
        label: "Default Rating",
        description: "Pre-selected rating value",
        placeholder: "No default",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // ========== SPECIAL FIELDS ==========

  // Statement Field
  statement: {
    displayName: "Statement",
    description: "Display-only content with rich formatting",
    category: "special-fields",
    defaultValues: {
      type: "statement",
      label: "Information",
      description: "Your statement content goes here...",
      displayOptions: {
        width: "full",
        variant: "default",
        showLabel: true,
      },
    },
    propertySchema: [
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Title",
        description: "Display the statement title",
      },
    ],
  },

  // Legal Field
  legal: {
    displayName: "Legal",
    description: "Terms acceptance with checkbox",
    category: "special-fields",
    defaultValues: {
      type: "legal",
      label: "I agree to the Terms and Conditions",
      description: "Enter your legal terms and conditions here...",
      required: true,
      displayOptions: {
        width: "full",
        showLabel: true,
      },
    },
    propertySchema: [

      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        placeholder: "You must accept the terms to continue",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
    ],
  },

  // File Upload Field
  fileUpload: {
    displayName: "File Upload",
    description: "File upload with type and size restrictions",
    category: "special-fields",
    defaultValues: {
      type: "fileUpload",
      label: "Upload File",
      required: false,
      acceptedFileTypes: [],
      maxFileSize: 10,
      helpText: "",
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
      },
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "textarea",
        label: "Upload Instructions",
        placeholder: "Custom instructions for users...",
      },
      {
        id: "maxFileSize",
        section: "validation",
        component: "number",
        label: "Maximum File Size (MB)",
        description: "Maximum file size in megabytes",
        placeholder: "10",
      },
      {
        id: "displayOptions.width",
        section: "display",
        component: "select",
        label: "Field Width",
        props: {
          options: [
            { value: "full", label: "Full Width" },
            { value: "half", label: "Half Width" },
            { value: "third", label: "One Third" },
          ],
        },
      },
      {
        id: "displayOptions.showLabel",
        section: "display",
        component: "switch",
        label: "Show Label",
      },
      {
        id: "displayOptions.showDescription",
        section: "display",
        component: "switch",
        label: "Show Description",
      },
    ],
  },

  // ========== STRUCTURE FIELDS ==========
  // Page Break Field
  pageBreak: {
    displayName: "Page Break",
    description: "Section separator for multi-page forms",
    category: "structure-fields",
    defaultValues: {
      type: "pageBreak",
      label: "Page Break",
      displayOptions: {
      },
    },
    propertySchema: [
      {
        id: "displayOptions.sectionTitle",
        section: "basic",
        component: "input",
        label: "Section Title",
        description: "Optional title for this section",
        placeholder: "e.g., Personal Information",
      },
      {
        id: "displayOptions.sectionDescription",
        section: "basic",
        component: "textarea",
        label: "Section Description",
        description: "Optional description for this section",
        placeholder: "Brief description of this section...",
      },
    ],
  },
};

// Helper functions
export const getFieldConfig = (fieldType: string): FieldTypeConfig | null => {
  return FIELD_TYPE_REGISTRY[fieldType] || null;
};

export const getFieldPropertySchema = (fieldType: string): FieldPropertySchema[] => {
  const config = getFieldConfig(fieldType);
  return config ? config.propertySchema : [];
};

export const getFieldDefaultValues = (fieldType: string): Partial<FormField> => {
  const config = getFieldConfig(fieldType);
  return config ? config.defaultValues : {};
};

export const getAllFieldTypes = (): string[] => {
  return Object.keys(FIELD_TYPE_REGISTRY);
};

export const getFieldsByCategory = (category: string): string[] => {
  return Object.entries(FIELD_TYPE_REGISTRY)
    .filter(([, config]) => config.category === category)
    .map(([fieldType]) => fieldType);
};