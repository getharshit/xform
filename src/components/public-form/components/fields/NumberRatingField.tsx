"use client";

import React, { useState } from "react";
import { useController } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, Star } from "lucide-react";

interface NumberRatingFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const NumberRatingField: React.FC<NumberRatingFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const {
    field: controllerField,
    fieldState: { error, isTouched },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
      min: {
        value: field.minRating || 1,
        message: `Rating must be at least ${field.minRating || 1}`,
      },
      max: {
        value: field.maxRating || 10,
        message: `Rating cannot exceed ${field.maxRating || 10}`,
      },
    },
  });

  const hasError = !!error && isTouched;
  const minRating = field.minRating || 1;
  const maxRating = field.maxRating || 10;
  const currentRating = controllerField.value;

  // Generate rating options
  const ratingOptions = Array.from(
    { length: maxRating - minRating + 1 },
    (_, i) => minRating + i
  );

  const handleRatingClick = (rating: number) => {
    controllerField.onChange(rating);
  };

  const getRatingLabel = (rating: number) => {
    const total = maxRating - minRating + 1;
    const position = rating - minRating;

    if (total === 10) {
      if (position <= 2) return "Poor";
      if (position <= 4) return "Fair";
      if (position <= 6) return "Good";
      if (position <= 8) return "Very Good";
      return "Excellent";
    }

    if (total === 5) {
      if (position === 0) return "Poor";
      if (position === 1) return "Fair";
      if (position === 2) return "Good";
      if (position === 3) return "Very Good";
      return "Excellent";
    }

    return "";
  };

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="number-rating-field space-y-4">
        {/* Rating Scale */}
        <div
          className="rating-scale"
          role="radiogroup"
          aria-labelledby={`question-${field.id}`}
          aria-describedby={hasError ? `error-${field.id}` : undefined}
        >
          {/* Scale Labels */}
          {maxRating === 10 && (
            <div
              className="flex justify-between text-xs mb-3"
              style={{ color: "var(--form-text-secondary, #6B7280)" }}
            >
              <span>{minRating} - Very Poor</span>
              <span>{maxRating} - Excellent</span>
            </div>
          )}

          {/* Rating Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {ratingOptions.map((rating) => {
              const isSelected = currentRating === rating;
              const isHovered = hoveredRating === rating;
              const shouldHighlight =
                isSelected ||
                (hoveredRating !== null && rating <= hoveredRating);

              return (
                <motion.button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onFocus={() => setHoveredRating(rating)}
                  onBlur={() => setHoveredRating(null)}
                  className={`
                    relative w-12 h-12 rounded-full border-2 text-sm font-medium
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                  style={{
                    backgroundColor: shouldHighlight
                      ? "var(--form-color-primary, #3B82F6)"
                      : "var(--form-background-color, #FFFFFF)",
                    color: shouldHighlight
                      ? "var(--form-background-color, #FFFFFF)"
                      : hasError
                      ? "var(--form-color-error, #EF4444)"
                      : "var(--form-text-color, #1F2937)",
                    borderColor: shouldHighlight
                      ? "var(--form-color-primary, #3B82F6)"
                      : hasError
                      ? "var(--form-color-error, #EF4444)"
                      : "var(--form-border-color, #D1D5DB)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={false}
                  animate={{
                    scale: isSelected ? 1.05 : 1,
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Rating ${rating} out of ${maxRating}${
                    getRatingLabel(rating) ? ` - ${getRatingLabel(rating)}` : ""
                  }`}
                >
                  {rating}

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "var(--form-color-success, #10B981)",
                        }}
                      >
                        <Star
                          className="w-2 h-2 fill-current"
                          style={{
                            color: "var(--form-background-color, #FFFFFF)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Current Rating Display */}
          <AnimatePresence>
            {(currentRating || hoveredRating) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mt-3"
              >
                <div
                  className="text-lg font-medium"
                  style={{ color: "var(--form-text-color, #1F2937)" }}
                >
                  {hoveredRating || currentRating} out of {maxRating}
                </div>
                {getRatingLabel(hoveredRating || currentRating) && (
                  <div
                    className="text-sm"
                    style={{ color: "var(--form-text-secondary, #6B7280)" }}
                  >
                    {getRatingLabel(hoveredRating || currentRating)}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
      </div>
    </QuestionContainer>
  );
};
