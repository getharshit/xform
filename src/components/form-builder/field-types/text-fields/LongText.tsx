// src/components/form-builder/field-types/text-fields/LongText.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type LongTextProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

export const LongText: React.FC<LongTextProps> = (props) => {
  const { field } = props;

  // Generate field info badge - show character limits and rich text support
  const fieldInfo = () => {
    const badges = [];

    if (field.maxLength) {
      badges.push(
        <Badge key="maxLength" variant="secondary" className="text-xs">
          Max: {field.maxLength} chars
        </Badge>
      );
    }

    if (field.minLength) {
      badges.push(
        <Badge key="minLength" variant="outline" className="text-xs">
          Min: {field.minLength} chars
        </Badge>
      );
    }

    if (badges.length === 0 && field.placeholder) {
      badges.push(
        <Badge key="placeholder" variant="secondary" className="text-xs">
          Has placeholder
        </Badge>
      );
    }

    return badges.length > 0 ? (
      <div className="flex gap-1">{badges}</div>
    ) : null;
  };

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo()}>
      {/* Long text fields don't need expandable content */}
    </BaseQuestionTile>
  );
};
