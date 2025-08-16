import { ollamaClient } from './ollama-client';
import { FormField, ExtendedFieldType } from '@/types/form';

export interface GeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
}

// Map legacy field types from AI to new extended field types
const mapFieldType = (aiType: string): ExtendedFieldType => {
  const typeMap: Record<string, ExtendedFieldType> = {
    // Legacy mappings
    'text': 'shortText',
    'textarea': 'longText',
    'email': 'email',
    'url': 'website',
    'phone': 'phoneNumber',
    'number': 'shortText',
    
    // Choice field mappings
    'radio': 'multipleChoice',
    'multipleChoice': 'multipleChoice',
    'checkbox': 'multipleChoice',
    'select': 'dropdown',
    'dropdown': 'dropdown',
    'yesno': 'yesNo',
    'boolean': 'yesNo',
    
    // Rating mappings
    'rating': 'numberRating',
    'scale': 'opinionScale',
    'stars': 'numberRating',
    
    // Special fields
    'file': 'fileUpload',
    'upload': 'fileUpload',
    'date': 'shortText', // We don't have a date field yet, use shortText
    'time': 'shortText',
    'datetime': 'shortText',
    
    // Extended field types (direct mapping)
    'shortText': 'shortText',
    'longText': 'longText',
    'website': 'website',
    'phoneNumber': 'phoneNumber',
    'numberRating': 'numberRating',
    'opinionScale': 'opinionScale',
    'statement': 'statement',
    'legal': 'legal',
    'fileUpload': 'fileUpload',
    'pageBreak': 'pageBreak',
    'startingPage': 'startingPage',
    'postSubmission': 'postSubmission'
  };

  return typeMap[aiType] || 'shortText'; // Default to shortText if unknown
};

// Generate unique field ID
const generateFieldId = (type: ExtendedFieldType, index: number, existingIds: string[]): string => {
  const baseId = type.replace(/([A-Z])/g, '-$1').toLowerCase();
  let fieldId = `${baseId}-${index + 1}`;
  let counter = 1;
  
  while (existingIds.includes(fieldId)) {
    fieldId = `${baseId}-${index + 1}-${counter}`;
    counter++;
  }
  
  return fieldId;
};

// Validate and clean field data
const validateAndCleanField = (field: any, index: number, existingIds: string[]): FormField => {
  const mappedType = mapFieldType(field.type || 'text');
  const fieldId = field.id || generateFieldId(mappedType, index, existingIds);
  
  // Ensure ID is unique
  let uniqueId = fieldId;
  let counter = 1;
  while (existingIds.includes(uniqueId)) {
    uniqueId = `${fieldId}-${counter}`;
    counter++;
  }
  existingIds.push(uniqueId);

  const baseField: FormField = {
    id: uniqueId,
    type: mappedType,
    label: field.label || `Question ${index + 1}`,
    description: field.description || undefined,
    required: Boolean(field.required),
    placeholder: field.placeholder || undefined,
    helpText: field.helpText || undefined,
  };

  // Add type-specific properties
  switch (mappedType) {
    case 'multipleChoice':
    case 'dropdown':
      return {
        ...baseField,
        options: Array.isArray(field.options) && field.options.length > 0 
          ? field.options 
          : ['Option 1', 'Option 2', 'Option 3'] // Default options
      };
      
    case 'numberRating':
      return {
        ...baseField,
        minRating: field.minRating || 1,
        maxRating: field.maxRating || 5
      };
      
    case 'shortText':
    case 'longText':
      return {
        ...baseField,
        maxLength: field.maxLength || (mappedType === 'shortText' ? 100 : 1000),
        minLength: field.minLength || undefined,
        validationRules: field.pattern ? {
          pattern: field.pattern,
          customMessage: field.customMessage || undefined
        } : undefined
      };
      
    case 'email':
      return {
        ...baseField,
        placeholder: field.placeholder || 'name@example.com'
      };
      
    case 'website':
      return {
        ...baseField,
        placeholder: field.placeholder || 'https://example.com'
      };
      
    case 'phoneNumber':
      return {
        ...baseField,
        placeholder: field.placeholder || '(555) 123-4567'
      };
      
    case 'fileUpload':
      return {
        ...baseField,
        acceptedFileTypes: field.acceptedFileTypes || ['.pdf', '.doc', '.docx'],
        maxFileSize: field.maxFileSize || 10
      };
      
    case 'statement':
      return {
        ...baseField,
        description: field.content || field.description || 'This is a statement field.',
        displayOptions: {
          variant: 'default'
        }
      };
      
    case 'legal':
      return {
        ...baseField,
        label: field.label || 'I agree to the terms and conditions',
        description: field.terms || field.description || 'By checking this box, you agree to our terms.',
        required: true // Legal fields should always be required
      };
      
    default:
      return baseField;
  }
};

export async function generateFormFromPrompt(prompt: string): Promise<GeneratedForm> {
  try {
    console.log('Starting AI form generation with prompt:', prompt);
    
    const result = await ollamaClient.generateForm(prompt);
    console.log('AI generated result:', result);
    
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from AI');
    }

    // Validate required fields
    if (!result.title && !result.fields) {
      throw new Error('AI response missing required fields (title and fields)');
    }

    const existingIds: string[] = [];
    
    // Validate and transform the fields
    const fields: FormField[] = [];
    if (Array.isArray(result.fields)) {
      result.fields.forEach((field: any, index: number) => {
        try {
          const validatedField = validateAndCleanField(field, index, existingIds);
          fields.push(validatedField);
        } catch (error) {
          console.warn(`Skipping invalid field at index ${index}:`, error);
          // Create a fallback field
          const fallbackField = validateAndCleanField({
            type: 'shortText',
            label: `Question ${index + 1}`,
            required: false
          }, index, existingIds);
          fields.push(fallbackField);
        }
      });
    }

    // Ensure we have at least one field
    if (fields.length === 0) {
      console.warn('No valid fields generated, adding default field');
      fields.push(validateAndCleanField({
        type: 'shortText',
        label: 'Your Response',
        required: false
      }, 0, existingIds));
    }

    const generatedForm: GeneratedForm = {
      title: typeof result.title === 'string' ? result.title.trim() : 'AI Generated Form',
      description: typeof result.description === 'string' ? result.description.trim() : 'Form generated by AI based on your requirements.',
      fields
    };

    console.log('Successfully generated form:', generatedForm);
    return generatedForm;

  } catch (error) {
    console.error('Form generation failed:', error);
    
    // Enhanced fallback form based on the prompt
    const fallbackFields: FormField[] = [];
    const existingIds: string[] = [];
    
    // Try to infer some fields from the prompt
    const lowercasePrompt = prompt.toLowerCase();
    
    // Add name field if it seems like a form that would need it
    if (lowercasePrompt.includes('name') || lowercasePrompt.includes('contact') || lowercasePrompt.includes('feedback')) {
      fallbackFields.push(validateAndCleanField({
        type: 'shortText',
        label: 'Your Name',
        required: true,
        placeholder: 'Enter your name'
      }, 0, existingIds));
    }
    
    // Add email field for contact/feedback forms
    if (lowercasePrompt.includes('email') || lowercasePrompt.includes('contact') || lowercasePrompt.includes('feedback')) {
      fallbackFields.push(validateAndCleanField({
        type: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'name@example.com'
      }, fallbackFields.length, existingIds));
    }
    
    // Add rating field for feedback/survey forms
    if (lowercasePrompt.includes('rating') || lowercasePrompt.includes('feedback') || lowercasePrompt.includes('survey') || lowercasePrompt.includes('satisfaction')) {
      fallbackFields.push(validateAndCleanField({
        type: 'numberRating',
        label: 'How would you rate your experience?',
        required: false,
        minRating: 1,
        maxRating: 5
      }, fallbackFields.length, existingIds));
    }
    
    // Add comment field for most forms
    fallbackFields.push(validateAndCleanField({
      type: 'longText',
      label: 'Additional Comments',
      required: false,
      placeholder: 'Please share any additional thoughts...',
      maxLength: 500
    }, fallbackFields.length, existingIds));
    
    // If no fields were inferred, add basic fields
    if (fallbackFields.length === 0) {
      fallbackFields.push(
        validateAndCleanField({
          type: 'shortText',
          label: 'Your Name',
          required: true
        }, 0, existingIds),
        validateAndCleanField({
          type: 'longText',
          label: 'Your Message',
          required: true,
          placeholder: 'Please enter your message...'
        }, 1, existingIds)
      );
    }
    
    return {
      title: `Form: ${prompt.slice(0, 50)}${prompt.length > 50 ? '...' : ''}`,
      description: 'This is a fallback form created when AI generation is unavailable. You can edit and customize it as needed.',
      fields: fallbackFields
    };
  }
}