"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedForm, FormState, NavigationConfig } from "../types";
import { useFormContext } from "../providers/FormProvider";
import { FormQuestion } from "../components/FormQuestion";
import {
  AnimatedButton,
  AnimatedProgressIndicator,
} from "../animation/components";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  ArrowUp,
  ArrowDown,
  Keyboard,
  AlertCircle,
  X,
} from "lucide-react";

interface SingleColumnLayoutProps {
  form: ExtendedForm;
  state: FormState;
  children?: React.ReactNode;
}

export const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({
  form,
  state,
  children,
}) => {
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>(
    {}
  );

  // SIMPLIFIED: Remove problematic dependencies, keep it simple
  useEffect(() => {
    const updateBackground = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      const backgroundType = computedStyle
        .getPropertyValue("--form-background-type")
        .trim()
        .replace(/['"]/g, "");
      const backgroundValue = computedStyle
        .getPropertyValue("--form-background-value")
        .trim()
        .replace(/['"]/g, "");
      const backgroundPattern = computedStyle
        .getPropertyValue("--form-background-pattern")
        .trim()
        .replace(/['"]/g, "");

      console.log("🎨 Background update triggered:", {
        backgroundType,
        backgroundValue,
        backgroundPattern,
      });

      let newStyle: React.CSSProperties = {};

      if (
        backgroundType === "gradient" &&
        backgroundValue.includes("linear-gradient")
      ) {
        newStyle = {
          backgroundColor: "transparent",
          backgroundImage: backgroundValue,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          backgroundPosition: "center",
        };
        console.log("🌈 Applied gradient:", backgroundValue);
      } else if (backgroundType === "pattern") {
        const backgroundColor = computedStyle
          .getPropertyValue("--form-color-background")
          .trim()
          .replace(/['"]/g, "");

        newStyle = {
          backgroundColor: backgroundColor || "#ffffff",
          backgroundImage:
            backgroundPattern !== "none" ? backgroundPattern : "none",
          backgroundSize: "var(--form-background-pattern-size, 20px)",
          backgroundRepeat: "repeat",
          backgroundAttachment: "scroll",
          backgroundPosition: "center",
        };
        console.log("🔲 Applied pattern:", {
          backgroundColor,
          backgroundPattern,
        });
      } else {
        newStyle = {
          backgroundColor: backgroundValue || "#ffffff",
          backgroundImage: "none",
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          backgroundPosition: "center",
        };
        console.log("🎨 Applied solid:", backgroundValue);
      }

      setBackgroundStyle(newStyle);
    };

    // Update immediately
    updateBackground();

    // SIMPLIFIED: Only depend on properties we know exist and matter
  }, [
    form?.customization?.colors, // Watch the entire colors object
    form?.theme, // Watch the entire theme object
    form?.id, // Watch form ID changes
  ]); // This will trigger when any theme/customization changes occur

  // Dynamic button styles using CSS properties
  const getButtonStyle = (
    variant: "primary" | "secondary",
    isSubmit: boolean = false
  ) => {
    const baseStyle: React.CSSProperties = {
      padding: "var(--form-button-padding, 0.75rem 1.5rem)",
      fontSize: "var(--form-button-font-size, 1rem)",
      borderRadius: "var(--form-border-radius, 8px)",
      fontWeight: "var(--form-font-weight-medium, 500)",
      transition: "all 200ms ease",
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--form-spacing-xs, 0.5rem)",
    };

    const buttonStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--form-button-style")
        .trim() || "filled";

    if (variant === "primary") {
      const backgroundColor = isSubmit
        ? "var(--form-color-success, #10b981)"
        : "var(--form-color-primary, #3b82f6)";

      if (buttonStyle === "outlined") {
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: backgroundColor
            .replace("var(--form-color-", "var(--form-color-")
            .replace(", ", ", "),
          border: `2px solid ${backgroundColor}`,
        };
      } else if (buttonStyle === "ghost") {
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: backgroundColor
            .replace("var(--form-color-", "var(--form-color-")
            .replace(", ", ", "),
          border: "none",
        };
      } else {
        // filled (default)
        return {
          ...baseStyle,
          backgroundColor,
          color: "var(--form-color-text-inverse, #ffffff)",
          border: "none",
        };
      }
    } else {
      // secondary button
      if (buttonStyle === "outlined") {
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: "var(--form-color-border, #374151)",
          border: "2px solid var(--form-color-border, #d1d5db)",
        };
      } else if (buttonStyle === "ghost") {
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: "var(--form-color-text-primary, #374151)",
          border: "none",
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: "var(--form-color-surface, #ffffff)",
          color: "var(--form-color-text-primary, #374151)",
          border: "1px solid var(--form-color-border, #d1d5db)",
        };
      }
    }
  };

  const {
    currentStepFields,
    formState,
    validateCurrentStep,
    nextStep,
    previousStep,
    submitForm,
    getFieldError,
    formMethods,
    submitError, // ADD THIS
    clearSubmitError,
  } = useFormContext();

  // Local state for single-column navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isValidating, setIsValidating] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalQuestions = currentStepFields.length;
  const currentField = currentStepFields[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const progressPercentage =
    ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Auto-save progress
  useEffect(() => {
    const saveProgress = () => {
      const formData = formMethods.getValues();
      localStorage.setItem(
        `form-progress-${form.id}`,
        JSON.stringify({
          currentQuestionIndex,
          formData,
          timestamp: Date.now(),
        })
      );
      setProgressSaved(true);
      setTimeout(() => setProgressSaved(false), 2000);
    };

    const timer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, formMethods, form.id]);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`form-progress-${form.id}`);
    if (savedProgress) {
      try {
        const { currentQuestionIndex: savedIndex, formData } =
          JSON.parse(savedProgress);
        if (savedIndex && savedIndex < totalQuestions) {
          setCurrentQuestionIndex(savedIndex);
          Object.keys(formData).forEach((key) => {
            formMethods.setValue(key, formData[key]);
          });
        }
      } catch (error) {
        console.error("Failed to load saved progress:", error);
      }
    }
  }, [form.id, formMethods, totalQuestions]);

  // Smooth scroll to current question
  const scrollToQuestion = useCallback((index: number) => {
    const questionElement = questionRefs.current[index];
    if (questionElement && containerRef.current) {
      const container = containerRef.current;
      const offsetTop = questionElement.offsetTop - container.offsetTop - 100;
      container.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  // Navigation handlers
  const handleNextQuestion = async () => {
    if (!currentField) return;

    // Prevent multiple submissions
    if (formState.isSubmitting) {
      console.log("🚫 Form is already submitting, ignoring click");
      return;
    }

    setIsValidating(true);
    const fieldId = currentField.id;
    const isValid = await formMethods.trigger(fieldId);
    setIsValidating(false);

    if (!isValid) {
      const fieldElement = document.querySelector(
        `[data-field-id="${fieldId}"]`
      );
      if (fieldElement) {
        (fieldElement as HTMLElement).focus();
      }
      return;
    }

    if (isLastQuestion) {
      // Only call submitForm once and wait for it to complete
      try {
        await submitForm();
      } catch (error) {
        console.error("Submit error in handleNextQuestion:", error);
        // Error is already handled in submitForm, just log it here
      }
    } else {
      setDirection("forward");
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setDirection("backward");
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
        case "Enter":
          event.preventDefault();
          handleNextQuestion();
          break;
        case "ArrowUp":
          event.preventDefault();
          handlePreviousQuestion();
          break;
        case "?":
          event.preventDefault();
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
        case "Escape":
          setShowKeyboardShortcuts(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestionIndex, showKeyboardShortcuts]);

  // Auto-advance for certain field types
  useEffect(() => {
    if (!autoAdvanceEnabled || !currentField) return;

    const autoAdvanceTypes = ["yesNo", "multipleChoice"];
    if (autoAdvanceTypes.includes(currentField.type)) {
      const fieldValue = formMethods.getValues(currentField.id);
      if (fieldValue && !isLastQuestion) {
        const timer = setTimeout(() => {
          handleNextQuestion();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [
    formMethods.watch(currentField?.id),
    autoAdvanceEnabled,
    currentField,
    isLastQuestion,
  ]);

  // Scroll to question when index changes
  useEffect(() => {
    scrollToQuestion(currentQuestionIndex);
  }, [currentQuestionIndex, scrollToQuestion]);

  const questionVariants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
    }),
  };

  if (!currentField) {
    return <div>No questions available</div>;
  }

  return (
    <div className="single-column-layout min-h-screen" style={backgroundStyle}>
      {/* Progress Header */}
      <div
        className="sticky top-0 z-40 shadow-sm"
        style={{
          backgroundColor: "var(--form-color-surface, #ffffff)",
          borderBottom: "1px solid var(--form-color-border, #e5e7eb)",
          boxShadow: "var(--form-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
          zIndex: 40,
        }}
      >
        <div
          className="max-w-2xl mx-auto "
          style={{
            padding: "var(--form-spacing-md, 1rem)",
            maxWidth: "var(--form-max-width, 42rem)",
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: "var(--form-spacing-md, 1rem)" }}
          >
            <div>
              <p
                style={{
                  fontSize: "var(--form-font-size-small, 0.875rem)",
                  color: "var(--form-color-text-secondary, #6b7280)",
                }}
              >
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>

            <div
              className="flex items-center"
              style={{ gap: "var(--form-spacing-xs, 0.5rem)" }}
            >
              {progressSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center text-xs"
                  style={{
                    gap: "var(--form-spacing-xs, 0.25rem)",
                    color: "var(--form-color-success, #10b981)",
                    fontSize: "var(--form-font-size-small, 0.75rem)",
                  }}
                >
                  <Save className="w-3 h-3" />
                  Saved
                </motion.div>
              )}

              <button
                type="button"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                className="p-2 transition-colors"
                style={{
                  color: "var(--form-color-text-secondary, #9ca3af)",
                  padding: "var(--form-spacing-xs, 0.5rem)",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--form-border-radius, 8px)",
                  cursor: "pointer",
                }}
                title="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatedProgressIndicator
            progress={progressPercentage}
            type="bar"
            showPercentage={false}
            className="mb-2"
            style={{ marginBottom: "var(--form-spacing-xs, 0.5rem)" }}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              padding: "var(--form-spacing-md, 1rem)",
            }}
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-sm w-full"
              style={{
                backgroundColor: "var(--form-color-surface, #ffffff)",
                borderRadius: "var(--form-border-radius, 0.75rem)",
                padding: "var(--form-spacing-xl, 1.5rem)",
                maxWidth: "24rem",
                width: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="font-medium mb-4"
                style={{
                  fontSize: "var(--form-font-size-title, 1rem)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  color: "var(--form-color-text, #111827)",
                  marginBottom: "var(--form-spacing-md, 1rem)",
                }}
              >
                Keyboard Shortcuts
              </h3>
              <div
                className="space-y-2 text-sm"
                style={{
                  fontSize: "var(--form-font-size-small, 0.875rem)",
                }}
              >
                {[
                  { action: "Next question", key: "↓ or Enter" },
                  { action: "Previous question", key: "↑" },
                  { action: "Toggle shortcuts", key: "?" },
                  { action: "Close", key: "Esc" },
                ].map((shortcut, index) => (
                  <div key={index} className="flex justify-between">
                    <span
                      style={{
                        color: "var(--form-color-text-secondary, #6b7280)",
                      }}
                    >
                      {shortcut.action}
                    </span>
                    <span
                      className="font-mono px-2 py-1 rounded"
                      style={{
                        fontFamily: "var(--form-font-family, monospace)",
                        backgroundColor: "var(--form-color-border, #f3f4f6)",
                        padding:
                          "var(--form-spacing-xs, 0.25rem) var(--form-spacing-xs, 0.5rem)",
                        borderRadius: "var(--form-border-radius, 0.25rem)",
                        fontSize: "var(--form-font-size-small, 0.75rem)",
                      }}
                    >
                      {shortcut.key}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="max-w-2xl mx-auto min-h-screen"
        style={{
          padding: "var(--form-spacing-xl, 2rem) var(--form-spacing-md, 1rem)",
          maxWidth: "var(--form-max-width, 42rem)",
          minHeight: "100vh",
        }}
      >
        {/* Question Container */}
        <div className="relative min-h-[800px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <div
                ref={(el) => {
                  questionRefs.current[currentQuestionIndex] = el;
                }}
                className="shadow-sm p-8"
                style={{
                  backgroundColor: "var(--form-color-surface, #ffffff)",
                  borderRadius: "var(--form-border-radius, 1rem)",
                  border: "1px solid var(--form-color-border, #e5e7eb)",
                  boxShadow:
                    "var(--form-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
                  padding: "var(--form-spacing-xl, 2rem)",
                }}
              >
                <FormQuestion
                  field={currentField}
                  questionNumber={currentQuestionIndex + 1}
                  showQuestionNumber={true}
                  showValidation={true}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
          style={{ marginTop: "var(--form-spacing-xl, 2rem)" }}
        >
          {/* Back Button */}
          <div className="flex-1">
            {!isFirstQuestion && (
              <button
                onClick={handlePreviousQuestion}
                disabled={isValidating}
                className="inline-flex items-center disabled:opacity-50"
                style={{
                  ...getButtonStyle("secondary"),
                  opacity: isValidating ? 0.5 : 1,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          {/* Auto-advance Toggle */}
          <div
            className="flex items-center"
            style={{ gap: "var(--form-spacing-md, 1rem)" }}
          >
            <label
              className="flex items-center text-sm"
              style={{
                gap: "var(--form-spacing-xs, 0.5rem)",
                fontSize: "var(--form-font-size-small, 0.875rem)",
                color: "var(--form-color-text-secondary, #6b7280)",
              }}
            >
              <input
                type="checkbox"
                checked={autoAdvanceEnabled}
                onChange={(e) => setAutoAdvanceEnabled(e.target.checked)}
                className="rounded focus:ring-2"
                style={{
                  borderColor: "var(--form-color-border, #d1d5db)",
                  accentColor: "var(--form-color-primary, #3b82f6)",
                }}
              />
              Auto-advance
            </label>
          </div>

          {/* Next/Submit Button */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={isValidating || formState.isSubmitting} // Disable during validation OR submission
              className="inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                ...getButtonStyle("primary", isLastQuestion),
                opacity: isValidating || formState.isSubmitting ? 0.5 : 1,
              }}
            >
              {isValidating ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{
                      borderColor: "currentColor",
                      borderTopColor: "transparent",
                    }}
                  />
                  Validating...
                </>
              ) : formState.isSubmitting ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{
                      borderColor: "currentColor",
                      borderTopColor: "transparent",
                    }}
                  />
                  Submitting...
                </>
              ) : isLastQuestion ? (
                <>
                  <Check className="w-4 h-4" />
                  Submit
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Submit Error Display - ADD THIS SECTION */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--form-color-error, #fef2f2)",
              borderColor: "var(--form-color-error, #ef4444)",
              color: "var(--form-color-error, #ef4444)",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Submission Error</h4>
                <p className="text-sm">{submitError}</p>
              </div>
              <button
                onClick={clearSubmitError}
                className="p-1 hover:bg-red-100 rounded transition-colors"
                style={{
                  color: "var(--form-color-error, #ef4444)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Navigation Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center text-xs"
          style={{
            marginTop: "var(--form-spacing-lg, 1.5rem)",
            gap: "var(--form-spacing-lg, 1.5rem)",
            fontSize: "var(--form-font-size-small, 0.75rem)",
            color: "var(--form-color-text-secondary, #9ca3af)",
          }}
        >
          {[
            { icon: ArrowUp, text: "Previous" },
            { icon: ArrowDown, text: "Next" },
            { icon: Keyboard, text: "Press ? for shortcuts" },
          ].map((hint, index) => (
            <div
              key={index}
              className="flex items-center"
              style={{ gap: "var(--form-spacing-xs, 0.25rem)" }}
            >
              <hint.icon className="w-3 h-3" />
              <span>{hint.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Mobile Bottom Navigation */}
        <div
          className="fixed bottom-0 left-0 right-0 p-4 md:hidden"
          style={{
            backgroundColor: "var(--form-color-surface, #ffffff)",
            borderTop: "1px solid var(--form-color-border, #e5e7eb)",
            padding: "var(--form-spacing-md, 1rem)",
          }}
        >
          <div
            className="max-w-2xl mx-auto flex items-center justify-between"
            style={{ gap: "var(--form-spacing-sm, 0.75rem)" }}
          >
            <button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion || isValidating}
              className="flex items-center text-sm"
              style={{
                ...getButtonStyle("secondary"),
                fontSize: "var(--form-font-size-small, 0.875rem)",
                opacity: isFirstQuestion || isValidating ? 0.5 : 1,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div
              className="text-sm"
              style={{
                fontSize: "var(--form-font-size-small, 0.875rem)",
                color: "var(--form-color-text-secondary, #6b7280)",
              }}
            >
              {currentQuestionIndex + 1} / {totalQuestions}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={isValidating}
              className="flex items-center text-sm"
              style={{
                ...getButtonStyle("primary", isLastQuestion),
                fontSize: "var(--form-font-size-small, 0.875rem)",
                opacity: isValidating ? 0.5 : 1,
              }}
            >
              {isLastQuestion ? (
                <>
                  Submit
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
