"use client";

import React from "react";
import { useController } from "react-hook-form";
import { motion } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle } from "lucide-react";

interface ShortTextFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const ShortTextField: React.FC<ShortTextFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();

  const {
    field: controllerField,
    fieldState: { error, isTouched },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
      maxLength: {
        value: field.maxLength || 255,
        message: `Maximum ${field.maxLength || 255} characters allowed`,
      },
      minLength: field.minLength
        ? {
            value: field.minLength,
            message: `Minimum ${field.minLength} characters required`,
          }
        : undefined,
      pattern: field.validationRules?.pattern
        ? {
            value: new RegExp(field.validationRules.pattern),
            message: field.validationRules.customMessage || "Invalid format",
          }
        : undefined,
    },
  });

  const hasError = !!error && isTouched;
  const currentLength = controllerField.value?.length || 0;
  const maxLength = field.maxLength || 255;

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="short-text-field space-y-2">
        {/* Input */}
        <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <input
            {...controllerField}
            id={field.id}
            type="text"
            placeholder={field.placeholder || "Type your answer here..."}
            maxLength={maxLength}
            className="w-full px-4 py-3 text-base border transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={
              {
                borderColor: hasError
                  ? "var(--form-color-error, #ef4444)"
                  : "var(--form-color-border, #d1d5db)",
                borderRadius: "var(--form-border-radius, 8px)",
                borderWidth: "var(--form-border-width, 1px)",
                backgroundColor: hasError
                  ? "var(--form-color-error, #ef4444)10" // 10% opacity
                  : "var(--form-color-surface, #ffffff)",
                color: "var(--form-color-text, #1f2937)",
                fontSize: "var(--form-font-size-input, 16px)",
                fontFamily: "var(--form-font-family, inherit)",
                "--tw-ring-color": "var(--form-color-primary, #3b82f6)",
              } as React.CSSProperties
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.id}` : undefined}
          />
        </motion.div>

        {/* Character Counter */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex-1">{/* Error will be displayed here */}</div>
          <div
            className={`character-counter ${
              currentLength > maxLength * 0.9 ? "text-orange-600" : ""
            }`}
            style={{
              color:
                currentLength > maxLength * 0.9
                  ? "var(--form-color-warning, #f59e0b)"
                  : "var(--form-color-text-secondary, #6b7280)",
              fontSize: "var(--form-font-size-small, 12px)",
            }}
          >
            {currentLength}/{maxLength}
          </div>
        </div>

        {/* Error Message */}
        <AnimatedErrorMessage isVisible={hasError}>
          <div
            id={`error-${field.id}`}
            className="flex items-start gap-2 text-sm"
            role="alert"
            aria-live="polite"
            style={{
              color: "var(--form-color-error, #ef4444)",
              fontSize: "var(--form-font-size-small, 14px)",
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error?.message}</span>
          </div>
        </AnimatedErrorMessage>
      </div>
    </QuestionContainer>
  );
};
