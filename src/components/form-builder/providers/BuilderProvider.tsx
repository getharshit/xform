// src/components/form-builder/providers/BuilderProvider.tsx

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Form, FormField } from "@/types/form";
import {
  BuilderState,
  BuilderAction,
  BuilderContextValue,
  initialBuilderState,
  UIPreferences,
} from "./types";
import { builderReducer } from "./builderReducer";
import { storage } from "../utils/storage";
import {
  createFieldFromTemplate,
  getTemplateByType,
} from "../utils/field-templates";

import { getFieldDefaultValues } from "../field-types/registry/fieldRegistry";

const BuilderContext = createContext<BuilderContextValue | null>(null);

export interface BuilderProviderProps {
  children: React.ReactNode;
  initialForm?: Form;
  formId?: string;
  autoSaveInterval?: number;
  enablePersistence?: boolean;
  onFormSave?: (form: Form) => Promise<boolean>;
  onFormPublish?: (form: Form) => Promise<boolean>;
  onError?: (error: string) => void;
}

export const BuilderProvider: React.FC<BuilderProviderProps> = ({
  children,
  initialForm,
  formId,
  autoSaveInterval = 30000,
  enablePersistence = true,
  onFormSave,
  onFormPublish,
  onError,
}) => {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false); // Prevent concurrent saves
  const lastSaveVersionRef = useRef<string | null>(null); // Track save conflicts

  // Initialize form on mount
  useEffect(() => {
    if (initialForm) {
      dispatch({
        type: "SET_FORM",
        payload: { form: initialForm, saveToHistory: false },
      });
    } else if (enablePersistence) {
      loadFromStorage();
    }
  }, [initialForm, enablePersistence]);

  // Enhanced auto-save setup with proper debouncing
  useEffect(() => {
    // Only set up auto-save if conditions are met and not already saving
    if (
      state.autoSave.enabled &&
      state.autoSave.hasUnsavedChanges &&
      state.form &&
      !isSavingRef.current // Prevent overlapping saves
    ) {
      // Clear existing timeout
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }

      // Set new timeout
      autoSaveRef.current = setTimeout(() => {
        performAutoSave();
      }, state.autoSave.interval);
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [
    state.autoSave.enabled,
    state.autoSave.hasUnsavedChanges,
    state.autoSave.interval,
    state.form?.id, // Only track form ID, not entire form object
    state.form?.fields?.length, // Track field count changes
  ]);

  // Enhanced storage with better debouncing
  useEffect(() => {
    if (enablePersistence && state.form && !isSavingRef.current) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce storage saves more aggressively
      saveTimeoutRef.current = setTimeout(() => {
        saveToStorage();
      }, 2000); // Increased to 2 seconds to reduce conflicts
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    state.form?.id,
    state.form?.fields?.length, // Only save when significant changes occur
    state.selectedFieldId,
    enablePersistence,
  ]);

  // Enhanced auto-save function with conflict detection
  const performAutoSave = useCallback(async () => {
    if (!state.form || !onFormSave || isSavingRef.current) return;

    // Set saving flag to prevent concurrent saves
    isSavingRef.current = true;
    dispatch({ type: "START_AUTO_SAVE" });

    try {
      // Create a version hash for conflict detection
      const currentVersion = JSON.stringify({
        fields: state.form.fields,
        title: state.form.title,
        updatedAt: state.form.updatedAt,
      });

      // Check if this version was already saved
      if (lastSaveVersionRef.current === currentVersion) {
        console.log("Auto-save skipped: no changes detected");
        dispatch({
          type: "COMPLETE_AUTO_SAVE",
          payload: { timestamp: Date.now() },
        });
        return;
      }

      console.log("Auto-save starting for form:", state.form.id);
      const success = await onFormSave(state.form);

      if (success) {
        // Update the last saved version
        lastSaveVersionRef.current = currentVersion;

        console.log("Auto-save completed successfully");
        dispatch({
          type: "COMPLETE_AUTO_SAVE",
          payload: { timestamp: Date.now() },
        });

        // Don't update the form state here - it causes loops!
        // The form is already saved, just mark it as clean
      } else {
        throw new Error("Auto-save failed");
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Auto-save failed";
      dispatch({
        type: "AUTO_SAVE_ERROR",
        payload: { error: errorMessage },
      });
      onError?.(errorMessage);
    } finally {
      // Always clear the saving flag
      isSavingRef.current = false;
    }
  }, [state.form, onFormSave, onError]);

  // Storage functions
  const saveToStorage = useCallback(() => {
    if (!enablePersistence) return;

    const storageData = {
      form: state.form,
      uiPreferences: state.ui,
      selectedFieldId: state.selectedFieldId,
      lastSaved: state.autoSave.lastSaved || Date.now(),
    };

    const success = storage.saveBuilderState(storageData);
    if (!success) {
      onError?.("Failed to save to local storage");
    }

    // Also save form history
    if (state.form) {
      storage.saveFormHistory(
        state.history.past,
        state.history.past.length - 1
      );
    }
  }, [state, enablePersistence, onError]);

  const loadFromStorage = useCallback(() => {
    if (!enablePersistence) return;

    const storageData = storage.loadBuilderState();
    if (storageData && storageData.form) {
      dispatch({
        type: "LOAD_FROM_STORAGE",
        payload: {
          data: {
            form: storageData.form,
            originalForm: storageData.form,
            ui: storageData.uiPreferences,
            selectedFieldId: storageData.selectedFieldId,
            autoSave: {
              ...state.autoSave,
              lastSaved: storageData.lastSaved,
            },
          },
        },
      });

      // Load form history
      const historyData = storage.loadFormHistory();
      if (historyData) {
        dispatch({
          type: "LOAD_FROM_STORAGE",
          payload: {
            data: {
              history: {
                ...state.history,
                past: historyData.history,
                present: storageData.form,
              },
            },
          },
        });
      }
    }
  }, [enablePersistence]);

  const clearStorage = useCallback(() => {
    if (!enablePersistence) return;

    const success = storage.clear();
    if (!success) {
      onError?.("Failed to clear local storage");
    }
  }, [enablePersistence, onError]);

  // Helper functions
  const addField = useCallback((field: FormField, index?: number) => {
    dispatch({
      type: "ADD_FIELD",
      payload: {
        field,
        index:
          field.type === "startingPage" ? 0 : index ? index + 1 : undefined, // Always put starting page at 0, shift others
      },
    });
  }, []);

  const updateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      dispatch({ type: "UPDATE_FIELD", payload: { fieldId, updates } });
    },
    []
  );

  const updateForm = useCallback((updates: Partial<Form>) => {
    dispatch({ type: "UPDATE_FORM", payload: { updates } });
  }, []);

  const deleteField = useCallback((fieldId: string) => {
    dispatch({ type: "DELETE_FIELD", payload: { fieldId } });
  }, []);

  const duplicateField = useCallback((fieldId: string, newIndex?: number) => {
    dispatch({ type: "DUPLICATE_FIELD", payload: { fieldId, newIndex } });
  }, []);

  const selectField = useCallback((fieldId: string | null) => {
    dispatch({ type: "SELECT_FIELD", payload: { fieldId } });
  }, []);

  const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: "REORDER_FIELDS", payload: { fromIndex, toIndex } });
  }, []);

  // Enhanced form save with conflict prevention
  const saveForm = useCallback(async (): Promise<boolean> => {
    if (!state.form || !onFormSave || isSavingRef.current) return false;

    // Prevent concurrent saves
    isSavingRef.current = true;
    dispatch({ type: "SET_SAVING", payload: { isSaving: true } });

    try {
      console.log("Manual save starting for form:", state.form.id);
      const success = await onFormSave(state.form);

      if (success) {
        // Update version tracking
        const currentVersion = JSON.stringify({
          fields: state.form.fields,
          title: state.form.title,
          updatedAt: state.form.updatedAt,
        });
        lastSaveVersionRef.current = currentVersion;

        console.log("Manual save completed successfully");

        // Update original form state to mark as clean
        dispatch({
          type: "SET_FORM",
          payload: { form: state.form, saveToHistory: false },
        });
      }
      return success;
    } catch (error) {
      console.error("Manual save error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Save failed";
      dispatch({ type: "SET_ERROR", payload: { error: errorMessage } });
      onError?.(errorMessage);
      return false;
    } finally {
      isSavingRef.current = false;
      dispatch({ type: "SET_SAVING", payload: { isSaving: false } });
    }
  }, [state.form, onFormSave, onError]);

  const publishForm = useCallback(async (): Promise<boolean> => {
    if (!state.form || !onFormPublish) return false;

    dispatch({ type: "SET_PUBLISHING", payload: { isPublishing: true } });

    try {
      const success = await onFormPublish(state.form);
      if (success) {
        dispatch({
          type: "SET_FORM",
          payload: { form: state.form, saveToHistory: false },
        });
      }
      return success;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Publish failed";
      dispatch({ type: "SET_ERROR", payload: { error: errorMessage } });
      onError?.(errorMessage);
      return false;
    } finally {
      dispatch({ type: "SET_PUBLISHING", payload: { isPublishing: false } });
    }
  }, [state.form, onFormPublish, onError]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  // History operations
  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  // UI operations
  const toggleLeftPanel = useCallback(() => {
    dispatch({ type: "TOGGLE_LEFT_PANEL" });
  }, []);

  const toggleRightPanel = useCallback(() => {
    dispatch({ type: "TOGGLE_RIGHT_PANEL" });
  }, []);

  const setPanelTab = useCallback((tab: UIPreferences["activePanelTab"]) => {
    dispatch({ type: "SET_PANEL_TAB", payload: { tab } });
  }, []);

  const setBuilderStep = useCallback((step: UIPreferences["builderStep"]) => {
    dispatch({ type: "SET_BUILDER_STEP", payload: { step } });
  }, []);

  // Computed values
  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;
  const hasUnsavedChanges = state.autoSave.hasUnsavedChanges;
  const selectedField =
    state.form?.fields.find((field) => field.id === state.selectedFieldId) ||
    null;
  const fieldCount = state.form?.fields.length || 0;

  // Helper function to add field by type
  const addFieldByType = useCallback(
    (fieldType: string, index?: number) => {
      const template = getTemplateByType(fieldType as any);
      if (!template) {
        onError?.(`Unknown field type: ${fieldType}`);
        return;
      }

      const field = createFieldFromTemplate(template, state.form?.fields || []);
      addField(field, index);
    },
    [state.form?.fields, addField, onError]
  );

  const contextValue: BuilderContextValue = {
    state,
    dispatch,

    // Computed values
    canUndo,
    canRedo,
    hasUnsavedChanges,
    selectedField,
    fieldCount,

    // Helper functions
    addField,
    updateField,
    updateForm,
    deleteField,
    duplicateField,
    selectField,
    reorderFields,

    // Form operations
    saveForm,
    publishForm,
    resetForm,

    // History operations
    undo,
    redo,

    // UI operations
    toggleLeftPanel,
    toggleRightPanel,
    setPanelTab,
    setBuilderStep,

    // Storage operations
    saveToStorage,
    loadFromStorage,
    clearStorage,

    // Extended functionality
    addFieldByType,
  } as BuilderContextValue & {
    addFieldByType: (fieldType: string, index?: number) => void;
  };

  return (
    <BuilderContext.Provider value={contextValue}>
      {children}
    </BuilderContext.Provider>
  );
};

// Hook to use the builder context
export const useBuilder = (): BuilderContextValue & {
  addFieldByType: (fieldType: string, index?: number) => void;
} => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context as BuilderContextValue & {
    addFieldByType: (fieldType: string, index?: number) => void;
  };
};
