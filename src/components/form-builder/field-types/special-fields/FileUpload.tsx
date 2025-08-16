// src/components/form-builder/field-types/special-fields/FileUpload.tsx

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type FileUploadProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// File Upload Configuration Component
interface FileUploadConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const FileUploadConfig: React.FC<FileUploadConfigProps> = ({
  field,
  onUpdateField,
}) => {
  const acceptedFileTypes = field.acceptedFileTypes || [];
  const maxFileSize = field.maxFileSize || 10;
  const [newFileType, setNewFileType] = useState("");

  // Common file type presets
  const fileTypePresets = [
    { label: "Images", types: [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    { label: "Documents", types: [".pdf", ".doc", ".docx", ".txt"] },
    { label: "Spreadsheets", types: [".xls", ".xlsx", ".csv"] },
    { label: "Archives", types: [".zip", ".rar", ".7z"] },
    { label: "Videos", types: [".mp4", ".avi", ".mov", ".wmv"] },
    { label: "Audio", types: [".mp3", ".wav", ".aac", ".ogg"] },
  ];

  const handleAddFileType = () => {
    if (newFileType.trim() && !acceptedFileTypes.includes(newFileType.trim())) {
      const updatedTypes = [...acceptedFileTypes, newFileType.trim()];
      onUpdateField(field.id, { acceptedFileTypes: updatedTypes });
      setNewFileType("");
    }
  };

  const handleRemoveFileType = (typeToRemove: string) => {
    const updatedTypes = acceptedFileTypes.filter(
      (type) => type !== typeToRemove
    );
    onUpdateField(field.id, { acceptedFileTypes: updatedTypes });
  };

  const handleAddPreset = (types: string[]) => {
    const newTypes = [...new Set([...acceptedFileTypes, ...types])];
    onUpdateField(field.id, { acceptedFileTypes: newTypes });
  };

  const handleMaxSizeChange = (value: string) => {
    const size = parseFloat(value) || 10;
    onUpdateField(field.id, { maxFileSize: size });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFileType();
    }
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* File Size Limit */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Maximum File Size (MB)</Label>
        <Input
          type="number"
          value={maxFileSize}
          onChange={(e) => handleMaxSizeChange(e.target.value)}
          className="h-8 text-sm"
          min="0.1"
          max="100"
          step="0.1"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="text-xs text-muted-foreground">
          Recommended: 10MB or less for better user experience
        </div>
      </div>

      {/* File Type Presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Quick Add File Types</Label>
        <div className="flex flex-wrap gap-1">
          {fileTypePresets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => handleAddPreset(preset.types)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom File Types */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Custom File Types</Label>
        <div className="flex gap-2">
          <Input
            value={newFileType}
            onChange={(e) => setNewFileType(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=".pdf, .doc, etc."
            className="h-8 text-sm flex-1"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleAddFileType}
            disabled={!newFileType.trim()}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Add file extensions like .pdf, .jpg, .docx
        </div>
      </div>

      {/* Accepted File Types List */}
      {acceptedFileTypes.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium">
            Accepted File Types ({acceptedFileTypes.length})
          </Label>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {acceptedFileTypes.map((type, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {type}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveFileType(type)}
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">
          Upload Instructions (Optional)
        </Label>
        <Textarea
          value={field.helpText || ""}
          onChange={(e) =>
            onUpdateField(field.id, { helpText: e.target.value })
          }
          placeholder="Add custom instructions for users..."
          className="h-16 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Configuration Summary */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded space-y-1">
        <div>
          <strong>Max Size:</strong> {maxFileSize}MB
        </div>
        <div>
          <strong>File Types:</strong>{" "}
          {acceptedFileTypes.length > 0
            ? acceptedFileTypes.join(", ")
            : "All files allowed"}
        </div>
        <div>
          <strong>Multiple Files:</strong> No (single file only)
        </div>
      </div>
    </div>
  );
};

export const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { field } = props;

  // Generate field info badge - show accepted file types
  const fieldInfo = () => {
    const acceptedTypes = field.acceptedFileTypes || [];

    if (acceptedTypes.length === 0) {
      return (
        <Badge variant="secondary" className="text-xs">
          All files
        </Badge>
      );
    }

    if (acceptedTypes.length <= 3) {
      return (
        <Badge variant="secondary" className="text-xs">
          {acceptedTypes.join(", ")}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-xs">
        {acceptedTypes.slice(0, 2).join(", ")} +{acceptedTypes.length - 2} more
      </Badge>
    );
  };

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo()}>
      <FileUploadConfig field={field} onUpdateField={props.onUpdateField} />
    </BaseQuestionTile>
  );
};
