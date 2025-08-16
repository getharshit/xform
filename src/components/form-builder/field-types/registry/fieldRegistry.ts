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

// Central field registry
export const FIELD_TYPE_REGISTRY: Record<string, FieldTypeConfig> = {
  // Multiple Choice Field
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
      // Basic Properties
      {
        id: "label",
        section: "basic",
        component: "input",
        label: "Field Label",
        placeholder: "Enter field label",
      },
      {
        id: "description",
        section: "basic",
        component: "textarea",
        label: "Description",
        description: "Optional description to help users",
        placeholder: "Add helpful description",
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
        id: "required",
        section: "basic",
        component: "switch",
        label: "Required Field",
        description: "Make this field required",
      },

      // Options Management
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

      // Display Options
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

  // Short Text Field
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
      // Basic Properties
      {
        id: "label",
        section: "basic",
        component: "input",
        label: "Field Label",
        placeholder: "Enter field label",
      },
      {
        id: "description",
        section: "basic",
        component: "textarea",
        label: "Description",
        description: "Optional description to help users",
        placeholder: "Add helpful description",
      },
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
        id: "required",
        section: "basic",
        component: "switch",
        label: "Required Field",
        description: "Make this field required",
      },

      // Validation Properties
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

      // Display Options
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

  // Number Rating Field
  numberRating: {
    displayName: "Rating Scale",
    description: "Numeric rating scale",
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
      },
    },
    propertySchema: [
      // Basic Properties
      {
        id: "label",
        section: "basic",
        component: "input",
        label: "Field Label",
        placeholder: "Enter field label",
      },
      {
        id: "description",
        section: "basic",
        component: "textarea",
        label: "Description",
        placeholder: "Add helpful description",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        placeholder: "Additional help for users",
      },
      {
        id: "required",
        section: "basic",
        component: "switch",
        label: "Required Field",
      },

      // Rating Configuration
      {
        id: "minRating",
        section: "validation",
        component: "number",
        label: "Minimum Rating",
        placeholder: "1",
      },
      {
        id: "maxRating",
        section: "validation",
        component: "number",
        label: "Maximum Rating",
        placeholder: "5",
      },
      // Display Options
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