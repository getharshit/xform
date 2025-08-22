/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ExtendedFormField } from "@/types";
import { FieldWrapper } from "./FieldWrapper";
import { Check, AlertCircle } from "lucide-react";

interface StaticFieldBaseProps {
  field: ExtendedFormField;
  className?: string;
}

export const StaticFieldBase: React.FC<StaticFieldBaseProps> = ({
  field,
  className = "",
}) => {
  const renderStaticField = (props: any) => {
    switch (field.type) {
      case "statement":
        return (
          <div className={`prose max-w-none ${className}`}>
            <div className="text-gray-700">
              {/* Support for HTML content */}
              <div dangerouslySetInnerHTML={{ __html: field.label }} />
              {field.description && (
                <div className="mt-2 text-sm text-gray-600">
                  <div
                    dangerouslySetInnerHTML={{ __html: field.description }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "legal":
        return (
          <div className={className}>
            <label className="flex items-start gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={props.value === true}
                onChange={(e) => props.onChange(e.target.checked)}
                onBlur={props.onBlur}
                className={`mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  props.error ? "border-red-500" : ""
                }`}
              />
              <div className="flex-1">
                <div className="text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: field.label }} />
                </div>
                {field.description && (
                  <div className="mt-1 text-xs text-gray-600">
                    <div
                      dangerouslySetInnerHTML={{ __html: field.description }}
                    />
                  </div>
                )}
              </div>
              {props.value && (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </label>
            {props.error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{props.error}</span>
              </div>
            )}
          </div>
        );

      case "pageBreak":
        return (
          <div className={`text-center py-8 ${className}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              Continue to next section
            </div>
          </div>
        );

      default:
        return <div>Unsupported static field type: {field.type}</div>;
    }
  };

  // For static fields that don't need form control
  if (field.type === "statement" || field.type === "pageBreak") {
    return <>{renderStaticField({})}</>;
  }

  // For legal fields that need form control
  return (
    <FieldWrapper field={field}>
      {(props) => renderStaticField(props)}
    </FieldWrapper>
  );
};
