"use client";

import React from "react";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../providers/FormProvider";
import { FieldRenderer } from "./FieldRenderer";

interface FormQuestionProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  showValidation?: boolean;
  className?: string;
}

export const FormQuestion: React.FC<FormQuestionProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  showValidation = true,
  className = "",
}) => {
  // For the new field components, we don't need the wrapper since they handle everything internally
  // The new field components (ShortTextField, EmailField, etc.) include their own QuestionContainer

  return (
    <div className={`form-question ${className}`}>
      <FieldRenderer
        field={field}
        questionNumber={questionNumber}
        showQuestionNumber={showQuestionNumber}
      />
    </div>
  );
};
