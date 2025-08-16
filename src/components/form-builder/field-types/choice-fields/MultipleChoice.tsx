// src/components/form-builder/field-types/choice-fields/MultipleChoice.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Plus, X, RotateCcw } from "lucide-react";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

interface MultipleChoiceProps
  extends Omit<
    BaseQuestionTileProps,
    "children" | "fieldInfo" | "expandable"
  > {}

// MCQ Options Manager Component
interface MCQOptionsManagerProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const MCQOptionsManager: React.FC<MCQOptionsManagerProps> = ({
  field,
  onUpdateField,
}) => {
  const options = field.options || ["Option 1", "Option 2"];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOptions = [...options, `Option ${options.length + 1}`];
    onUpdateField(field.id, { options: newOptions });
  };

  const removeOption = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      onUpdateField(field.id, { options: newOptions });
    }
  };

  const startEditingOption = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditingValue(options[index]);
  };

  const saveOptionEdit = () => {
    if (editingIndex !== null) {
      const newOptions = [...options];
      newOptions[editingIndex] =
        editingValue.trim() || `Option ${editingIndex + 1}`;
      onUpdateField(field.id, { options: newOptions });
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const cancelOptionEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      saveOptionEdit();
    } else if (e.key === "Escape") {
      cancelOptionEdit();
    }
  };

  const toggleLayout = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentLayout = field.displayOptions?.inline || false;
    onUpdateField(field.id, {
      displayOptions: {
        ...field.displayOptions,
        inline: !currentLayout,
      },
    });
  };

  const toggleAllowOther = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateField(field.id, {
      allowOther: !field.allowOther,
    });
  };

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Options Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Options ({options.length})
          </span>
          <Badge variant="outline" className="text-xs">
            {field.displayOptions?.inline ? "Horizontal" : "Vertical"}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={toggleLayout}
            title="Toggle layout"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={addOption}
            title="Add option"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-dashed border-muted-foreground/30 hover:bg-muted/50 transition-colors group"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab opacity-50" />
            <div className="w-3 h-3 border border-primary rounded-full flex-shrink-0" />

            {editingIndex === index ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={saveOptionEdit}
                onKeyDown={handleOptionKeyDown}
                className="h-6 text-xs flex-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className="text-xs flex-1 cursor-text hover:text-primary"
                onClick={(e) => startEditingOption(index, e)}
              >
                {option}
              </span>
            )}

            {options.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100"
                onClick={(e) => removeOption(index, e)}
                title="Remove option"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}

        {/* Allow Other Option */}
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded border border-dashed border-muted-foreground/20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Allow "Other" option
            </span>
          </div>
          <Switch
            checked={field.allowOther || false}
            onCheckedChange={() => toggleAllowOther({} as React.MouseEvent)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-muted-foreground/20">
        <span className="text-xs text-muted-foreground">
          Layout: {field.displayOptions?.inline ? "Horizontal" : "Vertical"}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-6 text-xs px-2"
          onClick={addOption}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Option
        </Button>
      </div>
    </div>
  );
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
  const { field, onUpdateField } = props;

  // Generate field info badge
  const fieldInfo = (
    <>
      <Badge variant="secondary" className="text-xs">
        {field.options?.length || 0} options
      </Badge>
      {field.allowOther && (
        <Badge variant="outline" className="text-xs">
          + Other
        </Badge>
      )}
    </>
  );

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo}>
      <MCQOptionsManager field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
