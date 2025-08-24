// src/lib/ai/form-generator.ts - FIXED VERSION
import ollama from 'ollama'; // Assuming ollama is properly set up in your project
import { FormField, ExtendedFieldType } from '@/types'; // FIXED: Changed from @/types/form to @/types

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

// Create default field configuration based on type
const createDefaultField = (type: ExtendedFieldType, id: string, label: string, description?: string): FormField => {
  const baseField: FormField = {
    id,
    type,
    label,
    description: description || '',
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
    case 'shortText':
      return {
        ...baseField,
        placeholder: 'Enter your answer',
        maxLength: 100,
      };
    
    case 'longText':
      return {
        ...baseField,
        placeholder: 'Enter your detailed response',
        maxLength: 500,
      };
    
    case 'email':
      return {
        ...baseField,
        placeholder: 'Enter your email address',
        validationRules: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          customMessage: 'Please enter a valid email address',
        },
      };
    
    case 'phoneNumber':
      return {
        ...baseField,
        placeholder: 'Enter your phone number',
        validationRules: {
          autoFormat: true,
        },
      };
    
    case 'website':
      return {
        ...baseField,
        placeholder: 'https://example.com',
        validationRules: {
          autoAddProtocol: true,
          allowedProtocols: ['http', 'https'],
        },
      };
    
    case 'multipleChoice':
      return {
        ...baseField,
        options: ['Option 1', 'Option 2', 'Option 3'],
        displayOptions: {
          ...baseField.displayOptions,
          layout: 'vertical',
        },
      };
    
    case 'dropdown':
      return {
        ...baseField,
        options: ['Select an option', 'Option 1', 'Option 2', 'Option 3'],
      };
    
    case 'yesNo':
      return {
        ...baseField,
        options: ['Yes', 'No'],
        displayOptions: {
          ...baseField.displayOptions,
          inline: true,
        },
      };
    
    case 'numberRating':
      return {
        ...baseField,
        minRating: 1,
        maxRating: 5,
        displayStyle: 'numbers',
      };
    
    case 'opinionScale':
      return {
        ...baseField,
        minRating: 1,
        maxRating: 10,
      };
    
    case 'fileUpload':
      return {
        ...baseField,
        acceptedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
        maxFileSize: 10, // 10MB
        helpText: 'Maximum file size: 10MB',
      };
    
    case 'statement':
      return {
        ...baseField,
        displayOptions: {
          ...baseField.displayOptions,
          showLabel: false,
        },
      };
    
    case 'legal':
      return {
        ...baseField,
        required: true,
        validationRules: {
          requireScrollToAccept: true,
        },
        displayOptions: {
          ...baseField.displayOptions,
          links: [
            {
              text: 'Terms of Service',
              url: 'https://example.com/terms',
              external: true,
            },
          ],
        },
      };
    
    default:
      return baseField;
  }
};

export async function generateFormFromPrompt(prompt: string): Promise<GeneratedForm> {
  try {
    const completion = await ollama.generate({
      model: "gemma3:12b",
      prompt: `
        Create a form based on this request: "${prompt}"
        
        Respond with a JSON object containing:
        - title: A clear, descriptive form title
        - description: A brief description of the form's purpose
        - fields: An array of form fields
        
        For each field, include:
        - type: One of the supported types (shortText, longText, email, website, phoneNumber, multipleChoice, dropdown, yesNo, opinionScale, numberRating, statement, legal, fileUpload)
        - label: Clear, user-friendly field label
        - description: Optional helpful description
        - required: Boolean indicating if field is required
        - options: Array of options for choice fields
        
        Make the form practical and user-friendly. Use appropriate field types.
        
        Example:
        {
          "title": "Customer Feedback Form",
          "description": "Help us improve our service",
          "fields": [
            {
              "type": "shortText",
              "label": "Your Name",
              "required": true
            },
            {
              "type": "email",
              "label": "Email Address",
              "required": true
            }
          ]
        }
      `,
      stream: false,
    });

    const aiResponse = completion.response;
    
    // Parse the AI response
    let formData;
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      formData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Validate required fields
    if (!formData.title || !formData.fields || !Array.isArray(formData.fields)) {
      throw new Error('Invalid form structure from AI');
    }

    // Process fields and generate proper FormField objects
    const existingIds: string[] = [];
    const processedFields: FormField[] = formData.fields.map((field: any, index: number) => {
      const fieldType = mapFieldType(field.type || 'shortText');
      const fieldId = generateFieldId(fieldType, index, existingIds);
      existingIds.push(fieldId);

      const processedField = createDefaultField(
        fieldType,
        fieldId,
        field.label || `Field ${index + 1}`,
        field.description
      );

      // Apply AI-generated properties
      if (field.required !== undefined) {
        processedField.required = Boolean(field.required);
      }

      if (field.options && Array.isArray(field.options)) {
        processedField.options = field.options;
      }

      if (field.placeholder) {
        processedField.placeholder = field.placeholder;
      }

      return processedField;
    });

    return {
      title: formData.title,
      description: formData.description || '',
      fields: processedFields,
    };

  } catch (error) {
    console.error('Error generating form:', error);
    throw new Error(`Failed to generate form: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export { mapFieldType, generateFieldId, createDefaultField };