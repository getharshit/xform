'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onToggleShortcuts: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  onNext,
  onPrevious,
  onToggleShortcuts,
  canGoNext,
  canGoPrevious,
  enabled = true
}: UseKeyboardNavigationProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't interfere if user is typing in form elements
    const target = event.target as HTMLElement;
    const isFormElement = 
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.contentEditable === 'true';

    if (isFormElement) return;

    // Handle keyboard shortcuts
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        if (canGoNext) {
          event.preventDefault();
          onNext();
        }
        break;
        
      case 'ArrowUp':
        if (canGoPrevious) {
          event.preventDefault();
          onPrevious();
        }
        break;
        
      case '?':
        event.preventDefault();
        onToggleShortcuts();
        break;
        
      // Additional shortcuts
      case 'n':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (canGoNext) onNext();
        }
        break;
        
      case 'p':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (canGoPrevious) onPrevious();
        }
        break;
    }
  }, [enabled, onNext, onPrevious, onToggleShortcuts, canGoNext, canGoPrevious]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};