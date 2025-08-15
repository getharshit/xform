"use client";

import React, { useRef, useEffect } from "react";
import { useController } from "react-hook-form";
import { motion } from "framer-motion";
import { ExtendedFormField } from "../../types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle } from "lucide-react";

interface LongTextFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const LongTextField: React.FC<LongTextFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    field: controllerField,
    fieldState: { error, isTouched },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
      maxLength: {
        value: field.maxLength || 1000,
        message: `Maximum ${field.maxLength || 1000} characters allowed`,
      },
      minLength: field.minLength
        ? {
            value: field.minLength,
            message: `Minimum ${field.minLength} characters required`,
          }
        : undefined,
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
      };

      adjustHeight();
      textarea.addEventListener("input", adjustHeight);

      return () => textarea.removeEventListener("input", adjustHeight);
    }
  }, [controllerField.value]);

  const hasError = !!error && isTouched;
  const currentLength = controllerField.value?.length || 0;
  const maxLength = field.maxLength || 1000;

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="long-text-field space-y-2">
        {/* Textarea */}
        <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <textarea
            {...controllerField}
            ref={textareaRef}
            id={field.id}
            placeholder={
              field.placeholder || "Type your detailed answer here..."
            }
            maxLength={maxLength}
            rows={4}
            className={`
              w-full px-4 py-3 text-base border rounded-lg resize-none
              focus:ring-2 focus:border-transparent
              transition-colors duration-200
              disabled:cursor-not-allowed
              ${hasError ? "ring-2" : "focus:ring-2"}
            `}
            style={
              {
                minHeight: "120px",
                maxHeight: "300px",
                borderColor: hasError
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-border-color, #D1D5DB)",
                backgroundColor: hasError
                  ? "var(--form-color-error-background, #FEF2F2)"
                  : "var(--form-background-color, #FFFFFF)",
                color: "var(--form-text-color, #1F2937)",
                "--tw-ring-color": hasError
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-color-primary, #3B82F6)",
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
            className="character-counter"
            style={{
              color:
                currentLength > maxLength * 0.9
                  ? "var(--form-color-warning, #F59E0B)"
                  : "var(--form-text-secondary, #6B7280)",
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
            style={{ color: "var(--form-color-error, #EF4444)" }}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error?.message}</span>
          </div>
        </AnimatedErrorMessage>
      </div>
    </QuestionContainer>
  );
};
