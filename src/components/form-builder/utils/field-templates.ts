// src/components/form-builder/utils/field-templates.ts

import { FieldTemplate } from '../types/builder'
import { FormField } from '@/types/form'
// Create field from template
// Import getFieldDefaultValues at the top of the file
import { getFieldDefaultValues } from '../field-types/registry/fieldRegistry'

// All 16 field types organized by category
export const FIELD_TEMPLATES: FieldTemplate[] = [
  // Text Fields Category
  {
    id: 'short-text',
    type: 'shortText',
    label: 'Short Text',
    description: 'Single line text input',
    icon: 'Type',
    category: 'text-fields',
    defaultField: {
      type: 'shortText',
      label: 'Short answer',
      required: false,
      placeholder: 'Enter your answer...',
      maxLength: 100
    }
  },
  {
    id: 'long-text',
    type: 'longText',
    label: 'Long Text',
    description: 'Multi-line text area',
    icon: 'AlignLeft',
    category: 'text-fields',
    defaultField: {
      type: 'longText',
      label: 'Long answer',
      required: false,
      placeholder: 'Enter detailed response...',
      maxLength: 1000
    }
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    description: 'Email address input',
    icon: 'Mail',
    category: 'text-fields',
    defaultField: {
      type: 'email',
      label: 'Email address',
      required: false,
      placeholder: 'name@example.com'
    }
  },
  {
    id: 'website',
    type: 'website',
    label: 'Website',
    description: 'Website URL input',
    icon: 'Globe',
    category: 'text-fields',
    defaultField: {
      type: 'website',
      label: 'Website URL',
      required: false,
      placeholder: 'https://example.com'
    }
  },
  {
    id: 'phone-number',
    type: 'phoneNumber',
    label: 'Phone Number',
    description: 'Phone number input',
    icon: 'Phone',
    category: 'text-fields',
    defaultField: {
      type: 'phoneNumber',
      label: 'Phone number',
      required: false,
      placeholder: '(555) 123-4567'
    }
  },

  // Choice Fields Category
  {
    id: 'multiple-choice',
    type: 'multipleChoice',
    label: 'Multiple Choice',
    description: 'Radio button selection',
    icon: 'CircleDot',
    category: 'choice-fields',
    defaultField: {
      type: 'multipleChoice',
      label: 'Choose one option',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    id: 'dropdown',
    type: 'dropdown',
    label: 'Dropdown',
    description: 'Select from dropdown',
    icon: 'ChevronDown',
    category: 'choice-fields',
    defaultField: {
      type: 'dropdown',
      label: 'Select from dropdown',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      placeholder: 'Choose an option...'
    }
  },
  {
    id: 'yes-no',
    type: 'yesNo',
    label: 'Yes/No',
    description: 'Simple yes or no choice',
    icon: 'ToggleLeft',
    category: 'choice-fields',
    defaultField: {
      type: 'yesNo',
      label: 'Yes or No question',
      required: false
    }
  },
  {
    id: 'opinion-scale',
    type: 'opinionScale',
    label: 'Opinion Scale',
    description: '1-10 opinion rating',
    icon: 'BarChart3',
    category: 'choice-fields',
    defaultField: {
      type: 'opinionScale',
      label: 'Rate from 1 to 10',
      required: false
    }
  },

  // Rating Fields Category
  {
    id: 'number-rating',
    type: 'numberRating',
    label: 'Rating Scale',
    description: 'Star or number rating',
    icon: 'Star',
    category: 'rating-fields',
    defaultField: {
      type: 'numberRating',
      label: 'Rate your experience',
      required: false,
      minRating: 1,
      maxRating: 5
    }
  },

  // Special Fields Category
  {
    id: 'statement',
    type: 'statement',
    label: 'Statement',
    description: 'Display text or content',
    icon: 'FileText',
    category: 'special-fields',
    defaultField: {
      type: 'statement',
      label: 'Information',
      description: 'This is informational text that will be displayed to users.',
      displayOptions: {
        variant: 'default'
      }
    }
  },
  {
    id: 'legal',
    type: 'legal',
    label: 'Legal',
    description: 'Terms acceptance checkbox',
    icon: 'Scale',
    category: 'special-fields',
    defaultField: {
      type: 'legal',
      label: 'I agree to the Terms and Conditions',
      description: 'By checking this box, you agree to our terms and conditions.',
      required: true
    }
  },
  {
    id: 'file-upload',
    type: 'fileUpload',
    label: 'File Upload',
    description: 'File upload field',
    icon: 'Upload',
    category: 'special-fields',
    defaultField: {
      type: 'fileUpload',
      label: 'Upload file',
      required: false,
      acceptedFileTypes: ['.pdf', '.doc', '.docx'],
      maxFileSize: 10
    }
  },

  // Structure Fields Category
  {
    id: 'page-break',
    type: 'pageBreak',
    label: 'Page Break',
    description: 'Section separator',
    icon: 'Minus',
    category: 'structure-fields',
    defaultField: {
      type: 'pageBreak',
      label: 'Section Break'
    }
  },
  {
    id: 'starting-page',
    type: 'startingPage',
    label: 'Starting Page',
    description: 'Welcome screen',
    icon: 'Play',
    category: 'structure-fields',
    defaultField: {
      type: 'startingPage',
      label: 'Welcome to Our Form',
      description: 'Thank you for taking the time to fill out this form.',
      displayOptions: {
        estimatedTime: '5 minutes',
        features: ['Anonymous', 'Secure', 'Mobile-friendly']
      }
    }
  },
  {
    id: 'post-submission',
    type: 'postSubmission',
    label: 'Thank You Page',
    description: 'Post-submission screen',
    icon: 'CheckCircle',
    category: 'structure-fields',
    defaultField: {
      type: 'postSubmission',
      label: 'Thank You!',
      description: 'Your response has been recorded successfully.',
      displayOptions: {
        showDownload: false,
        showShare: false,
        showFeedback: true
      }
    }
  }
]

// Field categories configuration
export const FIELD_CATEGORIES = [
  {
    id: 'text-fields',
    label: 'Text Fields',
    description: 'Text inputs and content fields',
    icon: 'Type',
    color: 'blue'
  },
  {
    id: 'choice-fields',
    label: 'Choice Fields',
    description: 'Selection and choice options',
    icon: 'CircleDot',
    color: 'green'
  },
  {
    id: 'rating-fields',
    label: 'Rating Fields',
    description: 'Rating and scoring fields',
    icon: 'Star',
    color: 'yellow'
  },
  {
    id: 'special-fields',
    label: 'Special Fields',
    description: 'Advanced and specialized fields',
    icon: 'Sparkles',
    color: 'purple'
  },
  {
    id: 'structure-fields',
    label: 'Structure Fields',
    description: 'Layout and navigation elements',
    icon: 'Layout',
    color: 'gray'
  }
] as const

// Get templates by category
export const getTemplatesByCategory = (category: string) => {
  return FIELD_TEMPLATES.filter(template => template.category === category)
}

// Get template by field type
export const getTemplateByType = (type: FormField['type']) => {
  return FIELD_TEMPLATES.find(template => template.type === type)
}

// Search templates
export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return FIELD_TEMPLATES.filter(template => 
    template.label.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery)
  )
}

// Generate unique field ID
export const generateFieldId = (type: FormField['type'], existingFields: FormField[] = []) => {
  const baseId = type.replace(/([A-Z])/g, '-$1').toLowerCase()
  const existingIds = existingFields.map(f => f.id)
  
  let counter = 1
  let fieldId = baseId
  
  while (existingIds.includes(fieldId)) {
    fieldId = `${baseId}-${counter}`
    counter++
  }
  
  return fieldId
}



// Create field from template
export const createFieldFromTemplate = (
  template: FieldTemplate, 
  existingFields: FormField[] = []
): FormField => {
  const fieldId = generateFieldId(template.type, existingFields)
  
  // Get registry default values if available
  let registryDefaults = {};
  try {
    registryDefaults = getFieldDefaultValues(template.type) || {};
  } catch (error) {
    console.warn('Could not load registry defaults for', template.type);
  }
  
  // Merge registry defaults with template defaults
  return {
    id: fieldId,
    ...registryDefaults,        // Registry defaults first
    ...template.defaultField,   // Template overrides registry
    type: template.type,        // Ensure type is correct
    label: template.defaultField.label || template.label,
    required: template.defaultField.required || false
  } as FormField
}