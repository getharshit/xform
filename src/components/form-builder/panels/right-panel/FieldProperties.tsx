import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Plus, X } from "lucide-react";
import { FileText } from "lucide-react";
import { FormField } from "@/types/form";

export interface FieldPropertiesProps {
  selectedField?: FormField | null;
  onFieldUpdate?: (updates: Partial<FormField>) => void;
}

export const FieldProperties: React.FC<FieldPropertiesProps> = ({
  selectedField,
  onFieldUpdate,
}) => {
  if (!selectedField) {
    return (
      <div className="p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h4 className="font-medium mb-2">No field selected</h4>
        <p className="text-sm text-muted-foreground">
          Select a field from the canvas to edit its properties
        </p>
      </div>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate?.(updates);
  };

  // Helper function to update options for choice fields
  const updateOptions = (newOptions: string[]) => {
    updateField({ options: newOptions });
  };

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    const newOption = `Option ${currentOptions.length + 1}`;
    updateOptions([...currentOptions, newOption]);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = selectedField.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    updateOptions(newOptions);
  };

  const removeOption = (index: number) => {
    const currentOptions = selectedField.options || [];
    if (currentOptions.length > 1) {
      updateOptions(currentOptions.filter((_, i) => i !== index));
    }
  };

  const getFieldTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
      shortText: "Short Text",
      longText: "Long Text",
      email: "Email",
      website: "Website",
      phoneNumber: "Phone Number",
      multipleChoice: "Multiple Choice",
      dropdown: "Dropdown",
      yesNo: "Yes/No",
      opinionScale: "Opinion Scale",
      numberRating: "Rating Scale",
      statement: "Statement",
      legal: "Legal",
      fileUpload: "File Upload",
      pageBreak: "Page Break",
      startingPage: "Starting Page",
      postSubmission: "Thank You Page",
    };
    return typeNames[type] || type;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Field Type Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {getFieldTypeName(selectedField.type)}
        </Badge>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Properties */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Basic Properties</h4>

        <div>
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={selectedField.label || ""}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label htmlFor="field-description">Description (Optional)</Label>
          <Textarea
            id="field-description"
            value={selectedField.description || ""}
            onChange={(e) => updateField({ description: e.target.value })}
            placeholder="Add helpful description"
            rows={2}
          />
        </div>

        {/* Placeholder for text fields */}
        {[
          "shortText",
          "longText",
          "email",
          "website",
          "phoneNumber",
          "dropdown",
        ].includes(selectedField.type) && (
          <div>
            <Label htmlFor="field-placeholder">Placeholder Text</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder || ""}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {/* Help Text */}
        <div>
          <Label htmlFor="field-help">Help Text (Optional)</Label>
          <Input
            id="field-help"
            value={selectedField.helpText || ""}
            onChange={(e) => updateField({ helpText: e.target.value })}
            placeholder="Additional help for users"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required Field</Label>
          <Switch
            id="field-required"
            checked={selectedField.required || false}
            onCheckedChange={(checked) => updateField({ required: checked })}
          />
        </div>
      </div>

      <Separator />

      {/* Field-specific properties */}
      {/* Text field validation */}
      {["shortText", "longText"].includes(selectedField.type) && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Text Validation</h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-length">Min Length</Label>
              <Input
                id="min-length"
                type="number"
                value={selectedField.minLength || ""}
                onChange={(e) =>
                  updateField({
                    minLength: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="max-length">Max Length</Label>
              <Input
                id="max-length"
                type="number"
                value={selectedField.maxLength || ""}
                onChange={(e) =>
                  updateField({
                    maxLength: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pattern">Validation Pattern (Regex)</Label>
            <Input
              id="pattern"
              value={selectedField.validationRules?.pattern || ""}
              onChange={(e) =>
                updateField({
                  validationRules: {
                    ...selectedField.validationRules,
                    pattern: e.target.value,
                  },
                })
              }
              placeholder="^[a-zA-Z\\s]+$"
            />
          </div>

          <div>
            <Label htmlFor="custom-message">Custom Error Message</Label>
            <Input
              id="custom-message"
              value={selectedField.validationRules?.customMessage || ""}
              onChange={(e) =>
                updateField({
                  validationRules: {
                    ...selectedField.validationRules,
                    customMessage: e.target.value,
                  },
                })
              }
              placeholder="Please enter a valid value"
            />
          </div>
        </div>
      )}

      {/* Choice field options */}
      {["multipleChoice", "dropdown"].includes(selectedField.type) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Options</h4>
            <Button size="sm" onClick={addOption}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {(selectedField.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder="Option text"
                  className="flex-1"
                />
                {(selectedField.options?.length || 0) > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating field properties */}
      {selectedField.type === "numberRating" && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Rating Scale</h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-rating">Min Rating</Label>
              <Input
                id="min-rating"
                type="number"
                value={selectedField.minRating || 1}
                onChange={(e) =>
                  updateField({ minRating: parseInt(e.target.value) || 1 })
                }
                min={1}
                max={10}
              />
            </div>
            <div>
              <Label htmlFor="max-rating">Max Rating</Label>
              <Input
                id="max-rating"
                type="number"
                value={selectedField.maxRating || 5}
                onChange={(e) =>
                  updateField({ maxRating: parseInt(e.target.value) || 5 })
                }
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Preview:{" "}
            {Array.from(
              {
                length:
                  (selectedField.maxRating || 5) -
                  (selectedField.minRating || 1) +
                  1,
              },
              (_, i) => (selectedField.minRating || 1) + i
            ).join(" - ")}
          </div>
        </div>
      )}

      {/* File upload properties */}
      {selectedField.type === "fileUpload" && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">File Upload Settings</h4>

          <div>
            <Label htmlFor="accepted-types">Accepted File Types</Label>
            <Input
              id="accepted-types"
              value={selectedField.acceptedFileTypes?.join(", ") || ""}
              onChange={(e) =>
                updateField({
                  acceptedFileTypes: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder=".pdf, .jpg, .png"
            />
          </div>

          <div>
            <Label htmlFor="max-file-size">Max File Size (MB)</Label>
            <Input
              id="max-file-size"
              type="number"
              value={selectedField.maxFileSize || ""}
              onChange={(e) =>
                updateField({
                  maxFileSize: parseInt(e.target.value) || undefined,
                })
              }
              placeholder="10"
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Display Options */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Display Options</h4>

        <div>
          <Label>Field Width</Label>
          <Select
            value={selectedField.displayOptions?.width || "full"}
            onValueChange={(value) =>
              updateField({
                displayOptions: {
                  ...selectedField.displayOptions,
                  width: value as "full" | "half" | "third",
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="half">Half Width</SelectItem>
              <SelectItem value="third">One Third</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-label">Show Label</Label>
          <Switch
            id="show-label"
            checked={selectedField.displayOptions?.showLabel !== false}
            onCheckedChange={(checked) =>
              updateField({
                displayOptions: {
                  ...selectedField.displayOptions,
                  showLabel: checked,
                },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-description">Show Description</Label>
          <Switch
            id="show-description"
            checked={selectedField.displayOptions?.showDescription !== false}
            onCheckedChange={(checked) =>
              updateField({
                displayOptions: {
                  ...selectedField.displayOptions,
                  showDescription: checked,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
