"use client";

import React, { useState, useRef, useEffect } from "react";
import { useController } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import {
  AlertCircle,
  Check,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LegalFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const LegalField: React.FC<LegalFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  const {
    field: controllerField,
    fieldState: { error, isTouched },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required
        ? field.validationRules?.customMessage ||
          "You must accept the terms to continue"
        : false,
      validate: (value) => {
        if (field.required && !value) {
          return "You must read and accept the terms and conditions";
        }
        return true;
      },
    },
  });

  const hasError = !!error && isTouched;
  const isAccepted = controllerField.value === true;

  // Check if user has scrolled to bottom of terms
  const handleTermsScroll = () => {
    const element = termsRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
      setHasScrolledToBottom(isAtBottom);
    }
  };

  // Auto-scroll detection for expanded terms
  useEffect(() => {
    if (isTermsExpanded && termsRef.current) {
      const element = termsRef.current;
      element.addEventListener("scroll", handleTermsScroll);
      handleTermsScroll(); // Check initial state

      return () => element.removeEventListener("scroll", handleTermsScroll);
    }
  }, [isTermsExpanded]);

  const handleAcceptance = (accepted: boolean) => {
    controllerField.onChange(accepted);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      handleAcceptance(!isAccepted);
    }
  };

  const requiresScrollToAccept =
    field.validationRules?.requireScrollToAccept ?? true;

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="legal-field space-y-4">
        {/* Terms and Conditions Container */}
        <div
          className="terms-container border-2 rounded-lg overflow-hidden"
          style={{
            backgroundColor: "var(--form-background-color, #FFFFFF)",
            borderColor: "var(--form-border-color, #E5E7EB)",
          }}
        >
          {/* Terms Header */}
          <div
            className="terms-header px-4 py-3 border-b"
            style={{
              backgroundColor: "var(--form-background-secondary, #F9FAFB)",
              borderBottomColor: "var(--form-border-color, #E5E7EB)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsTermsExpanded(!isTermsExpanded)}
              className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <div className="flex items-center gap-2">
                <FileText
                  className="w-5 h-5"
                  style={{ color: "var(--form-text-secondary, #6B7280)" }}
                />
                <span
                  className="font-medium"
                  style={{ color: "var(--form-text-color, #1F2937)" }}
                >
                  {field.displayOptions?.termsTitle || "Terms and Conditions"}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isTermsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className="w-5 h-5"
                  style={{ color: "var(--form-text-secondary, #6B7280)" }}
                />
              </motion.div>
            </button>
          </div>

          {/* Terms Content */}
          <AnimatePresence>
            {isTermsExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  ref={termsRef}
                  className="terms-content max-h-64 overflow-y-auto p-4 text-sm leading-relaxed"
                  style={{ color: "var(--form-text-color, #374151)" }}
                  role="region"
                  aria-label="Terms and conditions content"
                  tabIndex={0}
                >
                  {field.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: field.description }}
                    />
                  ) : (
                    <div className="space-y-4">
                      <p>
                        Please read the following terms and conditions
                        carefully.
                      </p>
                      <p>
                        By checking the box below, you acknowledge that you have
                        read, understood, and agree to be bound by these terms.
                      </p>
                    </div>
                  )}

                  {/* External Links */}
                  {field.displayOptions?.externalLinks && (
                    <div className="mt-4 space-y-2">
                      {field.displayOptions.externalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={typeof link === "string" ? link : link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline transition-colors"
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
                          {typeof link === "string" ? link : link.text}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scroll Indicator */}
                {requiresScrollToAccept && !hasScrolledToBottom && (
                  <div
                    className="border-t px-4 py-2"
                    style={{
                      backgroundColor:
                        "var(--form-color-warning-background, #FFFBEB)",
                      borderTopColor: "var(--form-color-warning, #F59E0B)",
                      color: "var(--form-color-warning-text, #92400E)",
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <ChevronDown className="w-3 h-3 animate-bounce" />
                      <span>Please scroll to the bottom to continue</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Acceptance Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.label
            className={`
              flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer
              transition-all duration-200 group
              ${
                !requiresScrollToAccept ||
                hasScrolledToBottom ||
                !isTermsExpanded
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }
            `}
            style={{
              borderColor: isAccepted
                ? "var(--form-color-success, #10B981)"
                : hasError
                ? "var(--form-color-error, #EF4444)"
                : "var(--form-border-color, #E5E7EB)",
              backgroundColor: isAccepted
                ? "var(--form-color-success-background, #F0FDF4)"
                : hasError
                ? "var(--form-color-error-background, #FEF2F2)"
                : "var(--form-background-color, #FFFFFF)",
            }}
            whileHover={{
              scale:
                !requiresScrollToAccept ||
                hasScrolledToBottom ||
                !isTermsExpanded
                  ? 1.01
                  : 1,
            }}
            whileTap={{
              scale:
                !requiresScrollToAccept ||
                hasScrolledToBottom ||
                !isTermsExpanded
                  ? 0.99
                  : 1,
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="checkbox"
            aria-checked={isAccepted}
            aria-describedby={hasError ? `error-${field.id}` : undefined}
            aria-disabled={
              requiresScrollToAccept && !hasScrolledToBottom && isTermsExpanded
            }
          >
            {/* Custom Checkbox */}
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => {
                  if (
                    !requiresScrollToAccept ||
                    hasScrolledToBottom ||
                    !isTermsExpanded
                  ) {
                    handleAcceptance(e.target.checked);
                  }
                }}
                className="sr-only"
                tabIndex={-1}
              />

              <motion.div
                className="w-5 h-5 rounded border-2 flex items-center justify-center"
                style={{
                  borderColor: isAccepted
                    ? "var(--form-color-success, #10B981)"
                    : hasError
                    ? "var(--form-color-error, #EF4444)"
                    : "var(--form-border-color, #D1D5DB)",
                  backgroundColor: isAccepted
                    ? "var(--form-color-success, #10B981)"
                    : "transparent",
                }}
                animate={{
                  borderColor: isAccepted
                    ? "var(--form-color-success, #10B981)"
                    : hasError
                    ? "var(--form-color-error, #EF4444)"
                    : "var(--form-border-color, #D1D5DB)",
                  backgroundColor: isAccepted
                    ? "var(--form-color-success, #10B981)"
                    : "transparent",
                }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence>
                  {isAccepted && (
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

            {/* Acceptance Text */}
            <div className="flex-1">
              <span
                className="text-sm leading-relaxed"
                style={{
                  color: isAccepted
                    ? "var(--form-color-success, #10B981)"
                    : "var(--form-text-color, #1F2937)",
                }}
              >
                {field.label ||
                  "I have read and agree to the terms and conditions"}
              </span>

              {field.required && (
                <span
                  className="ml-1"
                  style={{ color: "var(--form-color-error, #EF4444)" }}
                  aria-label="Required"
                >
                  *
                </span>
              )}

              {field.helpText && (
                <div
                  className="mt-1 text-xs"
                  style={{ color: "var(--form-text-secondary, #6B7280)" }}
                >
                  {field.helpText}
                </div>
              )}
            </div>
          </motion.label>
        </motion.div>

        {/* Warning for scroll requirement */}
        {requiresScrollToAccept && !hasScrolledToBottom && isTermsExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border rounded-lg p-3"
            style={{
              backgroundColor: "var(--form-color-warning-background, #FFFBEB)",
              borderColor: "var(--form-color-warning, #F59E0B)",
            }}
          >
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--form-color-warning-text, #92400E)" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                Please read the complete terms by scrolling to the bottom before
                accepting.
              </span>
            </div>
          </motion.div>
        )}

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
