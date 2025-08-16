// src/components/form-builder/field-types/structure-fields/PageBreak.tsx

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type PageBreakProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// Page Break Configuration Component
interface PageBreakConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const PageBreakConfig: React.FC<PageBreakConfigProps> = ({
  field,
  onUpdateField,
}) => {
  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Page Break Preview */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Preview</Label>
        <Card className="p-3 bg-muted/30 border-dashed">
          <div className="text-center space-y-2">
            <Separator className="my-2" />
            <div className="flex items-center justify-center gap-2">
              <div className="text-xs font-medium text-muted-foreground">
                Page Break
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        </Card>
      </div>

      {/* Page Break Info */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded space-y-1">
        <div>
          <strong>Purpose:</strong> Divides form into multiple pages/sections
        </div>
        <div>
          <strong>Effect:</strong> Creates a natural break point for better user
          experience
        </div>
        <div>
          <strong>Navigation:</strong> Users can navigate between sections
        </div>
      </div>
    </div>
  );
};

export const PageBreak: React.FC<PageBreakProps> = (props) => {
  const { field, index } = props;

  // Generate field info badge - show page number
  const pageNumber = index + 1; // Since page breaks create new pages
  const fieldInfo = (
    <Badge variant="default" className="text-xs">
      Page {pageNumber}
    </Badge>
  );

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo}>
      <PageBreakConfig field={field} onUpdateField={props.onUpdateField} />
    </BaseQuestionTile>
  );
};
