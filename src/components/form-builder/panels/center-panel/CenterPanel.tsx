"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

import { FormCanvas } from "./FormCanvas";
import { FormPreview } from "./FormPreview";
import { EmptyState } from "./EmptyState";
import { CanvasToolbar } from "./canvas-toolbar/CanvasToolbar";
import { useBuilder } from "../../providers/BuilderProvider";

export interface CenterPanelProps {
  previewMode?: boolean;
  onPreviewToggle?: () => void;
  className?: string;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({
  previewMode = false,
  onPreviewToggle,
  className = "",
}) => {
  const {
    state: {
      form,
      ui: { viewportMode },
      selectedFieldId,
      autoSave,
    },
    addFieldByType,
    selectField,
    saveForm,
    undo,
    redo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    fieldCount,
  } = useBuilder();

  const [localViewportMode, setLocalViewportMode] = useState<
    "desktop" | "tablet" | "mobile"
  >(viewportMode);

  const getViewportClass = () => {
    switch (localViewportMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "max-w-4xl mx-auto";
    }
  };

  const handleAddField = () => {
    // Default to adding a short text field
    addFieldByType("shortText");
  };

  const handlePreviewToggle = () => {
    onPreviewToggle?.();
  };

  const handleSave = async () => {
    await saveForm();
  };

  return (
    <div className={`flex flex-col h-full bg-muted/30 ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">
              {previewMode ? "Form Preview" : "Form Builder"}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </Badge>

              {form?.title && (
                <Badge variant="secondary" className="max-w-[200px] truncate">
                  {form.title}
                </Badge>
              )}

              {/* Auto-save indicator */}
              {autoSave.enabled && hasUnsavedChanges && (
                <Badge variant="destructive" className="text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Toggle */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={localViewportMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLocalViewportMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={localViewportMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLocalViewportMode("tablet")}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={localViewportMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLocalViewportMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview Toggle */}
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={handlePreviewToggle}
            >
              {previewMode ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          <div className={getViewportClass()}>
            {previewMode ? (
              <FormPreview form={form} viewportMode={localViewportMode} />
            ) : fieldCount > 0 ? (
              <FormCanvas
                form={form}
                selectedFieldId={selectedFieldId}
                onFieldSelect={selectField}
                onFieldAdd={addFieldByType}
                viewportMode={localViewportMode}
              />
            ) : (
              <EmptyState onAddField={handleAddField} />
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Canvas Toolbar - appears when editing and has fields */}
      {!previewMode && fieldCount > 0 && (
        <CanvasToolbar
          onSave={handleSave}
          onPreview={handlePreviewToggle}
          onUndo={undo}
          onRedo={redo}
          onAddField={handleAddField}
          canUndo={canUndo}
          canRedo={canRedo}
          isDirty={hasUnsavedChanges}
        />
      )}
    </div>
  );
};
