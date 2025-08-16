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
    description: "Email address input with domain validation",
    category: "text-fields",
    defaultValues: {
      type: "email",
      label: "Email Address",
      required: false,
      placeholder: "name@example.com",
      defaultValue: "",
      validationRules: {
        pattern: "",
        customMessage: "",
        blockedDomains: [],
      },
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
        description: "Example email format shown to users",
        placeholder: "name@example.com",
      },
      {
        id: "validationRules.blockedDomains",
        section: "validation",
        component: "textarea",
        label: "Blocked Domains",
        description: "Comma-separated list of blocked email domains",
        placeholder: "tempmail.com, 10minutemail.com",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please enter a valid business email address",
      },
    ],
  },

  // Website Field
  website: {
    displayName: "Website",
    description: "Website URL input with protocol validation and link preview",
    category: "text-fields",
    defaultValues: {
      type: "website",
      label: "Website",
      required: false,
      placeholder: "https://example.com",
      defaultValue: ["http", "https", "ftp"],
      validationRules: {
        allowedProtocols: ["http", "https", "ftp"],
        autoAddProtocol: true,
        blockedDomains: [],
        customMessage: "",
      },
      displayOptions: {
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        description: "Example URL format shown to users",
        placeholder: "https://example.com",
      },
      {
        id: "validationRules.allowedProtocols",
        section: "validation",
        component: "select",
        label: "Allowed Protocols",
        description: "Which URL protocols to accept",
        props: {
          options: [
            { value: "https", label: "HTTPS Only (Secure)" },
            { value: "http,https", label: "HTTP and HTTPS" },
            { value: "http,https,ftp", label: "HTTP, HTTPS, and FTP" },
          ],
        },
      },
      {
        id: "validationRules.blockedDomains",
        section: "validation",
        component: "textarea",
        label: "Blocked Domains",
        description: "Comma-separated list of blocked website domains",
        placeholder: "competitor.com, spam-site.org",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please enter a valid website URL",
      },
    ],
  },
  // Phone Number Field
  phoneNumber: {
    displayName: "Phone Number",
    description: "Phone number input with country code and auto-formatting",
    category: "text-fields",
    defaultValues: {
      type: "phoneNumber",
      label: "Phone Number",
      required: false,
      placeholder: "(555) 123-4567",
      defaultValue: "",
      validationRules: {
        autoFormat: true,
        allowedCountries: [],
        autoDetectCountry: true,
        pattern: "",
        customMessage: "",
      },
      displayOptions: {
        showCountryCode: true,
        defaultCountry: "US",
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        description: "Example phone format shown to users",
        placeholder: "(555) 123-4567",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Enter your phone number with area code",
      },
      {
        id: "validationRules.autoFormat",
        section: "validation",
        component: "switch",
        label: "Auto-Format Phone Number",
        description: "Automatically format phone number as user types",
      },
      {
        id: "displayOptions.showCountryCode",
        section: "validation",
        component: "switch",
        label: "Show Country Code Dropdown",
        description: "Display country code selector with phone input",
      },
      {
        id: "displayOptions.defaultCountry",
        section: "validation",
        component: "select",
        label: "Default Country",
        description: "Default country for phone number format",
        props: {
          options: [
            { value: "US", label: "United States (+1)" },
            { value: "CA", label: "Canada (+1)" },
            { value: "GB", label: "United Kingdom (+44)" },
            { value: "AU", label: "Australia (+61)" },
            { value: "DE", label: "Germany (+49)" },
            { value: "FR", label: "France (+33)" },
            { value: "IN", label: "India (+91)" },
            { value: "JP", label: "Japan (+81)" },
          ],
        },
      },
      {
        id: "validationRules.allowedCountries",
        section: "validation",
        component: "textarea",
        label: "Allowed Countries",
        description: "Comma-separated list of allowed country codes (leave empty for all countries)",
        placeholder: "US, CA, GB, AU",
      },
      {
        id: "validationRules.autoDetectCountry",
        section: "validation",
        component: "switch",
        label: "Auto-Detect Country",
        description: "Automatically detect country from phone number format",
      },
      {
        id: "validationRules.pattern",
        section: "validation",
        component: "input",
        label: "Custom Validation Pattern",
        description: "Custom regex pattern for phone number validation",
        placeholder: "^\\+?[1-9]\\d{1,14}$",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please enter a valid phone number",
      },
    ],
  },
  // Long Text Field
  longText: {
    displayName: "Long Text",
    description: "Multi-line text input with character limits",
    category: "text-fields",
    defaultValues: {
      type: "longText",
      label: "Untitled Question",
      required: false,
      placeholder: "Enter your detailed response...",
      defaultValue: "",
      maxLength: 1000,
      minLength: undefined,
      validationRules: {
        customMessage: "",
      },
      displayOptions: {
        enableRichText: false,
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        description: "Example text shown to users",
        placeholder: "Enter your detailed response...",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Please provide detailed information",
      },
      {
        id: "minLength",
        section: "basic",
        component: "number",
        label: "Minimum Length",
        description: "Minimum number of characters required",
        placeholder: "0",
      },
      {
        id: "maxLength",
        section: "basic",
        component: "number",
        label: "Maximum Length",
        description: "Maximum number of characters allowed",
        placeholder: "1000",
      },
      {
        id: "displayOptions.enableRichText",
        section: "basic",
        component: "switch",
        label: "Enable Rich Text",
        description: "Allow rich text formatting (bold, italic, etc.)",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please enter a valid response",
      },
    ],
  },

  // ========== CHOICE FIELDS ==========

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
      validationRules: {
        minSelections: undefined,
        maxSelections: 1, // Single choice by default
        customMessage: "",
      },
      displayOptions: {
        layout: "vertical", // vertical or horizontal
        randomizeOrder: false,
        otherLabel: "Other",
        requireOtherText: true,
      },
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Choose the best option that applies",
      },
      {
        id: "allowOther",
        section: "options",
        component: "switch",
        label: "Allow Other Option",
        description: "Add an 'Other' option with text input",
      },
      {
        id: "displayOptions.layout",
        section: "display",
        component: "select",
        label: "Layout Direction",
        description: "How to arrange the options",
        props: {
          options: [
            { value: "vertical", label: "Vertical" },
            { value: "horizontal", label: "Horizontal" },
          ],
        },
      },
      {
        id: "displayOptions.randomizeOrder",
        section: "display",
        component: "switch",
        label: "Randomize Option Order",
        description: "Show options in random order for each user",
      },
      {
        id: "validationRules.minSelections",
        section: "validation",
        component: "number",
        label: "Minimum Selections",
        description: "Minimum number of options that must be selected",
        placeholder: "1",
      },
      {
        id: "validationRules.maxSelections",
        section: "validation",
        component: "number",
        label: "Maximum Selections",
        description: "Maximum number of options that can be selected",
        placeholder: "1",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please select an option",
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
      validationRules: {
        customMessage: "",
      },
    },
    propertySchema: [
      {
        id: "placeholder",
        section: "basic",
        component: "input",
        label: "Placeholder Text",
        description: "Text shown when no option is selected",
        placeholder: "Choose an option...",
      },
{
  id: "defaultValue",
  section: "basic",
  component: "select",
  label: "Default Selection",
  description: "Pre-selected option from the available choices",
  props: {
    options: [], 
  },
},
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Select the best option that applies",
      },
      {
        id: "validationRules.customMessage",
        section: "validation",
        component: "input",
        label: "Custom Error Message",
        description: "Custom error message for validation failures",
        placeholder: "Please select an option",
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
      defaultValue: undefined, // Neither yes nor no by default
    },
    propertySchema: [
      {
        id: "defaultValue",
        section: "basic",
        component: "select",
        label: "Default Selection",
        description: "Pre-selected option for the field",
        props: {
          options: [
            { value: "undefined", label: "No Default" },
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ],
        },
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Choose yes or no",
      },
    ],
  },

  // Opinion Scale Field
  opinionScale: {
    displayName: "Opinion Scale",
    description: "Customizable numeric scale for opinions and ratings",
    category: "choice-fields",
    defaultValues: {
      type: "opinionScale",
      label: "Untitled Question",
      required: false,
      minRating: 1,
      maxRating: 10,
      defaultValue: undefined, // No default selection
    },
    propertySchema: [
      {
        id: "defaultValue",
        section: "basic",
        component: "number",
        label: "Default Rating",
        description: "Pre-selected rating value (leave empty for no default)",
        placeholder: "No default",
      },
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Rate on a scale from 1 to 10",
      },
      {
        id: "minRating",
        section: "basic",
        component: "number",
        label: "Minimum Rating",
        description: "Lowest value on the scale",
        placeholder: "1",
      },
      {
        id: "maxRating",
        section: "basic",
        component: "number",
        label: "Maximum Rating",
        description: "Highest value on the scale",
        placeholder: "10",
      },
    ],
  },

  // ========== RATING FIELDS ==========

  // Number Rating Field
  numberRating: {
    displayName: "Rating Scale",
    description: "Numeric rating scale with customizable range and visual styles",
    category: "rating-fields",
    defaultValues: {
      type: "numberRating",
      label: "Untitled Question",
      required: false,
      minRating: 1,
      maxRating: 5,
      displayOptions: {
        ratingStyle: "numbers",
      },
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional help text for users",
        placeholder: "Rate your experience",
      },
      {
        id: "minRating",
        section: "basic",
        component: "number",
        label: "Minimum Rating",
        description: "Lowest rating value",
        placeholder: "1",
      },
      {
        id: "maxRating",
        section: "basic",
        component: "number",
        label: "Maximum Rating",
        description: "Highest rating value",
        placeholder: "5",
      },
      {
        id: "displayOptions.ratingStyle",
        section: "display",
        component: "select",
        label: "Rating Style",
        description: "Visual representation of the rating scale",
        props: {
          options: [
            { value: "stars", label: "⭐ Stars" },
            { value: "hearts", label: "❤️ Hearts" },
            { value: "thumbs", label: "👍 Thumbs" },
            { value: "smiley", label: "😊 Smiley" },
            { value: "fire", label: "🔥 Fire" },
            { value: "numbers", label: "🔢 Numbers" },
          ],
        },
      },
    ],
  },
  // ========== SPECIAL FIELDS ==========

// Statement Field
  statement: {
    displayName: "Statement",
    description: "Display-only content with visual variants",
    category: "special-fields",
    defaultValues: {
      type: "statement",
      label: "Information",
      description: "Your statement content goes here...",
      displayOptions: {
        variant: "default",
      },
    },
    propertySchema: [
      {
        id: "displayOptions.variant",
        section: "display",
        component: "select",
        label: "Visual Style",
        description: "Choose the visual appearance of the statement",
        props: {
          options: [
            { value: "default", label: "Default" },
            { value: "info", label: "Info Box (Blue)" },
            { value: "warning", label: "Warning Box (Yellow)" },
            { value: "success", label: "Success Box (Green)" },
            { value: "highlight", label: "Highlight Box (Primary)" },
          ],
        },
      },
    ],
  },
  // Legal Field
  legal: {
    displayName: "Legal",
    description: "Terms acceptance with scroll requirements and external links",
    category: "special-fields",
    defaultValues: {
      type: "legal",
      label: "I agree to the Terms and Conditions",
      description: "Enter your legal terms and conditions here...",
      required: true, // Legal fields are always required
      validationRules: {
        requireScrollToAccept: true,
      },
      displayOptions: {
        externalLinks: [],
        enableMultipleCheckboxes: false,
        additionalAgreements: [],
      },
    },
    propertySchema: [
      {
        id: "label",
        section: "basic",
        component: "input",
        label: "Acceptance Text",
        description: "Text for the acceptance checkbox",
        placeholder: "I agree to the Terms and Conditions",
      },
      {
        id: "description",
        section: "basic",
        component: "textarea",
        label: "Legal Content",
        description: "The legal terms and conditions content",
        placeholder: "Enter your terms and conditions content...",
      },
      {
        id: "validationRules.requireScrollToAccept",
        section: "validation",
        component: "switch",
        label: "Require Scroll to Accept",
        description: "User must scroll to bottom of content before accepting",
      },
      {
        id: "displayOptions.externalLinks",
        section: "validation",
        component: "textarea",
        label: "External Links",
        description: "Links to full legal documents (one per line: Label|URL)",
        placeholder: "Privacy Policy|https://example.com/privacy\nTerms of Service|https://example.com/terms",
      },
      {
        id: "displayOptions.enableMultipleCheckboxes",
        section: "validation",
        component: "switch",
        label: "Enable Multiple Checkboxes",
        description: "Allow multiple separate agreement checkboxes",
      },
      {
        id: "displayOptions.additionalAgreements",
        section: "validation",
        component: "textarea",
        label: "Additional Agreements",
        description: "Additional checkboxes (one per line)",
        placeholder: "I agree to receive marketing emails\nI understand the refund policy",
      },
    ],
  },

  // File Upload Field
  fileUpload: {
    displayName: "File Upload",
    description: "File upload with type restrictions and size limits",
    category: "special-fields",
    defaultValues: {
      type: "fileUpload",
      label: "Upload File",
      required: false,
      acceptedFileTypes: [],
      maxFileSize: 10, // 10MB default
    },
    propertySchema: [
      {
        id: "helpText",
        section: "basic",
        component: "input",
        label: "Help Text",
        description: "Additional instructions for users",
        placeholder: "Please upload your document",
      },
      {
        id: "maxFileSize",
        section: "validation",
        component: "number",
        label: "Maximum File Size (MB)",
        description: "Maximum file size allowed per file",
        placeholder: "10",
      },
      {
        id: "acceptedFileTypes",
        section: "validation",
        component: "textarea",
        label: "Accepted File Types",
        description: "Comma-separated list of file extensions (e.g., .pdf, .jpg, .png)",
        placeholder: ".pdf, .doc, .docx, .jpg, .png",
      },

    ],
  },

  // ========== STRUCTURE FIELDS ==========
  // Page Break Field
// Page Break Field
  pageBreak: {
    displayName: "Page Break",
    description: "Section separator with automatic numbering and navigation",
    category: "structure-fields",
    defaultValues: {
      type: "pageBreak",
      label: "Section Break",
      description: "",
      displayOptions: {
        sectionTitle: "",
        sectionDescription: "",
        continueButtonText: "Continue",
      },
    },
    propertySchema: [
      {
        id: "displayOptions.sectionTitle",
        section: "basic",
        component: "input",
        label: "Section Title",
        description: "Title for the new section/page",
        placeholder: "e.g., Personal Information",
      },
      {
        id: "displayOptions.sectionDescription",
        section: "basic",
        component: "textarea",
        label: "Section Description",
        description: "Description or instructions for this section",
        placeholder: "Brief description of what this section covers...",
      },
      {
        id: "displayOptions.autoSectionNumbering",
        section: "basic",
        component: "switch",
        label: "Automatic Section Numbering",
        description: "Automatically number sections (Section 1, Section 2, etc.)",
      },
      {
        id: "displayOptions.continueButtonText",
        section: "basic",
        component: "input",
        label: "Continue Button Text",
        description: "Custom text for the continue/next button",
        placeholder: "Continue",
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