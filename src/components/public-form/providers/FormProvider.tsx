"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useForm,
  FormProvider as RHFFormProvider,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExtendedForm,
  FormState,
  ExtendedValidationError,
  FieldGroup,
} from "../types";
import { useFormValidation } from "../hooks/useFormValidation";
import {
  hasMultiStepLayout,
  groupFieldsByPageBreaks,
} from "../utils/stepDetection";

interface FormContextValue {
  // Form configuration
  form: ExtendedForm;

  // React Hook Form instance
  formMethods: UseFormReturn<any>;

  // Multi-step management
  currentStep: number;
  totalSteps: number;
  currentStepFields: any[];

  // State management
  formState: FormState;

  // Actions
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  validateCurrentStep: () => Promise<boolean>;
  submitForm: () => Promise<void>;

  // Validation
  validateField: (
    fieldId: string,
    value: any
  ) => ExtendedValidationError | null;

  // Utilities
  getFieldValue: (fieldId: string) => any;
  setFieldValue: (fieldId: string, value: any) => void;
  isFieldTouched: (fieldId: string) => boolean;
  getFieldError: (fieldId: string) => string | undefined;

  // ADDED: Error state management
  submitError: string | null;
  clearSubmitError: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Helper function to get default values based on field type
const getFieldDefaultValue = (field: any) => {
  switch (field.type) {
    case "shortText":
    case "longText":
    case "email":
    case "website":
    case "phoneNumber":
    case "text":
      return "";
    case "multipleChoice":
    case "dropdown":
      return "";
    case "yesNo":
      return false;
    case "numberRating":
    case "rating":
    case "opinionScale":
      return null;
    case "date":
      return "";
    case "legal":
      return false;
    case "fileUpload":
      return null;
    default:
      return "";
  }
};

interface FormProviderProps {
  form: ExtendedForm;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onFieldChange?: (fieldId: string, value: any) => void;
  onStepChange?: (step: number) => void;
  initialData?: Record<string, any>;
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  form,
  onSubmit,
  onFieldChange,
  onStepChange,
  initialData = {},
  children,
}) => {
  // ADDED: Submit error state
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation setup
  const { validationSchema, validateField, validateAll } = useFormValidation(
    form.fields
  );

  // React Hook Form setup
  // Create default values for all fields to prevent controlled/uncontrolled switch
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};

    // Add defaults for all fields in the form (excluding pageBreak fields)
    form.fields
      .filter((field) => field.type !== "pageBreak")
      .forEach((field) => {
        defaults[field.id] =
          initialData[field.id] ?? getFieldDefaultValue(field);
      });

    return defaults;
  }, [form.fields, initialData]);

  // React Hook Form setup
  const formMethods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  const {
    watch,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: rhfFormState,
  } = formMethods;

  // Multi-step logic using pageBreak detection
  const isMultiStep = hasMultiStepLayout(form.fields);

  // Create steps based on pageBreak fields
  const stepConfiguration = useMemo(() => {
    if (isMultiStep) {
      return groupFieldsByPageBreaks(form.fields);
    }

    // Single step - all non-pageBreak fields
    return {
      steps: [
        {
          title: "Form",
          fields: form.fields.filter((field) => field.type !== "pageBreak"),
        },
      ],
      totalSteps: 1,
    };
  }, [form.fields, isMultiStep]);

  const [currentStep, setCurrentStep] = React.useState(0);

  const totalSteps = stepConfiguration.totalSteps;

  const currentStepFields = useMemo(() => {
    return stepConfiguration.steps[currentStep]?.fields || [];
  }, [stepConfiguration.steps, currentStep]);

  // Form state
  const [formState, setFormState] = React.useState<FormState>({
    currentStep,
    totalSteps,
    formData: getValues(),
    errors: [],
    isSubmitting: false,
    isValid: rhfFormState.isValid,
    touchedFields: new Set(),
    visitedSteps: new Set([0]),
  });

  // Track previous form data for change detection
  const previousFormDataRef = useRef<Record<string, any>>({});

  // Watch for form data changes
  const watchedData = watch();

  useEffect(() => {
    // Get the previous form data from the ref
    const previousFormData = previousFormDataRef.current;

    setFormState((prevState) => ({
      ...prevState,
      formData: watchedData,
      isValid: rhfFormState.isValid,
      errors: validateAll(watchedData),
    }));

    // Notify parent of field changes
    if (onFieldChange) {
      Object.keys(watchedData).forEach((fieldId) => {
        // Compare with previous data to detect changes
        if (previousFormData[fieldId] !== watchedData[fieldId]) {
          onFieldChange(fieldId, watchedData[fieldId]);
        }
      });
    }

    // Update the ref with current data for next comparison
    previousFormDataRef.current = watchedData;
  }, [rhfFormState.isValid]); // Remove watchedData and validateAll from dependencies

  // Step navigation functions
  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();

    if (isStepValid && currentStep < totalSteps - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setFormState((prev) => ({
        ...prev,
        currentStep: newStep,
        visitedSteps: new Set([...prev.visitedSteps, newStep]),
      }));
      onStepChange?.(newStep);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setFormState((prev) => ({
        ...prev,
        currentStep: newStep,
      }));
      onStepChange?.(newStep);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      setFormState((prev) => ({
        ...prev,
        currentStep: step,
        visitedSteps: new Set([...prev.visitedSteps, step]),
      }));
      onStepChange?.(step);
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    // Clear any previous submit errors when validation is attempted
    setSubmitError(null);

    const fieldsToValidate = currentStepFields.map((field) => field.id);
    const result = await trigger(fieldsToValidate);

    // Update touched fields
    setFormState((prev) => ({
      ...prev,
      touchedFields: new Set([...prev.touchedFields, ...fieldsToValidate]),
    }));

    return result;
  };

  // FIXED: Enhanced submit function with double-submission prevention
  const submitForm = async () => {
    // Prevent double submissions
    if (formState.isSubmitting) {
      console.log("🚫 Form already submitting, ignoring duplicate call");
      return;
    }

    console.log("🚀 Starting form submission...");

    setFormState((prev) => ({ ...prev, isSubmitting: true }));
    setSubmitError(null); // Clear any previous errors

    try {
      // Validate entire form first
      console.log("📋 Validating form...");
      const isValid = await trigger();

      if (!isValid) {
        console.log("❌ Form validation failed");
        setSubmitError(
          "Please check all required fields and correct any errors."
        );
        return;
      }

      const formData = getValues();
      console.log("📤 Submitting form data:", formData);
      console.log("🎯 Form ID:", form?.id);

      // Call the onSubmit function from parent component
      await onSubmit(formData);

      console.log("✅ Form submitted successfully");
    } catch (error) {
      console.error("💥 Form submission error:", error);

      // Enhanced error handling with user-friendly messages
      let userMessage =
        "An unexpected error occurred while submitting the form.";

      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes("Validation failed")) {
          userMessage = "Please check your responses and try again.";
        } else if (error.message.includes("Form not found")) {
          userMessage = "This form is no longer available.";
        } else if (error.message.includes("already submitted")) {
          userMessage = "You have already submitted a response to this form.";
        } else if (error.message.includes("Failed to submit form")) {
          userMessage =
            "Unable to submit the form. Please check your internet connection and try again.";
        } else {
          // Use the original error message if it's user-friendly
          userMessage = error.message;
        }
      }

      setSubmitError(userMessage);

      // Don't re-throw the error - handle it gracefully
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // ADDED: Function to clear submit errors
  const clearSubmitError = () => {
    setSubmitError(null);
  };

  // Utility functions
  const getFieldValue = (fieldId: string) => getValues(fieldId);

  const setFieldValue = (fieldId: string, value: any) => {
    setValue(fieldId, value, { shouldValidate: true, shouldTouch: true });
  };

  const isFieldTouched = (fieldId: string) => {
    return (
      formState.touchedFields.has(fieldId) ||
      !!rhfFormState.touchedFields[fieldId]
    );
  };

  const getFieldError = (fieldId: string) => {
    return rhfFormState.errors[fieldId]?.message as string | undefined;
  };

  const contextValue: FormContextValue = {
    form,
    formMethods,
    currentStep,
    totalSteps,
    currentStepFields,
    formState,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    submitForm,
    validateField,
    getFieldValue,
    setFieldValue,
    isFieldTouched,
    getFieldError,
    submitError, // ADDED
    clearSubmitError, // ADDED
  };

  return (
    <FormContext.Provider value={contextValue}>
      <RHFFormProvider {...formMethods}>
        {/* FIXED: Prevent default form submission and double submission */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default HTML form submission
            // Don't call submitForm here - let components handle it manually
          }}
          noValidate
        >
          {children}
        </form>
      </RHFFormProvider>
    </FormContext.Provider>
  );
};
