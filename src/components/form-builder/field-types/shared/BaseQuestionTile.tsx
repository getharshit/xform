// src/components/form-builder/field-types/shared/BaseQuestionTile.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Type,
  Mail,
  Star,
  GripVertical,
  CircleDot,
  ChevronDown,
  ToggleLeft,
  BarChart3,
  Globe,
  Phone,
  AlignLeft,
  FileText,
  Scale,
  Upload,
  Minus,
  Play,
  CheckCircle,
  Copy,
  Trash2,
} from "lucide-react";
import { FormField } from "@/types/form";

// Field type icon mapping
const getFieldIcon = (fieldType: FormField["type"]) => {
  const iconMap = {
    shortText: Type,
    longText: AlignLeft,
    email: Mail,
    website: Globe,
    phoneNumber: Phone,
    multipleChoice: CircleDot,
    dropdown: ChevronDown,
    yesNo: ToggleLeft,
    opinionScale: BarChart3,
    numberRating: Star,
    statement: FileText,
    legal: Scale,
    fileUpload: Upload,
    pageBreak: Minus,
    startingPage: Play,
    postSubmission: CheckCircle,
  };
  return iconMap[fieldType] || Type;
};

export interface BaseQuestionTileProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: (fieldId: string) => void;
  onDuplicate: (fieldId: string, event: React.MouseEvent) => void;
  onDelete: (fieldId: string, event: React.MouseEvent) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  dragHandleProps?: any;

  // Field-specific content area
  children?: React.ReactNode;

  // Optional field-specific info to display
  fieldInfo?: React.ReactNode;

  // Whether this field type should be expandable
  expandable?: boolean;
}

export const BaseQuestionTile: React.FC<BaseQuestionTileProps> = ({
  field,
  index,
  isSelected,
  isDragging = false,
  onSelect,
  onDuplicate,
  onDelete,
  onUpdateField,
  dragHandleProps,
  children,
  fieldInfo,
  expandable = false,
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [localLabel, setLocalLabel] = useState(field.label || "");
  const [localDescription, setLocalDescription] = useState(
    field.description || ""
  );
  const [isExpanded, setIsExpanded] = useState(isSelected);

  const labelInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const IconComponent = getFieldIcon(field.type);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditingLabel]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  // Update local state when field props change
  useEffect(() => {
    setLocalLabel(field.label || "");
  }, [field.label]);

  useEffect(() => {
    setLocalDescription(field.description || "");
  }, [field.description]);

  // Sync expansion with selection
  useEffect(() => {
    if (expandable) {
      setIsExpanded(isSelected);
    }
  }, [isSelected, expandable]);

  const handleSelect = () => {
    if (!isEditingLabel && !isEditingDescription) {
      onSelect(field.id);
    }
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingLabel(true);
    setLocalLabel(field.label || "");
  };

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingDescription(true);
    setLocalDescription(field.description || "");
  };

  const handleLabelSave = () => {
    const trimmedLabel = localLabel.trim();
    if (trimmedLabel !== field.label) {
      onUpdateField(field.id, {
        label: trimmedLabel || "Untitled Question",
      });
    }
    setIsEditingLabel(false);
  };

  const handleDescriptionSave = () => {
    const trimmedDescription = localDescription.trim();
    if (trimmedDescription !== field.description) {
      onUpdateField(field.id, {
        description: trimmedDescription,
      });
    }
    setIsEditingDescription(false);
  };

  const handleRequiredToggle = (checked: boolean) => {
    onUpdateField(field.id, { required: checked });
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleLabelSave();
    } else if (e.key === "Escape") {
      setLocalLabel(field.label || "");
      setIsEditingLabel(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      setLocalDescription(field.description || "");
      setIsEditingDescription(false);
    }
  };

  const toggleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandable) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        onSelect(field.id);
      }
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 group relative ${
        isSelected
          ? "border-primary shadow-md bg-primary/5 ring-1 ring-primary/20"
          : "hover:shadow-md hover:border-primary/20 border-border"
      } ${isDragging ? "rotate-2 shadow-lg scale-105 z-50" : ""}`}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        {/* Main Row: Icon + Question Number + Content Column */}
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="cursor-grab hover:cursor-grabbing flex-shrink-0 mt-2"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-50 hover:opacity-100" />
          </div>

          {/* Field Type Icon */}
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>

          {/* Question Number */}
          <div className="text-sm font-medium text-muted-foreground flex-shrink-0 mt-2">
            {index + 1}.
          </div>

          {/* Content Column: Question + Description + Field-Specific + Controls */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Question Input */}
            <div>
              {isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={localLabel}
                  onChange={(e) => setLocalLabel(e.target.value)}
                  onBlur={handleLabelSave}
                  onKeyDown={handleLabelKeyDown}
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Question"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className="px-3 py-2 text-sm bg-muted/30 border border-dashed border-muted-foreground/30 rounded-md hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-text"
                  onClick={handleLabelClick}
                >
                  {field.label || "Question"}
                </div>
              )}
            </div>

            {/* Description Textarea */}
            <div>
              {isEditingDescription ? (
                <textarea
                  ref={descriptionInputRef}
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onBlur={handleDescriptionSave}
                  onKeyDown={handleDescriptionKeyDown}
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Description"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className="px-3 py-2 text-sm bg-muted/30 border border-dashed border-muted-foreground/30 rounded-md hover:bg-muted/50 hover:border-primary/30 transition-colors cursor-text min-h-[60px] flex items-start pt-3"
                  onClick={handleDescriptionClick}
                >
                  {field.description || "Description"}
                </div>
              )}
            </div>

            {/* Field-Specific Content Area */}
            {children && (expandable ? isExpanded : true) && (
              <div
                className={
                  expandable
                    ? "border border-primary/20 rounded-lg p-3 bg-primary/5"
                    : ""
                }
              >
                {children}
              </div>
            )}

            {/* Controls Row: Required Toggle + Field Info + Action Buttons */}
            <div className="flex items-center justify-between">
              {/* Left: Required Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.required || false}
                  onCheckedChange={handleRequiredToggle}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs text-muted-foreground">Required</span>
              </div>

              {/* Center: Field-Specific Info */}
              <div className="flex items-center gap-2">
                {fieldInfo}
                {expandable && children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={toggleExpansion}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                )}
              </div>

              {/* Right: Action Buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(field.id, e);
                  }}
                  title="Duplicate field"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(field.id, e);
                  }}
                  title="Delete field"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-sm" />
        )}
      </CardContent>
    </Card>
  );
};
