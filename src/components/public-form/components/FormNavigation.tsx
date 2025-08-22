"use client";

import React from "react";
import { NavigationConfig } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  config: NavigationConfig;
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  config,
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div
      className="form-navigation"
      style={{
        marginTop: "var(--form-spacing-xl, 32px)",
        paddingTop: "var(--form-spacing-lg, 24px)",
        borderTop: `1px solid var(--form-color-border, #E5E7EB)`,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Back button */}
        <div className="flex-1">
          {config.showBackButton && canGoBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--form-spacing-xs, 8px)",
                padding: `var(--form-spacing-xs, 8px) var(--form-spacing-md, 16px)`,
                fontSize: "var(--form-font-size-input, 14px)",
                fontWeight: "var(--form-font-weight-medium, 500)",
                fontFamily:
                  "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                color: "var(--form-color-text, #374151)",
                backgroundColor: "var(--form-color-background, #ffffff)",
                border: `1px solid var(--form-color-border, #D1D5DB)`,
                borderRadius: "var(--form-border-radius, 8px)",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor =
                  "var(--form-color-background, #F9FAFB)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor =
                  "var(--form-color-background, #ffffff)";
              }}
              onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                e.currentTarget.style.outline =
                  "2px solid var(--form-color-primary, #3B82F6)";
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              {config.buttonLabels?.back}
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex-1 flex justify-center">
          {config.showProgressIndicator && (
            <div
              style={{
                color: "var(--form-color-secondary, #6B7280)",
                fontSize: "var(--form-font-size-small, 14px)",
                fontFamily:
                  "var(--form-font-family, Inter, system-ui, sans-serif)",
              }}
            >
              {config.showQuestionCounter && (
                <span>
                  {currentStep} of {totalSteps}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Next/Submit button */}
        <div className="flex-1 flex justify-end">
          {isLastStep
            ? config.showSubmitButton && (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--form-spacing-xs, 8px)",
                    padding: `var(--form-spacing-xs, 8px) var(--form-spacing-lg, 24px)`,
                    fontSize: "var(--form-font-size-input, 14px)",
                    fontWeight: "var(--form-font-weight-medium, 500)",
                    fontFamily:
                      "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                    color: "white",
                    backgroundColor: isSubmitting
                      ? "var(--form-color-secondary, #6B7280)"
                      : "var(--form-color-primary, #3B82F6)",
                    border: "none",
                    borderRadius: "var(--form-border-radius, 8px)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? "0.5" : "1",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor =
                        "var(--form-color-primary-dark, #2563EB)";
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.backgroundColor =
                        "var(--form-color-primary, #3B82F6)";
                    }
                  }}
                  onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.outline =
                      "2px solid var(--form-color-primary, #3B82F6)";
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  {isSubmitting ? "Submitting..." : config.buttonLabels?.submit}
                </button>
              )
            : config.showNextButton && (
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!canGoNext}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--form-spacing-xs, 8px)",
                    padding: `var(--form-spacing-xs, 8px) var(--form-spacing-md, 16px)`,
                    fontSize: "var(--form-font-size-input, 14px)",
                    fontWeight: "var(--form-font-weight-medium, 500)",
                    fontFamily:
                      "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                    color: "white",
                    backgroundColor: !canGoNext
                      ? "var(--form-color-secondary, #6B7280)"
                      : "var(--form-color-primary, #3B82F6)",
                    border: "none",
                    borderRadius: "var(--form-border-radius, 8px)",
                    cursor: !canGoNext ? "not-allowed" : "pointer",
                    opacity: !canGoNext ? "0.5" : "1",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (canGoNext) {
                      e.currentTarget.style.backgroundColor =
                        "var(--form-color-primary-dark, #2563EB)";
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!canGoNext) {
                      e.currentTarget.style.backgroundColor =
                        "var(--form-color-secondary, #6B7280)";
                    } else {
                      e.currentTarget.style.backgroundColor =
                        "var(--form-color-primary, #3B82F6)";
                    }
                  }}
                  onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.outline =
                      "2px solid var(--form-color-primary, #3B82F6)";
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  {config.buttonLabels?.next}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
        </div>
      </div>
    </div>
  );
};
