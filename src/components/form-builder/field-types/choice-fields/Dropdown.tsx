// src/components/form-builder/field-types/choice-fields/Dropdown.tsx

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type DropdownProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// Dropdown Options Manager Component with Comma-Separated Textarea
interface DropdownOptionsManagerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const DropdownOptionsManager: React.FC<DropdownOptionsManagerProps> = ({
  field,
  onUpdateField,
}) => {
  const options = field.options || [];
  const [optionsText, setOptionsText] = useState(options.join(", "));

  const handleOptionsChange = (text: string) => {
    setOptionsText(text);
    // Convert comma-separated text to options array
    const newOptions = text
      .split(",")
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    onUpdateField(field.id, { options: newOptions });
  };

  const handleAddSampleOptions = () => {
    const sampleOptions = "Option 1, Option 2, Option 3, Option 4, Option 5";
    setOptionsText(sampleOptions);
    handleOptionsChange(sampleOptions);
  };

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Options Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Dropdown Items ({options.length})
          </span>
        </div>
      </div>

      {/* Comma-Separated Textarea */}
      <div className="space-y-2">
        <Textarea
          value={optionsText}
          onChange={(e) => handleOptionsChange(e.target.value)}
          placeholder="Enter options separated by commas..."
          className="min-h-[80px] text-sm"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          💡 <strong>Tip:</strong> Separate each option with a comma. Perfect
          for long lists like countries, states, or categories.
        </div>
      </div>
    </div>
  );
};

export const Dropdown: React.FC<DropdownProps> = (props) => {
  const { field, onUpdateField } = props;

  // Generate field info badge - show options count
  const fieldInfo = (
    <Badge variant="secondary" className="text-xs">
      {field.options?.length || 0} Items
    </Badge>
  );

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo}>
      <DropdownOptionsManager field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
