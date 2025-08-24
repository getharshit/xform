import { z } from 'zod';
import { ExtendedFormField, FieldValidationError } from '@/types';

// Validation schema builder
export const buildValidationSchema = (fields: ExtendedFormField[]) => {
  const schemaObject: Record<string, z.ZodSchema<any>> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodType<any>;

    switch (field.type) {
      case 'shortText':
      case 'longText':
        fieldSchema = z.string();
         if (field.validationRules?.min) {
      fieldSchema = (fieldSchema as z.ZodString).min(field.validationRules.min);
    }
    if (field.validationRules?.max) {
      fieldSchema = (fieldSchema as z.ZodString).max(field.validationRules.max);
    }
    if (field.validationRules?.pattern) {
      fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.validationRules.pattern));
    }
    break;

      case 'email':
        fieldSchema = z.string().email(
          field.validationRules?.customMessage || 'Please enter a valid email address'
        );
        break;

      case 'website':
        fieldSchema = z.string().url(
          field.validationRules?.customMessage || 'Please enter a valid URL'
        );
        break;

      case 'phoneNumber':
        fieldSchema = z.string().regex(
          /^[\+]?[1-9][\d]{0,15}$/,
          field.validationRules?.customMessage || 'Please enter a valid phone number'
        );
        break;

      case 'multipleChoice':
      case 'dropdown':
        fieldSchema = z.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(field.options as [string, ...string[]], {
            errorMap: () => ({ message: field.validationRules?.customMessage || 'Please select a valid option' })
          });
        }
        break;

      case 'yesNo':
        fieldSchema = z.enum(['yes', 'no'], {
          errorMap: () => ({ message: field.validationRules?.customMessage || 'Please select yes or no' })
        });
        break;

      case 'numberRating':
      case 'opinionScale':
        const min = field.minRating || 1;
        const max = field.maxRating || (field.type === 'opinionScale' ? 10 : 5);
        fieldSchema = z.number().min(min).max(max, 
          field.validationRules?.customMessage || `Please select a rating between ${min} and ${max}`
        );
        break;

      case 'legal':
        fieldSchema = z.boolean().refine((val) => val === true, {
          message: field.validationRules?.customMessage || 'You must agree to continue'
        });
        break;

      case 'fileUpload':
        fieldSchema = z.instanceof(FileList).optional();
        if (field.required) {
          fieldSchema = fieldSchema.refine((files) => files && files.length > 0, {
            message: field.validationRules?.customMessage || 'Please upload a file'
          });
        }
        if (field.acceptedFileTypes && field.acceptedFileTypes.length > 0) {
          fieldSchema = fieldSchema.refine((files) => {
            if (!files || files.length === 0) return true;
            const file = files[0];
            return field.acceptedFileTypes!.some(type => file.type.includes(type));
          }, {
            message: field.validationRules?.customMessage || `Please upload a valid file type: ${field.acceptedFileTypes.join(', ')}`
          });
        }
        if (field.maxFileSize) {
          fieldSchema = fieldSchema.refine((files) => {
            if (!files || files.length === 0) return true;
            const file = files[0];
            return file.size <= (field.maxFileSize! * 1024 * 1024); // Convert MB to bytes
          }, {
            message: field.validationRules?.customMessage || `File size must be less than ${field.maxFileSize}MB`
          });
        }
        break;

      case 'statement':
      case 'pageBreak':
        // These don't need validation as they're display-only
        fieldSchema = z.any().optional();
        break;

      default:
        fieldSchema = z.any();
    }

    // Apply required validation
    if (field.required && field.type !== 'statement' && field.type !== 'pageBreak') {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      } else if (fieldSchema instanceof z.ZodNumber) {
        // Number fields are required by having a value
      } else if (fieldSchema instanceof z.ZodBoolean) {
        // Boolean fields (legal) are handled above
      } else {
        fieldSchema = fieldSchema.refine((val) => {
          if (val === null || val === undefined || val === '') return false;
          if (Array.isArray(val) && val.length === 0) return false;
          return true;
        }, { message: `${field.label} is required` });
      }
    } else if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[field.id] = fieldSchema;
  });

  return z.object(schemaObject);
};

// Custom validation hook
export const useFormValidation = (fields: ExtendedFormField[]) => {
  const validationSchema = buildValidationSchema(fields);

  const validateField = (fieldId: string, value: any): FieldValidationError | null => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return null;

    try {
      const fieldSchema = validationSchema.shape[fieldId];
      fieldSchema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          fieldId,
          message: error.errors[0].message,
          type: 'format'
        };
      }
      return null;
    }
  };

  const validateAll = (formData: Record<string, any>): FieldValidationError[] => {
    try {
      validationSchema.parse(formData);
      return [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map(err => ({
          fieldId: err.path[0] as string,
          message: err.message,
          type: 'format' as const
        }));
      }
      return [];
    }
  };

  return {
    validationSchema,
    validateField,
    validateAll
  };
};