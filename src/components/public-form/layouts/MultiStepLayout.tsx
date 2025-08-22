/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedForm, FormState, ProgressConfig } from "@/types";
import { useFormContext } from "../providers/FormProvider";
import { FormQuestion } from "../components/FormQuestion";
import { StepIndicator } from "../components/StepIndicator";
import {
  AnimatedButton,
  AnimatedProgressIndicator,
} from "../animation/components";
import { useMultiStepProgress } from "../hooks/useMultiStepProgress";
import { groupFieldsByPageBreaks } from "../utils/stepDetection";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader,
  Sparkles,
} from "lucide-react";

interface MultiStepLayoutProps {
  form: ExtendedForm;
  state: FormState;
  progressConfig?: ProgressConfig;
  children?: React.ReactNode;
}

export const MultiStepLayout: React.FC<MultiStepLayoutProps> = ({
  form,
  state,
  progressConfig,
}) => {
  React.useEffect(() => {
    console.log("🖼️ MultiStep CSS Properties:", {
      "background-value": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--form-background-value"),
      "background-pattern": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--form-background-pattern"),
      "background-type": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--form-background-type"),
      "pattern-size": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--form-background-pattern-size"),
    });
  }, []);

  const {
    formMethods,
    formState,
    submitForm,
    validateField,
    currentStep: contextCurrentStep,
    totalSteps: contextTotalSteps,
    currentStepFields: contextCurrentStepFields,
  } = useFormContext();

  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isValidating, setIsValidating] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showProgressRestored, setShowProgressRestored] = useState(false);

  // Get step configuration from pageBreak grouping for display purposes
  const stepConfiguration = groupFieldsByPageBreaks(form.fields);
  const steps = stepConfiguration.steps.map((step, index) => ({
    id: `step-${index}`,
    title: step.title,
    description: `Complete this section of the form`,
    fields: step.fields,
  }));

  const totalSteps = contextTotalSteps;

  // Multi-step progress management
  const {
    currentStepIndex,
    completedSteps,
    visitedSteps,
    stepErrors,
    isLoading,
    completionPercentage,
    goToStep,
    nextStep,
    previousStep,
    markStepCompleted,
    setStepError,
    saveProgress,
    loadProgress,
    isStepCompleted,
    isStepVisited,
    hasStepError,
    getStepErrors,
    canAccessStep,
  } = useMultiStepProgress({
    formId: form.id,
    totalSteps,
    formMethods,
    onProgressChange: (progress) => {
      // Handle progress change if needed
    },
  });

  // Use the current step from context, but fall back to internal state for progress hook
  const currentStep = steps[currentStepIndex] || {
    id: `step-${currentStepIndex}`,
    title: `Step ${currentStepIndex + 1}`,
    description: "Complete this section",
    fields: contextCurrentStepFields,
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Check for restored progress on mount
  useEffect(() => {
    const restored = loadProgress();
    if (restored && restored.stepIndex > 0) {
      setShowProgressRestored(true);
      setTimeout(() => setShowProgressRestored(false), 5000);
    }
  }, [loadProgress]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        completionPercentage > 10 &&
        completionPercentage < 100
      ) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [completionPercentage]);

  // Validate current step
  const validateCurrentStep = async (): Promise<{
    isValid: boolean;
    errors?: string[];
  }> => {
    if (!currentStep || !currentStep.fields) return { isValid: false };

    setIsValidating(true);
    const errors: string[] = [];

    try {
      // Validate each field in the current step
      for (const field of currentStep.fields) {
        const isFieldValid = await formMethods.trigger(field.id);
        if (!isFieldValid) {
          const fieldError = formMethods.formState.errors[field.id];
          if (fieldError?.message) {
            errors.push(`${field.label}: ${fieldError.message}`);
          }
        }
      }

      const isValid = errors.length === 0;
      return { isValid, errors };
    } finally {
      setIsValidating(false);
    }
  };

  // Navigation handlers
  const handleNextStep = async () => {
    const validationResults = await validateCurrentStep();

    if (validationResults.isValid) {
      setDirection("forward");
      if (isLastStep) {
        await submitForm();
      } else {
        await nextStep(validationResults);
      }
    } else {
      setStepError(currentStepIndex, validationResults.errors || []);
    }
  };

  const handlePreviousStep = async () => {
    setDirection("backward");
    await previousStep();
  };

  const handleStepClick = async (stepIndex: number) => {
    if (!canAccessStep(stepIndex)) return;

    setDirection(stepIndex > currentStepIndex ? "forward" : "backward");
    await goToStep(stepIndex);
  };

  // Auto-save when step changes
  useEffect(() => {
    const timer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timer);
  }, [currentStepIndex, saveProgress]);

  // Step transition variants
  const stepVariants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? -300 : 300,
      opacity: 0,
      scale: 0.98,
    }),
  };

  // Progress restored notification
  const ProgressRestoredNotification = () => (
    <AnimatePresence>
      {showProgressRestored && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50"
          style={{
            backgroundColor: "var(--form-color-primary, #3b82f6)",
            color: "var(--form-color-text-inverse, #ffffff)",
            borderRadius: "var(--form-border-radius-lg, 0.75rem)",
            boxShadow:
              "var(--form-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1))",
            zIndex: "var(--form-z-index-toast, 1000)",
          }}
        >
          <div
            className="flex items-center"
            style={{ gap: "var(--form-spacing-xs, 0.5rem)" }}
          >
            <CheckCircle className="w-5 h-5" />
            <span
              className="font-medium"
              style={{
                fontSize: "var(--form-font-size-sm, 0.875rem)",
                fontWeight: "var(--form-font-weight-medium, 500)",
              }}
            >
              Progress restored from previous session
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Exit intent modal
  const ExitIntentModal = () => (
    <AnimatePresence>
      {showExitIntent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "var(--form-color-overlay, rgba(0, 0, 0, 0.5))",
            zIndex: "var(--form-z-index-modal, 1000)",
            padding: "var(--form-spacing-md, 1rem)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-md w-full shadow-xl"
            style={{
              backgroundColor: "var(--form-color-surface, #ffffff)",
              borderRadius: "var(--form-border-radius-xl, 1rem)",
              padding: "var(--form-spacing-lg, 1.5rem)",
              boxShadow:
                "var(--form-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1))",
            }}
          >
            <div className="text-center">
              <AlertTriangle
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: "var(--form-color-warning, #f59e0b)" }}
              />
              <h3
                className="mb-2"
                style={{
                  fontSize: "var(--form-font-size-lg, 1.125rem)",
                  fontWeight: "var(--form-font-weight-semibold, 600)",
                  color: "var(--form-color-text-primary, #111827)",
                  marginBottom: "var(--form-spacing-xs, 0.5rem)",
                }}
              >
                Don't lose your progress!
              </h3>
              <p
                className="mb-6"
                style={{
                  color: "var(--form-color-text-secondary, #6b7280)",
                  marginBottom: "var(--form-spacing-lg, 1.5rem)",
                  fontSize: "var(--form-font-size-base, 1rem)",
                }}
              >
                Your form is {Math.round(completionPercentage)}% complete. Your
                progress has been automatically saved.
              </p>

              <div
                className="flex"
                style={{ gap: "var(--form-spacing-sm, 0.75rem)" }}
              >
                <motion.button
                  type="button"
                  onClick={() => setShowExitIntent(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: "var(--form-color-primary, #3b82f6)",
                    color: "var(--form-color-text-inverse, #ffffff)",
                    borderRadius: "var(--form-border-radius-lg, 0.75rem)",
                    padding:
                      "var(--form-spacing-sm, 0.5rem) var(--form-spacing-md, 1rem)",
                    fontSize:
                      "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                    fontWeight:
                      "var(--form-font-weight-button-text, var(--form-font-weight-medium, 500))",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Form
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    saveProgress();
                    setShowExitIntent(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: "var(--form-color-secondary, #f8f9fa)",
                    color: "var(--form-color-text-primary, #374151)",
                    borderRadius: "var(--form-border-radius-lg, 0.75rem)",
                    padding:
                      "var(--form-spacing-sm, 0.5rem) var(--form-spacing-md, 1rem)",
                    fontSize:
                      "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                    fontWeight:
                      "var(--form-font-weight-button-text, var(--form-font-weight-medium, 500))",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save & Exit
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!currentStep) {
    return <div>No steps available</div>;
  }

  // Helper function to determine progress indicator type
  const getProgressIndicatorType = (): "bar" | "circle" | "steps" => {
    if (!progressConfig?.type) return "bar";

    // Map the progressConfig types to AnimatedProgressIndicator types
    switch (progressConfig.type) {
      case "circle":
        return "circle";
      case "steps":
        return "steps";
      case "bar":
      case "percentage":
      default:
        return "bar";
    }
  };

  // Helper function to determine step indicator variant
  const getStepIndicatorVariant = (): "horizontal" | "vertical" | "dots" => {
    if (!progressConfig?.type) return "horizontal";

    // Map progressConfig types to StepIndicator variants
    if (form.layout?.options.multiStep?.progressBarStyle === "dots") {
      return "dots";
    }
    return "horizontal";
  };

  return (
    <div
      className="multi-step-layout min-h-screen"
      style={{
        background:
          "var(--form-background-value, var(--form-color-background, #f9fafb))",
        backgroundImage: "var(--form-background-pattern, none)",
        backgroundSize:
          "var(--form-background-pattern-size, 20px) var(--form-background-pattern-size, 20px)",
      }}
    >
      {/* Progress Restored Notification */}
      <ProgressRestoredNotification />

      {/* Exit Intent Modal */}
      <ExitIntentModal />

      {/* Header with Progress */}
      <div
        className="sticky top-0 z-40 shadow-sm"
        style={{
          backgroundColor: "var(--form-color-surface, #ffffff)",
          borderBottom: `1px solid var(--form-color-border, #e5e7eb)`,
          boxShadow: "var(--form-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
          zIndex: "var(--form-z-index-dropdown, 40)",
        }}
      >
        <div
          className="max-w-4xl mx-auto px-4 py-6"
          style={{
            padding:
              "var(--form-spacing-lg, 1.5rem) var(--form-spacing-md, 1rem)",
          }}
        >
          {/* Form Title and Step Info */}
          <div
            className="flex items-center justify-between mb-6"
            style={{ marginBottom: "var(--form-spacing-lg, 1.5rem)" }}
          >
            <div>
              <h1
                className="font-bold"
                style={{
                  fontSize: "1.6rem",
                  fontWeight:
                    "var(--form-font-weight-form-title, var(--form-font-weight-bold, 700))",
                  color: "var(--form-color-text-primary, #111827)",
                  lineHeight:
                    "var(--form-line-height-form-title, var(--form-line-height-tight, 1.25))",
                }}
              >
                {form.title}
              </h1>
              {form.description && (
                <p
                  className="mt-1"
                  style={{
                    color: "var(--form-color-text-secondary, #6b7280)",
                    marginTop: "var(--form-spacing-xs, 0.25rem)",
                    fontSize: "1rem",
                    lineHeight:
                      "var(--form-line-height-form-description, var(--form-line-height-normal, 1.5))",
                  }}
                >
                  {form.description}
                </p>
              )}
            </div>

            <div
              className="flex items-center"
              style={{ gap: "var(--form-spacing-md, 1rem)" }}
            >
              {/* Save Progress Indicator */}
              <motion.div
                className="flex items-center text-sm"
                style={{
                  gap: "var(--form-spacing-xs, 0.5rem)",
                  color: "var(--form-color-text-muted, #9ca3af)",
                  fontSize:
                    "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
                }}
                animate={{ opacity: isLoading ? 1 : 0.7 }}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Auto-saved</span>
                  </>
                )}
              </motion.div>

              {/* Completion Percentage */}
              <div className="text-right">
                <div
                  className="text-sm"
                  style={{
                    color: "var(--form-color-text-muted, #9ca3af)",
                    fontSize:
                      "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
                  }}
                >
                  Progress
                </div>
                <div
                  className="text-lg font-semibold"
                  style={{
                    fontSize: "var(--form-font-size-lg, 1.125rem)",
                    fontWeight: "var(--form-font-weight-semibold, 600)",
                    color: "var(--form-color-primary, #3b82f6)",
                  }}
                >
                  {Math.round(completionPercentage)}%
                </div>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            steps={steps.map((step, index) => ({
              id: step.id,
              title: step.title,
              description: step.description,
              isCompleted: isStepCompleted(index),
              isActive: index === currentStepIndex,
              isAccessible: canAccessStep(index),
              hasError: hasStepError(index),
            }))}
            currentStep={currentStepIndex}
            onStepClick={handleStepClick}
            variant={getStepIndicatorVariant()}
            showLabels={progressConfig?.showStepLabels !== false}
            className="mb-4"
            style={{ marginBottom: "var(--form-spacing-md, 1rem)" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="max-w-4xl mx-auto px-4 py-8"
        style={{
          padding: "var(--form-spacing-2xl, 2rem) var(--form-spacing-md, 1rem)",
        }}
      >
        {/* Step Content */}
        <div className="relative">
          {/* Step Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            style={{ marginBottom: "var(--form-spacing-2xl, 2rem)" }}
          >
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize:
                  "var(--form-font-size-section-title, var(--form-font-size-xl, 1.25rem))",
                fontWeight:
                  "var(--form-font-weight-section-title, var(--form-font-weight-semibold, 600))",
                color: "var(--form-color-text-primary, #111827)",
                marginBottom: "var(--form-spacing-xs, 0.5rem)",
              }}
            >
              {currentStep.title}
            </h2>
            {currentStep.description && (
              <p
                style={{
                  color: "var(--form-color-text-secondary, #6b7280)",
                  fontSize: "var(--form-font-size-base, 1rem)",
                }}
              >
                {currentStep.description}
              </p>
            )}
            <div
              className="text-sm mt-2"
              style={{
                color: "var(--form-color-text-muted, #9ca3af)",
                marginTop: "var(--form-spacing-xs, 0.5rem)",
                fontSize:
                  "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
              }}
            >
              Step {currentStepIndex + 1} of {totalSteps}
            </div>
          </motion.div>

          {/* Step Errors */}
          {hasStepError(currentStepIndex) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-4 mb-6"
              style={{
                backgroundColor: "var(--form-color-error-bg, #fef2f2)",
                border: `1px solid var(--form-color-border-error, #fecaca)`,
                borderRadius: "var(--form-border-radius-lg, 0.75rem)",
                padding: "var(--form-spacing-md, 1rem)",
                marginBottom: "var(--form-spacing-lg, 1.5rem)",
              }}
            >
              <div
                className="flex items-start"
                style={{ gap: "var(--form-spacing-sm, 0.75rem)" }}
              >
                <AlertTriangle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--form-color-error, #dc2626)" }}
                />
                <div>
                  <h4
                    className="text-sm font-medium mb-1"
                    style={{
                      fontSize:
                        "var(--form-font-size-error-text, var(--form-font-size-sm, 0.875rem))",
                      fontWeight:
                        "var(--form-font-weight-error-text, var(--form-font-weight-medium, 500))",
                      color: "var(--form-color-error, #dc2626)",
                      marginBottom: "var(--form-spacing-xs, 0.25rem)",
                    }}
                  >
                    Please fix the following errors:
                  </h4>
                  <ul
                    className="text-sm space-y-1"
                    style={{
                      fontSize:
                        "var(--form-font-size-error-text, var(--form-font-size-sm, 0.875rem))",
                      color: "var(--form-color-error, #dc2626)",
                    }}
                  >
                    {getStepErrors(currentStepIndex).map((error, index) => (
                      <li key={index} className="list-disc list-inside">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Animated Step Content */}
          <div className="relative overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStepIndex}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="shadow-sm p-8"
                style={{
                  backgroundColor: "var(--form-color-surface, #ffffff)",
                  borderRadius: "var(--form-border-radius-xl, 1rem)",
                  border: `1px solid var(--form-color-border, #e5e7eb)`,
                  boxShadow:
                    "var(--form-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
                  padding: "var(--form-spacing-2xl, 2rem)",
                }}
              >
                <div
                  style={{ gap: "var(--form-spacing-2xl, 2rem)" }}
                  className="space-y-8"
                >
                  {currentStep.fields.map((field, fieldIndex) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: fieldIndex * 0.1,
                      }}
                    >
                      <FormQuestion
                        field={field}
                        questionNumber={
                          form.fields.findIndex((f) => f.id === field.id) + 1
                        }
                        showQuestionNumber={true}
                        showValidation={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between pt-6"
          style={{
            marginTop: "var(--form-spacing-2xl, 2rem)",
            paddingTop: "var(--form-spacing-lg, 1.5rem)",
            borderTop: `1px solid var(--form-color-border, #e5e7eb)`,
          }}
        >
          {/* Back Button */}
          <div className="flex-1">
            {!isFirstStep && (
              <AnimatedButton
                variant="secondary"
                onClick={handlePreviousStep}
                disabled={isLoading || isValidating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg disabled:opacity-50"
                style={{
                  color: "var(--form-color-text-primary, #374151)",
                  backgroundColor: "var(--form-color-surface, #ffffff)",
                  border: `1px solid var(--form-color-border, #d1d5db)`,
                  borderRadius: "var(--form-border-radius-lg, 0.75rem)",
                  padding:
                    "var(--form-spacing-sm, 0.75rem) var(--form-spacing-lg, 1.5rem)",
                  gap: "var(--form-spacing-xs, 0.5rem)",
                  fontSize:
                    "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                  fontWeight:
                    "var(--form-font-weight-button-text, var(--form-font-weight-medium, 500))",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </AnimatedButton>
            )}
          </div>

          {/* Step Counter */}
          <div
            className="flex items-center text-sm"
            style={{
              gap: "var(--form-spacing-xs, 0.5rem)",
              color: "var(--form-color-text-muted, #9ca3af)",
              fontSize:
                "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
            }}
          >
            <span>{currentStepIndex + 1}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>

          {/* Next/Submit Button */}
          <div className="flex-1 flex justify-end">
            <AnimatedButton
              variant="primary"
              onClick={handleNextStep}
              disabled={isLoading || isValidating}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium disabled:opacity-50`}
              style={{
                color: "var(--form-color-text-inverse, #ffffff)",
                backgroundColor: isLastStep
                  ? "var(--form-color-success, #10b981)"
                  : "var(--form-color-primary, #3b82f6)",
                border: "none",
                borderRadius: "var(--form-border-radius-lg, 0.75rem)",
                padding:
                  "var(--form-spacing-sm, 0.75rem) var(--form-spacing-lg, 1.5rem)",
                gap: "var(--form-spacing-xs, 0.5rem)",
                fontSize:
                  "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                fontWeight:
                  "var(--form-font-weight-button-text, var(--form-font-weight-medium, 500))",
              }}
            >
              {isValidating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : isLastStep ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Complete Form
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Mobile Progress Footer */}
        <div
          className="fixed bottom-0 left-0 right-0 p-4 md:hidden"
          style={{
            backgroundColor: "var(--form-color-surface, #ffffff)",
            borderTop: `1px solid var(--form-color-border, #e5e7eb)`,
            padding: "var(--form-spacing-md, 1rem)",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Mobile Progress Bar */}
            <div style={{ marginBottom: "var(--form-spacing-sm, 0.75rem)" }}>
              <div
                className="flex justify-between text-xs mb-1"
                style={{
                  color: "var(--form-color-text-muted, #9ca3af)",
                  marginBottom: "var(--form-spacing-xs, 0.25rem)",
                  fontSize:
                    "var(--form-font-size-caption, var(--form-font-size-xs, 0.75rem))",
                }}
              >
                <span>
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span>{Math.round(completionPercentage)}% complete</span>
              </div>
              <AnimatedProgressIndicator
                progress={completionPercentage}
                type="bar"
                showPercentage={false}
                className="h-1.5"
              />
            </div>

            {/* Mobile Navigation */}
            <div
              className="flex items-center justify-between"
              style={{ gap: "var(--form-spacing-sm, 0.75rem)" }}
            >
              <AnimatedButton
                variant="secondary"
                onClick={handlePreviousStep}
                disabled={isFirstStep || isLoading || isValidating}
                className="flex items-center gap-2 px-4 py-2 text-sm"
                style={{
                  color: "var(--form-color-text-primary, #374151)",
                  backgroundColor: "var(--form-color-surface, #ffffff)",
                  border: `1px solid var(--form-color-border, #d1d5db)`,
                  borderRadius: "var(--form-border-radius-md, 0.5rem)",
                  padding:
                    "var(--form-spacing-xs, 0.5rem) var(--form-spacing-md, 1rem)",
                  gap: "var(--form-spacing-xs, 0.5rem)",
                  fontSize:
                    "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </AnimatedButton>

              <AnimatedButton
                variant="primary"
                onClick={handleNextStep}
                disabled={isLoading || isValidating}
                className={`flex items-center gap-2 px-4 py-2 text-sm`}
                style={{
                  color: "var(--form-color-text-inverse, #ffffff)",
                  backgroundColor: isLastStep
                    ? "var(--form-color-success, #10b981)"
                    : "var(--form-color-primary, #3b82f6)",
                  border: "none",
                  borderRadius: "var(--form-border-radius-md, 0.5rem)",
                  padding:
                    "var(--form-spacing-xs, 0.5rem) var(--form-spacing-md, 1rem)",
                  gap: "var(--form-spacing-xs, 0.5rem)",
                  fontSize:
                    "var(--form-font-size-button-text, var(--form-font-size-sm, 0.875rem))",
                }}
              >
                {isValidating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Validating
                  </>
                ) : isLastStep ? (
                  <>
                    Complete
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
