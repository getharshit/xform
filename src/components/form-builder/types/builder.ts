// src/components/form-builder/types/builder.ts

import { FormField, Form } from '@/types'

// Main builder state
export interface FormBuilderState {
  // Form data
  form: Form | null
  
  // UI state
  selectedFieldId: string | null
  draggedFieldId: string | null
  isPreviewMode: boolean
  isDirty: boolean
  
  // Panel states
  leftPanelCollapsed: boolean
  rightPanelCollapsed: boolean
  activePanelTab: 'field' | 'form' | 'theme'
  
  // Builder modes
  builderStep: 'build' | 'design' | 'integrate' | 'share'
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  isPublishing: boolean
  
  // Error handling
  errors: string[]
  warnings: string[]
  
  // History for undo/redo
  history: Form[]
  historyIndex: number
  maxHistorySize: number
}

// Builder actions
export type FormBuilderAction = 
  | { type: 'SET_FORM'; payload: Form }
  | { type: 'UPDATE_FORM'; payload: Partial<Form> }
  | { type: 'ADD_FIELD'; payload: { field: FormField; index?: number } }
  | { type: 'UPDATE_FIELD'; payload: { fieldId: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_BUILDER_STEP'; payload: FormBuilderState['builderStep'] }
  | { type: 'SET_PANEL_TAB'; payload: FormBuilderState['activePanelTab'] }
  | { type: 'TOGGLE_LEFT_PANEL' }
  | { type: 'TOGGLE_RIGHT_PANEL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' }

// Field template for palette
export interface FieldTemplate {
  id: string
  type: FormField['type']
  label: string
  description: string
  icon: string
  category: FieldCategory
  isNew?: boolean
  isPro?: boolean
  defaultField: Partial<FormField>
}

// Field categories
export type FieldCategory = 
  | 'text-fields' 
  | 'choice-fields' 
  | 'rating-fields' 
  | 'special-fields' 
  | 'structure-fields'

// Panel size configuration
export interface PanelSizes {
  leftPanel: number
  centerPanel: number
  rightPanel: number
}

// Builder configuration
export interface FormBuilderConfig {
  // Feature flags
  enableAdvancedFields: boolean
  enableThemeCustomization: boolean
  enableConditionalLogic: boolean
  enableIntegrations: boolean
  
  // UI preferences
  defaultPanelSizes: PanelSizes
  showFieldTooltips: boolean
  autoSave: boolean
  autoSaveInterval: number
  
  // Validation
  maxFields: number
  maxFieldNameLength: number
  
  // Performance
  enableVirtualization: boolean
  maxUndoHistory: number
}

// Context value type
export interface FormBuilderContextValue {
  state: FormBuilderState
  dispatch: React.Dispatch<FormBuilderAction>
  config: FormBuilderConfig
  
  // Computed values
  canUndo: boolean
  canRedo: boolean
  hasUnsavedChanges: boolean
  selectedField: FormField | null
  
  // Helper functions
  addField: (field: FormField, index?: number) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  deleteField: (fieldId: string) => void
  selectField: (fieldId: string | null) => void
  saveForm: () => Promise<void>
  publishForm: () => Promise<void>
}