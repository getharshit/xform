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
import {
  BuilderState,
  BuilderAction,
  BuilderContextValue,
  initialBuilderState,
  UIPreferences,
} from "./types";
import { builderReducer } from "./builderReducer";
import { storage } from "../utils/storage";
import { Form, FormField, FormTheme, FormCustomization } from "@/types/form";
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
  const customizationSaveRef = useRef<NodeJS.Timeout | null>(null);
  const themeSaveRef = useRef<NodeJS.Timeout | null>(null);
  const lastCustomizationSave = useRef<string>("");

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
      // ADD THESE NEW CLEANUP LINES:
      if (customizationSaveRef.current) {
        clearTimeout(customizationSaveRef.current);
      }
      if (themeSaveRef.current) {
        clearTimeout(themeSaveRef.current);
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
    console.log("🔍 AUTO-SAVE: Starting check", {
      hasForm: !!state.form,
      hasOnFormSave: !!onFormSave,
      isSaving: isSavingRef.current,
      timestamp: Date.now(),
    });

    if (!state.form || !onFormSave || isSavingRef.current) {
      console.log("🚫 AUTO-SAVE: Blocked", { isSaving: isSavingRef.current });
      return;
    }

    // Set saving flag to prevent concurrent saves
    isSavingRef.current = true;
    console.log("🚀 AUTO-SAVE: Starting save operation", Date.now());
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

  // ADD ALL THE CUSTOMIZATION FUNCTIONS HERE (after performAutoSave)

  // Save intervals for different change types
  const SAVE_INTERVALS = {
    customization: 1500, // 1.5s for theme/customization changes
    structure: 5000, // 5s for field/form structure
    ui: 500, // 0.5s for UI preferences (localStorage only)
  };

  // Enhanced customization save with heavy debouncing
  const saveCustomizationChanges = useCallback(() => {
    if (!state.form || !onFormSave) return;

    // Clear existing timeout
    if (customizationSaveRef.current) {
      clearTimeout(customizationSaveRef.current);
    }

    // Set debounced save
    customizationSaveRef.current = setTimeout(async () => {
      if (isSavingRef.current || !state.form) return; // Add null check

      try {
        // Create hash of customization data to avoid duplicate saves
        const customizationHash = JSON.stringify({
          theme: state.form.theme,
          customization: state.form.customization,
        });

        // Skip if no changes
        if (lastCustomizationSave.current === customizationHash) {
          console.log("Customization save skipped: no changes");
          return;
        }

        isSavingRef.current = true;
        console.log("Saving customization changes...");

        const success = await onFormSave(state.form);
        if (success) {
          lastCustomizationSave.current = customizationHash;
          console.log("Customization changes saved successfully");
        }
      } catch (error) {
        console.error("Customization save failed:", error);
        onError?.("Failed to save customization changes");
      } finally {
        isSavingRef.current = false;
      }
    }, SAVE_INTERVALS.customization);
  }, [state.form, onFormSave, onError]);

  // Enhanced theme update functions with proper typing
  const updateTheme = useCallback(
    (themeUpdates: Partial<FormTheme>) => {
      if (!state.form) return; // Add null check

      dispatch({
        type: "UPDATE_FORM",
        payload: {
          updates: {
            theme: { ...state.form.theme, ...themeUpdates } as FormTheme,
          },
          saveToHistory: false, // Don't save theme changes to history
        },
      });

      // Immediate localStorage save for UI feedback
      saveToStorage();

      // Debounced database save
      saveCustomizationChanges();
    },
    [state.form, saveCustomizationChanges]
  );

  const updateCustomization = useCallback(
    (customizationUpdates: Partial<FormCustomization>) => {
      if (!state.form) return; // Add null check

      dispatch({
        type: "UPDATE_FORM",
        payload: {
          updates: {
            customization: {
              ...state.form.customization,
              ...customizationUpdates,
            } as FormCustomization,
          },
          saveToHistory: false,
        },
      });

      // Immediate localStorage save
      saveToStorage();

      // Debounced database save
      saveCustomizationChanges();
    },
    [state.form, saveCustomizationChanges]
  );

  // Enhanced color update (most frequent changes)
  const updateColors = useCallback(
    (colorUpdates: Record<string, string>) => {
      if (!state.form) return; // Add null check

      const currentColors = state.form.customization?.colors || {};
      const updatedColors = { ...currentColors, ...colorUpdates };

      updateCustomization({ colors: updatedColors });
    },
    [state.form, updateCustomization]
  );

  // Typography updates
  const updateTypography = useCallback(
    (typographyUpdates: Record<string, any>) => {
      if (!state.form) return; // Add null check

      const currentTypography = state.form.customization?.typography || {};
      const updatedTypography = { ...currentTypography, ...typographyUpdates };

      updateCustomization({ typography: updatedTypography });
    },
    [state.form, updateCustomization]
  );

  // Spacing updates
  const updateSpacing = useCallback(
    (spacingUpdates: Record<string, number>) => {
      if (!state.form) return; // Add null check

      const currentSpacing = state.form.customization?.spacing || {};
      const updatedSpacing = { ...currentSpacing, ...spacingUpdates };

      updateCustomization({ spacing: updatedSpacing });
    },
    [state.form, updateCustomization]
  );

  // NEW: Border updates function
  const updateBorders = useCallback(
    (borderUpdates: Record<string, any>) => {
      if (!state.form) return; // Add null check

      console.log(
        "🔲 BuilderProvider.updateBorders called with:",
        borderUpdates
      );

      const currentBorders = state.form.customization?.borders || {};
      const updatedBorders = { ...currentBorders, ...borderUpdates };

      console.log("🔲 Current borders:", currentBorders);
      console.log("🔲 Updated borders:", updatedBorders);

      updateCustomization({ borders: updatedBorders });
    },
    [state.form, updateCustomization]
  );

  // NEW: Animation updates function
  // NEW: Animation updates function
  const updateAnimations = useCallback(
    (animationUpdates: Record<string, any>) => {
      if (!state.form) return;
      const currentAnimations = state.form.customization?.animations || {};
      const updatedAnimations = { ...currentAnimations, ...animationUpdates };
      updateCustomization({ animations: updatedAnimations });
    },
    [state.form, updateCustomization]
  );
  // Apply complete theme preset (immediate save)
  const applyThemePreset = useCallback(
    async (themePreset: Partial<FormTheme & FormCustomization>) => {
      if (!state.form) return; // Add null check

      // Apply theme immediately
      dispatch({
        type: "UPDATE_FORM",
        payload: {
          updates: {
            theme: { ...state.form.theme, ...themePreset } as FormTheme,
            customization: {
              ...state.form.customization,
              ...themePreset,
            } as FormCustomization,
          },
        },
      });

      // Save immediately for theme presets (user expects instant application)
      if (onFormSave && !isSavingRef.current) {
        try {
          isSavingRef.current = true;
          console.log("Applying theme preset...");
          await onFormSave(state.form);
          console.log("Theme preset applied successfully");
        } catch (error) {
          console.error("Theme preset save failed:", error);
          onError?.("Failed to apply theme preset");
        } finally {
          isSavingRef.current = false;
        }
      }
    },
    [state.form, onFormSave, onError]
  );

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

    // Customization operations (UPDATED WITH BORDERS)
    updateTheme,
    updateCustomization,
    updateColors,
    updateTypography,
    updateSpacing,
    updateBorders, // NEW: Added borders update function
    applyThemePreset,
    updateAnimations,

    // Extended functionality
    addFieldByType,
  } as BuilderContextValue & {
    addFieldByType: (fieldType: string, index?: number) => void;
    updateTheme: (themeUpdates: Partial<FormTheme>) => void;
    updateCustomization: (
      customizationUpdates: Partial<FormCustomization>
    ) => void;
    updateColors: (colorUpdates: Record<string, string>) => void;
    updateTypography: (typographyUpdates: Record<string, any>) => void;
    updateSpacing: (spacingUpdates: Record<string, number>) => void;
    updateBorders: (borderUpdates: Record<string, any>) => void; // NEW
    updateAnimations: (animationUpdates: Record<string, any>) => void; // NEW
    applyThemePreset: (
      themePreset: FormTheme & FormCustomization
    ) => Promise<void>;
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
  updateTheme: (themeUpdates: Partial<FormTheme>) => void;
  updateCustomization: (
    customizationUpdates: Partial<FormCustomization>
  ) => void;
  updateColors: (colorUpdates: Record<string, string>) => void;
  updateTypography: (typographyUpdates: Record<string, any>) => void;
  updateSpacing: (spacingUpdates: Record<string, number>) => void;
  updateBorders: (borderUpdates: Record<string, any>) => void; // NEW
  applyThemePreset: (
    themePreset: FormTheme & FormCustomization
  ) => Promise<void>;
} => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context as BuilderContextValue & {
    addFieldByType: (fieldType: string, index?: number) => void;
    updateTheme: (themeUpdates: Partial<FormTheme>) => void;
    updateCustomization: (
      customizationUpdates: Partial<FormCustomization>
    ) => void;
    updateColors: (colorUpdates: Record<string, string>) => void;
    updateTypography: (typographyUpdates: Record<string, any>) => void;
    updateSpacing: (spacingUpdates: Record<string, number>) => void;
    updateBorders: (borderUpdates: Record<string, any>) => void; // NEW
    applyThemePreset: (
      themePreset: FormTheme & FormCustomization
    ) => Promise<void>;
  };
};
