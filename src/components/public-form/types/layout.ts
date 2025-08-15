// Layout configuration
export interface FormLayoutConfig {
    type: FormLayoutType;
    options: LayoutOptions;
  }
  
  // Layout types
  export type FormLayoutType = 'singleColumn' | 'multiStep' | 'wizard' | 'conversational';
  
  // Layout options
  export interface LayoutOptions {
    // Single column options
    singleColumn?: {
      maxWidth: number;
      questionSpacing: number;
      showAllQuestions: boolean;
    };
    
    // Multi-step options
    multiStep?: {
      showProgressBar: boolean;
      progressBarStyle: 'bar' | 'dots' | 'numbers';
      showStepTitles: boolean;
      allowBackNavigation: boolean;
      saveProgress: boolean;
      showQuestionNumbers: boolean;
    };
    
    // Wizard options (guided flow)
    wizard?: {
      showSteps: boolean;
      stepIndicatorStyle: 'line' | 'circles' | 'arrows';
      showStepLabels: boolean;
      highlightCurrentStep: boolean;
    };
    
    // Conversational options (chat-like)
    conversational?: {
      showAvatar: boolean;
      avatarUrl?: string;
      messageDelay: number;
      showTypingIndicator: boolean;
      bubbleStyle: 'rounded' | 'square' | 'minimal';
    };
  }
  
  // Navigation configuration
  export interface NavigationConfig {
    showBackButton: boolean;
    showNextButton: boolean;
    showSubmitButton: boolean;
    showProgressIndicator: boolean;
    showQuestionCounter: boolean;
    buttonLabels: {
      back: string;
      next: string;
      submit: string;
      continue: string;
    };
    keyboardNavigation: boolean;
    autoAdvance?: {
      enabled: boolean;
      delay: number; // milliseconds
      triggerOn: 'selection' | 'input' | 'validation';
    };
  }
  
  // Progress indicator configuration
  export interface ProgressConfig {
    type: 'bar' | 'circle' | 'steps' | 'percentage';
    position: 'top' | 'bottom' | 'sidebar';
    showPercentage: boolean;
    showStepLabels: boolean;
    animated: boolean;
  }