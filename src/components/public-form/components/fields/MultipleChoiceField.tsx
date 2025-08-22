"use client";

import React, { useState } from "react";
import { useController } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, Check, Plus } from "lucide-react";

interface MultipleChoiceFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const MultipleChoiceField: React.FC<MultipleChoiceFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

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
  const hasOtherOption =
    field.options?.includes("Other") || field.options?.includes("other");

  // FIXED: Remove duplicates from options to prevent key conflicts
  const uniqueOptions = field.options ? [...new Set(field.options)] : [];

  const handleOptionSelect = (option: string) => {
    if (option.toLowerCase() === "other") {
      setShowOtherInput(true);
      if (otherValue) {
        controllerField.onChange(`Other: ${otherValue}`);
      }
    } else {
      setShowOtherInput(false);
      setOtherValue("");
      controllerField.onChange(option);
    }
  };

  const handleOtherInputChange = (value: string) => {
    setOtherValue(value);
    if (value.trim()) {
      controllerField.onChange(`Other: ${value}`);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    option: string,
    index: number
  ) => {
    const options = uniqueOptions; // Use deduplicated options

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = (index + 1) % options.length;
        const nextElement = document.querySelector(
          `[data-option-index="${nextIndex}"]`
        ) as HTMLElement;
        nextElement?.focus();
        break;

      case "ArrowUp":
        event.preventDefault();
        const prevIndex = index === 0 ? options.length - 1 : index - 1;
        const prevElement = document.querySelector(
          `[data-option-index="${prevIndex}"]`
        ) as HTMLElement;
        prevElement?.focus();
        break;

      case " ":
      case "Enter":
        event.preventDefault();
        handleOptionSelect(option);
        break;
    }
  };

  const isSelected = (option: string) => {
    if (option.toLowerCase() === "other") {
      return controllerField.value?.startsWith("Other:");
    }
    return controllerField.value === option;
  };

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="multiple-choice-field space-y-3">
        {/* Options */}
        <div
          className="options-container space-y-2"
          role="radiogroup"
          aria-labelledby={`question-${field.id}`}
          aria-describedby={hasError ? `error-${field.id}` : undefined}
        >
          {uniqueOptions.map((option, index) => {
            const selected = isSelected(option);
            const isOtherOption = option.toLowerCase() === "other";

            return (
              <motion.div
                key={`${field.id}-option-${index}-${option}`} // FIXED: Use unique key combining field ID, index, and option
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="option-wrapper"
              >
                <motion.label
                  className="relative flex items-center gap-3 p-4 border-2 cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={
                    {
                      borderColor: selected
                        ? "var(--form-color-primary, #3b82f6)"
                        : hasError
                        ? "var(--form-color-error, #ef4444)"
                        : "var(--form-color-border, #d1d5db)",
                      backgroundColor: selected
                        ? "var(--form-color-primary, #3b82f6)10" // 10% opacity
                        : hasError
                        ? "var(--form-color-error, #ef4444)05" // 5% opacity
                        : "var(--form-color-background, #ffffff)",
                      borderRadius: "var(--form-border-radius, 8px)",
                      "--tw-ring-color": "var(--form-color-primary, #3b82f6)",
                    } as React.CSSProperties
                  }
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onKeyDown={(e) => handleKeyDown(e, option, index)}
                  tabIndex={0}
                  data-option-index={index}
                  role="radio"
                  aria-checked={selected}
                  aria-describedby={hasError ? `error-${field.id}` : undefined}
                >
                  {/* Custom Radio Button */}
                  <div className="relative flex-shrink-0">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={selected}
                      onChange={() => handleOptionSelect(option)}
                      className="sr-only"
                      tabIndex={-1}
                    />

                    <motion.div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: selected
                          ? "var(--form-color-primary, #3b82f6)"
                          : "var(--form-color-border, #d1d5db)",
                        backgroundColor: selected
                          ? "var(--form-color-primary, #3b82f6)"
                          : "transparent",
                      }}
                      animate={{
                        borderColor: selected
                          ? "var(--form-color-primary, #3b82f6)"
                          : "var(--form-color-border, #d1d5db)",
                        backgroundColor: selected
                          ? "var(--form-color-primary, #3b82f6)"
                          : "transparent",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Option Text */}
                  <span
                    className="flex-1 font-medium"
                    style={{
                      color: selected
                        ? "var(--form-color-primary, #3b82f6)"
                        : "var(--form-color-text, #374151)",
                      fontSize: "var(--form-font-size-input, 16px)",
                      fontFamily: "var(--form-font-family, inherit)",
                      fontWeight: "var(--form-font-weight-medium, 500)",
                    }}
                  >
                    {isOtherOption ? (
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Other
                      </span>
                    ) : (
                      option
                    )}
                  </span>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "var(--form-color-success, #10b981)",
                        }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.label>

                {/* Other Input Field */}
                {isOtherOption && (
                  <AnimatePresence>
                    {showOtherInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 ml-8"
                      >
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={otherValue}
                          onChange={(e) =>
                            handleOtherInputChange(e.target.value)
                          }
                          className="w-full px-3 py-2 border focus:ring-2 focus:outline-none"
                          style={
                            {
                              borderColor: "var(--form-color-border, #d1d5db)",
                              borderRadius: "var(--form-border-radius, 6px)",
                              fontSize: "var(--form-font-size-input, 16px)",
                              fontFamily: "var(--form-font-family, inherit)",
                              "--tw-ring-color":
                                "var(--form-color-primary, #3b82f6)",
                            } as React.CSSProperties
                          }
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
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
