"use client";

import React from "react";
import { ExtendedFormField } from "@/types";
import { FieldWrapper } from "./FieldWrapper";

interface TextFieldBaseProps {
  field: ExtendedFormField;
  className?: string;
}

export const TextFieldBase: React.FC<TextFieldBaseProps> = ({
  field,
  className = "",
}) => {
  const renderInput = (type: string, props: any) => {
    const baseClassName = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
      props.error
        ? "border-red-500 focus:ring-red-200"
        : "border-gray-300 focus:ring-blue-500"
    } ${className}`;

    switch (field.type) {
      case "longText":
        return (
          <div className="relative">
            <textarea
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              onBlur={props.onBlur}
              placeholder={field.placeholder || "Your answer"}
              className={`${baseClassName} resize-vertical min-h-[120px]`}
              maxLength={field.maxLength || 1000}
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              {props.value?.length || 0}/{field.maxLength || 1000} characters
            </div>
          </div>
        );

      case "email":
        return (
          <input
            type="email"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={props.onBlur}
            placeholder={field.placeholder || "Enter your email"}
            className={baseClassName}
            maxLength={field.maxLength || 255}
          />
        );

      case "website":
        return (
          <input
            type="url"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={props.onBlur}
            placeholder={field.placeholder || "https://example.com"}
            className={baseClassName}
            maxLength={field.maxLength || 500}
          />
        );

      case "phoneNumber":
        return (
          <input
            type="tel"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            onBlur={props.onBlur}
            placeholder={field.placeholder || "Enter your phone number"}
            className={baseClassName}
            maxLength={field.maxLength || 20}
          />
        );

      case "shortText":
      default:
        return (
          <div className="relative">
            <input
              type="text"
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              onBlur={props.onBlur}
              placeholder={field.placeholder || "Your answer"}
              className={baseClassName}
              maxLength={field.maxLength || 255}
            />
            {field.maxLength && (
              <div className="text-xs text-gray-500 mt-1">
                {props.value?.length || 0}/{field.maxLength} characters
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <FieldWrapper field={field}>
      {(props) => renderInput(field.type, props)}
    </FieldWrapper>
  );
};
