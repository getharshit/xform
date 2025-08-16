// src/components/form-builder/field-types/QuestionTileDispatcher.tsx

"use client";

import React from "react";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "./shared/BaseQuestionTile";
import { MultipleChoice } from "./choice-fields/MultipleChoice";

// Import other field-specific tiles as they're created
import { ShortText } from "./text-fields/ShortText";
// import { NumberRating } from "./rating-fields/NumberRating";
// ... etc

export const QuestionTileDispatcher: React.FC<BaseQuestionTileProps> = (
  props
) => {
  const { field } = props;

  // Route to field-specific component based on field type
  switch (field.type) {
    case "multipleChoice":
      return <MultipleChoice {...props} />;

    case "dropdown":
      return <MultipleChoice {...props} />; // Dropdown uses same logic as MCQ

    // Add more field types as they're implemented
    case "shortText":
      return <ShortText {...props} />;

    // case 'numberRating':
    //   return <NumberRating {...props} />;

    // case 'email':
    //   return <EmailField {...props} />;

    // For now, fallback to BaseQuestionTile for unimplemented types
    default:
      return <BaseQuestionTile {...props} />;
  }
};
