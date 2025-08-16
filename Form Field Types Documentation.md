# Form Field Types Documentation v2.0

## Overview

This document provides comprehensive documentation for all 16 field types supported by the Public Forms System v2.0. Each field type includes specifications, validation rules, display options, form builder integration, and implementation examples.

## Field Types Summary

The system supports 16 distinct field types with **complete form builder editing support**:

### Text-Based Fields (5 types) ✅ **Full Editor Support**
- **shortText** - Single-line text input with character limits and validation
- **longText** - Multi-line textarea with auto-resize and content management
- **email** - Email address input with domain validation and format checking
- **website** - URL input with protocol validation and auto-formatting
- **phoneNumber** - Phone number input with format validation and auto-formatting

### Choice-Based Fields (4 types) ✅ **Full Editor Support**
- **multipleChoice** - Radio button selection with option management and layout control
- **dropdown** - Select dropdown menu with searchable options and placeholders
- **yesNo** - Boolean yes/no choice with inline display and default selection
- **opinionScale** - 1-10 opinion scale with semantic labels and default rating

### Rating Fields (1 type) ✅ **Full Editor Support**
- **numberRating** - Numeric rating scale with customizable range and default values

### Special Fields (3 types) ✅ **Full Editor Support**
- **statement** - Display-only content with rich formatting, variants, and image support
- **legal** - Terms acceptance with scrollable content and acceptance tracking
- **fileUpload** - File upload with validation, type restrictions, and size limits

### Structure Fields (3 types) ✅ **Full Editor Support**
- **pageBreak** - Multi-step form section breaks with titles and descriptions
- **startingPage** - Welcome/intro screen with time estimates and feature highlights
- **postSubmission** - Thank you/completion screen with custom actions and redirects

**All field types now include:**
- ✅ Specialized form builder editor
- ✅ Real-time preview in builder
- ✅ Advanced property configuration
- ✅ Validation rule management
- ✅ Display option customization

---

## Form Builder Integration

Each field type is fully integrated with the form builder through specialized editor components:

### Editor Features by Category

**Text Fields**: Placeholder configuration, character limits, default values, format validation
**Choice Fields**: Option management (add/remove/reorder), layout control, default selections  
**Rating Fields**: Range configuration, default ratings, display customization
**Special Fields**: Rich content editing, display variants, file type restrictions
**Structure Fields**: Section management, completion flow, redirect configuration

### Common Editor Features

All field editors provide:
- **Real-time Preview**: See exactly how the field appears to form users
- **Tabbed Settings**: Organized into Basic, Validation, and Display options
- **Auto-save**: Changes persist automatically without manual saving
- **Type Safety**: Full TypeScript integration with proper validation
- **Accessibility**: WCAG-compliant editing interfaces

---

## Text-Based Fields

### 1. shortText

Single-line text input for names, titles, and short responses with comprehensive form builder support.

#### Properties

- **type**: 'shortText'
- **placeholder**: Input placeholder text
- **maxLength**: Maximum character count
- **minLength**: Minimum character count
- **defaultValue**: Pre-filled value
- **validationRules**: Custom patterns, error messages, length validation
- **displayOptions**: Width settings, label visibility

#### Form Builder Support ✅

**ShortTextEditor provides:**
- Placeholder text configuration with real-time preview
- Character limit settings (min/max length) with validation
- Default value configuration for pre-filled forms
- Custom validation pattern setup with regex support
- Display width options (full, half, third)
- Label and description visibility controls

**Editor Interface:**
- **Basic tab**: Placeholder, character limits, default values
- **Validation tab**: Custom patterns, error messages, length validation
- **Display tab**: Width settings, label visibility options

**Real-time Features:**
- Character counter with visual feedback in preview
- Pattern validation testing with immediate error display
- Live placeholder text updates in field preview
- Default value preview showing pre-filled state

#### Usage Example

```json
{
  "id": "firstName",
  "type": "shortText",
  "label": "First Name",
  "description": "Enter your legal first name",
  "required": true,
  "placeholder": "John",
  "maxLength": 50,
  "minLength": 2,
  "defaultValue": "",
  "validationRules": {
    "pattern": "^[a-zA-Z\\s]+$",
    "customMessage": "Name can only contain letters and spaces",
    "min": 2,
    "max": 50
  },
  "displayOptions": {
    "width": "half",
    "showLabel": true,
    "showDescription": true
  }
}
```

#### Best Practices

- Use for single-line inputs (names, titles, IDs)
- Set appropriate maxLength (typically 50-100 characters)
- Provide clear placeholder examples that match expected format
- Use pattern validation for specific formats (names, codes, etc.)
- Configure character limits based on actual data requirements

---

### 2. longText

Multi-line textarea for detailed responses and comments with auto-resize functionality.

#### Properties

- **type**: 'longText'
- **placeholder**: Textarea placeholder text
- **maxLength**: Character limit (default: 1000)
- **minLength**: Minimum character requirement
- **defaultValue**: Pre-filled content
- **validationRules**: Custom validation messages
- **displayOptions**: Width settings, label visibility

#### Form Builder Support ✅

**LongTextEditor provides:**
- Placeholder text configuration with multi-line preview
- Character limit settings with real-time counter
- Default content configuration for pre-filled forms
- Textarea height customization (rows setting)
- Display width and label visibility controls
- Auto-resize preview functionality

**Editor Interface:**
- **Basic tab**: Placeholder, character limits, default content
- **Validation tab**: Length validation, custom error messages
- **Display tab**: Width settings, label visibility, textarea height

**Features:**
- Auto-resize functionality (120px to 300px height range)
- Character counter with warning states for approaching limits
- Rich text preview support for formatted content
- Scroll optimization for long content areas

#### Usage Example

```json
{
  "id": "feedback",
  "type": "longText",
  "label": "Detailed Feedback",
  "description": "Please provide comprehensive feedback about your experience",
  "required": true,
  "placeholder": "Tell us about your experience, what went well, and areas for improvement...",
  "maxLength": 1000,
  "minLength": 50,
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Use for detailed responses requiring multiple sentences
- Set reasonable maxLength (500-2000 characters)
- Enable character counter for long text fields
- Consider user experience on mobile devices with appropriate height settings
- Provide clear guidance on expected content length and detail

---

### 3. email

Email address input with built-in validation and domain management capabilities.

#### Properties

- **type**: 'email'
- **placeholder**: Email format example (default: "name@example.com")
- **defaultValue**: Pre-filled email address
- **validationRules**: Domain restrictions, custom error messages
- **displayOptions**: Width settings, label visibility

#### Form Builder Support ✅

**EmailEditor provides:**
- Placeholder text configuration with email format examples
- Default email value for pre-filled forms
- Domain restriction management (allowed/blocked domains)
- Custom validation message configuration
- Real-time email format validation preview
- Display width and label visibility controls

**Editor Interface:**
- **Basic tab**: Placeholder text, default email value
- **Validation tab**: Domain restrictions, custom error messages
- **Display tab**: Width settings, label visibility options

**Advanced Features:**
- **Domain Management**: Configure allowed domains (e.g., company emails only)
- **Format Validation**: Real-time email format checking with visual feedback
- **Auto-suggestions**: Browser autocomplete integration
- **Security Options**: Block temporary/disposable email domains

#### Usage Example

```json
{
  "id": "userEmail",
  "type": "email",
  "label": "Email Address",
  "description": "We'll use this to send you updates",
  "required": true,
  "placeholder": "name@company.com",
  "defaultValue": "",
  "validationRules": {
    "customMessage": "Please enter a valid email address"
  },
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Validation Features

- **Format Validation**: RFC 5322 compliant email validation
- **Real-time Validation**: Immediate feedback as user types in preview
- **Visual Feedback**: Success/error indicators in form builder preview
- **Autocomplete Integration**: Browser autocomplete support for better UX

#### Best Practices

- Always include helpful placeholder text that matches your domain requirements
- Provide clear error messages that guide users to correct format
- Consider autocomplete attributes for better user experience
- Test email validation with various formats during form building

---

### 4. website

URL input with validation and auto-formatting capabilities.

#### Properties

- **type**: 'website'
- **placeholder**: URL example (default: "https://example.com")
- **defaultValue**: Pre-filled URL
- **validationRules**: Protocol requirements, custom error messages
- **displayOptions**: Width settings, label visibility

#### Form Builder Support ✅

**WebsiteEditor provides:**
- Placeholder text configuration with URL format examples
- Default URL value for pre-filled forms
- Protocol validation and auto-formatting
- Custom validation message configuration
- Real-time URL format validation preview
- Display width and label visibility controls

**Editor Interface:**
- **Basic tab**: Placeholder text, default URL value
- **Validation tab**: Protocol validation, custom error messages
- **Display tab**: Width settings, label visibility options

**Features:**
- Auto-protocol addition (automatically adds https:// if missing)
- Link preview functionality when valid URL entered
- Protocol validation (HTTP/HTTPS enforcement)
- Security options for HTTPS-only requirements

#### Usage Example

```json
{
  "id": "companyWebsite",
  "type": "website",
  "label": "Company Website",
  "description": "Your company's main website URL",
  "required": false,
  "placeholder": "https://yourcompany.com",
  "defaultValue": "",
  "validationRules": {
    "customMessage": "Please enter a valid website URL"
  },
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Enable auto-protocol addition for better UX
- Provide example URLs in placeholder text
- Consider HTTPS requirements for business forms
- Test link validation for active URLs when needed

---

### 5. phoneNumber

Phone number input with formatting and validation capabilities.

#### Properties

- **type**: 'phoneNumber'
- **placeholder**: Phone format example (default: "(555) 123-4567")
- **defaultValue**: Pre-filled phone number
- **validationRules**: Format validation, custom error messages
- **displayOptions**: Width settings, label visibility

#### Form Builder Support ✅

**PhoneNumberEditor provides:**
- Placeholder text configuration with phone format examples
- Default phone number for pre-filled forms
- Format validation and auto-formatting preview
- Custom validation message configuration
- Real-time phone format validation
- Display width and label visibility controls

**Editor Interface:**
- **Basic tab**: Placeholder text, default phone number
- **Validation tab**: Format validation, custom error messages
- **Display tab**: Width settings, label visibility options

**Features:**
- Auto-formatting as user types (format preview in builder)
- International format support with country codes
- Flexible validation for different phone formats
- Visual feedback for format validation

#### Usage Example

```json
{
  "id": "contactPhone",
  "type": "phoneNumber",
  "label": "Phone Number",
  "description": "We'll only call during business hours",
  "required": false,
  "placeholder": "+1 (555) 123-4567",
  "defaultValue": "",
  "validationRules": {
    "customMessage": "Please enter a valid phone number"
  },
  "displayOptions": {
    "width": "half",
    "showLabel": true
  }
}
```

#### Best Practices

- Use international format for global forms
- Provide clear format examples in placeholder text
- Consider optional vs required based on use case
- Test format validation with various number formats

---

## Choice-Based Fields

### 6. multipleChoice

Advanced radio button implementation with comprehensive option management and layout control.

#### Properties

- **type**: 'multipleChoice'
- **options**: Array of choice options
- **defaultValue**: Pre-selected option
- **validationRules**: Custom validation messages
- **displayOptions**: Width, label visibility, inline layout

#### Form Builder Support ✅

**MultipleChoiceEditor provides:**
- **Interactive Option Management**: Add, remove, edit, and reorder options
- **Real-time Preview**: See exactly how radio buttons will appear
- **Layout Control**: Toggle between vertical and horizontal (inline) layouts
- **Default Selection**: Configure pre-selected options for forms
- **Option Validation**: Ensure at least one option exists
- **Drag-and-Drop Reordering**: Intuitive option organization

**Editor Interface:**
- **Basic tab**: 
  - Option management with add/remove buttons
  - Individual option editing with inline text fields
  - Default selection dropdown
  - Layout toggle (vertical/inline)
- **Validation tab**: Custom error messages for required validation
- **Display tab**: Width settings, label visibility controls

**Advanced Features:**
- **Option Manager Component**: Dedicated interface for choice management
- **Live Preview Updates**: Radio buttons update instantly as options change
- **Smart Validation**: Prevents deletion of last remaining option
- **Accessibility Support**: Proper ARIA labels and keyboard navigation

#### Usage Example

```json
{
  "id": "contactMethod",
  "type": "multipleChoice",
  "label": "How would you prefer to be contacted?",
  "description": "Select your preferred communication method",
  "required": true,
  "options": [
    "Email",
    "Phone call", 
    "Text message",
    "Video call"
  ],
  "defaultValue": "Email",
  "validationRules": {
    "customMessage": "Please select a contact method"
  },
  "displayOptions": {
    "width": "full",
    "inline": false,
    "showLabel": true
  }
}
```

#### Best Practices

- Limit to 2-7 options for optimal user experience
- Use clear, mutually exclusive options that don't overlap
- Order options logically (frequency of use, alphabetical, or workflow-based)
- Consider inline layout for short option lists (2-3 options)
- Provide default selections for forms where appropriate
- Test option ordering during form building to optimize user flow

---

### 7. dropdown

Select dropdown menu with option management and customization capabilities.

#### Properties

- **type**: 'dropdown'
- **options**: Array of dropdown options
- **placeholder**: Dropdown placeholder text
- **defaultValue**: Pre-selected option
- **validationRules**: Custom validation messages
- **displayOptions**: Width, label visibility

#### Form Builder Support ✅

**DropdownEditor provides:**
- **Option Management**: Add, remove, edit dropdown options
- **Placeholder Configuration**: Custom placeholder text setting
- **Default Selection**: Pre-selected value configuration
- **Real-time Preview**: See dropdown appearance and options
- **Option Validation**: Ensure dropdown has valid options
- **Intuitive Interface**: Easy option management with visual feedback

**Editor Interface:**
- **Basic tab**: Option management, placeholder text, default selection
- **Validation tab**: Custom error messages for required validation
- **Display tab**: Width settings, label visibility controls

**Features:**
- **Custom Styled Dropdown**: Consistent with form theme
- **Option Organization**: Easy add/remove/edit functionality
- **Loading States**: Proper loading and error handling
- **Keyboard Navigation**: Full keyboard accessibility support

#### Usage Example

```json
{
  "id": "country",
  "type": "dropdown",
  "label": "Country",
  "description": "Select your country of residence",
  "required": true,
  "placeholder": "Choose your country...",
  "options": [
    "United States",
    "Canada", 
    "United Kingdom",
    "Australia",
    "Germany",
    "France"
  ],
  "defaultValue": "",
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Use for 8+ options (prefer radio buttons for fewer)
- Provide clear placeholder text that guides selection
- Order options logically (alphabetical, by frequency, or geographic)
- Consider default selections for common choices
- Test dropdown behavior across different devices

---

### 8. yesNo

Boolean choice field with layout and selection customization.

#### Properties

- **type**: 'yesNo'
- **defaultValue**: Pre-selected boolean value
- **validationRules**: Custom validation messages
- **displayOptions**: Width, label visibility, inline layout

#### Form Builder Support ✅

**YesNoEditor provides:**
- **Layout Control**: Toggle between vertical and horizontal display
- **Default Selection**: Configure pre-selected option (Yes/No/None)
- **Real-time Preview**: See exact button/toggle appearance
- **Custom Labels**: Option to customize Yes/No text (future enhancement)
- **Accessibility**: Proper ARIA labels and keyboard support

**Editor Interface:**
- **Basic tab**: Layout toggle, default selection configuration
- **Validation tab**: Custom error messages for required fields
- **Display tab**: Width settings, label visibility, inline options

**Features:**
- **Multiple Display Variants**: Radio buttons, toggle switches, or buttons
- **Clear Visual Feedback**: Obvious selection states
- **Accessibility Compliant**: Screen reader compatible
- **Smooth State Transitions**: Visual feedback for selections

#### Usage Example

```json
{
  "id": "newsletterSubscribe",
  "type": "yesNo",
  "label": "Subscribe to Newsletter",
  "description": "Would you like to receive our monthly newsletter?",
  "required": false,
  "defaultValue": false,
  "displayOptions": {
    "inline": true,
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Use for clear binary decisions
- Consider default values carefully (avoid pre-selecting unless appropriate)
- Use inline layout for compact forms
- Provide clear, unambiguous labels
- Consider the context when choosing between radio buttons and toggle styles

---

### 9. opinionScale

Interactive 1-10 opinion scale with visual feedback and semantic labels.

#### Properties

- **type**: 'opinionScale'
- **defaultValue**: Pre-selected rating (1-10)
- **validationRules**: Custom validation messages
- **displayOptions**: Width, label visibility

#### Form Builder Support ✅

**OpinionScaleEditor provides:**
- **Scale Description**: Configure contextual description for the scale
- **Default Rating**: Pre-select a rating value (1-10)
- **Real-time Preview**: See interactive 1-10 scale with visual feedback
- **Semantic Labels**: Built-in "Strongly Disagree" to "Strongly Agree" context
- **Visual Design**: Color gradients and hover effects in preview

**Editor Interface:**
- **Basic tab**: Scale description, default rating selection
- **Display tab**: Width settings, label visibility options
- **Validation**: Fixed 1-10 validation (no custom validation needed)

**Features:**
- **Fixed 1-10 Scale**: Standardized opinion measurement
- **Visual Gradients**: Color coding from negative to positive
- **Hover Effects**: Interactive feedback during selection
- **Net Promoter Score Compatible**: Perfect for NPS-style questions
- **Keyboard Navigation**: Arrow key navigation support

#### Usage Example

```json
{
  "id": "recommendLikelihood",
  "type": "opinionScale",
  "label": "Likelihood to Recommend",
  "description": "How likely are you to recommend our service to others?",
  "required": true,
  "defaultValue": null,
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Use for agreement/likelihood questions
- Perfect for Net Promoter Score (NPS) measurements
- Provide clear context about what the scale represents
- Consider cultural differences in scale interpretation
- Use for standardized opinion measurement across forms

---

## Rating Fields

### 10. numberRating

Star-based or numeric rating with customizable scale and display options.

#### Properties

- **type**: 'numberRating'
- **minRating**: Minimum rating value
- **maxRating**: Maximum rating value
- **defaultValue**: Pre-selected rating
- **validationRules**: Custom validation messages
- **displayOptions**: Width, label visibility

#### Form Builder Support ✅

**NumberRatingEditor provides:**
- **Range Configuration**: Set minimum and maximum rating values (1-10)
- **Default Rating**: Configure pre-selected rating value
- **Real-time Preview**: See rating scale with exact appearance
- **Validation Testing**: Test rating range validation in real-time
- **Visual Feedback**: See how ratings appear to users

**Editor Interface:**
- **Basic tab**: Min/max rating configuration, default rating selection
- **Validation tab**: Range validation, custom error messages
- **Display tab**: Width settings, label visibility options

**Features:**
- **Customizable Rating Range**: Support for 1-5, 1-10, or custom ranges
- **Visual Rating Display**: Number-based rating with clear indicators
- **Hover Preview Effects**: Interactive feedback during rating selection
- **Semantic Feedback Labels**: Optional low/high labels for context
- **Keyboard Navigation**: Arrow key navigation support

#### Usage Example

```json
{
  "id": "serviceRating",
  "type": "numberRating",
  "label": "Rate Our Service",
  "description": "How would you rate your overall experience?",
  "required": true,
  "minRating": 1,
  "maxRating": 5,
  "defaultValue": null,
  "displayOptions": {
    "width": "full",
    "showLabel": true
  }
}
```

#### Best Practices

- Use 1-5 or 1-10 scales for consistency with user expectations
- Consider context when choosing rating range
- Provide semantic labels (Poor → Excellent) for clarity
- Test rating interactions in preview mode
- Use for satisfaction, quality, or performance measurements

---

## Special Fields

### 11. statement

Display-only content field for instructions, information, and rich media with formatting options.

#### Properties

- **type**: 'statement'
- **label**: Statement title
- **description**: HTML content to display
- **displayOptions**: Visual variants, image support, external links

#### Form Builder Support ✅

**StatementEditor provides:**
- **Rich Content Editing**: Multi-line content editing with formatting
- **Display Variants**: Choose from default, highlighted, info, or warning styles
- **Image Integration**: Add header images with URL and alt text
- **Link Management**: Add external links within statement content
- **Real-time Preview**: See exactly how statement appears to users

**Editor Interface:**
- **Basic tab**: Statement content, display style, image URL, alt text
- **Display tab**: Width settings, variant selection
- **No validation needed**: Statements are display-only

**Features:**
- **Multiple Visual Variants**: Default, highlighted, info box, warning box styles
- **Image Integration**: Header images with accessibility support
- **External Link Handling**: Links open in appropriate windows/tabs
- **Rich Content Support**: HTML content rendering
- **Responsive Design**: Adapts to different screen sizes

#### Usage Example

```json
{
  "id": "welcomeMessage",
  "type": "statement",
  "label": "Welcome to Our Survey",
  "description": "Thank you for participating! This survey will help us improve our services. Your responses are confidential and will only be used for research purposes. The survey should take approximately 5-7 minutes to complete.",
  "displayOptions": {
    "variant": "highlighted",
    "imageUrl": "https://example.com/welcome-banner.jpg",
    "imageAlt": "Welcome banner",
    "width": "full"
  }
}
```

#### Display Variants

- **Default**: Standard text formatting with neutral styling
- **Highlighted**: Emphasized background/border for important information
- **Info**: Blue info box styling for helpful information
- **Warning**: Yellow warning box styling for important notices

#### Best Practices

- Use for instructions, disclaimers, and important information
- Keep content concise and scannable for better user experience
- Use appropriate variant for content type (info for help, warning for important notices)
- Include images for visual engagement when appropriate
- Test content rendering across different screen sizes

---

### 12. legal

Terms acceptance field with scrollable content and comprehensive acceptance tracking.

#### Properties

- **type**: 'legal'
- **label**: Acceptance text (e.g., "I agree to...")
- **description**: Full legal text content (HTML supported)
- **required**: Always true (legal acceptance must be required)
- **validationRules**: Scroll requirements, custom messages
- **displayOptions**: Terms title, external links

#### Form Builder Support ✅

**LegalEditor provides:**
- **Acceptance Text Configuration**: Customize the checkbox label text
- **Terms Title**: Set title for the legal content section
- **Legal Content Editing**: Multi-line content editing for terms/policies
- **Scroll Requirements**: Option to require reading full content
- **External Links**: Add links to full legal documents
- **Preview with Scroll**: See scrollable terms container in action

**Editor Interface:**
- **Basic tab**: Acceptance text, terms title, legal content editing
- **Validation tab**: Scroll requirements, custom error messages
- **Display tab**: Width settings (legal fields typically full width)

**Features:**
- **Scrollable Terms Container**: Long legal text in manageable, contained area
- **Scroll-to-Accept Validation**: Ensures users read complete terms
- **External Document Links**: Link to full legal documents
- **Clear Acceptance Language**: Prominent checkbox for legal agreement
- **Audit Trail Support**: Tracks acceptance for compliance

#### Usage Example

```json
{
  "id": "termsAcceptance",
  "type": "legal",
  "label": "I have read and agree to the Terms of Service and Privacy Policy",
  "description": "By using our service, you agree to the following terms... [Full legal content here]",
  "required": true,
  "validationRules": {
    "customMessage": "You must accept the terms to continue"
  },
  "displayOptions": {
    "termsTitle": "Terms of Service & Privacy Policy",
    "width": "full"
  }
}
```

#### Features

- **Scrollable Content**: Long legal text in contained, scrollable area
- **External Links**: Link to complete legal documents
- **Clear Acceptance**: Unambiguous checkbox for user agreement
- **Compliance Ready**: Designed for legal requirement compliance

#### Best Practices

- Always require acceptance for legal terms
- Provide links to complete legal documents
- Use clear, unambiguous acceptance language
- Consider accessibility for screen readers
- Test scrolling behavior across different devices
- Keep legal content up-to-date and accurate

---

### 13. fileUpload

File upload field with validation, preview, and comprehensive file management.

#### Properties

- **type**: 'fileUpload'
- **acceptedFileTypes**: Array of allowed file extensions
- **maxFileSize**: Maximum file size in MB
- **validationRules**: Custom validation messages
- **displayOptions**: Upload instructions, multiple file support

#### Form Builder Support ✅

**FileUploadEditor provides:**
- **File Type Configuration**: Set accepted file extensions (.pdf, .jpg, etc.)
- **Size Limit Management**: Configure maximum file size in MB
- **Upload Instructions**: Custom instructions for users
- **Validation Preview**: See file type and size restrictions in preview
- **Drag-and-Drop Preview**: Preview of upload interface

**Editor Interface:**
- **Basic tab**: Accepted file types, size limits, upload instructions
- **Validation tab**: Custom error messages for file validation
- **Display tab**: Width settings, instruction text

**Features:**
- **File Type Validation**: Restrict uploads to specific file types
- **Size Limit Enforcement**: Prevent oversized file uploads
- **Upload Progress Tracking**: Progress indication for file uploads
- **File Preview Generation**: Preview capabilities for images/documents
- **Error Handling**: Clear error messages for invalid files

#### Usage Example

```json
{
  "id": "resume",
  "type": "fileUpload",
  "label": "Upload Resume",
  "description": "Please upload your current resume or CV",
  "required": true,
  "acceptedFileTypes": [".pdf", ".doc", ".docx"],
  "maxFileSize": 5,
  "validationRules": {
    "customMessage": "Please upload a valid resume file"
  },
  "displayOptions": {
    "width": "full"
  }
}
```

#### Features

- **Drag & Drop Interface**: Modern file upload with drag-and-drop support
- **File Validation**: Comprehensive type and size validation
- **Progress Tracking**: Upload progress indication for user feedback
- **Preview Generation**: Image and document preview capabilities
- **Error Feedback**: Clear validation errors for file issues

#### Best Practices

- Clearly specify accepted file types to avoid user confusion
- Set reasonable file size limits based on your infrastructure
- Provide clear upload instructions and requirements
- Show file validation errors clearly with helpful guidance
- Consider security implications and implement proper file scanning
- Test upload functionality across different browsers and devices

---

## Structure Fields

### 14. pageBreak

Section separator for multi-step forms and logical content grouping.

#### Properties

- **type**: 'pageBreak'
- **label**: Section title (optional)
- **description**: Section description (optional)
- **displayOptions**: Progress indication, navigation styles

#### Form Builder Support ✅

**PageBreakEditor provides:**
- **Section Title Configuration**: Optional title for form sections
- **Section Description**: Explanatory text for section breaks
- **Progress Indication**: Visual progress indicators for multi-step forms
- **Navigation Control**: Configure continue button text and behavior
- **Visual Preview**: See section break appearance in form flow

**Editor Interface:**
- **Basic tab**: Section title, description, navigation options
- **Display tab**: Progress indicator settings, visual styling
- **No validation needed**: Page breaks are structural elements

**Features:**
- **Visual Section Separation**: Clear breaks between form sections
- **Progress Indication**: Show users their progress through the form
- **Section Completion Feedback**: Acknowledge completed sections
- **Smooth Transitions**: Professional section-to-section navigation

#### Usage Example

```json
{
  "id": "section2",
  "type": "pageBreak",
  "label": "Personal Information",
  "description": "Now we'll collect some basic personal details",
  "displayOptions": {
    "width": "full"
  }
}
```

#### Best Practices

- Use to logically group related questions into sections
- Provide clear section titles that set expectations
- Keep section descriptions brief and helpful
- Show progress indicators for longer forms
- Test section transitions for smooth user experience

---

### 15. startingPage

Welcome screen for form introduction and context setting with engagement features.

#### Properties

- **type**: 'startingPage'
- **label**: Welcome title
- **description**: Welcome content and instructions
- **displayOptions**: Time estimates, participant counts, feature highlights

#### Form Builder Support ✅

**StartingPageEditor provides:**
- **Welcome Title**: Engaging title for form introduction
- **Welcome Message**: Detailed description and instructions
- **Time Estimation**: Set expected completion time
- **Participant Count**: Show social proof with participant numbers
- **Feature Highlights**: Highlight key features (anonymous, secure, etc.)
- **Full-Screen Preview**: See complete welcome screen layout

**Editor Interface:**
- **Basic tab**: Welcome title, message, time estimate, participant count, features
- **Display tab**: Layout options, visual styling
- **No validation needed**: Starting pages are informational

**Features:**
- **Engagement Elements**: Time estimates and participant counts for motivation
- **Trust Building**: Feature highlights to build confidence
- **Professional Appearance**: Polished welcome screen design
- **Mobile Optimization**: Responsive design for all devices

#### Usage Example

```json
{
  "id": "welcome",
  "type": "startingPage",
  "label": "Customer Satisfaction Survey",
  "description": "Help us improve our service by sharing your experience. Your feedback is valuable and will help us serve you better.",
  "displayOptions": {
    "estimatedTime": "5-7 minutes",
    "participantCount": 1247,
    "features": [
      "Anonymous responses",
      "Mobile-friendly",
      "Secure & encrypted"
    ]
  }
}
```

#### Features

- **Estimated Time**: Set realistic user expectations for completion
- **Participant Count**: Social proof element to encourage participation
- **Feature Highlights**: Build trust with privacy and security features
- **Visual Appeal**: Engaging hero images and custom styling options

#### Best Practices

- Set accurate time estimates to build trust
- Highlight privacy and security features to encourage participation
- Use engaging but professional language
- Keep introduction content concise but informative
- Include relevant feature highlights that matter to your audience

---

### 16. postSubmission

Thank you screen with custom actions and next steps configuration.

#### Properties

- **type**: 'postSubmission'
- **label**: Thank you title
- **description**: Completion message
- **displayOptions**: Custom actions, download options, redirect settings

#### Form Builder Support ✅

**PostSubmissionEditor provides:**
- **Thank You Title**: Customizable completion title
- **Completion Message**: Detailed thank you and next steps content
- **Redirect Configuration**: Set up automatic redirects with delay timing
- **Action Buttons**: Configure download receipts, social sharing, feedback options
- **Custom Actions**: Add custom buttons for specific workflows
- **Preview with Actions**: See complete thank you page with all configured actions

**Editor Interface:**
- **Basic tab**: Thank you title, completion message, redirect URL and delay
- **Actions tab**: Configure download options, sharing, feedback, custom actions
- **Display tab**: Layout options, visual styling

**Features:**
- **Celebration Animations**: Positive reinforcement for form completion
- **Download Receipt**: PDF/email confirmation options for users
- **Custom Action Buttons**: Flexible next steps for user workflow
- **Social Sharing**: Viral form sharing integration
- **Auto-redirect**: Seamless user journey continuation

#### Usage Example

```json
{
  "id": "thankYou",
  "type": "postSubmission",
  "label": "Thank You!",
  "description": "Your response has been recorded successfully. We appreciate you taking the time to share your feedback with us.",
  "displayOptions": {
    "redirectUrl": "https://example.com/thank-you",
    "redirectDelay": 5,
    "showDownload": true,
    "showShare": false,
    "showFeedback": true
  }
}
```

#### Features

- **Celebration Animations**: Visual feedback for successful completion
- **Download Receipt**: User confirmation and record-keeping
- **Custom Actions**: Flexible workflow continuation options
- **Social Sharing**: Encourage viral form distribution
- **Auto-redirect**: Seamless navigation to next steps

#### Best Practices

- Express genuine gratitude for user participation
- Provide clear next steps or calls to action
- Offer receipt/confirmation options for important forms
- Consider user journey after form submission
- Test redirect timing for optimal user experience
- Use celebration elements to create positive completion experience

---

## Legacy Field Types

### Backward Compatibility

The system maintains support for legacy field types through automatic mapping:

| Legacy Type | Maps To | Notes |
|-------------|---------|-------|
| `text` | `shortText` | Single-line text input |
| `rating` | `numberRating` | Numeric rating scale |
| `date` | Dedicated `DateField` | Date input with picker |

### Migration Strategy

Legacy fields are automatically converted during form processing while maintaining all functionality and data integrity.

---

## Field Validation Reference

### Common Validation Properties

All fields support these validation options:

- **required**: Field is required for form submission
- **customMessage**: Override default error messages with user-friendly text

### Type-Specific Validation

| Field Type | Validation Options |
|------------|-------------------|
| **shortText/longText** | `pattern`, `minLength`, `maxLength` |
| **email** | Built-in email format validation |
| **website** | Built-in URL format validation |
| **phoneNumber** | Built-in phone format validation |
| **multipleChoice/dropdown** | Option selection validation |
| **numberRating** | `minRating`, `maxRating` range validation |
| **opinionScale** | Fixed 1-10 validation |
| **legal** | Required acceptance validation |
| **fileUpload** | `acceptedFileTypes`, `maxFileSize` |

### Custom Validation Messages

All field types support custom error messages to provide user-friendly feedback that matches your brand voice and helps users understand how to correct input errors.

---

## Display Options Reference

### Common Display Properties

All fields support these display options:

- **width**: 'full' | 'half' | 'third' for responsive layout control
- **showLabel**: Toggle field label visibility
- **showDescription**: Toggle field description visibility

### Layout Width Options

- **full**: 100% width (default for most fields)
- **half**: 50% width (side-by-side layout)
- **third**: 33% width (three-column layout)

### Responsive Behavior

- **Desktop**: Respects width settings for optimal layout
- **Tablet**: Falls back to full width for half/third options
- **Mobile**: Always full width for optimal touch interaction

---

## Form Builder Best Practices

### Field Configuration

1. **Use appropriate placeholders** - Provide clear examples of expected input
2. **Set reasonable character limits** - Balance user needs with data requirements
3. **Configure default values thoughtfully** - Pre-fill when helpful, not when intrusive
4. **Organize choice options logically** - Order by frequency, alphabet, or user workflow
5. **Provide clear help text** - Guide users without overwhelming the interface

### Editor Workflow

1. **Start with field type selection** - Choose the most appropriate field type first
2. **Configure basic properties** - Set label, description, and core functionality
3. **Add validation rules** - Implement appropriate validation for data quality
4. **Customize display options** - Adjust width, layout, and visual presentation
5. **Test in preview mode** - Verify the field works as expected for end users

### Advanced Configuration

- Use option reordering for choice fields to optimize user experience
- Configure file upload restrictions to match your data processing capabilities
- Set up legal fields with proper scroll requirements for compliance
- Design starting/ending pages to improve form completion rates

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

All field types are designed to meet accessibility standards:

#### Required Elements
- **Semantic HTML**: Proper form elements and labels for all field types
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard accessibility across all field editors
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Association**: Validation errors properly linked to fields

#### Field-Specific Accessibility

- **Choice Fields**: Proper fieldset and legend elements for grouped options
- **Rating Fields**: ARIA labels for rating scales with clear value communication
- **File Upload**: Proper labeling and error announcement for upload status
- **Legal Fields**: Screen reader support for scrollable content areas

---

## Mobile Optimization

### Touch-Friendly Design

All field types are optimized for mobile devices:

#### Touch Targets
- **Minimum 44px**: All interactive elements meet touch target requirements
- **Adequate Spacing**: 8px minimum between interactive elements
- **Thumb Navigation**: Optimized for one-handed operation

#### Mobile-Specific Features
- **Appropriate Keyboards**: Email, numeric, phone keyboards triggered automatically
- **Auto-zoom Prevention**: Proper input sizing to prevent unwanted zooming
- **Upload Integration**: Camera and gallery access for file upload fields
- **Orientation Support**: Works in both portrait and landscape modes

---

## Performance Considerations

### Field Editor Optimization

#### Loading Strategy
- **On-demand Loading**: Field editors load only when fields are active
- **Shared Components**: Reusable components reduce bundle size
- **Progressive Enhancement**: Basic functionality works without JavaScript

#### Rendering Performance
- **Optimistic Updates**: Immediate UI feedback for all property changes
- **Debounced Validation**: Prevents excessive validation calls during typing
- **Efficient Re-rendering**: Only changed properties trigger updates

---

## Migration Guide

### Upgrading from Basic Fields

Existing forms automatically benefit from enhanced field editing without requiring migration:

1. **Automatic Enhancement**: All existing field types now have specialized editors
2. **Preserved Data**: All existing field configurations remain intact
3. **New Features**: Access to advanced validation, display options, and previews
4. **Backward Compatibility**: Legacy field properties continue to work

### New Features Available

- **Tabbed editing interface** for organized property management
- **Real-time preview** showing exact field appearance
- **Advanced validation** with custom error messages
- **Display customization** with width and layout options
- **Option management** with drag-and-drop reordering for choice fields

---

## Troubleshooting

### Common Field Configuration Issues

#### Validation Not Working
- **Check field requirements**: Ensure required fields are properly marked
- **Verify validation rules**: Test custom patterns and length limits
- **Review error messages**: Ensure custom messages are clear and helpful

#### Display Issues
- **Width settings**: Verify width options work across different screen sizes
- **Label visibility**: Check that labels and descriptions display correctly
- **Mobile layout**: Test field appearance on mobile devices

#### Choice Field Problems
- **Option management**: Ensure all choice fields have at least one option
- **Default selections**: Verify default values match available options
- **Layout issues**: Test inline vs vertical layouts for different option counts

### Field Editor Debugging

- **Use browser dev tools** to inspect field properties and validation
- **Test in preview mode** to see exactly how fields appear to users
- **Check console logs** for validation errors or configuration issues
- **Verify auto-save** is working by checking for property updates

---

## API Integration

### Field Configuration API

All field types work seamlessly with the existing form API:

- **POST /api/forms**: Create forms with any combination of 16 field types
- **PUT /api/forms/[id]**: Update field configurations with enhanced properties
- **Form Validation**: Server-side validation matches client-side field editor validation
- **Data Collection**: All field types properly collect and store user responses

### Field Type Validation

The API validates field configurations to ensure:
- Required properties are present for each field type
- Validation rules are properly formatted
- Display options are compatible with field types
- Default values match field type constraints

---

*Last Updated: December 2024*  
*Field Types Version: 2.0.0*  
*Total Supported Types: 16*  
*Form Builder Integration: Complete*  
*Legacy Compatibility: Full*  
*Editor Support: All Field Types*