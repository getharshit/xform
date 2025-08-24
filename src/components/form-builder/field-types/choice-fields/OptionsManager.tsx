// src/components/form-builder/field-types/choice-fields/OptionsManager.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormField } from "@/types";

interface OptionsManagerProps {
  field: FormField;
  onFieldUpdate: (updates: Partial<FormField>) => void;
}

export const OptionsManager: React.FC<OptionsManagerProps> = ({
  field,
  onFieldUpdate,
}) => {
  const options = field.options || ["Option 1", "Option 2"];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    onFieldUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onFieldUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      onFieldUpdate({ options: newOptions });
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

    onFieldUpdate({ options: newOptions });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(options[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      updateOption(
        editingIndex,
        editingValue.trim() || `Option ${editingIndex + 1}`
      );
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Options ({options.length})</Label>
        <Button size="sm" onClick={addOption}>
          <Plus className="w-4 h-4 mr-1" />
          Add Option
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="options">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 ${
                snapshot.isDraggingOver ? "bg-primary/5 rounded-lg p-2" : ""
              }`}
            >
              {options.map((option: string, index: number) => (
                <Draggable
                  key={`option-${index}`}
                  draggableId={`option-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-3 transition-all ${
                        snapshot.isDragging
                          ? "shadow-lg rotate-2 scale-105 bg-primary/10"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab hover:cursor-grabbing"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Radio Button Visual */}
                        <div className="w-4 h-4 border-2 border-primary rounded-full flex-shrink-0" />

                        {/* Option Input */}
                        {editingIndex === index ? (
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={handleKeyDown}
                            placeholder="Option text"
                            className="flex-1"
                            autoFocus
                          />
                        ) : (
                          <div
                            className="flex-1 cursor-text hover:text-primary text-sm"
                            onClick={() => startEditing(index)}
                          >
                            {option}
                          </div>
                        )}

                        {/* Remove Button */}
                        {options.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="text-xs text-muted-foreground">
        💡 Tip: Drag options to reorder them, click to edit text
      </div>
    </div>
  );
};
