import { ExtendedFormField } from '../types';

/**
 * Detects if a form should use multi-step layout based on pageBreak fields
 */
export const hasMultiStepLayout = (fields: ExtendedFormField[]): boolean => {
  return fields.some(field => field.type === 'pageBreak');
};

/**
 * Extracts step titles from pageBreak fields
 */
export const getStepTitlesFromPageBreaks = (fields: ExtendedFormField[]): string[] => {
  const stepTitles: string[] = ['Step 1']; // Always have a first step
  
  fields.forEach((field, index) => {
    if (field.type === 'pageBreak') {
      const stepNumber = stepTitles.length + 1;
      stepTitles.push(field.label || `Step ${stepNumber}`);
    }
  });
  
  return stepTitles;
};

/**
 * Groups fields into steps based on pageBreak positions
 */
export const groupFieldsByPageBreaks = (fields: ExtendedFormField[]) => {
  const steps: { title: string; fields: ExtendedFormField[] }[] = [];
  let currentStepFields: ExtendedFormField[] = [];
  let stepIndex = 0;
  
  for (const field of fields) {
    if (field.type === 'pageBreak') {
      // Save current step if it has fields
      if (currentStepFields.length > 0) {
        steps.push({
          title: stepIndex === 0 ? 'Step 1' : steps[stepIndex - 1]?.title || `Step ${stepIndex + 1}`,
          fields: currentStepFields
        });
        stepIndex++;
        currentStepFields = [];
      }
      
      // Set title for next step
      // This will be used when we create the next step
    } else {
      currentStepFields.push(field);
    }
  }
  
  // Add final step if there are remaining fields
  if (currentStepFields.length > 0) {
    steps.push({
      title: `Step ${stepIndex + 1}`,
      fields: currentStepFields
    });
  }
  
  return {
    steps,
    totalSteps: steps.length
  };
};