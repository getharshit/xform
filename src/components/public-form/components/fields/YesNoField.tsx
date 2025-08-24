"use client";

import React from "react";
import { useController } from "react-hook-form";
import { motion } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, Check, X } from "lucide-react";

interface YesNoFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  variant?: "toggle" | "buttons";
  className?: string;
}

export const YesNoField: React.FC<YesNoFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  variant = "buttons",
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
    },
  });

  const hasError = !!error && isTouched;

  const handleSelection = (value: "yes" | "no") => {
    controllerField.onChange(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent, value: "yes" | "no") => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleSelection(value);
    }
  };

  const renderToggleVariant = () => (
    <div className="toggle-container flex items-center justify-center">
      <div className="flex items-center gap-4">
        {/* No Label */}
        <span
          className="text-sm font-medium"
          style={{ color: "var(--form-text-color, #1F2937)" }}
        >
          No
        </span>

        {/* Toggle Switch */}
        <motion.button
          type="button"
          onClick={() =>
            handleSelection(controllerField.value === "yes" ? "no" : "yes")
          }
          className="relative w-14 h-7 rounded-full border-2 focus:outline-none focus:ring-2"
          style={
            {
              backgroundColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-border-color, #E5E7EB)",
              borderColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-border-color, #D1D5DB)",
              "--tw-ring-color": "var(--form-color-primary, #3B82F6)",
            } as React.CSSProperties
          }
          whileTap={{ scale: 0.95 }}
          aria-pressed={controllerField.value === "yes"}
          aria-labelledby={`question-${field.id}`}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full shadow-md flex items-center justify-center"
            style={{
              backgroundColor: "var(--form-background-color, #FFFFFF)",
            }}
            animate={{
              x: controllerField.value === "yes" ? 28 : 2,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          >
            {controllerField.value === "yes" ? (
              <Check
                className="w-3 h-3"
                style={{ color: "var(--form-color-success, #10B981)" }}
              />
            ) : (
              <X
                className="w-3 h-3"
                style={{ color: "var(--form-text-secondary, #6B7280)" }}
              />
            )}
          </motion.div>
        </motion.button>

        {/* Yes Label */}
        <span
          className="text-sm font-medium"
          style={{ color: "var(--form-text-color, #1F2937)" }}
        >
          Yes
        </span>
      </div>
    </div>
  );

  const renderButtonsVariant = () => (
    <div
      className="buttons-container flex gap-3"
      role="radiogroup"
      aria-labelledby={`question-${field.id}`}
    >
      {/* Yes Button */}
      <motion.button
        type="button"
        onClick={() => handleSelection("yes")}
        onKeyDown={(e) => handleKeyDown(e, "yes")}
        className={`
          flex-1 py-4 px-6 rounded-lg border-2 font-medium text-center
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
        style={
          {
            borderColor:
              controllerField.value === "yes"
                ? "var(--form-color-success, #10B981)"
                : hasError
                ? "var(--form-color-error, #EF4444)"
                : "var(--form-border-color, #D1D5DB)",
            backgroundColor:
              controllerField.value === "yes"
                ? "var(--form-color-success-background, #F0FDF4)"
                : "var(--form-background-color, #FFFFFF)",
            color:
              controllerField.value === "yes"
                ? "var(--form-color-success, #10B981)"
                : hasError
                ? "var(--form-color-error, #EF4444)"
                : "var(--form-text-color, #1F2937)",
            "--tw-ring-color": "var(--form-color-success, #10B981)",
          } as React.CSSProperties
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="radio"
        aria-checked={controllerField.value === "yes"}
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-border-color, #D1D5DB)",
              backgroundColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "transparent",
            }}
            animate={{
              borderColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "var(--form-border-color, #D1D5DB)",
              backgroundColor:
                controllerField.value === "yes"
                  ? "var(--form-color-success, #10B981)"
                  : "transparent",
            }}
          >
            {controllerField.value === "yes" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>
          <span>Yes</span>
        </div>
      </motion.button>

      {/* No Button */}
      <motion.button
        type="button"
        onClick={() => handleSelection("no")}
        onKeyDown={(e) => handleKeyDown(e, "no")}
        className={`
          flex-1 py-4 px-6 rounded-lg border-2 font-medium text-center
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
        style={
          {
            borderColor:
              controllerField.value === "no"
                ? "var(--form-color-error, #EF4444)"
                : hasError
                ? "var(--form-color-error, #EF4444)"
                : "var(--form-border-color, #D1D5DB)",
            backgroundColor:
              controllerField.value === "no"
                ? "var(--form-color-error-background, #FEF2F2)"
                : "var(--form-background-color, #FFFFFF)",
            color:
              controllerField.value === "no"
                ? "var(--form-color-error, #EF4444)"
                : hasError
                ? "var(--form-color-error, #EF4444)"
                : "var(--form-text-color, #1F2937)",
            "--tw-ring-color": "var(--form-color-error, #EF4444)",
          } as React.CSSProperties
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        role="radio"
        aria-checked={controllerField.value === "no"}
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor:
                controllerField.value === "no"
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-border-color, #D1D5DB)",
              backgroundColor:
                controllerField.value === "no"
                  ? "var(--form-color-error, #EF4444)"
                  : "transparent",
            }}
            animate={{
              borderColor:
                controllerField.value === "no"
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-border-color, #D1D5DB)",
              backgroundColor:
                controllerField.value === "no"
                  ? "var(--form-color-error, #EF4444)"
                  : "transparent",
            }}
          >
            {controllerField.value === "no" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.div>
          <span>No</span>
        </div>
      </motion.button>
    </div>
  );

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="yes-no-field space-y-4">
        {/* Render based on variant */}
        {variant === "toggle" ? renderToggleVariant() : renderButtonsVariant()}

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
