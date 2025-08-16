// src/components/form-builder/field-types/special-fields/Statement.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type StatementProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;
// Statement Configuration Component
interface StatementConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const StatementConfig: React.FC<StatementConfigProps> = ({
  field,
  onUpdateField,
}) => {
  const [content, setContent] = useState(field.description || "");
  const variant = field.displayOptions?.variant || "default";

  // Visual variant options
  const variantOptions = [
    {
      value: "default",
      label: "Default",
      bg: "bg-background",
      border: "border-border",
    },
    {
      value: "info",
      label: "Info Box",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      value: "warning",
      label: "Warning Box",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      value: "success",
      label: "Success Box",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      value: "highlight",
      label: "Highlight Box",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
  ];

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdateField(field.id, { description: value });
  };

  const handleVariantChange = (newVariant: string) => {
    onUpdateField(field.id, {
      displayOptions: {
        ...field.displayOptions,
        variant: newVariant,
      },
    });
  };

  const insertRichTextTag = (tag: string) => {
    const textarea = document.querySelector(
      `textarea[data-field="${field.id}"]`
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let insertion = "";
    switch (tag) {
      case "bold":
        insertion = `<strong>${selectedText || "bold text"}</strong>`;
        break;
      case "italic":
        insertion = `<em>${selectedText || "italic text"}</em>`;
        break;
      case "link":
        insertion = `<a href="https://example.com">${
          selectedText || "link text"
        }</a>`;
        break;
      case "heading":
        insertion = `<h3>${selectedText || "Heading"}</h3>`;
        break;
      case "list":
        insertion = `<ul><li>${selectedText || "List item"}</li></ul>`;
        break;
    }

    const newContent =
      content.substring(0, start) + insertion + content.substring(end);
    handleContentChange(newContent);
  };

  const getCurrentVariant = () => {
    return variantOptions.find((v) => v.value === variant) || variantOptions[0];
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Content</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("bold")}
            >
              <strong>B</strong>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("italic")}
            >
              <em>I</em>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("link")}
            >
              🔗
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("heading")}
            >
              H3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("list")}
            >
              •
            </Button>
          </div>
        </div>

        <Textarea
          data-field={field.id}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your statement content with HTML formatting..."
          className="min-h-[100px] text-sm font-mono"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          💡 <strong>Tip:</strong> Use HTML tags for formatting. Select text and
          click buttons above to insert tags.
        </div>
      </div>
    </div>
  );
};

export const Statement: React.FC<StatementProps> = (props) => {
  const { field, onUpdateField } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      <StatementConfig field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
