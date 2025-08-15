// src/components/form-builder/floating-elements/FloatingAddQuestionToolbar.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Type,
  AlignLeft,
  Mail,
  Globe,
  Phone,
  CircleDot,
  ChevronDown,
  ToggleLeft,
  BarChart3,
  Star,
  FileText,
  Scale,
  Upload,
  Minus,
  Play,
  CheckCircle,
  Sparkles,
  Layout,
} from "lucide-react";
import { useBuilder } from "../providers/BuilderProvider";

export interface FloatingAddQuestionToolbarProps {
  onFieldAdd?: (fieldType: string) => void;
  className?: string;
}

// Field types organized by categories with icons
const fieldCategories = [
  {
    id: "text-fields",
    label: "Text Fields",
    icon: Type,
    fields: [
      { type: "shortText", label: "Short Text", icon: Type },
      { type: "longText", label: "Long Text", icon: AlignLeft },
      { type: "email", label: "Email", icon: Mail },
      { type: "website", label: "Website", icon: Globe },
      { type: "phoneNumber", label: "Phone", icon: Phone },
    ],
  },
  {
    id: "choice-fields",
    label: "Choice Fields",
    icon: CircleDot,
    fields: [
      { type: "multipleChoice", label: "Multiple Choice", icon: CircleDot },
      { type: "dropdown", label: "Dropdown", icon: ChevronDown },
      { type: "yesNo", label: "Yes/No", icon: ToggleLeft },
      { type: "opinionScale", label: "Opinion Scale", icon: BarChart3 },
    ],
  },
  {
    id: "rating-fields",
    label: "Rating Fields",
    icon: Star,
    fields: [{ type: "numberRating", label: "Rating Scale", icon: Star }],
  },
  {
    id: "special-fields",
    label: "Special Fields",
    icon: Sparkles,
    fields: [
      { type: "statement", label: "Statement", icon: FileText },
      { type: "legal", label: "Legal", icon: Scale },
      { type: "fileUpload", label: "File Upload", icon: Upload },
    ],
  },
  {
    id: "structure-fields",
    label: "Structure Fields",
    icon: Layout,
    fields: [
      { type: "pageBreak", label: "Page Break", icon: Minus },
      { type: "startingPage", label: "Welcome Page", icon: Play },
      { type: "postSubmission", label: "Thank You Page", icon: CheckCircle },
    ],
  },
];

export const FloatingAddQuestionToolbar: React.FC<
  FloatingAddQuestionToolbarProps
> = ({ onFieldAdd, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use the builder context
  const {
    addFieldByType,
    fieldCount,
    state: { form },
  } = useBuilder();

  const handleFieldSelect = (fieldType: string) => {
    // Use the integrated state management
    if (onFieldAdd) {
      onFieldAdd(fieldType);
    } else {
      // Use the built-in addFieldByType method
      addFieldByType(fieldType);
    }
    setIsOpen(false);
  };

  // Don't show toolbar if there's no form
  if (!form) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      <Card className="shadow-lg border bg-card/95 backdrop-blur py-0.5">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" className="shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[768px] p-0"
                side="top"
                align="start"
                sideOffset={30}
                alignOffset={-220}
              >
                <div className="p-4 border-b">
                  <h4 className="font-semibold text-sm">Add Question</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a question type to add to your form
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {fieldCategories.map((category, categoryIndex) => (
                    <div key={category.id}>
                      <h5 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                        {category.label}
                      </h5>
                      <div className="grid grid-cols-5 gap-2">
                        {category.fields.map((field) => {
                          const IconComponent = field.icon;
                          return (
                            <Button
                              key={field.type}
                              variant="ghost"
                              className="h-auto p-3 flex flex-col gap-2 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all"
                              onClick={() => handleFieldSelect(field.type)}
                            >
                              <div className="w-12 h-8 rounded bg-primary/10 flex items-center justify-center">
                                <IconComponent className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-xs font-medium text-center leading-tight">
                                {field.label}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                      {categoryIndex < fieldCategories.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Status badges */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </Badge>

              {form?.title && (
                <Badge
                  variant="secondary"
                  className="text-xs max-w-[150px] truncate"
                >
                  {form.title}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
