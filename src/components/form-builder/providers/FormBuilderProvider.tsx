"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Form, FormField } from "@/types/form";

// Types (you can move these to separate files later)
export interface FormBuilderState {
  form: Form | null;
  selectedFieldId: string | null;
  draggedFieldId: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  activePanelTab: "field" | "form" | "theme";
  builderStep: "build" | "design" | "integrate" | "share";
  isLoading: boolean;
  isSaving: boolean;
  errors: string[];
  history: Form[];
  historyIndex: number;
}

export type FormBuilderAction =
  | { type: "SET_FORM"; payload: Form }
  | { type: "UPDATE_FORM"; payload: Partial<Form> }
  | { type: "ADD_FIELD"; payload: { field: FormField; index?: number } }
  | {
      type: "UPDATE_FIELD";
      payload: { fieldId: string; updates: Partial<FormField> };
    }
  | { type: "DELETE_FIELD"; payload: string }
  | { type: "SELECT_FIELD"; payload: string | null }
  | { type: "SET_PREVIEW_MODE"; payload: boolean }
  | { type: "SET_PANEL_TAB"; payload: FormBuilderState["activePanelTab"] }
  | { type: "TOGGLE_LEFT_PANEL" }
  | { type: "TOGGLE_RIGHT_PANEL" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "UNDO" }
  | { type: "REDO" };

interface FormBuilderContextValue {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;

  // Helper functions
  addField: (field: FormField, index?: number) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  saveForm: () => Promise<void>;

  // Computed values
  selectedField: FormField | null;
  canUndo: boolean;
  canRedo: boolean;
}

// Initial state
const initialState: FormBuilderState = {
  form: null,
  selectedFieldId: null,
  draggedFieldId: null,
  isPreviewMode: false,
  isDirty: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  activePanelTab: "field",
  builderStep: "build",
  isLoading: false,
  isSaving: false,
  errors: [],
  history: [],
  historyIndex: -1,
};

// Reducer
const formBuilderReducer = (
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState => {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        form: action.payload,
        isDirty: false,
        history: [action.payload],
        historyIndex: 0,
      };

    case "UPDATE_FORM":
      if (!state.form) return state;
      const updatedForm = { ...state.form, ...action.payload };
      return {
        ...state,
        form: updatedForm,
        isDirty: true,
      };

    case "ADD_FIELD":
      if (!state.form) return state;
      const newFields = [...state.form.fields];
      const insertIndex = action.payload.index ?? newFields.length;
      newFields.splice(insertIndex, 0, action.payload.field);

      return {
        ...state,
        form: { ...state.form, fields: newFields },
        isDirty: true,
        selectedFieldId: action.payload.field.id,
      };

    case "UPDATE_FIELD":
      if (!state.form) return state;
      const updatedFields = state.form.fields.map((field) =>
        field.id === action.payload.fieldId
          ? { ...field, ...action.payload.updates }
          : field
      );

      return {
        ...state,
        form: { ...state.form, fields: updatedFields },
        isDirty: true,
      };

    case "DELETE_FIELD":
      if (!state.form) return state;
      const filteredFields = state.form.fields.filter(
        (field) => field.id !== action.payload
      );

      return {
        ...state,
        form: { ...state.form, fields: filteredFields },
        isDirty: true,
        selectedFieldId:
          state.selectedFieldId === action.payload
            ? null
            : state.selectedFieldId,
      };

    case "SELECT_FIELD":
      return {
        ...state,
        selectedFieldId: action.payload,
        activePanelTab: action.payload ? "field" : state.activePanelTab,
      };

    case "SET_PREVIEW_MODE":
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedFieldId: action.payload ? null : state.selectedFieldId,
      };

    case "SET_PANEL_TAB":
      return {
        ...state,
        activePanelTab: action.payload,
      };

    case "TOGGLE_LEFT_PANEL":
      return {
        ...state,
        leftPanelCollapsed: !state.leftPanelCollapsed,
      };

    case "TOGGLE_RIGHT_PANEL":
      return {
        ...state,
        rightPanelCollapsed: !state.rightPanelCollapsed,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_SAVING":
      return {
        ...state,
        isSaving: action.payload,
      };

    default:
      return state;
  }
};

// Context
const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

// Provider
export interface FormBuilderProviderProps {
  children: React.ReactNode;
  initialForm?: Form;
}

export const FormBuilderProvider: React.FC<FormBuilderProviderProps> = ({
  children,
  initialForm,
}) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Initialize form
  useEffect(() => {
    if (initialForm) {
      dispatch({ type: "SET_FORM", payload: initialForm });
    }
  }, [initialForm]);

  // Helper functions
  const addField = (field: FormField, index?: number) => {
    dispatch({ type: "ADD_FIELD", payload: { field, index } });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    dispatch({ type: "UPDATE_FIELD", payload: { fieldId, updates } });
  };

  const deleteField = (fieldId: string) => {
    dispatch({ type: "DELETE_FIELD", payload: fieldId });
  };

  const selectField = (fieldId: string | null) => {
    dispatch({ type: "SELECT_FIELD", payload: fieldId });
  };

  const saveForm = async () => {
    if (!state.form) return;

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      // API call to save form
      const response = await fetch(`/api/forms/${state.form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.form),
      });

      if (!response.ok) throw new Error("Failed to save form");

      // Form saved successfully
      dispatch({ type: "UPDATE_FORM", payload: { ...state.form } });
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  // Computed values
  const selectedField =
    state.form?.fields.find((field) => field.id === state.selectedFieldId) ||
    null;
  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: FormBuilderContextValue = {
    state,
    dispatch,
    addField,
    updateField,
    deleteField,
    selectField,
    saveForm,
    selectedField,
    canUndo,
    canRedo,
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};

// Hook
export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};
