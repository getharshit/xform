// src/components/form-builder/panels/left-panel/LeftPanel.tsx

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Type,
  Mail,
  Star,
  Settings,
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
import { useBuilder } from "../../providers/BuilderProvider";
import { FormField } from "@/types/form";

export interface LeftPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

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

// Field type display names
const getFieldDisplayName = (fieldType: FormField["type"]): string => {
  const nameMap = {
    shortText: "Short Text",
    longText: "Long Text",
    email: "Email",
    website: "Website",
    phoneNumber: "Phone",
    multipleChoice: "Multiple Choice",
    dropdown: "Dropdown",
    yesNo: "Yes/No",
    opinionScale: "Opinion Scale",
    numberRating: "Rating",
    statement: "Statement",
    legal: "Legal",
    fileUpload: "File Upload",
    pageBreak: "Page Break",
    startingPage: "Starting Page",
    postSubmission: "Thank You Page",
  };
  return nameMap[fieldType] || fieldType;
};

export const LeftPanel: React.FC<LeftPanelProps> = ({
  collapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  const {
    state: { form, selectedFieldId },
    selectField,
    duplicateField,
    deleteField,
    fieldCount,
  } = useBuilder();

  // Get form fields from state
  const formFields = form?.fields || [];

  const handleFieldSelect = (fieldId: string) => {
    selectField(fieldId === selectedFieldId ? null : fieldId);
  };

  const handleFieldDuplicate = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent field selection
    duplicateField(fieldId);
  };

  const handleFieldDelete = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent field selection
    if (window.confirm("Are you sure you want to delete this field?")) {
      deleteField(fieldId);
    }
  };

  return (
    <div className={`border-r bg-card flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Form Fields</h3>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {fieldCount} field{fieldCount !== 1 ? "s" : ""}
          </span>
          <Badge variant="outline">{fieldCount}</Badge>
        </div>

        {form?.title && (
          <div className="mt-2 text-xs text-muted-foreground truncate">
            {form.title}
          </div>
        )}
      </div>

      {/* Form Fields List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {formFields.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Type className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No fields added yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the "Add Question" button to start building your form
              </p>
            </div>
          ) : (
            formFields.map((field, index) => {
              const IconComponent = getFieldIcon(field.type);
              const isSelected = field.id === selectedFieldId;

              return (
                <Card
                  key={field.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary shadow-sm bg-primary/5"
                      : "hover:shadow-md hover:border-primary/20"
                  }`}
                  onClick={() => handleFieldSelect(field.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Drag handle */}
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50 hover:opacity-100" />

                      {/* Field icon */}
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Field info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {getFieldDisplayName(field.type)}
                          </Badge>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-sm truncate">
                          {field.label || "Untitled Question"}
                        </h4>
                        {field.description && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {field.description}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => handleFieldDuplicate(field.id, e)}
                          title="Duplicate field"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => handleFieldDelete(field.id, e)}
                          title="Delete field"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Selected indicator */}
                      {isSelected && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Field preview */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <div className="text-xs text-muted-foreground">
                          {field.type === "shortText" &&
                            "Single line text input"}
                          {field.type === "longText" && "Multi-line text area"}
                          {field.type === "email" && "Email address input"}
                          {field.type === "multipleChoice" &&
                            `${field.options?.length || 0} options`}
                          {field.type === "dropdown" &&
                            `${field.options?.length || 0} options`}
                          {field.type === "numberRating" &&
                            `${field.minRating || 1}-${
                              field.maxRating || 5
                            } scale`}
                          {field.type === "yesNo" && "Yes/No choice"}
                          {field.type === "opinionScale" &&
                            "1-10 opinion scale"}
                          {field.placeholder && (
                            <div className="mt-1 italic">
                              Placeholder: "{field.placeholder}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer with form info */}
      {form && (
        <div className="p-4 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span>Form ID:</span>
              <span className="font-mono">{form.id.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Updated:</span>
              <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
