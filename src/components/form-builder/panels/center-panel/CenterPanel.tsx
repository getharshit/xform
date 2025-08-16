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
        return "max-w-sm mx-auto"; // ~384px - Portrait mobile
      case "tablet":
        return "max-w-2xl mx-auto"; // ~672px - Tablet
      default:
        return "max-w-5xl mx-auto w-full"; // ~896px - Desktop landscape, full width
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

  // Debug log
  console.log("CenterPanel Debug:", {
    previewMode,
    hasForm: !!form,
    fieldCount,
    formTitle: form?.title,
  });

  return (
    <div className={`flex flex-col h-full bg-muted/30 ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Live Form Preview</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </Badge>
              {form?.title && (
                <Badge variant="secondary" className="max-w-[200px] truncate">
                  {form.title}
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

            {/* Preview Toggle - Optional, can be removed if not needed */}
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={handlePreviewToggle}
            >
              {previewMode ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Builder
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Interactive
                </>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area - Always show live preview */}
      <ScrollArea className="flex-1">
        <div className="p-8 pb-24">
          {" "}
          {/* Added bottom padding to account for toolbar */}
          <div className={getViewportClass()}>
            {fieldCount > 0 ? (
              /* Always show FormPreview instead of FormCanvas */
              <FormPreview form={form} viewportMode={localViewportMode} />
            ) : (
              /* Show empty state when no fields */
              <EmptyState onAddField={handleAddField} />
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Canvas Toolbar - Always visible when form exists */}
      <CanvasToolbar
        onSave={handleSave}
        onPreview={handlePreviewToggle}
        onUndo={undo}
        onRedo={redo}
        onFieldAdd={handleAddField}
        canUndo={canUndo}
        canRedo={canRedo}
        isDirty={hasUnsavedChanges}
        isPreviewMode={false} // Always show toolbar since we're always in "edit" mode
      />
    </div>
  );
};
