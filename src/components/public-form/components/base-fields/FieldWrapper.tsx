"use client";

import React from "react";
import { useController } from "react-hook-form";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";

interface FieldWrapperProps {
  field: ExtendedFormField;
  children: (props: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
    isValid: boolean;
    isTouched: boolean;
  }) => React.ReactNode;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  field,
  children,
}) => {
  const { formMethods } = useFormContext();

  const {
    field: controllerField,
    fieldState: { error, isTouched, invalid },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
    },
  });

  const handleChange = (value: any) => {
    // Handle different field types
    switch (field.type) {
      case "numberRating":
      case "opinionScale":
        controllerField.onChange(Number(value));
        break;
      case "legal":
        controllerField.onChange(Boolean(value));
        break;
      case "fileUpload":
        controllerField.onChange(value);
        break;
      default:
        controllerField.onChange(value);
    }
  };

  return (
    <>
      {children({
        value: controllerField.value || "",
        onChange: handleChange,
        onBlur: controllerField.onBlur,
        error: error?.message,
        isValid: !invalid,
        isTouched,
      })}
    </>
  );
};
