// src/components/form-builder/providers/types.ts

import { Form, FormField } from '@/types/form'

// UI Preferences
export interface UIPreferences {
  leftPanelCollapsed: boolean
  rightPanelCollapsed: boolean
  leftPanelWidth: number
  rightPanelWidth: number
  activePanelTab: 'field' | 'form' | 'theme'
  builderStep: 'build' | 'design' | 'integrate' | 'share'
  previewMode: boolean
  viewportMode: 'desktop' | 'tablet' | 'mobile'
}

// Auto-save state
export interface AutoSaveState {
  enabled: boolean
  interval: number // milliseconds
  lastSaved: number | null
  isSaving: boolean
  hasUnsavedChanges: boolean
  error: string | null
}

// History state for undo/redo
export interface HistoryState {
  past: Form[]
  present: Form | null
  future: Form[]
  maxSize: number
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean
  isSaving: boolean
  isPublishing: boolean
  error: string | null
  warnings: string[]
}

// Main builder state
export interface BuilderState {
  // Form data
  form: Form | null
  originalForm: Form | null // For comparison to detect changes
  
  // Selection state
  selectedFieldId: string | null
  draggedFieldId: string | null
  
  // UI state
  ui: UIPreferences
  
  // Auto-save
  autoSave: AutoSaveState
  
  // History
  history: HistoryState
  
  // Loading and errors
  loading: LoadingState
  
  // Metadata
  formId: string | null
  lastModified: number
  version: string
}

// Action types
export type BuilderAction =
  // Form actions
  | { type: 'SET_FORM'; payload: { form: Form; saveToHistory?: boolean } }
  | { type: 'UPDATE_FORM'; payload: { updates: Partial<Form>; saveToHistory?: boolean } }
  | { type: 'RESET_FORM' }
  
  // Field actions
  | { type: 'ADD_FIELD'; payload: { field: FormField; index?: number } }
  | { type: 'UPDATE_FIELD'; payload: { fieldId: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: { fieldId: string } }
  | { type: 'REORDER_FIELDS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'DUPLICATE_FIELD'; payload: { fieldId: string; newIndex?: number } }
  
  // Selection actions
  | { type: 'SELECT_FIELD'; payload: { fieldId: string | null } }
  | { type: 'SET_DRAGGED_FIELD'; payload: { fieldId: string | null } }
  
  // UI actions
  | { type: 'UPDATE_UI_PREFERENCES'; payload: Partial<UIPreferences> }
  | { type: 'TOGGLE_LEFT_PANEL' }
  | { type: 'TOGGLE_RIGHT_PANEL' }
  | { type: 'SET_PANEL_TAB'; payload: { tab: UIPreferences['activePanelTab'] } }
  | { type: 'SET_BUILDER_STEP'; payload: { step: UIPreferences['builderStep'] } }
  | { type: 'SET_PREVIEW_MODE'; payload: { enabled: boolean } }
  | { type: 'SET_VIEWPORT_MODE'; payload: { mode: UIPreferences['viewportMode'] } }
  | { type: 'SET_PANEL_WIDTH'; payload: { panel: 'left' | 'right'; width: number } }
  
  // Auto-save actions
  | { type: 'ENABLE_AUTO_SAVE'; payload?: { interval?: number } }
  | { type: 'DISABLE_AUTO_SAVE' }
  | { type: 'SET_AUTO_SAVE_INTERVAL'; payload: { interval: number } }
  | { type: 'START_AUTO_SAVE' }
  | { type: 'COMPLETE_AUTO_SAVE'; payload: { timestamp: number } }
  | { type: 'AUTO_SAVE_ERROR'; payload: { error: string } }
  
  // History actions
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_HISTORY_MAX_SIZE'; payload: { maxSize: number } }
  
  // Loading actions
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'SET_SAVING'; payload: { isSaving: boolean } }
  | { type: 'SET_PUBLISHING'; payload: { isPublishing: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'ADD_WARNING'; payload: { warning: string } }
  | { type: 'CLEAR_WARNINGS' }
  
  // Storage actions
  | { type: 'LOAD_FROM_STORAGE'; payload: { data: Partial<BuilderState> } }
  | { type: 'SAVE_TO_STORAGE' }
  | { type: 'CLEAR_STORAGE' }

// Context value interface
export interface BuilderContextValue {
  state: BuilderState
  dispatch: React.Dispatch<BuilderAction>
  
  // Computed values
  canUndo: boolean
  canRedo: boolean
  hasUnsavedChanges: boolean
  selectedField: FormField | null
  fieldCount: number
  
  // Helper functions
  addField: (field: FormField, index?: number) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  updateForm: (updates: Partial<Form>) => void
  deleteField: (fieldId: string) => void
  duplicateField: (fieldId: string, newIndex?: number) => void
  selectField: (fieldId: string | null) => void
  reorderFields: (fromIndex: number, toIndex: number) => void
  
  // Form operations
  saveForm: () => Promise<boolean>
  publishForm: () => Promise<boolean>
  resetForm: () => void
  
  // History operations
  undo: () => void
  redo: () => void
  
  // UI operations
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setPanelTab: (tab: UIPreferences['activePanelTab']) => void
  setBuilderStep: (step: UIPreferences['builderStep']) => void
  
  // Storage operations
  saveToStorage: () => void
  loadFromStorage: () => void
  clearStorage: () => void
}

// Default states
export const defaultUIPreferences: UIPreferences = {
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  leftPanelWidth: 25,
  rightPanelWidth: 15,
  activePanelTab: 'field',
  builderStep: 'build',
  previewMode: false,
  viewportMode: 'desktop'
}

export const defaultAutoSaveState: AutoSaveState = {
  enabled: true,
  interval: 30000, // 30 seconds
  lastSaved: null,
  isSaving: false,
  hasUnsavedChanges: false,
  error: null
}

export const defaultHistoryState: HistoryState = {
  past: [],
  present: null,
  future: [],
  maxSize: 50
}

export const defaultLoadingState: LoadingState = {
  isLoading: false,
  isSaving: false,
  isPublishing: false,
  error: null,
  warnings: []
}

export const initialBuilderState: BuilderState = {
  form: null,
  originalForm: null,
  selectedFieldId: null,
  draggedFieldId: null,
  ui: defaultUIPreferences,
  autoSave: defaultAutoSaveState,
  history: defaultHistoryState,
  loading: defaultLoadingState,
  formId: null,
  lastModified: Date.now(),
  version: '2.0.0'
}