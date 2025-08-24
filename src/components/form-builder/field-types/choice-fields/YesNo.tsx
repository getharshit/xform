// src/components/form-builder/field-types/choice-fields/YesNo.tsx

"use client";

import React from "react";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type YesNoProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

export const YesNo: React.FC<YesNoProps> = (props) => {
  const { field } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      {/* Yes/No fields don't need expandable content */}
    </BaseQuestionTile>
  );
};
