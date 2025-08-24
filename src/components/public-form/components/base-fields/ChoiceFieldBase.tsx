"use client";

import React from "react";
import { ExtendedFormField } from "@/types";
import { FieldWrapper } from "./FieldWrapper";
import { ChevronDown } from "lucide-react";

interface ChoiceFieldBaseProps {
  field: ExtendedFormField;
  className?: string;
}

export const ChoiceFieldBase: React.FC<ChoiceFieldBaseProps> = ({
  field,
  className = "",
}) => {
  const renderChoiceField = (props: any) => {
    switch (field.type) {
      case "multipleChoice":
        return (
          <div className={`space-y-3 ${className}`}>
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={props.value === option}
                  onChange={(e) => props.onChange(e.target.value)}
                  onBlur={props.onBlur}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <div className="relative">
            <select
              value={props.value || ""}
              onChange={(e) => props.onChange(e.target.value)}
              onBlur={props.onBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white transition-colors ${
                props.error
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              } ${className}`}
            >
              <option value="">Select an option...</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case "yesNo":
        return (
          <div className={`flex gap-4 ${className}`}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="yes"
                checked={props.value === "yes"}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="no"
                checked={props.value === "no"}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={props.onBlur}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        );

      default:
        return <div>Unsupported choice field type: {field.type}</div>;
    }
  };

  return (
    <FieldWrapper field={field}>
      {(props) => renderChoiceField(props)}
    </FieldWrapper>
  );
};
