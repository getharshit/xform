// src/components/form-builder/providers/builderReducer.ts

import { Form, FormField } from '@/types/form'
import { BuilderState, BuilderAction, defaultHistoryState } from './types'
import { generateFieldId } from '../utils/field-templates'

// Helper function to update history
const updateHistory = (
  state: BuilderState, 
  newForm: Form | null, 
  saveToHistory: boolean = true
): BuilderState['history'] => {
  if (!saveToHistory || !newForm) return state.history

  const { past, present, future, maxSize } = state.history

  // If present is null, just set it
  if (!present) {
    return {
      ...state.history,
      present: newForm
    }
  }

  // If the form hasn't actually changed, don't save to history
  if (JSON.stringify(present) === JSON.stringify(newForm)) {
    return state.history
  }

  // Add current state to past and set new present
  const newPast = [...past, present]
  
  // Limit history size
  if (newPast.length > maxSize) {
    newPast.splice(0, newPast.length - maxSize)
  }

  return {
    past: newPast,
    present: newForm,
    future: [], // Clear future when new action is performed
    maxSize
  }
}

// Helper function to check if form has unsaved changes
const hasUnsavedChanges = (current: Form | null, original: Form | null): boolean => {
  if (!current && !original) return false
  if (!current || !original) return true
  
  // Compare relevant fields (exclude timestamps)
  const { updatedAt: currentUpdated, ...currentRest } = current
  const { updatedAt: originalUpdated, ...originalRest } = original
  
  return JSON.stringify(currentRest) !== JSON.stringify(originalRest)
}

export const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    // Form actions
    case 'SET_FORM': {
      const { form, saveToHistory = true } = action.payload
      const history = updateHistory(state, form, saveToHistory)
      
      return {
        ...state,
        form,
        originalForm: form,
        history,
        formId: form?.id || null,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(form, state.originalForm)
        }
      }
    }

    case 'UPDATE_FORM': {
      if (!state.form) return state
      
      const { updates, saveToHistory = true } = action.payload
      const updatedForm = {
        ...state.form,
        ...updates,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm, saveToHistory)
      
      return {
        ...state,
        form: updatedForm,
        history,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    case 'RESET_FORM': {
      return {
        ...state,
        form: null,
        originalForm: null,
        selectedFieldId: null,
        draggedFieldId: null,
        history: defaultHistoryState,
        formId: null,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: false
        }
      }
    }

    // Field actions
    case 'ADD_FIELD': {
      if (!state.form) return state
      
      const { field, index } = action.payload
      const fields = [...state.form.fields]
      
      // Ensure unique field ID
      const fieldWithUniqueId = {
        ...field,
        id: field.id || generateFieldId(field.type, fields)
      }
      
      const insertIndex = index !== undefined ? index : fields.length
      fields.splice(insertIndex, 0, fieldWithUniqueId)
      
      const updatedForm = {
        ...state.form,
        fields,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm)
      
      return {
        ...state,
        form: updatedForm,
        history,
        selectedFieldId: fieldWithUniqueId.id,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    case 'UPDATE_FIELD': {
      if (!state.form) return state
      
      const { fieldId, updates } = action.payload
      const fields = state.form.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
      
      const updatedForm = {
        ...state.form,
        fields,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm)
      
      return {
        ...state,
        form: updatedForm,
        history,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    case 'DELETE_FIELD': {
      if (!state.form) return state
      
      const { fieldId } = action.payload
      const fields = state.form.fields.filter(field => field.id !== fieldId)
      
      const updatedForm = {
        ...state.form,
        fields,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm)
      
      return {
        ...state,
        form: updatedForm,
        history,
        selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    case 'REORDER_FIELDS': {
      if (!state.form) return state
      
      const { fromIndex, toIndex } = action.payload
      const fields = [...state.form.fields]
      const [movedField] = fields.splice(fromIndex, 1)
      fields.splice(toIndex, 0, movedField)
      
      const updatedForm = {
        ...state.form,
        fields,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm)
      
      return {
        ...state,
        form: updatedForm,
        history,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    case 'DUPLICATE_FIELD': {
      if (!state.form) return state
      
      const { fieldId, newIndex } = action.payload
      const field = state.form.fields.find(f => f.id === fieldId)
      if (!field) return state
      
      const fields = [...state.form.fields]
      const duplicatedField = {
        ...field,
        id: generateFieldId(field.type, fields),
        label: `${field.label} (Copy)`
      }
      
      const insertIndex = newIndex !== undefined ? newIndex : fields.length
      fields.splice(insertIndex, 0, duplicatedField)
      
      const updatedForm = {
        ...state.form,
        fields,
        updatedAt: new Date()
      }
      
      const history = updateHistory(state, updatedForm)
      
      return {
        ...state,
        form: updatedForm,
        history,
        selectedFieldId: duplicatedField.id,
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(updatedForm, state.originalForm)
        }
      }
    }

    // Selection actions
    case 'SELECT_FIELD': {
      return {
        ...state,
        selectedFieldId: action.payload.fieldId,
        ui: {
          ...state.ui,
          activePanelTab: action.payload.fieldId ? 'field' : state.ui.activePanelTab
        }
      }
    }

    case 'SET_DRAGGED_FIELD': {
      return {
        ...state,
        draggedFieldId: action.payload.fieldId
      }
    }

    // UI actions
    case 'UPDATE_UI_PREFERENCES': {
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      }
    }

    case 'TOGGLE_LEFT_PANEL': {
      return {
        ...state,
        ui: {
          ...state.ui,
          leftPanelCollapsed: !state.ui.leftPanelCollapsed
        }
      }
    }

    case 'TOGGLE_RIGHT_PANEL': {
      return {
        ...state,
        ui: {
          ...state.ui,
          rightPanelCollapsed: !state.ui.rightPanelCollapsed
        }
      }
    }

    case 'SET_PANEL_TAB': {
      return {
        ...state,
        ui: {
          ...state.ui,
          activePanelTab: action.payload.tab
        }
      }
    }

    case 'SET_BUILDER_STEP': {
      return {
        ...state,
        ui: {
          ...state.ui,
          builderStep: action.payload.step
        }
      }
    }

    case 'SET_PREVIEW_MODE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          previewMode: action.payload.enabled
        },
        selectedFieldId: action.payload.enabled ? null : state.selectedFieldId
      }
    }

    case 'SET_VIEWPORT_MODE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          viewportMode: action.payload.mode
        }
      }
    }

    case 'SET_PANEL_WIDTH': {
      const { panel, width } = action.payload
      return {
        ...state,
        ui: {
          ...state.ui,
          [panel === 'left' ? 'leftPanelWidth' : 'rightPanelWidth']: width
        }
      }
    }

    // Auto-save actions
    case 'ENABLE_AUTO_SAVE': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          enabled: true,
          interval: action.payload?.interval || state.autoSave.interval
        }
      }
    }

    case 'DISABLE_AUTO_SAVE': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          enabled: false
        }
      }
    }

    case 'SET_AUTO_SAVE_INTERVAL': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          interval: action.payload.interval
        }
      }
    }

    case 'START_AUTO_SAVE': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          isSaving: true,
          error: null
        }
      }
    }

    case 'COMPLETE_AUTO_SAVE': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          isSaving: false,
          lastSaved: action.payload.timestamp,
          hasUnsavedChanges: false,
          error: null
        }
      }
    }

    case 'AUTO_SAVE_ERROR': {
      return {
        ...state,
        autoSave: {
          ...state.autoSave,
          isSaving: false,
          error: action.payload.error
        }
      }
    }

    // History actions
    case 'UNDO': {
      const { past, present, future } = state.history
      if (past.length === 0) return state
      
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      const newFuture = present ? [present, ...future] : future
      
      return {
        ...state,
        form: previous,
        history: {
          ...state.history,
          past: newPast,
          present: previous,
          future: newFuture
        },
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(previous, state.originalForm)
        }
      }
    }

    case 'REDO': {
      const { past, present, future } = state.history
      if (future.length === 0) return state
      
      const next = future[0]
      const newFuture = future.slice(1)
      const newPast = present ? [...past, present] : past
      
      return {
        ...state,
        form: next,
        history: {
          ...state.history,
          past: newPast,
          present: next,
          future: newFuture
        },
        lastModified: Date.now(),
        autoSave: {
          ...state.autoSave,
          hasUnsavedChanges: hasUnsavedChanges(next, state.originalForm)
        }
      }
    }

    case 'CLEAR_HISTORY': {
      return {
        ...state,
        history: {
          ...defaultHistoryState,
          present: state.form
        }
      }
    }

    case 'SET_HISTORY_MAX_SIZE': {
      const { maxSize } = action.payload
      const { past } = state.history
      
      // Truncate past if it exceeds new max size
      const truncatedPast = past.length > maxSize 
        ? past.slice(past.length - maxSize) 
        : past
      
      return {
        ...state,
        history: {
          ...state.history,
          past: truncatedPast,
          maxSize
        }
      }
    }

    // Loading actions
    case 'SET_LOADING': {
      return {
        ...state,
        loading: {
          ...state.loading,
          isLoading: action.payload.isLoading
        }
      }
    }

    case 'SET_SAVING': {
      return {
        ...state,
        loading: {
          ...state.loading,
          isSaving: action.payload.isSaving
        }
      }
    }

    case 'SET_PUBLISHING': {
      return {
        ...state,
        loading: {
          ...state.loading,
          isPublishing: action.payload.isPublishing
        }
      }
    }

    case 'SET_ERROR': {
      return {
        ...state,
        loading: {
          ...state.loading,
          error: action.payload.error
        }
      }
    }

    case 'ADD_WARNING': {
      return {
        ...state,
        loading: {
          ...state.loading,
          warnings: [...state.loading.warnings, action.payload.warning]
        }
      }
    }

    case 'CLEAR_WARNINGS': {
      return {
        ...state,
        loading: {
          ...state.loading,
          warnings: []
        }
      }
    }

    // Storage actions
    case 'LOAD_FROM_STORAGE': {
      const { data } = action.payload
      return {
        ...state,
        ...data,
        lastModified: Date.now()
      }
    }

    case 'SAVE_TO_STORAGE': {
      // This action doesn't change state, it's handled by the provider
      return state
    }

    case 'CLEAR_STORAGE': {
      // This action doesn't change state, it's handled by the provider
      return state
    }

    default:
      return state
  }
}