"use client";

import React from "react";
import { PublicFormRendererProps, ProgressConfig } from "@/types";
import type { FormCustomization } from "@/types";
import { FormProvider } from "../providers/FormProvider";
import { AnimationProvider, useAnimationFromCustomization } from "../animation";
import { useBuilder } from "@/components/form-builder/providers/BuilderProvider";
import { FormQuestion } from "./FormQuestion";
import { FormNavigation } from "./FormNavigation";
import { SingleColumnLayout, MultiStepLayout } from "../layouts";
import { useFormContext } from "../providers/FormProvider";
import { hasMultiStepLayout } from "../utils/stepDetection";
import { ThemeProvider } from "../themes/ThemeProvider";
import {
  getContainerClasses,
  createThemeWrapperStyle,
} from "../themes/cssProperties";
import { defaultTheme } from "../themes/defaultTheme";
import AnimatedBackgroundRenderer from "../themes/backgrounds/animated/AnimatedBackgroundRenderer";

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

  const renderAnimatedBackground = () => {
    if (
      form.customization?.colors?.backgroundType === "animated" &&
      form.customization?.colors?.animatedConfig
    ) {
      return (
        <AnimatedBackgroundRenderer
          config={form.customization.colors.animatedConfig}
          className="absolute inset-0 z-0"
        />
      );
    }
    return null;
  };

  // Initialize animation system with form customization

  const { state } = useBuilder(); // Get form state
  useAnimationFromCustomization(state.form?.customization);

  // Generate and apply theme styles from customization
  const themeWrapperStyle = React.useMemo(() => {
    return createThemeWrapperStyle(form.customization);
  }, [form.customization]);

  const containerClasses = getContainerClasses(form.customization);

  // Simple detection: check if form has pageBreak fields
  const isMultiStep = hasMultiStepLayout(form.fields);

  // Add this right after the themeWrapperStyle useMemo
  React.useEffect(() => {
    // Check what CSS properties are actually set
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    console.log("🎨 CSS Properties on root:");
    console.log(
      "--form-color-background:",
      computedStyle.getPropertyValue("--form-color-background")
    );
    console.log(
      "--form-background-image:",
      computedStyle.getPropertyValue("--form-background-image")
    );
    console.log(
      "--form-background-type:",
      computedStyle.getPropertyValue("--form-background-type")
    );
  }, [themeWrapperStyle, form.customization]);

  return (
    <div className="form-theme-wrapper min-h-screen" style={themeWrapperStyle}>
      {renderAnimatedBackground()}
      <div className={containerClasses}>
        {isMultiStep ? (
          <MultiStepLayout
            form={form}
            state={formState}
            progressConfig={{
              type:
                form.layout?.options.multiStep?.progressBarStyle === "dots"
                  ? "circle"
                  : form.layout?.options.multiStep?.progressBarStyle ===
                    "numbers"
                  ? "steps"
                  : "bar",
              position: "top",
              showPercentage: true,
              showStepLabels:
                form.layout?.options.multiStep?.showStepTitles || false,
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
  const animationConfig = {};

  // Create a theme-like object that works with our CSS generator
  const themeForProvider = React.useMemo(() => {
    // Don't pass customization directly to ThemeProvider,
    // let our CSS functions handle it instead
    return defaultTheme;
  }, []);

  return (
    <ThemeProvider initialTheme={themeForProvider}>
      <AnimationProvider initialConfig={animationConfig}>
        <FormProvider {...props}>
          <FormContent />
        </FormProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
};
