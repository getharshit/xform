'use client';

import { useMemo } from 'react';
import { ExtendedFormField, FieldGroup } from '@/types';

interface StepGroup {
  id: string;
  title: string;
  description?: string;
  fields: ExtendedFormField[];
}

interface UseStepGroupingProps {
  fields: ExtendedFormField[];
  fieldGroups?: FieldGroup[];
}

export const useStepGrouping = ({ fields, fieldGroups }: UseStepGroupingProps) => {
  
  const steps = useMemo(() => {
    // If fieldGroups are explicitly defined, use them
    if (fieldGroups && fieldGroups.length > 0) {
      return fieldGroups.map(group => ({
        id: group.id,
        title: group.title,
        description: group.description,
        fields: group.fields
      }));
    }

    // Auto-generate logical steps based on field types and content
    const autoSteps: StepGroup[] = [];
    let currentStep: StepGroup | null = null;
    let stepCounter = 1;

    fields.forEach((field, index) => {
      // Determine if this field should start a new step
      const shouldStartNewStep = 
        !currentStep || // First field
        field.type === 'pageBreak' || // Explicit page break
        isLogicalBreakPoint(field, fields[index - 1]) || // Logical break
        (currentStep.fields.length >= 5); // Max fields per step

      if (shouldStartNewStep) {
        // Save previous step if it exists and has fields
        if (currentStep && currentStep.fields.length > 0) {
          autoSteps.push(currentStep);
        }

        // Start new step
        currentStep = {
          id: `step-${stepCounter}`,
          title: generateStepTitle(field, stepCounter),
          description: generateStepDescription(field),
          fields: []
        };
        stepCounter++;
      }         // Add field to current step (unless it's a page break)
              // We know currentStep is not null here because we just created it if it was null
        if (field.type !== 'pageBreak') {
          // We know currentStep is not null here because we just created it if it was null
          if (currentStep) {
            currentStep.fields.push(field);
          }
        }
    });

    // Add the last step if it exists and has fields
    if (currentStep && currentStep.fields.length > 0) {
      autoSteps.push(currentStep);
    }

    // Ensure we always have at least one step
    if (autoSteps.length === 0 && fields.length > 0) {
      autoSteps.push({
        id: 'step-1',
        title: 'Form',
        description: 'Complete the form',
        fields: fields.filter(field => field.type !== 'pageBreak')
      });
    }

    return autoSteps;
  }, [fields, fieldGroups]);

  return {
    steps,
    totalSteps: steps.length
  };
};

// Helper functions
const isLogicalBreakPoint = (currentField: ExtendedFormField, previousField?: ExtendedFormField): boolean => {
  if (!previousField) return false;

  // Break on field type changes that suggest new sections
  const breakingTransitions: Array<[ExtendedFormField['type'], ExtendedFormField['type']]> = [
    // From basic info to detailed info
    ['shortText', 'longText'],
    ['email', 'longText'],
    // From questions to legal/consent
    ['multipleChoice', 'legal'],
    ['opinionScale', 'legal'],
    // From input to selection
    ['longText', 'multipleChoice'],
    ['shortText', 'dropdown'],
    // From regular fields to special pages
    ['shortText', 'startingPage'],
    ['longText', 'postSubmission'],
  ];

  return breakingTransitions.some(([prev, curr]) => 
    previousField.type === prev && currentField.type === curr
  );
};

const generateStepTitle = (field: ExtendedFormField, stepNumber: number): string => {
  // Complete mapping for all field types
  const fieldTypeNames: Record<ExtendedFormField['type'], string> = {
    shortText: 'Basic Information',
    longText: 'Detailed Information',
    email: 'Contact Information',
    phoneNumber: 'Contact Information',
    website: 'Additional Details',
    multipleChoice: 'Preferences',
    dropdown: 'Selections',
    yesNo: 'Quick Questions',
    numberRating: 'Ratings',
    opinionScale: 'Feedback',
    legal: 'Terms & Agreement',
    statement: 'Information',
    fileUpload: 'File Upload',
    startingPage: 'Welcome',
    postSubmission: 'Completion',
    pageBreak: `Step ${stepNumber}`
  };

  return fieldTypeNames[field.type] || `Step ${stepNumber}`;
};

const generateStepDescription = (field: ExtendedFormField): string => {
  // Complete mapping for all field types
  const descriptions: Record<ExtendedFormField['type'], string> = {
    shortText: 'Please provide some basic information',
    longText: 'Share your detailed thoughts and feedback',
    email: 'We need your contact information',
    phoneNumber: 'How can we reach you?',
    website: 'Tell us about your online presence',
    multipleChoice: 'Select your preferences',
    dropdown: 'Choose from the available options',
    yesNo: 'Quick yes or no questions',
    numberRating: 'Rate your experience',
    opinionScale: 'Share your opinion',
    legal: 'Review and accept our terms',
    statement: 'Important information',
    fileUpload: 'Upload your documents',
    startingPage: 'Welcome to the form',
    postSubmission: 'Thank you for completing the form',
    pageBreak: 'Continue to next section'
  };

  return descriptions[field.type] || 'Complete this section';
};