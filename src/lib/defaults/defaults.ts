// src/lib/defaults.ts

import { Form, FormField, FormTheme, FormCustomization, FormLayoutConfig, FormSettings } from '@/types'

// Default theme configuration
export const defaultTheme: FormTheme = {
  // Theme metadata
  id: 'default',
  name: 'Default Theme',
  description: 'Clean and professional default theme',
  isDark: false,
  isCustom: false,
    createdAt: new Date(),
  updatedAt: new Date(),
  
  // Colors structure
  colors: {
    // Primary colors
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryActive: '#1D4ED8',
    secondary: '#6B7280',
    secondaryHover: '#4B5563',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F9FAFB',
    
    // Text colors
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#D1D5DB',
    borderHover: '#9CA3AF',
    borderFocus: '#3B82F6',
    borderError: '#EF4444',
    borderSuccess: '#10B981',
    
    // State colors
    error: '#EF4444',
    errorHover: '#DC2626',
    success: '#10B981',
    successHover: '#059669',
    warning: '#F59E0B',
    warningHover: '#D97706',
    info: '#3B82F6',
    infoHover: '#2563EB'
  },
  
  // Typography structure
  typography: {
    // Font families
    fontFamily: 'Inter, system-ui, sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    
    // Font sizes (in rem)
    fontSizeXs: 0.75,
    fontSizeSm: 0.875,
    fontSizeBase: 1,
    fontSizeLg: 1.125,
    fontSizeXl: 1.25,
    fontSize2xl: 1.5,
    fontSize3xl: 1.875,
    fontSize4xl: 2.25,
    
    // Font weights
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    
    // Line heights
    lineHeightTight: 1.25,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.625,
    lineHeightLoose: 2,
    
    // Letter spacing (in em)
    letterSpacingTighter: -0.05,
    letterSpacingTight: -0.025,
    letterSpacingNormal: 0,
    letterSpacingWide: 0.025,
    letterSpacingWider: 0.05
  },
  
  // Spacing structure
  spacing: {
    unit: 1,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 56,
    '5xl': 64,
    '6xl': 72
  },
  
  // Border radius structure
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    full: 9999
  },
  
  // Shadows structure
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Transitions structure
  transitions: {
    durationFast: 150,
    durationNormal: 200,
    durationSlow: 300,
    easingLinear: 'linear',
    easingEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easingEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easingEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easingElastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  // Breakpoints structure
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-index structure
  zIndex: {
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    modal: 1040,
    popover: 1030,
    tooltip: 1020,
    toast: 1050,
    overlay: 1060
  }
}

// Default customization
export const defaultCustomization: FormCustomization = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#FFFFFF',
    text: {
  primary: "#1F2937",
  secondary: "#6B7280", 
  muted: "#9CA3AF",
  error: "#EF4444",
  success: "#10B981"
},
    border: {
  default: "#E5E7EB",
  focus: "#3B82F6",
  error: "#EF4444",
  hover: "#D1D5DB"
},
  },
  maxWidth: 600,
  alignment: 'center',
  buttonStyle: 'filled',
  buttonSize: 'md',
  animations: {
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