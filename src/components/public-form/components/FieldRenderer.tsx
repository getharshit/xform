"use client";

import React from "react";
import { ExtendedFormField } from "@/types";
import {
  ShortTextField,
  LongTextField,
  EmailField,
  WebsiteField,
  PhoneNumberField,
  NumberRatingField,
  MultipleChoiceField,
  DropdownField,
  YesNoField,
  OpinionScaleField,
  StatementField,
  LegalField,
  StartingPageField,
  PostSubmissionField,
} from "./fields";
import { FileFieldBase } from "./base-fields";

// Supported field types for validation
const SUPPORTED_FIELD_TYPES = [
  "shortText",
  "longText",
  "email",
  "website",
  "phoneNumber",
  "numberRating",
  "multipleChoice",
  "dropdown",
  "yesNo",
  "opinionScale",
  "statement",
  "legal",
  "startingPage",
  "postSubmission",
  "fileUpload",
  "pageBreak",
  // Legacy types
  "text",
  "rating",
  "date",
] as const;

interface FieldRendererProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  onSpecialAction?: (action: string, data?: any) => void;
  className?: string;
}

// Dedicated Date Field Component
const DateField: React.FC<{
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}> = ({ field, questionNumber, showQuestionNumber, className }) => {
  return (
    <div className={`date-field ${className}`}>
      {showQuestionNumber && questionNumber && (
        <div className="question-number text-sm text-gray-500 mb-2">
          Question {questionNumber}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.description && (
          <p className="text-sm text-gray-600">{field.description}</p>
        )}

        <input
          type="date"
          id={field.id}
          name={field.id}
          required={field.required}
          placeholder={field.placeholder || "YYYY-MM-DD"}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
      </div>
    </div>
  );
};

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  onSpecialAction,
  className = "",
}) => {
  // Validate field type
  const isValidFieldType = SUPPORTED_FIELD_TYPES.includes(field.type as any);

  if (!isValidFieldType) {
    console.warn(`Unknown field type: ${field.type}`, {
      fieldId: field.id,
      fieldLabel: field.label,
      supportedTypes: SUPPORTED_FIELD_TYPES,
    });
  }

  // Map field types to components
  const renderField = () => {
    switch (field.type) {
      // Text-based fields
      case "shortText":
        return (
          <ShortTextField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "longText":
        return (
          <LongTextField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "email":
        return (
          <EmailField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "website":
        return (
          <WebsiteField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "phoneNumber":
        return (
          <PhoneNumberField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "numberRating":
        return (
          <NumberRatingField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      // Choice-based fields
      case "multipleChoice":
        return (
          <MultipleChoiceField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "dropdown":
        return (
          <DropdownField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "yesNo":
        return (
          <YesNoField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            variant="buttons"
            className={className}
          />
        );

      case "opinionScale":
        return (
          <OpinionScaleField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      // Static/Content fields
      case "statement":
        return (
          <StatementField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      case "legal":
        return (
          <LegalField
            field={field}
            questionNumber={questionNumber}
            showQuestionNumber={showQuestionNumber}
            className={className}
          />
        );

      // Special page fields
      case "startingPage":
        return (
          <StartingPageField
            field={field}
            onStart={() => onSpecialAction?.("startForm")}
            className={className}
          />
        );

      case "postSubmission":
        return (
          <PostSubmissionField
            field={field}
            onAction={onSpecialAction}
            className={className}
          />
        );

      // File upload
      case "fileUpload":
        return <FileFieldBase field={field} className={className} />;

      // Page break for multi-step
      case "pageBreak":
        return (
          <div className="page-break-field py-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Continue to next section
            </div>
            {field.label && (
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                {field.label}
              </h3>
            )}
            {field.description && (
              <p className="text-gray-600 max-w-md mx-auto">
                {field.description}
              </p>
            )}
          </div>
        );

      // Unknown field types with fallback
      default:
        console.error(`Unknown field type: ${field.type}`, {
          fieldId: field.id,
          fieldLabel: field.label,
          receivedType: field.type,
          supportedTypes: SUPPORTED_FIELD_TYPES,
        });

        return (
          <div className="unknown-field-fallback">
            {/* Error notification */}
            <div className="p-4 border border-red-300 bg-red-50 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
                <div>
                  <p className="text-red-700 text-sm font-medium">
                    Unknown field type:{" "}
                    <code className="bg-red-100 px-1 rounded">
                      {field.type}
                    </code>
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Field ID: <code>{field.id}</code> | Falling back to text
                    input for data collection
                  </p>
                </div>
              </div>
            </div>

            {/* Fallback to text input */}
            <ShortTextField
              field={{
                ...field,
                type: "shortText",
                label: `${field.label} (Unknown Type: ${field.type})`,
                description: field.description
                  ? `${field.description}\n\n⚠️ This field had an unknown type and is displayed as text input.`
                  : `⚠️ This field had an unknown type (${field.type}) and is displayed as text input.`,
              }}
              questionNumber={questionNumber}
              showQuestionNumber={showQuestionNumber}
              className={`${className} fallback-field`}
            />
          </div>
        );
    }
  };

  return (
    <div
      className="field-renderer"
      data-field-type={field.type}
      data-field-id={field.id}
      data-required={field.required}
      data-has-options={!!field.options?.length}
      data-is-valid-type={isValidFieldType}
      data-question-number={questionNumber}
    >
      {renderField()}
    </div>
  );
};
