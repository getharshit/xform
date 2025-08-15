// src/lib/defaults.ts

import { Form, FormField, FormTheme, FormCustomization, FormLayoutConfig, FormSettings } from '@/types/form'

// Default theme configuration
export const defaultTheme: FormTheme = {
  primaryColor: '#3B82F6',
  fontFamily: 'Inter, system-ui, sans-serif',
  secondaryColor: '#6B7280',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  borderColor: '#D1D5DB',
  fontSize: {
    title: 24,
    question: 16,
    input: 16,
    small: 14
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700
  },
  borderRadius: 8,
  spacing: 16,
  buttonStyle: 'rounded',
  inputStyle: 'outlined',
  shadowLevel: 'sm'
}

// Default customization
export const defaultCustomization: FormCustomization = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#D1D5DB'
  },
  maxWidth: 600,
  alignment: 'center',
  buttonStyle: 'filled',
  buttonSize: 'md',
  animations: {
    intensity: 'subtle',
    enableAnimations: true,
    respectReducedMotion: true
  }
}

// Default layout
export const defaultLayout: FormLayoutConfig = {
  type: 'singleColumn',
  options: {
    maxWidth: 600,
    singleColumn: {
      showQuestionNumbers: true,
      questionSpacing: 24,
      submitButtonPosition: 'center'
    }
  }
}

// Default settings
export const defaultSettings: FormSettings = {
  allowMultipleSubmissions: false,
  collectIPAddress: true,
  collectUserAgent: true,
  submitButtonText: 'Submit',
  showResetButton: false,
  confirmBeforeSubmit: false,
  showPrivacyNotice: false,
  gdprCompliant: false
}

// MVP field templates for the form builder
export const mvpFieldTemplates: Array<{
  type: FormField['type']
  label: string
  icon: string
  category: string
  defaultField: Partial<FormField>
}> = [
  {
    type: 'shortText',
    label: 'Short Text',
    icon: 'Type',
    category: 'basic',
    defaultField: {
      type: 'shortText',
      label: 'Short answer',
      required: false,
      placeholder: 'Enter your answer...',
      maxLength: 100
    }
  },
  {
    type: 'multipleChoice',
    label: 'Multiple Choice',
    icon: 'CircleDot',
    category: 'basic',
    defaultField: {
      type: 'multipleChoice',
      label: 'Choose one option',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'ChevronDown',
    category: 'basic',
    defaultField: {
      type: 'dropdown',
      label: 'Select from dropdown',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      placeholder: 'Choose an option...'
    }
  },
  {
    type: 'numberRating',
    label: 'Rating Scale',
    icon: 'Star',
    category: 'basic',
    defaultField: {
      type: 'numberRating',
      label: 'Rate your experience',
      required: false,
      minRating: 1,
      maxRating: 5
    }
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'basic',
    defaultField: {
      type: 'email',
      label: 'Email address',
      required: false,
      placeholder: 'name@example.com'
    }
  }
]

// Create a blank form
export function createBlankForm(): Omit<Form, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: 'Untitled Form',
    description: '',
    fields: [],
    theme: defaultTheme,
    customization: defaultCustomization,
    layout: defaultLayout,
    settings: defaultSettings
  }
}

// Create a form with sample fields
export function createSampleForm(): Omit<Form, 'id' | 'createdAt' | 'updatedAt'> {
  const sampleFields: FormField[] = [
    {
      id: 'name',
      type: 'shortText',
      label: 'Full Name',
      description: 'Please enter your full name',
      required: true,
      placeholder: 'John Doe',
      maxLength: 100
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      description: 'We\'ll use this to contact you',
      required: true,
      placeholder: 'john@example.com'
    },
    {
      id: 'rating',
      type: 'numberRating',
      label: 'How would you rate our service?',
      required: true,
      minRating: 1,
      maxRating: 5
    },
    {
      id: 'feedback',
      type: 'multipleChoice',
      label: 'How did you hear about us?',
      required: false,
      options: ['Social Media', 'Friend/Family', 'Search Engine', 'Advertisement', 'Other']
    }
  ]

  return {
    title: 'Contact Form',
    description: 'We\'d love to hear from you!',
    fields: sampleFields,
    theme: defaultTheme,
    customization: defaultCustomization,
    layout: defaultLayout,
    settings: defaultSettings
  }
}