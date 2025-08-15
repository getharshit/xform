"use client";

import React from "react";
import { useController } from "react-hook-form";
import { motion } from "framer-motion";
import { ExtendedFormField } from "../../types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, Phone, Check } from "lucide-react";

interface PhoneNumberFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
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
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message:
          field.validationRules?.customMessage ||
          "Please enter a valid phone number",
      },
      minLength: {
        value: 10,
        message: "Phone number must be at least 10 digits",
      },
      maxLength: {
        value: field.maxLength || 20,
        message: `Maximum ${field.maxLength || 20} characters allowed`,
      },
    },
  });

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    // Remove all non-digit characters except +
    const phoneNumber = value.replace(/[^\d+]/g, "");

    // Handle international numbers starting with +
    if (phoneNumber.startsWith("+")) {
      return phoneNumber;
    }

    // Format US phone numbers
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    controllerField.onChange(formatted);
  };

  const hasError = !!error && isTouched;
  const isValid = !error && isTouched && controllerField.value;

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="phone-field space-y-2">
        {/* Input with Icon */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone
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
            value={controllerField.value || ""}
            onChange={handleChange}
            onBlur={controllerField.onBlur}
            name={controllerField.name}
            id={field.id}
            type="tel"
            placeholder={field.placeholder || "(555) 123-4567"}
            maxLength={field.maxLength || 20}
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
            autoComplete="tel"
          />

          {/* Success Icon */}
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check
                  className="w-5 h-5"
                  style={{ color: "var(--form-color-success, #10B981)" }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Format Help Text */}
        <div
          className="text-xs"
          style={{ color: "var(--form-text-secondary, #6B7280)" }}
        >
          Format: (555) 123-4567 or +1 555 123 4567
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

        {/* Success Message */}
        {isValid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 text-sm"
            style={{ color: "var(--form-color-success, #10B981)" }}
          >
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Valid phone number</span>
          </motion.div>
        )}
      </div>
    </QuestionContainer>
  );
};
