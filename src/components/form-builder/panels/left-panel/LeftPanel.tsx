// src/components/form-builder/panels/left-panel/LeftPanel.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useBuilder } from "../../providers/BuilderProvider";
import { QuestionTile } from "../../field-types/shared/QuestionTile";

export interface LeftPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

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
    updateField,
    reorderFields,
    fieldCount,
  } = useBuilder();

  // Get form fields from state
  const formFields = form?.fields || [];

  const handleFieldSelect = (fieldId: string) => {
    selectField(fieldId === selectedFieldId ? null : fieldId);
  };

  const handleFieldDuplicate = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    duplicateField(fieldId);
  };

  const handleFieldDelete = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this field?")) {
      deleteField(fieldId);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      reorderFields(sourceIndex, destinationIndex);
    }
  };

  return (
    <div className={`border-r bg-card flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Form Questions</h3>
        </div>
      </div>

      {/* Form Fields List */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {formFields.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Type className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No questions added yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the "Add Question" button to start building your form
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 ${
                      snapshot.isDraggingOver
                        ? "bg-primary/5 rounded-lg p-2"
                        : ""
                    }`}
                  >
                    {formFields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <QuestionTile
                              field={field}
                              index={index}
                              isSelected={field.id === selectedFieldId}
                              isDragging={snapshot.isDragging}
                              onSelect={handleFieldSelect}
                              onDuplicate={handleFieldDuplicate}
                              onDelete={handleFieldDelete}
                              onUpdateField={updateField}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
