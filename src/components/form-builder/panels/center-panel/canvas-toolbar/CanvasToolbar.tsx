// src/components/form-builder/panels/center-panel/canvas-toolbar/CanvasToolbar.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, Undo2, Redo2, Plus, AlertCircle } from "lucide-react";
import { useBuilder } from "../../../providers/BuilderProvider";

export interface CanvasToolbarProps {
  onSave?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddField?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isDirty?: boolean;
  className?: string;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onSave,
  onPreview,
  onUndo,
  onRedo,
  onAddField,
  canUndo: propCanUndo,
  canRedo: propCanRedo,
  isDirty: propIsDirty,
  className = "",
}) => {
  // Use builder context for state management
  const {
    state: {
      autoSave,
      loading: { isSaving, error },
    },
    canUndo,
    canRedo,
    hasUnsavedChanges,
    undo,
    redo,
    saveForm,
    addFieldByType,
    fieldCount,
  } = useBuilder();

  // Use props if provided, otherwise use context values
  const effectiveCanUndo = propCanUndo !== undefined ? propCanUndo : canUndo;
  const effectiveCanRedo = propCanRedo !== undefined ? propCanRedo : canRedo;
  const effectiveIsDirty =
    propIsDirty !== undefined ? propIsDirty : hasUnsavedChanges;

  const handleSave = async () => {
    if (onSave) {
      onSave();
    } else {
      await saveForm();
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    }
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    } else {
      undo();
    }
  };

  const handleRedo = () => {
    if (onRedo) {
      onRedo();
    } else {
      redo();
    }
  };

  const handleAddField = () => {
    if (onAddField) {
      onAddField();
    } else {
      // Default to adding a short text field
      addFieldByType("shortText");
    }
  };

  return (
    <div
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 ${className}`}
    >
      <Card className="px-4 py-2 shadow-lg border bg-card/95 backdrop-blur">
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={!effectiveCanUndo}
            title={`Undo${effectiveCanUndo ? "" : " (nothing to undo)"}`}
          >
            <Undo2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={!effectiveCanRedo}
            title={`Redo${effectiveCanRedo ? "" : " (nothing to redo)"}`}
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Add Field */}
          <Button variant="ghost" size="sm" onClick={handleAddField}>
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <Button variant="ghost" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="relative"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? "Saving..." : "Save"}
            {effectiveIsDirty && !autoSave.isSaving && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </Button>

          {/* Status indicators */}
          <div className="flex items-center gap-2 ml-2">
            {/* Field count */}
            <Badge variant="outline" className="text-xs">
              {fieldCount} field{fieldCount !== 1 ? "s" : ""}
            </Badge>

            {/* Auto-save status */}
            {autoSave.enabled && (
              <Badge
                variant={
                  autoSave.isSaving
                    ? "default"
                    : effectiveIsDirty
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs flex items-center gap-1"
              >
                {autoSave.isSaving ? (
                  <>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    Auto-saving...
                  </>
                ) : effectiveIsDirty ? (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Unsaved
                  </>
                ) : (
                  "Saved"
                )}
              </Badge>
            )}

            {/* Error indicator */}
            {error && (
              <Badge
                variant="destructive"
                className="text-xs flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Error
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
