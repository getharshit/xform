// src/components/form-builder/field-types/text-fields/PhoneNumber.tsx

"use client";

import React from "react";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type PhoneNumberProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

export const PhoneNumber: React.FC<PhoneNumberProps> = (props) => {
  const { field } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      {/* Phone number fields don't need expandable content */}
    </BaseQuestionTile>
  );
};
