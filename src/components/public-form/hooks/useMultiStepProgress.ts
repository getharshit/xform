'use client';

import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface StepProgress {
  stepIndex: number;
  formData: Record<string, any>;
  completedSteps: number[];
  visitedSteps: number[];
  stepErrors: Record<number, string[]>;
  timestamp: number;
}

interface UseMultiStepProgressProps {
  formId: string;
  totalSteps: number;
  formMethods: UseFormReturn<any>;
  onProgressChange?: (progress: StepProgress) => void;
}

export const useMultiStepProgress = ({
  formId,
  totalSteps,
  formMethods,
  onProgressChange
}: UseMultiStepProgressProps) => {
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const progressKey = `multi-step-progress-${formId}`;

  // Calculate completion percentage
  const completionPercentage = (completedSteps.length / totalSteps) * 100;

  // Save progress to localStorage
  const saveProgress = useCallback(async () => {
    try {
      const formData = formMethods.getValues();
      const progress: StepProgress = {
        stepIndex: currentStepIndex,
        formData,
        completedSteps,
        visitedSteps,
        stepErrors,
        timestamp: Date.now()
      };

      localStorage.setItem(progressKey, JSON.stringify(progress));
      onProgressChange?.(progress);

      // Visual feedback
      const event = new CustomEvent('multiStepProgressSaved', { 
        detail: { formId, progress } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save multi-step progress:', error);
    }
  }, [
    formId, 
    currentStepIndex, 
    completedSteps, 
    visitedSteps, 
    stepErrors, 
    formMethods, 
    progressKey, 
    onProgressChange
  ]);

  // Load progress from localStorage
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const progress: StepProgress = JSON.parse(saved);
        
        // Check if progress is recent (within 7 days)
        const isRecent = Date.now() - progress.timestamp < 7 * 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          // Restore form data
          Object.keys(progress.formData).forEach(key => {
            formMethods.setValue(key, progress.formData[key]);
          });

          // Restore step progress
          setCurrentStepIndex(progress.stepIndex);
          setCompletedSteps(progress.completedSteps);
          setVisitedSteps(progress.visitedSteps);
          setStepErrors(progress.stepErrors);

          return progress;
        } else {
          // Clear old progress
          localStorage.removeItem(progressKey);
        }
      }
    } catch (error) {
      console.error('Failed to load multi-step progress:', error);
    }
    return null;
  }, [progressKey, formMethods]);

  // Clear all progress
  const clearProgress = useCallback(() => {
    localStorage.removeItem(progressKey);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setVisitedSteps([0]);
    setStepErrors({});
  }, [progressKey]);

  // Navigate to specific step
  const goToStep = useCallback(async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= totalSteps) return false;

    setIsLoading(true);

    try {
      // Mark step as visited
      setVisitedSteps(prev => Array.from(new Set([...prev, stepIndex])));
      setCurrentStepIndex(stepIndex);
      
      return true;
    } catch (error) {
      console.error('Failed to navigate to step:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [totalSteps]);

  // Navigate to next step
  const nextStep = useCallback(async (validationResults?: { isValid: boolean; errors?: string[] }) => {
    if (currentStepIndex >= totalSteps - 1) return false;

    setIsLoading(true);

    try {
      // Handle validation results
      if (validationResults) {
        if (validationResults.isValid) {
          // Mark current step as completed
          setCompletedSteps(prev => Array.from(new Set([...prev, currentStepIndex])));
          // Clear errors for this step
          setStepErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[currentStepIndex];
            return newErrors;
          });
        } else {
          // Set errors for current step
          setStepErrors(prev => ({
            ...prev,
            [currentStepIndex]: validationResults.errors || []
          }));
          setIsLoading(false);
          return false;
        }
      }

      // Move to next step
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      setVisitedSteps(prev => Array.from(new Set([...prev, nextStepIndex])));

      return true;
    } catch (error) {
      console.error('Failed to navigate to next step:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentStepIndex, totalSteps]);

  // Navigate to previous step
  const previousStep = useCallback(async () => {
    if (currentStepIndex <= 0) return false;

    setIsLoading(true);

    try {
      const prevStepIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevStepIndex);
      
      return true;
    } catch (error) {
      console.error('Failed to navigate to previous step:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentStepIndex]);

  // Mark step as completed
  const markStepCompleted = useCallback((stepIndex: number) => {
    setCompletedSteps(prev => Array.from(new Set([...prev, stepIndex])));
    setStepErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[stepIndex];
      return newErrors;
    });
  }, []);

  // Set step errors
  const setStepError = useCallback((stepIndex: number, errors: string[]) => {
    setStepErrors(prev => ({
      ...prev,
      [stepIndex]: errors
    }));
  }, []);

  // Auto-save progress periodically
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [saveProgress]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Handle page unload - save progress
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveProgress]);

  return {
    currentStepIndex,
    completedSteps,
    visitedSteps,
    stepErrors,
    isLoading,
    completionPercentage,
    goToStep,
    nextStep,
    previousStep,
    markStepCompleted,
    setStepError,
    saveProgress,
    loadProgress,
    clearProgress,
    
    // Helper functions
    isStepCompleted: (stepIndex: number) => completedSteps.includes(stepIndex),
    isStepVisited: (stepIndex: number) => visitedSteps.includes(stepIndex),
    hasStepError: (stepIndex: number) => stepIndex in stepErrors,
    getStepErrors: (stepIndex: number) => stepErrors[stepIndex] || [],
    canAccessStep: (stepIndex: number) => {
      // Can access current step, previously visited steps, or next step if current is completed
      return stepIndex === currentStepIndex || 
             visitedSteps.includes(stepIndex) || 
             (stepIndex === currentStepIndex + 1 && completedSteps.includes(currentStepIndex));
    }
  };
};