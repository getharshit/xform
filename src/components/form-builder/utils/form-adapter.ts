// src/components/form-builder/utils/form-adapter.ts

import { Form, FormField } from "@/types/form";

/**
 * Adapter to convert builder form format to public form renderer format
 * Maintains form.ts as source of truth - NO type changes needed
 */
export class FormAdapter {
  /**
   * Convert builder form to format expected by PublicFormRenderer
   * Handles any property mapping or defaults without changing core types
   */
  static builderToRenderer(builderForm: Form): Form {
    if (!builderForm) {
      return builderForm;
    }

    // Create adapted form with any necessary transformations
    const adaptedForm: Form = {
      ...builderForm,
      
      // Ensure required properties exist with defaults
      fields: builderForm.fields?.map(field => this.adaptField(field)) || [],
      
      // Handle theme/customization properties
      customization: builderForm.customization || {
        colors: {
          primary: "#3B82F6",
          secondary: "#6B7280",
        },
        typography: {
          fontFamily: "Inter, system-ui, sans-serif",
        },
      },
      
      // Handle layout properties
      layout: builderForm.layout || {
        type: "singleColumn",
        options: {},
      },
      
      // Handle settings
      settings: builderForm.settings || {
        allowMultipleSubmissions: false,
        showProgressBar: true,
        collectIPAddress: false,
      },
    };

    return adaptedForm;
  }

  /**
   * Adapt individual field for renderer compatibility
   * Ensures all required properties exist
   */
  private static adaptField(field: FormField): FormField {
    return {
      ...field,
      
      // Ensure required base properties
      required: field.required ?? false,
      
      // Handle field-specific adaptations
      ...this.adaptFieldByType(field),
      
      // Ensure displayOptions exist
      displayOptions: {
        width: "full",
        showLabel: true,
        showDescription: true,
        ...field.displayOptions,
      },
      
      // Ensure validationRules exist for fields that need them
      validationRules: field.validationRules || {},
    };
  }

  /**
   * Type-specific field adaptations
   * Handles any field type specific requirements
   */
  private static adaptFieldByType(field: FormField): Partial<FormField> {
    switch (field.type) {
      case "multipleChoice":
      case "dropdown":
        return {
          options: field.options || ["Option 1", "Option 2"],
        };

      case "numberRating":
        return {
          minRating: field.minRating || 1,
          maxRating: field.maxRating || 5,
        };

      case "opinionScale":
        return {
          minRating: 1,
          maxRating: 10,
        };

      case "shortText":
      case "longText":
        return {
          maxLength: field.maxLength || 500,
          placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
        };

      case "email":
        return {
          placeholder: field.placeholder || "name@example.com",
        };

      case "website":
        return {
          placeholder: field.placeholder || "https://example.com",
        };

      case "phoneNumber":
        return {
          placeholder: field.placeholder || "(555) 123-4567",
        };

      case "fileUpload":
        return {
          acceptedFileTypes: field.acceptedFileTypes || [".pdf", ".doc", ".docx"],
          maxFileSize: field.maxFileSize || 10,
        };

      case "legal":
        return {
          // Legal fields must be required
          required: true,
        };

      case "statement":
        return {
          displayOptions: {
            ...field.displayOptions,
            variant: field.displayOptions?.variant || "default",
          },
        };

      default:
        return {};
    }
  }

  /**
   * Convert renderer form back to builder format if needed
   * For future use - currently not needed since we're read-only in preview
   */
  static rendererToBuilder(rendererForm: Form): Form {
    // For now, just return as-is since types are compatible
    return rendererForm;
  }

  /**
   * Validate form compatibility with renderer
   * Returns array of issues that might cause rendering problems
   */
  static validateForRenderer(form: Form): string[] {
    const issues: string[] = [];

    if (!form.fields || form.fields.length === 0) {
      issues.push("Form has no fields");
    }

    // Check each field for potential issues
    form.fields?.forEach((field, index) => {
      if (!field.id) {
        issues.push(`Field at index ${index} missing ID`);
      }

      if (!field.label) {
        issues.push(`Field "${field.id}" missing label`);
      }

      if (!field.type) {
        issues.push(`Field "${field.id}" missing type`);
      }

      // Type-specific validations
      switch (field.type) {
        case "multipleChoice":
        case "dropdown":
          if (!field.options || field.options.length === 0) {
            issues.push(`Choice field "${field.id}" has no options`);
          }
          break;

        case "numberRating":
          if (!field.maxRating || field.maxRating <= 0) {
            issues.push(`Rating field "${field.id}" has invalid maxRating`);
          }
          break;
      }
    });

    return issues;
  }
}

/**
 * Convenience function for quick adaptation
 */
export const adaptFormForRenderer = (builderForm: Form): Form => {
  return FormAdapter.builderToRenderer(builderForm);
};

/**
 * Convenience function for validation
 */
export const validateFormForRenderer = (form: Form): string[] => {
  return FormAdapter.validateForRenderer(form);
};