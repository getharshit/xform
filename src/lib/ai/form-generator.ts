import { ollamaClient } from './ollama-client';
import { FormField } from '@/types/form';

export interface GeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
}

export async function generateFormFromPrompt(prompt: string): Promise<GeneratedForm> {
  try {
    const result = await ollamaClient.generateForm(prompt);
    
    // Validate and transform the response
    const fields: FormField[] = result.fields.map((field: any, index: number) => ({
      id: field.id || `field_${index + 1}`,
      type: field.type || 'text',
      label: field.label || `Field ${index + 1}`,
      required: field.required || false,
      options: field.options || undefined,
      maxRating: field.type === 'rating' ? (field.maxRating || 5) : undefined,
    }));

    return {
      title: result.title || 'Generated Form',
      description: result.description || '',
      fields,
    };
  } catch (error) {
    console.error('Form generation failed:', error);
    
    // Fallback form for development
    return {
      title: 'Sample Form',
      description: 'This is a fallback form generated when AI is unavailable',
      fields: [
        {
          id: 'field_1',
          type: 'text',
          label: 'Your Name',
          required: true,
        },
        {
          id: 'field_2',
          type: 'text',
          label: 'Email Address',
          required: true,
        },
      ],
    };
  }
}