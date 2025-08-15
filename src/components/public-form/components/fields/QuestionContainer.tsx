"use client";

import React from "react";
import { ExtendedFormField } from "../../types";
import { AnimatedFieldContainer } from "../../animation/components";

interface QuestionContainerProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const QuestionContainer: React.FC<QuestionContainerProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  children,
  className = "",
}) => {
  const questionId = `question-${field.id}`;
  const descriptionId = field.description
    ? `description-${field.id}`
    : undefined;

  return (
    <AnimatedFieldContainer
      fieldId={field.id}
      className={`question-container ${className}`}
      animationPreset="slideUp"
    >
      <div className="question-wrapper">
        {/* Question Header */}
        <div className="question-header mb-4">
          <div className="flex items-start gap-3">
            {/* Question Number */}
            {showQuestionNumber && questionNumber && (
              <div
                className="question-number flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mt-1"
                style={{
                  backgroundColor: "var(--form-color-primary, #3b82f6)20", // 20% opacity
                  color: "var(--form-color-primary, #3b82f6)",
                  fontSize: "var(--form-font-size-small, 14px)",
                  fontFamily: "var(--form-font-family, inherit)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                }}
              >
                {questionNumber}
              </div>
            )}

            {/* Question Content */}
            <div className="question-content flex-1">
              {/* Question Title */}
              <label
                htmlFor={field.id}
                id={questionId}
                className="block font-medium mb-2"
                style={{
                  color: "var(--form-color-text, #1f2937)",
                  fontSize: "var(--form-font-size-question, 16px)",
                  fontFamily: "var(--form-font-family, inherit)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  lineHeight: "var(--form-line-height-question, 1.5)",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: field.label }} />
                {field.required && (
                  <span
                    className="ml-1"
                    aria-label="Required field"
                    title="This field is required"
                    style={{
                      color: "var(--form-color-error, #ef4444)",
                    }}
                  >
                    *
                  </span>
                )}
              </label>

              {/* Question Description */}
              {field.description && (
                <div
                  id={descriptionId}
                  className="mb-3"
                  style={{
                    color: "var(--form-color-text-secondary, #6b7280)",
                    fontSize: "var(--form-font-size-small, 14px)",
                    fontFamily: "var(--form-font-family, inherit)",
                    lineHeight: "var(--form-line-height-small, 1.4)",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: field.description }}
                  />
                </div>
              )}

              {/* Image Placeholder */}
              {/* TODO: Implement image display */}
              {/* {field.imageUrl && (
                <div className="question-image mb-3">
                  <img 
                    src={field.imageUrl} 
                    alt={field.imageAlt || ''} 
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Field Input */}
        <div
          className="question-input"
          role="group"
          aria-labelledby={questionId}
          aria-describedby={descriptionId}
        >
          {children}
        </div>

        {/* Help Text */}
        {field.helpText && (
          <div
            className="question-help mt-2"
            style={{
              color: "var(--form-color-text-secondary, #6b7280)",
              fontSize: "var(--form-font-size-small, 12px)",
              fontFamily: "var(--form-font-family, inherit)",
            }}
          >
            {field.helpText}
          </div>
        )}
      </div>
    </AnimatedFieldContainer>
  );
};
