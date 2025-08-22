// src/components/form-builder/field-types/special-fields/Legal.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type LegalProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// Legal Content Editor Component
interface LegalConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const LegalConfig: React.FC<LegalConfigProps> = ({ field, onUpdateField }) => {
  const [content, setContent] = useState(field.description || "");

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdateField(field.id, { description: value });
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
      case "paragraph":
        insertion = `<p>${selectedText || "Paragraph text"}</p>`;
        break;
    }

    const newContent =
      content.substring(0, start) + insertion + content.substring(end);
    handleContentChange(newContent);
  };

  const insertLegalTemplate = () => {
    const template = `<h3>Terms and Conditions</h3>
<p>By using this service, you agree to the following terms:</p>
<ul>
  <li>You will provide accurate information</li>
  <li>You understand data collection practices</li>
  <li>You consent to the terms outlined herein</li>
</ul>
<p>For complete terms, please visit our <a href="https://example.com/terms">Terms of Service</a> page.</p>`;

    handleContentChange(template);
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Legal Terms Content</Label>
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
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={() => insertRichTextTag("paragraph")}
            >
              ¶
            </Button>
          </div>
        </div>

        <Textarea
          data-field={field.id}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your legal terms and conditions with HTML formatting..."
          className="min-h-[120px] text-sm font-mono"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Content Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div>
          <strong>Character count:</strong> {content.length}
        </div>
        <div>
          <strong>Note:</strong> This creates a checkbox that users must check
          to accept these terms.
        </div>
      </div>
    </div>
  );
};

export const Legal: React.FC<LegalProps> = (props) => {
  const { field, onUpdateField } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      <LegalConfig field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
