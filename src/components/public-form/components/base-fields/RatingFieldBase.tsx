"use client";

import React from "react";
import { ExtendedFormField } from "../../types";
import { FieldWrapper } from "./FieldWrapper";
import { Star } from "lucide-react";

interface RatingFieldBaseProps {
  field: ExtendedFormField;
  className?: string;
}

export const RatingFieldBase: React.FC<RatingFieldBaseProps> = ({
  field,
  className = "",
}) => {
  const renderRatingField = (props: any) => {
    switch (field.type) {
      case "numberRating":
        const maxRating = field.maxRating || 5;
        const minRating = field.minRating || 1;

        return (
          <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex gap-2">
              {Array.from({ length: maxRating - minRating + 1 }).map(
                (_, index) => {
                  const rating = minRating + index;
                  const isSelected = props.value >= rating;

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => props.onChange(rating)}
                      onBlur={props.onBlur}
                      className="p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isSelected
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  );
                }
              )}
            </div>
            {props.value && (
              <span className="ml-2 text-sm text-gray-600">
                {props.value} out of {maxRating}
              </span>
            )}
          </div>
        );

      case "opinionScale":
        const maxScale = field.maxRating || 10;
        const minScale = field.minRating || 1;

        return (
          <div className={className}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {minScale} - Strongly Disagree
              </span>
              <span className="text-sm text-gray-500">
                {maxScale} - Strongly Agree
              </span>
            </div>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: maxScale - minScale + 1 }).map(
                (_, index) => {
                  const value = minScale + index;
                  const isSelected = props.value === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => props.onChange(value)}
                      onBlur={props.onBlur}
                      className={`w-10 h-10 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {value}
                    </button>
                  );
                }
              )}
            </div>
            {props.value && (
              <div className="text-center mt-2 text-sm text-gray-600">
                Selected: {props.value}
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported rating field type: {field.type}</div>;
    }
  };

  return (
    <FieldWrapper field={field}>
      {(props) => renderRatingField(props)}
    </FieldWrapper>
  );
};
