"use client";

import React from "react";
import { PublicFormRendererProps, ProgressConfig } from "../types";
import type { FormCustomization } from "@/types/form";
import { FormProvider } from "../providers/FormProvider";
import { AnimationProvider, useAnimationFromCustomization } from "../animation";
import { FormQuestion } from "./FormQuestion";
import { FormNavigation } from "./FormNavigation";
import { SingleColumnLayout, MultiStepLayout } from "../layouts";
import { useFormContext } from "../providers/FormProvider";
import {
  hasMultiStepLayout,
  groupFieldsByPageBreaks,
} from "../utils/stepDetection";
import { ThemeProvider } from "../themes/ThemeProvider";
import {
  createThemeWrapperStyle,
  getAnimationConfig,
  getContainerClasses,
} from "../utils/themeUtils";

// Internal component that has access to FormContext
const FormContent: React.FC = () => {
  const {
    form,
    currentStep,
    totalSteps,
    currentStepFields,
    formState,
    nextStep,
    previousStep,
    submitForm,
  } = useFormContext();

  // Initialize animation system with form customization
  useAnimationFromCustomization(form.customization);

  // Cast the customization to the correct type (using unknown first as suggested by TypeScript)
  const customization = form.customization as unknown as FormCustomization;

  // Generate theme styles from customization
  const themeStyle = createThemeWrapperStyle(customization);
  const containerClasses = getContainerClasses(customization);

  // Simple detection: check if form has pageBreak fields
  const isMultiStep = hasMultiStepLayout(form.fields);

  // For single-column layout, we don't need manual navigation controls
  // The layout handles everything internally
  return (
    <div className="form-theme-wrapper min-h-screen" style={themeStyle}>
      <div className={` ${containerClasses}`}>
        {isMultiStep ? (
          <MultiStepLayout
            form={form}
            state={formState}
            progressConfig={{
              type:
                form.layout.options.multiStep?.progressBarStyle === "dots"
                  ? "circle"
                  : form.layout.options.multiStep?.progressBarStyle ===
                    "numbers"
                  ? "steps"
                  : "bar",
              position: "top",
              showPercentage: true,
              showStepLabels:
                form.layout.options.multiStep?.showStepTitles || false,
              animated: true,
            }}
          >
            <div className="form-questions-container space-y-8">
              {currentStepFields.map((field, index) => {
                const questionNumber =
                  form.fields.findIndex((f) => f.id === field.id) + 1;
                return (
                  <FormQuestion
                    key={field.id}
                    field={field}
                    questionNumber={questionNumber}
                    showQuestionNumber={true}
                    showValidation={true}
                    className="mb-8"
                  />
                );
              })}
            </div>

            <FormNavigation
              config={{
                showBackButton: currentStep > 0,
                showNextButton: currentStep < totalSteps - 1,
                showSubmitButton: currentStep === totalSteps - 1,
                showProgressIndicator: true,
                showQuestionCounter: true,
                buttonLabels: {
                  back: "Back",
                  next: "Next",
                  submit: "Submit",
                  continue: "Continue",
                },
                keyboardNavigation: true,
              }}
              currentStep={currentStep + 1}
              totalSteps={totalSteps}
              canGoBack={currentStep > 0}
              canGoNext={!formState.isSubmitting}
              onBack={previousStep}
              onNext={nextStep}
              onSubmit={submitForm}
              isSubmitting={formState.isSubmitting}
            />
          </MultiStepLayout>
        ) : (
          <SingleColumnLayout form={form} state={formState} />
        )}
      </div>
    </div>
  );
};

// Main component that provides form and animation context
export const PublicFormRenderer: React.FC<PublicFormRendererProps> = (
  props
) => {
  // Cast the customization to the correct type (using unknown first)
  const customization = props.form
    .customization as unknown as FormCustomization;

  // Get animation config from customization
  const animationConfig = getAnimationConfig(customization);

  return (
    <ThemeProvider initialTheme={props.form.customization}>
      <AnimationProvider initialConfig={animationConfig}>
        <FormProvider {...props}>
          <FormContent />
        </FormProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
};
