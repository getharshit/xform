'use client';

import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface ProgressData {
  currentQuestionIndex: number;
  currentStep: number;
  formData: Record<string, any>;
  timestamp: number;
  completedQuestions: string[];
}

interface UseProgressSavingProps {
  formId: string;
  currentQuestionIndex: number;
  currentStep: number;
  formMethods: UseFormReturn<any>;
  enabled?: boolean;
}

export const useProgressSaving = ({
  formId,
  currentQuestionIndex,
  currentStep,
  formMethods,
  enabled = true
}: UseProgressSavingProps) => {
  const saveProgress = useCallback(() => {
    if (!enabled) return;

    try {
      const formData = formMethods.getValues();
      const progressData: ProgressData = {
        currentQuestionIndex,
        currentStep,
        formData,
        timestamp: Date.now(),
        completedQuestions: Object.keys(formData).filter(key => formData[key] !== undefined)
      };

      localStorage.setItem(`form-progress-${formId}`, JSON.stringify(progressData));
      
      // Dispatch custom event for UI feedback
      window.dispatchEvent(new CustomEvent('formProgressSaved', { 
        detail: { formId, timestamp: Date.now() } 
      }));
    } catch (error) {
      console.error('Failed to save form progress:', error);
    }
  }, [formId, currentQuestionIndex, currentStep, formMethods, enabled]);

  const loadProgress = useCallback((): ProgressData | null => {
    if (!enabled) return null;

    try {
      const saved = localStorage.getItem(`form-progress-${formId}`);
      if (saved) {
        const progressData = JSON.parse(saved) as ProgressData;
        
        // Check if progress is not too old (24 hours)
        const isRecent = Date.now() - progressData.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          return progressData;
        } else {
          // Remove old progress
          clearProgress();
        }
      }
    } catch (error) {
      console.error('Failed to load form progress:', error);
    }
    
    return null;
  }, [formId, enabled]);

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(`form-progress-${formId}`);
    } catch (error) {
      console.error('Failed to clear form progress:', error);
    }
  }, [formId]);

  const restoreProgress = useCallback((progressData: ProgressData) => {
    try {
      // Restore form data
      Object.keys(progressData.formData).forEach(key => {
        formMethods.setValue(key, progressData.formData[key]);
      });
      
      return {
        currentQuestionIndex: progressData.currentQuestionIndex,
        currentStep: progressData.currentStep
      };
    } catch (error) {
      console.error('Failed to restore form progress:', error);
      return null;
    }
  }, [formMethods]);

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timer);
  }, [saveProgress]);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    restoreProgress
  };
};