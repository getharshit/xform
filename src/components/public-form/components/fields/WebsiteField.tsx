"use client";

import React from "react";
import { useController } from "react-hook-form";
import { motion } from "framer-motion";
import { ExtendedFormField } from "../../types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, Globe, Check, ExternalLink } from "lucide-react";

interface WebsiteFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const WebsiteField: React.FC<WebsiteFieldProps> = ({
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
      pattern: {
        value:
          /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        message:
          field.validationRules?.customMessage ||
          "Please enter a valid URL (e.g., https://example.com)",
      },
      maxLength: {
        value: field.maxLength || 500,
        message: `Maximum ${field.maxLength || 500} characters allowed`,
      },
    },
  });

  const hasError = !!error && isTouched;
  const isValid = !error && isTouched && controllerField.value;

  // Auto-add https:// if missing
  const handleBlur = () => {
    const value = controllerField.value;
    if (
      value &&
      !value.startsWith("http://") &&
      !value.startsWith("https://")
    ) {
      controllerField.onChange(`https://${value}`);
    }
    controllerField.onBlur();
  };

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="website-field space-y-2">
        {/* Input with Icon */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe
              className="w-5 h-5"
              style={{
                color: hasError
                  ? "var(--form-color-error, #EF4444)"
                  : isValid
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-text-secondary, #6B7280)",
              }}
            />
          </div>

          <input
            {...controllerField}
            id={field.id}
            type="url"
            placeholder={field.placeholder || "https://example.com"}
            maxLength={field.maxLength || 500}
            onBlur={handleBlur}
            className={`
              w-full pl-10 pr-10 py-3 text-base border rounded-lg
              focus:ring-2 focus:border-transparent
              transition-colors duration-200
              disabled:cursor-not-allowed
              ${hasError ? "ring-2" : "focus:ring-2"}
            `}
            style={
              {
                borderColor: hasError
                  ? "var(--form-color-error, #EF4444)"
                  : isValid
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-border-color, #D1D5DB)",
                backgroundColor: hasError
                  ? "var(--form-color-error-background, #FEF2F2)"
                  : isValid
                  ? "var(--form-color-success-background, #F0FDF4)"
                  : "var(--form-background-color, #FFFFFF)",
                color: "var(--form-text-color, #1F2937)",
                "--tw-ring-color": hasError
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-color-primary, #3B82F6)",
              } as React.CSSProperties
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.id}` : undefined}
            autoComplete="url"
          />

          {/* Success Icon with Link */}
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <Check
                  className="w-5 h-5"
                  style={{ color: "var(--form-color-success, #10B981)" }}
                />

                <a
                  href={controllerField.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{
                    color: "var(--form-color-primary, #3B82F6)",
                  }}
                  title="Open link in new tab"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      "var(--form-color-primary-hover, #2563EB)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      "var(--form-color-primary, #3B82F6)";
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          )}
        </motion.div>

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

        {/* Success Message */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between text-sm"
            style={{ color: "var(--form-color-success, #10B981)" }}
          >
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Valid URL</span>
            </div>

            <a
              href={controllerField.value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs transition-colors"
              style={{
                color: "var(--form-color-primary, #3B82F6)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--form-color-primary-hover, #2563EB)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--form-color-primary, #3B82F6)";
              }}
            >
              Preview <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </div>
    </QuestionContainer>
  );
};
