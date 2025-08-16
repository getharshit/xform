// src/components/form-builder/field-types/choice-fields/MultipleChoice.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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

// MCQ Options Manager Component with Drag & Drop
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newOptions = Array.from(options);
    const [removed] = newOptions.splice(sourceIndex, 1);
    newOptions.splice(destinationIndex, 0, removed);

    onUpdateField(field.id, { options: newOptions });
  };

  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Options Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Options ({options.length})
          </span>
        </div>
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

      {/* Drag & Drop Options List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`options-${field.id}`}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 ${
                snapshot.isDraggingOver ? "bg-primary/5 rounded-lg p-2" : ""
              }`}
            >
              {options.map((option, index) => (
                <Draggable
                  key={`${field.id}-option-${index}`}
                  draggableId={`${field.id}-option-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-2 p-2 bg-muted/30 rounded border border-dashed border-muted-foreground/30 hover:bg-muted/50 transition-colors group ${
                        snapshot.isDragging
                          ? "shadow-lg rotate-2 scale-105 bg-primary/10 z-50"
                          : ""
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab hover:cursor-grabbing"
                      >
                        <GripVertical className="w-3 h-3 text-muted-foreground" />
                      </div>

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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export const MultipleChoice: React.FC<MultipleChoiceProps> = (props) => {
  const { field, onUpdateField } = props;

  // Generate field info badge - only show options count
  const fieldInfo = (
    <Badge variant="secondary" className="text-xs">
      {field.options?.length || 0} options
    </Badge>
  );

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo}>
      <MCQOptionsManager field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
