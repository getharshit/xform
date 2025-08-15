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
  const [viewportMode, setViewportMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [hasFields, setHasFields] = useState(false); // This would come from form state

  const getViewportClass = () => {
    switch (viewportMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "max-w-4xl mx-auto";
    }
  };

  return (
    <div className={`flex flex-col h-full bg-muted/30 ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">
              {previewMode ? "Form preview" : "Form Builder"}
            </h3>
            {hasFields && (
              <Badge variant="outline">
                {hasFields ? "3 fields" : "0 fields"}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Toggle */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={viewportMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportMode("desktop")}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportMode("tablet")}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview Toggle */}
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={onPreviewToggle}
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
              <FormPreview />
            ) : hasFields ? (
              <FormCanvas />
            ) : (
              <EmptyState onAddField={() => setHasFields(true)} />
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Canvas Toolbar - appears when editing */}
      {!previewMode && hasFields && <CanvasToolbar />}
    </div>
  );
};
