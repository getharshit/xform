// src/components/form-builder/field-types/text-fields/Website.tsx

"use client";

import React from "react";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

interface WebsiteProps
  extends Omit<
    BaseQuestionTileProps,
    "children" | "fieldInfo" | "expandable"
  > {}

export const Website: React.FC<WebsiteProps> = (props) => {
  const { field } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      {/* Website fields don't need expandable content */}
    </BaseQuestionTile>
  );
};
