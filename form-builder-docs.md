# Form Builder Complete Documentation v2.0

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Core Components](#core-components)
5. [State Management](#state-management)
6. [Field Types](#field-types)
7. [UI Components](#ui-components)
8. [API Reference](#api-reference)
9. [Configuration](#configuration)
10. [Development Guide](#development-guide)
11. [Troubleshooting](#troubleshooting)
12. [Performance](#performance)

---

## Overview

The Form Builder is a comprehensive, production-ready form creation system built with React, TypeScript, and modern web technologies. It provides a visual interface for creating complex forms with 16+ field types, advanced customization, and real-time collaboration features.

### Key Features ✨

- **16 Field Types**: From basic text to complex rating scales and legal acceptance
- **Dual Layout System**: Single-column conversational and multi-step wizard layouts
- **Advanced State Management**: Comprehensive state with auto-save and undo/redo
- **Real-time Preview**: Live form preview with instant updates
- **Theme Customization**: Complete visual customization with live preview
- **Template System**: Pre-built form templates for quick start
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Performance**: Optimized for large forms with efficient rendering
- **Persistence**: Auto-save with localStorage backup and recovery

### Technology Stack

```typescript
// Core Framework
React 19.1.0 + TypeScript 5

// UI Components
shadcn/ui components
Tailwind CSS 4
Lucide React icons

// Form Management
React Hook Form 7.62.0
Zod 3.25.76 validation

// Animation & Interaction
Framer Motion 12.23.12
@hello-pangea/dnd 18.0.1 (drag & drop)

// State Management
React Context + useReducer
Custom state management system
```

---

## Architecture

### System Architecture

```
Form Builder System
├── State Management Layer
│   ├── BuilderProvider (Context + Reducer)
│   ├── Auto-save Manager
│   ├── Storage Manager
│   └── History Manager (Undo/Redo)
├── UI Layer
│   ├── Layout Components
│   ├── Panel Components
│   ├── Field Components
│   └── Floating Elements
├── Business Logic Layer
│   ├── Field Templates
│   ├── Validation System
│   ├── Theme System
│   └── Form Utilities
└── Data Layer
    ├── Form Types
    ├── API Integration
    └── Storage Interface
```

### Component Hierarchy

```
FormBuilderLayout (Root)
├── BuilderProvider (State Management)
├── Header (Navigation & Actions)
├── Main Content Area
│   ├── LeftPanel (Field Management)
│   │   ├── FieldPalette (Add Fields)
│   │   └── FieldTemplates (Templates)
│   ├── CenterPanel (Form Editor)
│   │   ├── FormCanvas (Visual Editor)
│   │   ├── FormPreview (Live Preview)
│   │   └── CanvasToolbar (Quick Actions)
│   └── RightPanel (Properties)
│       ├── FieldProperties (Field Config)
│       ├── FormSettings (Form Config)
│       └── ThemeCustomizer (Appearance)
└── FloatingElements
    └── FloatingAddQuestionToolbar
```

---

## Getting Started

### Installation

```bash
# Clone or create the form builder
npm install

# Required dependencies
npm install @hello-pangea/dnd @hookform/resolvers framer-motion lucide-react react-hook-form zod
```

### Basic Usage

```typescript
import { FormBuilderLayout } from '@/components/form-builder';

function FormBuilderPage() {
  const handleSave = async (form: Form) => {
    // Save form to your backend
    const response = await fetch('/api/forms', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    return response.ok;
  };

  const handlePublish = async (form: Form) => {
    // Publish form logic
    return true;
  };

  return (
    <FormBuilderLayout
      onSave={handleSave}
      onPublish={handlePublish}
      enablePersistence={true}
      autoSaveInterval={30000}
    />
  );
}
```

### Quick Start with Initial Form

```typescript
import { FormBuilderLayout } from '@/components/form-builder';

const initialForm: Form = {
  id: 'sample-form',
  title: 'Contact Form',
  description: 'Get in touch with us',
  fields: [
    {
      id: 'name',
      type: 'shortText',
      label: 'Full Name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      required: true
    }
  ],
  theme: {
    primaryColor: '#3B82F6',
    fontFamily: 'Inter'
  },
  settings: {
    allowMultipleSubmissions: false,
    collectIPAddress: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

function FormBuilderPage() {
  return (
    <FormBuilderLayout
      initialForm={initialForm}
      onSave={handleSave}
    />
  );
}
```

---

## Core Components

### FormBuilderLayout

**Purpose**: Main container component that orchestrates the entire form builder experience.

**Props**:
```typescript
interface FormBuilderLayoutProps {
  initialForm?: Form;                    // Form to load initially
  formId?: string;                       // Form ID for loading
  onSave?: (form: Form) => Promise<boolean>;
  onPreview?: () => void;
  onPublish?: (form: Form) => Promise<boolean>;
  onError?: (error: string) => void;
  autoSaveInterval?: number;             // Auto-save interval (ms)
  enablePersistence?: boolean;           // Enable localStorage
  className?: string;
}
```

**Key Features**:
- **Multi-step navigation** (Build → Design → Integrate → Share)
- **Panel management** with collapsible sidebars
- **Auto-save integration** with visual indicators
- **Error handling** with user notifications
- **Responsive design** for all screen sizes

### LeftPanel

**Purpose**: Houses the field palette, templates, and form structure overview.

**Components**:
- **FieldPalette**: Drag-and-drop field types organized by category
- **FieldTemplates**: Pre-built form templates
- **Form Structure**: List of current form fields with reordering

**Features**:
- **16 field types** organized in 5 categories
- **Search functionality** for finding specific field types
- **Template library** with 6+ pre-built forms
- **Field management** (select, duplicate, delete)

### CenterPanel

**Purpose**: Main editing area with form canvas and preview modes.

**Modes**:
- **Edit Mode**: Visual form builder with drag-and-drop
- **Preview Mode**: Live form preview as end-users see it

**Features**:
- **Viewport simulation** (Desktop, Tablet, Mobile)
- **Real-time updates** as fields are modified
- **Empty state handling** for new forms
- **Canvas toolbar** for quick actions

### RightPanel

**Purpose**: Property editor for selected elements and global form settings.

**Tabs**:
- **Field Properties**: Edit selected field properties
- **Form Settings**: Global form configuration
- **Theme Customizer**: Visual appearance customization

**Features**:
- **Tabbed interface** for organized property editing
- **Real-time validation** of property values
- **Advanced theme controls** with live preview
- **Form behavior settings** (submissions, data collection, etc.)

---

## State Management

### BuilderProvider

**Purpose**: Centralized state management using React Context and useReducer.

```typescript
// Access state in any component
const {
  state,                    // Complete builder state
  addField,                 // Add field to form
  updateField,              // Update field properties
  updateForm,               // Update form properties
  deleteField,              // Remove field
  selectField,              // Select field for editing
  saveForm,                 // Save form
  undo,                     // Undo last action
  redo,                     // Redo last undone action
  hasUnsavedChanges,        // Check for unsaved changes
  fieldCount,               // Total field count
  selectedField             // Currently selected field
} = useBuilder();
```

### State Structure

```typescript
interface BuilderState {
  // Form data
  form: Form | null;
  originalForm: Form | null;        // For change detection
  
  // Selection state
  selectedFieldId: string | null;
  draggedFieldId: string | null;
  
  // UI state
  ui: {
    leftPanelCollapsed: boolean;
    rightPanelCollapsed: boolean;
    activePanelTab: 'field' | 'form' | 'theme';
    builderStep: 'build' | 'design' | 'integrate' | 'share';
    previewMode: boolean;
    viewportMode: 'desktop' | 'tablet' | 'mobile';
  };
  
  // Auto-save
  autoSave: {
    enabled: boolean;
    interval: number;
    lastSaved: number | null;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    error: string | null;
  };
  
  // History (Undo/Redo)
  history: {
    past: Form[];
    present: Form | null;
    future: Form[];
    maxSize: number;                  // Default: 50
  };
  
  // Loading states
  loading: {
    isLoading: boolean;
    isSaving: boolean;
    isPublishing: boolean;
    error: string | null;
    warnings: string[];
  };
}
```

### Auto-Save System

```typescript
// Auto-save configuration
const autoSaveConfig = {
  enabled: true,                      // Enable auto-save
  interval: 30000,                    // 30 seconds
  debounceDelay: 1000,               // 1 second debounce
  maxRetries: 3,                     // Retry failed saves
  backupToStorage: true              // localStorage backup
};

// Auto-save triggers
- Field addition/modification
- Form property changes
- After user inactivity (30s default)
- Before page unload
```

### Persistence System

```typescript
// Storage structure
interface StorageData {
  form: Form | null;
  uiPreferences: UIPreferences;
  selectedFieldId: string | null;
  lastSaved: number;
  version: string;
}

// Storage methods
const { 
  saveToStorage,     // Manual save to localStorage
  loadFromStorage,   // Load from localStorage
  clearStorage       // Clear all stored data
} = useBuilder();

// Automatic cleanup
- Remove data older than 24 hours
- Limit history to 50 actions
- Clean up on app unmount
```

---

## Field Types

### Text Fields

#### 1. ShortText
- **Purpose**: Single-line text input
- **Use Cases**: Names, titles, short answers
- **Properties**: placeholder, maxLength, minLength, pattern validation
- **Example**: Name, job title, product name

#### 2. LongText
- **Purpose**: Multi-line text area
- **Use Cases**: Comments, descriptions, detailed feedback
- **Properties**: placeholder, maxLength, minLength, auto-resize
- **Example**: Feedback, comments, detailed responses

#### 3. Email
- **Purpose**: Email address input with validation
- **Use Cases**: Contact forms, registration
- **Properties**: placeholder, domain validation
- **Validation**: RFC 5322 compliant email format

#### 4. Website
- **Purpose**: URL input with validation
- **Use Cases**: Portfolio links, company websites
- **Properties**: placeholder, protocol validation
- **Validation**: Valid URL format, auto-adds https://

#### 5. PhoneNumber
- **Purpose**: Phone number input with formatting
- **Use Cases**: Contact information
- **Properties**: placeholder, format validation
- **Validation**: International phone number formats

### Choice Fields

#### 6. MultipleChoice
- **Purpose**: Radio button selection (single choice)
- **Use Cases**: Yes/No questions, single option selection
- **Properties**: options array, default selection, layout (vertical/horizontal)
- **Features**: "Other" option with text input, keyboard navigation

#### 7. Dropdown
- **Purpose**: Select dropdown menu
- **Use Cases**: Long option lists, categorized choices
- **Properties**: options array, placeholder, default selection
- **Features**: Search functionality, keyboard navigation

#### 8. YesNo
- **Purpose**: Binary choice field
- **Use Cases**: Consent, agreement, binary decisions
- **Properties**: default selection, display style
- **Variants**: Toggle switch, radio buttons, buttons

#### 9. OpinionScale
- **Purpose**: 1-10 opinion rating
- **Use Cases**: Satisfaction surveys, NPS scores
- **Properties**: Fixed 1-10 scale
- **Features**: Visual scale with color gradients, hover effects

### Rating Fields

#### 10. NumberRating
- **Purpose**: Numeric rating scale
- **Use Cases**: Star ratings, satisfaction scores
- **Properties**: minRating, maxRating, display style
- **Variants**: Stars, numbers, visual scale

### Special Fields

#### 11. Statement
- **Purpose**: Display informational content
- **Use Cases**: Instructions, disclaimers, rich content
- **Properties**: HTML content, images, links, variants
- **Variants**: Default, highlighted, info box, warning box

#### 12. Legal
- **Purpose**: Terms acceptance with scrollable content
- **Use Cases**: Terms of service, privacy policy acceptance
- **Properties**: HTML content, scroll requirement, external links
- **Features**: Scroll-to-accept validation, audit trail

#### 13. FileUpload
- **Purpose**: File upload with validation
- **Use Cases**: Document submission, image uploads
- **Properties**: acceptedFileTypes, maxFileSize, multiple files
- **Features**: Drag & drop, progress tracking, preview

### Structure Fields

#### 14. PageBreak
- **Purpose**: Section separator for multi-step forms
- **Use Cases**: Form organization, logical grouping
- **Properties**: section title, description
- **Features**: Progress indication, navigation

#### 15. StartingPage
- **Purpose**: Welcome screen with form introduction
- **Use Cases**: Form branding, instructions, expectations
- **Properties**: title, description, estimated time, features
- **Features**: Participant count, feature highlights

#### 16. PostSubmission
- **Purpose**: Thank you screen after submission
- **Use Cases**: Confirmation, next steps, downloads
- **Properties**: title, description, custom actions
- **Features**: Download receipt, social sharing, redirects

---

## UI Components

### Floating Elements

#### FloatingAddQuestionToolbar
- **Purpose**: Quick access to add form fields
- **Location**: Bottom center of screen (fixed position)
- **Features**: Categorized field selection, field count display
- **Trigger**: Appears when editing form (not in preview mode)

#### CanvasToolbar
- **Purpose**: Quick actions for form editing
- **Location**: Bottom of canvas area
- **Actions**: Undo, Redo, Add Field, Preview, Save
- **Indicators**: Unsaved changes, auto-save status

### Navigation

#### Top Navigation Bar
- **Left**: Form title, field count, status badges
- **Center**: Step navigation (Build → Design → Integrate → Share)
- **Right**: Preview, Save, Publish actions

#### Panel Controls
- **Collapsible panels** with toggle buttons
- **Resizable panels** with drag handles
- **Tab navigation** within panels
- **Keyboard shortcuts** for common actions

### Visual Feedback

#### Status Indicators
- **Auto-save status**: Saving, Saved, Unsaved, Error
- **Field count**: Number of fields in form
- **Progress indicators**: Loading states, operation progress
- **Error states**: Validation errors, system errors

#### Interactive States
- **Hover effects**: Button hover, field hover
- **Selection states**: Selected fields, active panels
- **Drag states**: Dragging fields, drop zones
- **Loading states**: Saving, loading, processing

---

## API Reference

### Core Hooks

#### useBuilder()
```typescript
const {
  // State
  state: BuilderState,
  dispatch: React.Dispatch<BuilderAction>,
  
  // Computed values
  canUndo: boolean,
  canRedo: boolean,
  hasUnsavedChanges: boolean,
  selectedField: FormField | null,
  fieldCount: number,
  
  // Field operations
  addField: (field: FormField, index?: number) => void,
  addFieldByType: (type: string, index?: number) => void,
  updateField: (fieldId: string, updates: Partial<FormField>) => void,
  deleteField: (fieldId: string) => void,
  duplicateField: (fieldId: string, newIndex?: number) => void,
  selectField: (fieldId: string | null) => void,
  reorderFields: (fromIndex: number, toIndex: number) => void,
  
  // Form operations
  updateForm: (updates: Partial<Form>) => void,
  saveForm: () => Promise<boolean>,
  publishForm: () => Promise<boolean>,
  resetForm: () => void,
  
  // History operations
  undo: () => void,
  redo: () => void,
  
  // UI operations
  toggleLeftPanel: () => void,
  toggleRightPanel: () => void,
  setPanelTab: (tab: 'field' | 'form' | 'theme') => void,
  setBuilderStep: (step: 'build' | 'design' | 'integrate' | 'share') => void,
  
  // Storage operations
  saveToStorage: () => void,
  loadFromStorage: () => void,
  clearStorage: () => void
} = useBuilder();
```

### Field Templates

#### Creating Fields from Templates
```typescript
import { createFieldFromTemplate, getTemplateByType } from '@/components/form-builder/utils/field-templates';

// Get template for field type
const template = getTemplateByType('shortText');

// Create field from template
const field = createFieldFromTemplate(template, existingFields);

// Add to form
addField(field);
```

#### Available Templates
```typescript
// Text fields
'shortText', 'longText', 'email', 'website', 'phoneNumber'

// Choice fields
'multipleChoice', 'dropdown', 'yesNo', 'opinionScale'

// Rating fields
'numberRating'

// Special fields
'statement', 'legal', 'fileUpload'

// Structure fields
'pageBreak', 'startingPage', 'postSubmission'
```

### Form Templates

#### Using Pre-built Templates
```typescript
// Available templates
const templates = [
  'contact-form',           // Contact form (4 fields)
  'feedback-survey',        // Feedback survey (6 fields)
  'registration',           // Event registration (8 fields)
  'order-form',            // Product order (7 fields)
  'appointment-booking',    // Appointment booking (6 fields)
  'job-application'        // Job application (9 fields)
];

// Apply template
const template = formTemplates.find(t => t.id === 'contact-form');
template.fields.forEach(fieldConfig => {
  const field = createFieldFromTemplate(fieldTemplate, existingFields);
  addField(field);
});
```

---

## Configuration

### Form Configuration

```typescript
interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  fieldGroups?: FieldGroup[];          // Multi-step grouping
  theme: FormTheme;                    // Visual appearance
  customization: FormCustomization;    // Advanced styling
  layout: FormLayoutConfig;            // Layout options
  settings: FormSettings;              // Behavior settings
  createdAt: Date;
  updatedAt: Date;
}
```

### Theme Configuration

```typescript
interface FormTheme {
  // Basic colors
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  
  // Typography
  fontFamily: string;
  fontSize?: {
    title?: number;
    question?: number;
    input?: number;
    small?: number;
  };
  fontWeight?: {
    normal?: number;
    medium?: number;
    bold?: number;
  };
  
  // Layout
  borderRadius?: number;
  spacing?: number;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  
  // Styles
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  
  // Options
  showQuestionNumbers?: boolean;
  showProgressBar?: boolean;
  centerForm?: boolean;
  logoUrl?: string;
}
```

### Settings Configuration

```typescript
interface FormSettings {
  // Submission behavior
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  requireAllFields?: boolean;
  timeLimit?: number;                  // In minutes
  
  // Data collection
  collectIPAddress?: boolean;
  collectUserAgent?: boolean;
  gdprCompliant?: boolean;
  
  // Submit button
  submitButtonText?: string;
  showResetButton?: boolean;
  confirmBeforeSubmit?: boolean;
  
  // Redirects and messages
  redirectUrl?: string;
  customSubmissionMessage?: string;
  privacyNoticeText?: string;
  showPrivacyNotice?: boolean;
  
  // Advanced features
  enableSaveAndContinue?: boolean;
  shuffleQuestions?: boolean;
}
```

---

## Development Guide

### Adding New Field Types

#### 1. Define the Field Type
```typescript
// types/fields.ts
export type ExtendedFieldType = 
  | 'shortText'
  | 'customField'  // Add your new type
  | ...

export interface CustomFieldConfig {
  customProperty: string;
  customOptions: string[];
}
```

#### 2. Create Field Component
```typescript
// components/fields/CustomField.tsx
export const CustomField: React.FC<{
  field: FormField;
  questionNumber?: number;
}> = ({ field, questionNumber }) => {
  const { updateField } = useBuilder();
  
  return (
    <QuestionContainer field={field} questionNumber={questionNumber}>
      {/* Custom field implementation */}
    </QuestionContainer>
  );
};
```

#### 3. Create Field Editor
```typescript
// field-types/custom-fields/CustomFieldEditor.tsx
export const CustomFieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {/* Field configuration UI */}
    </div>
  );
};
```

#### 4. Add to Field Renderer
```typescript
// components/FieldRenderer.tsx
case 'customField':
  return <CustomField field={field} />;
```

#### 5. Add Template
```typescript
// utils/field-templates.ts
{
  id: 'custom-field',
  type: 'customField',
  label: 'Custom Field',
  description: 'Custom field description',
  icon: 'CustomIcon',
  category: 'special-fields',
  defaultField: {
    type: 'customField',
    label: 'Custom Field',
    customProperty: 'default value'
  }
}
```

### Extending the State System

#### Adding New State Properties
```typescript
// providers/types.ts
interface BuilderState {
  // ... existing properties
  customState: {
    customProperty: string;
    customArray: any[];
  };
}

// Add action types
type BuilderAction = 
  | { type: 'UPDATE_CUSTOM_STATE'; payload: Partial<CustomState> }
  | ...
```

#### Adding New Reducer Cases
```typescript
// providers/builderReducer.ts
case 'UPDATE_CUSTOM_STATE': {
  return {
    ...state,
    customState: {
      ...state.customState,
      ...action.payload
    }
  };
}
```

### Creating Custom Panels

#### Panel Component Structure
```typescript
// panels/custom-panel/CustomPanel.tsx
export const CustomPanel: React.FC<{
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ collapsed, onToggleCollapse }) => {
  const { state, customAction } = useBuilder();
  
  return (
    <div className="border-r bg-card flex flex-col h-full">
      {/* Panel header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">Custom Panel</h3>
      </div>
      
      {/* Panel content */}
      <ScrollArea className="flex-1">
        {/* Panel content */}
      </ScrollArea>
    </div>
  );
};
```

### Testing Components

#### Unit Testing
```typescript
// __tests__/components/FormBuilderLayout.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FormBuilderLayout } from '../FormBuilderLayout';

describe('FormBuilderLayout', () => {
  it('renders form builder interface', () => {
    render(<FormBuilderLayout />);
    
    expect(screen.getByText('Form Builder')).toBeInTheDocument();
    expect(screen.getByText('Add Question')).toBeInTheDocument();
  });
  
  it('handles field addition', async () => {
    render(<FormBuilderLayout />);
    
    fireEvent.click(screen.getByText('Add Question'));
    fireEvent.click(screen.getByText('Short Text'));
    
    await waitFor(() => {
      expect(screen.getByText('1 field')).toBeInTheDocument();
    });
  });
});
```

#### Integration Testing
```typescript
// __tests__/integration/formBuilder.integration.test.tsx
describe('Form Builder Integration', () => {
  it('creates a complete form', async () => {
    const { getByText, getByLabelText } = render(<FormBuilderLayout />);
    
    // Add fields
    fireEvent.click(getByText('Add Question'));
    fireEvent.click(getByText('Short Text'));
    
    // Configure field
    fireEvent.change(getByLabelText('Field Label'), {
      target: { value: 'Name' }
    });
    
    // Save form
    fireEvent.click(getByText('Save'));
    
    // Verify form structure
    await waitFor(() => {
      expect(mockSaveFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          fields: expect.arrayContaining([
            expect.objectContaining({
              label: 'Name',
              type: 'shortText'
            })
          ])
        })
      );
    });
  });
});
```

---

## Troubleshooting

### Common Issues

#### Floating Toolbar Not Visible

**Symptoms**: FloatingAddQuestionToolbar doesn't appear
**Causes**:
1. Not in "Build" step
2. Preview mode is active
3. No form loaded

**Solutions**:
```typescript
// Check current step
const { state: { ui: { builderStep, previewMode } } } = useBuilder();
console.log('Step:', builderStep, 'Preview:', previewMode);

// Force visibility for debugging
{/* Always show toolbar */}
<FloatingAddQuestionToolbar onFieldAdd={handleFieldAdd} />
```

#### State Not Updating

**Symptoms**: Changes not reflected in UI
**Causes**:
1. Not using useBuilder hook
2. Direct state mutation
3. Missing BuilderProvider

**Solutions**:
```typescript
// Correct way to update state
const { updateField } = useBuilder();
updateField('field-id', { label: 'New Label' });

// Check provider wrapping
<BuilderProvider>
  <YourComponent />
</BuilderProvider>
```

#### Auto-save Not Working

**Symptoms**: Changes not automatically saved
**Causes**:
1. Auto-save disabled
2. No onSave callback
3. Network issues

**Solutions**:
```typescript
// Check auto-save status
const { state: { autoSave } } = useBuilder();
console.log('Auto-save:', autoSave);

// Enable auto-save
<BuilderProvider
  autoSaveInterval={30000}
  onFormSave={handleSave}
>
```

#### Performance Issues

**Symptoms**: Slow rendering, lag in interactions
**Causes**:
1. Too many form fields
2. Complex animations
3. Memory leaks

**Solutions**:
```typescript
// Use React.memo for expensive components
const MemoizedFieldRenderer = React.memo(FieldRenderer);

// Reduce animation complexity
const { state: { ui: { previewMode } } } = useBuilder();
if (previewMode) {
  // Disable heavy animations
}

// Monitor memory usage
console.log('Storage usage:', getStorageUsage());
```

### Debug Mode

#### Enable Debug Logging
```typescript
// Add to BuilderProvider
<BuilderProvider
  initialConfig={{
    debug: {
      enabled: process.env.NODE_ENV === 'development',
      logUpdates: true,
      trackPerformance: true
    }
  }}
>
```

#### Performance Monitoring
```typescript
// Monitor state updates
const { state } = useBuilder();
useEffect(() => {
  console.log('State updated:', state);
}, [state]);

// Track render performance
const renderStart = performance.now();
// ... component render
const renderEnd = performance.now();
console.log('Render time:', renderEnd - renderStart);
```

---

## Performance

### Optimization Strategies

#### State Management
- **Selective updates**: Only update changed properties
- **Debounced saves**: Prevent excessive save operations
- **Memory cleanup**: Clear unused references
- **History limiting**: Limit undo/redo history size

#### Rendering Performance
- **React.memo**: Memoize expensive components
- **useMemo/useCallback**: Cache expensive calculations
- **Virtual scrolling**: For large field lists
- **Lazy loading**: Load field editors on demand

#### Bundle Optimization
- **Code splitting**: Split field editors into separate chunks
- **Tree shaking**: Remove unused code
- **Compression**: Gzip/Brotli compression
- **Caching**: Aggressive caching strategies

### Performance Metrics

#### Target Metrics
- **Initial load**: < 2 seconds
- **Field addition**: < 100ms
- **Auto-save**: < 500ms
- **Undo/Redo**: < 50ms
- **Memory usage**: < 50MB for 100-field form

#### Monitoring
```typescript
// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fieldCount: 0
  });
  
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      // Track performance entries
    });
    
    observer.observe({ entryTypes: ['measure'] });
    return () => observer.disconnect();
  }, []);
  
  return metrics;
};
```

### Browser Compatibility

#### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

#### Feature Detection
```typescript
// Check for required features
const browserSupport = {
  localStorage: typeof Storage !== 'undefined',
  customProperties: CSS.supports('color', 'var(--test)'),
  flexbox: CSS.supports('display', 'flex'),
  grid: CSS.supports('display', 'grid')
};

// Provide fallbacks
if (!browserSupport.localStorage) {
  // Use memory storage fallback
}
```

---

---

## Advanced Features

### Drag & Drop System

#### Implementation Status
- **Structure**: Complete drag & drop types and utilities
- **Components**: Ready for @hello-pangea/dnd integration
- **Drop Zones**: Defined in FormCanvas and FieldPalette

#### Adding Drag & Drop
```typescript
// Install dependency
npm install @hello-pangea/dnd

// Wrap components with DragDropContext
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FormCanvas = () => {
  const { reorderFields } = useBuilder();
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    reorderFields(result.source.index, result.destination.index);
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="form-fields">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <FieldPreview field={field} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
```

### Conditional Logic

#### Field Dependencies
```typescript
// Field with conditional logic
const conditionalField: FormField = {
  id: 'follow-up',
  type: 'longText',
  label: 'Please explain',
  conditionalLogic: {
    showWhen: [
      {
        fieldId: 'satisfaction',
        operator: 'lessThan',
        value: 3
      }
    ]
  }
};

// Conditional logic evaluation
const evaluateConditions = (field: FormField, formData: Record<string, any>) => {
  if (!field.conditionalLogic?.showWhen) return true;
  
  return field.conditionalLogic.showWhen.every(condition => {
    const fieldValue = formData[condition.fieldId];
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'lessThan':
        return fieldValue < condition.value;
      case 'greaterThan':
        return fieldValue > condition.value;
      case 'contains':
        return fieldValue?.includes(condition.value);
      default:
        return true;
    }
  });
};
```

### Multi-Step Forms

#### Step Configuration
```typescript
interface FieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  showProgressBar?: boolean;
  allowBackNavigation?: boolean;
  validationRules?: {
    requireAllFields?: boolean;
    customValidation?: (data: any) => string | null;
  };
}

// Multi-step form example
const multiStepForm: Form = {
  id: 'survey',
  title: 'Customer Survey',
  fieldGroups: [
    {
      id: 'demographics',
      title: 'About You',
      description: 'Basic information',
      fields: [
        { id: 'name', type: 'shortText', label: 'Name', required: true },
        { id: 'age', type: 'dropdown', label: 'Age Range', options: ['18-25', '26-35', '36-45', '45+'] }
      ]
    },
    {
      id: 'feedback',
      title: 'Your Feedback',
      description: 'Tell us about your experience',
      fields: [
        { id: 'rating', type: 'numberRating', label: 'Overall Rating', minRating: 1, maxRating: 5 },
        { id: 'comments', type: 'longText', label: 'Comments', required: false }
      ]
    }
  ]
};
```

### Analytics Integration

#### Form Analytics
```typescript
// Analytics tracking
const useFormAnalytics = () => {
  const { state } = useBuilder();
  
  useEffect(() => {
    // Track form builder usage
    analytics.track('form_builder_opened', {
      formId: state.form?.id,
      fieldCount: state.form?.fields.length,
      builderStep: state.ui.builderStep
    });
  }, [state.ui.builderStep]);
  
  const trackFieldAction = (action: string, fieldType: string) => {
    analytics.track('field_action', {
      action,
      fieldType,
      formId: state.form?.id,
      totalFields: state.form?.fields.length
    });
  };
  
  return { trackFieldAction };
};

// Usage in components
const { trackFieldAction } = useFormAnalytics();

const handleAddField = (fieldType: string) => {
  trackFieldAction('add', fieldType);
  addFieldByType(fieldType);
};
```

### Export/Import System

#### Form Export
```typescript
// Export form as JSON
const exportForm = (form: Form) => {
  const exportData = {
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    form: {
      ...form,
      // Remove runtime properties
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined
    }
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${form.title.replace(/\s+/g, '-').toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import form from JSON
const importForm = async (file: File): Promise<Form> => {
  const text = await file.text();
  const importData = JSON.parse(text);
  
  // Validate import data
  if (importData.version !== '2.0.0') {
    throw new Error('Unsupported form version');
  }
  
  // Generate new IDs
  const form = {
    ...importData.form,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    fields: importData.form.fields.map(field => ({
      ...field,
      id: generateFieldId(field.type, [])
    }))
  };
  
  return form;
};
```

### Keyboard Shortcuts

#### Shortcut Implementation
```typescript
// Keyboard shortcuts hook
const useKeyboardShortcuts = () => {
  const { 
    addFieldByType, 
    undo, 
    redo, 
    saveForm, 
    selectField,
    state 
  } = useBuilder();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 's':
            e.preventDefault();
            saveForm();
            break;
          case 'n':
            e.preventDefault();
            addFieldByType('shortText');
            break;
          case 'Escape':
            e.preventDefault();
            selectField(null);
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addFieldByType, undo, redo, saveForm, selectField]);
};

// Keyboard shortcut reference
const shortcuts = {
  'Ctrl+Z': 'Undo',
  'Ctrl+Shift+Z': 'Redo',
  'Ctrl+S': 'Save',
  'Ctrl+N': 'Add Text Field',
  'Escape': 'Deselect Field',
  'Delete': 'Delete Selected Field',
  'Tab': 'Navigate Fields',
  'Enter': 'Edit Selected Field'
};
```

---

## API Integration

### Backend Integration

#### Form CRUD Operations
```typescript
// API service for form operations
class FormBuilderAPI {
  static async saveForm(form: Form): Promise<boolean> {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save form:', error);
      return false;
    }
  }
  
  static async loadForm(formId: string): Promise<Form | null> {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load form:', error);
      return null;
    }
  }
  
  static async publishForm(form: Form): Promise<boolean> {
    try {
      const response = await fetch(`/api/forms/${form.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to publish form:', error);
      return false;
    }
  }
}

// Usage with FormBuilder
<FormBuilderLayout
  formId="existing-form-id"
  onSave={FormBuilderAPI.saveForm}
  onPublish={FormBuilderAPI.publishForm}
  onLoad={FormBuilderAPI.loadForm}
/>
```

#### Real-time Collaboration
```typescript
// WebSocket integration for real-time updates
class CollaborationManager {
  private ws: WebSocket;
  private formId: string;
  
  constructor(formId: string) {
    this.formId = formId;
    this.ws = new WebSocket(`ws://localhost:3000/collaborate/${formId}`);
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.ws.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      
      switch (type) {
        case 'field_updated':
          // Apply remote field update
          break;
        case 'user_joined':
          // Show user joined notification
          break;
        case 'cursor_moved':
          // Show remote user cursor
          break;
      }
    };
  }
  
  sendUpdate(type: string, payload: any) {
    this.ws.send(JSON.stringify({ type, payload }));
  }
}

// Integration with form builder
const collaboration = new CollaborationManager(formId);

const handleFieldUpdate = (fieldId: string, updates: any) => {
  updateField(fieldId, updates);
  collaboration.sendUpdate('field_updated', { fieldId, updates });
};
```

### Data Validation

#### Server-side Validation
```typescript
// Validation schemas for API
import { z } from 'zod';

const FormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['shortText', 'longText', 'email', /* ... */]),
  label: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
  // ... field-specific properties
});

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    fontFamily: z.string(),
    // ... theme properties
  }),
  settings: z.object({
    allowMultipleSubmissions: z.boolean().optional(),
    collectIPAddress: z.boolean().optional(),
    // ... settings properties
  })
});

// API endpoint with validation
app.post('/api/forms', async (req, res) => {
  try {
    const form = FormSchema.parse(req.body);
    const savedForm = await saveFormToDatabase(form);
    res.json(savedForm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

---

## Deployment

### Production Build

#### Optimization Configuration
```typescript
// next.config.js
const nextConfig = {
  // Bundle optimization
  experimental: {
    esmExternals: true,
  },
  
  // Image optimization
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Split form builder into separate chunk
      config.optimization.splitChunks.cacheGroups.formBuilder = {
        name: 'form-builder',
        test: /[\\/]components[\\/]form-builder[\\/]/,
        chunks: 'all',
        enforce: true,
      };
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    FORM_BUILDER_VERSION: '2.0.0',
    ENABLE_DEBUG: process.env.NODE_ENV === 'development',
  },
};
```

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

#### Development Environment
```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_AUTO_SAVE_INTERVAL=10000
NEXT_PUBLIC_STORAGE_CLEANUP_INTERVAL=300000
```

#### Production Environment
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_AUTO_SAVE_INTERVAL=30000
NEXT_PUBLIC_STORAGE_CLEANUP_INTERVAL=3600000
NEXT_PUBLIC_CDN_URL=https://cdn.yourapp.com
```

### Performance Monitoring

#### Analytics Integration
```typescript
// Performance monitoring
class PerformanceMonitor {
  static init() {
    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.logMetric);
      getFID(this.logMetric);
      getFCP(this.logMetric);
      getLCP(this.logMetric);
      getTTFB(this.logMetric);
    });
  }
  
  static logMetric(metric: any) {
    // Send to analytics service
    analytics.track('web_vital', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  }
  
  static trackFormBuilderMetrics(state: BuilderState) {
    const metrics = {
      fieldCount: state.form?.fields.length || 0,
      autoSaveEnabled: state.autoSave.enabled,
      hasUnsavedChanges: state.autoSave.hasUnsavedChanges,
      builderStep: state.ui.builderStep,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    };
    
    analytics.track('form_builder_metrics', metrics);
  }
}

// Initialize in app
useEffect(() => {
  PerformanceMonitor.init();
}, []);
```

---

## Security Considerations

### Input Sanitization

#### XSS Prevention
```typescript
import DOMPurify from 'dompurify';

// Sanitize HTML content in statement fields
const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOWED_URI_REGEXP: /^https?:\/\/|^mailto:|^tel:/,
  });
};

// Use in components
<div 
  dangerouslySetInnerHTML={{ 
    __html: sanitizeHTML(field.description) 
  }} 
/>
```

#### CSRF Protection
```typescript
// CSRF token implementation
const getCSRFToken = (): string => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

// Include in API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = getCSRFToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
      ...options.headers,
    },
  });
};
```

### Data Privacy

#### GDPR Compliance
```typescript
// Privacy-aware form settings
interface PrivacySettings {
  collectPersonalData: boolean;
  dataRetentionDays: number;
  allowDataExport: boolean;
  allowDataDeletion: boolean;
  consentRequired: boolean;
  privacyPolicyUrl: string;
}

// Privacy-compliant form builder
const PrivacyAwareFormBuilder = () => {
  const { updateForm } = useBuilder();
  
  const handlePrivacySettingChange = (setting: keyof PrivacySettings, value: any) => {
    updateForm({
      privacySettings: {
        ...form.privacySettings,
        [setting]: value
      }
    });
  };
  
  return (
    <FormBuilderLayout
      onSave={async (form) => {
        // Validate privacy compliance before saving
        if (form.privacySettings?.collectPersonalData && !form.privacySettings?.consentRequired) {
          throw new Error('Consent is required when collecting personal data');
        }
        
        return await saveForm(form);
      }}
    />
  );
};
```

---

## Conclusion

The Form Builder v2.0 provides a comprehensive, production-ready solution for creating complex forms with modern web technologies. Its architecture supports extensibility, performance, and maintainability while providing an exceptional user experience.

### Key Achievements

✅ **Complete Feature Set**: 16 field types, advanced theming, multi-step forms  
✅ **Production Ready**: Auto-save, error handling, performance optimization  
✅ **Developer Friendly**: TypeScript, comprehensive documentation, testing  
✅ **User Focused**: Intuitive interface, accessibility, responsive design  
✅ **Extensible**: Plugin architecture, custom field types, API integration  

### Future Roadmap

🔄 **Phase 3**: Drag & drop implementation, conditional logic, real-time collaboration  
🔄 **Phase 4**: Advanced analytics, A/B testing, form templates marketplace  
🔄 **Phase 5**: Mobile app, offline support, AI-powered form optimization  

### Getting Support

- **Documentation**: Comprehensive guides and API reference
- **Examples**: Live demos and code samples
- **Community**: GitHub discussions and issue tracking
- **Professional**: Enterprise support and custom development

The Form Builder is ready for production use and continued development. Its solid foundation enables rapid feature development while maintaining code quality and performance standards.

---

**Version**: 2.0.0  
**Last Updated**: December 2024  
**License**: MIT  
**Maintainer**: Forms Team  
**Repository**: [GitHub Repository URL]  
**Demo**: [Live Demo URL]  
**Documentation**: [Documentation Site URL]