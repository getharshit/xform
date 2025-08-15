// src/components/form-builder/panels/center-panel/canvas-toolbar/CanvasToolbar.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, Undo2, Redo2, Plus } from "lucide-react";

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
  canUndo = false,
  canRedo = false,
  isDirty = false,
  className = "",
}) => {
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
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Add Field */}
          <Button variant="ghost" size="sm" onClick={onAddField}>
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <Button variant="ghost" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="relative"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
            {isDirty && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </Button>

          {/* Status */}
          <Badge variant="outline" className="ml-2">
            Floating toolbar
          </Badge>
        </div>
      </Card>
    </div>
  );
};
