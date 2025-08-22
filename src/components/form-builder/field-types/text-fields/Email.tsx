// src/components/form-builder/field-types/text-fields/Email.tsx

"use client";

import React from "react";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type EmailProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;
export const Email: React.FC<EmailProps> = (props) => {
  const { field } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      {/* Email fields don't need expandable content */}
    </BaseQuestionTile>
  );
};
