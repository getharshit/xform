// src/types/layout.ts - Unified Form Layout Configuration Types
// Consolidates layout interfaces from both src/types/form.ts and src/components/public-form/types/layout.ts

/**
 * Form layout types supporting different form presentation styles
 */
export type FormLayoutType = 
  | 'singleColumn'     // Traditional single-column form layout
  | 'multiStep'        // Multi-step wizard with progress tracking
  | 'wizard'           // Guided step-by-step flow with step indicators
  | 'conversational'   // Chat-like conversational interface
  | 'custom';          // Custom layout configuration

/**
 * Single column layout configuration
 * Traditional form layout with all questions visible
 */
export interface SingleColumnOptions {
  maxWidth?: number;                    // Maximum form width in pixels
  questionSpacing?: number;             // Space between questions in pixels
  showAllQuestions?: boolean;           // Show all questions at once
  showQuestionNumbers?: boolean;        // Display question numbers
  submitButtonPosition?: 'left' | 'center' | 'right'; // Submit button alignment
  padding?: number;                     // Form container padding
  backgroundColor?: string;             // Form background color
}

/**
 * Multi-step layout configuration
 * Form broken into logical steps with navigation
 */
export interface MultiStepOptions {
  showProgressBar?: boolean;            // Display progress indicator
  progressBarStyle?: 'bar' | 'dots' | 'numbers' | 'percentage'; // Progress bar style
  showStepTitles?: boolean;             // Show step titles
  allowBackNavigation?: boolean;        // Allow going back to previous steps
  saveProgress?: boolean;               // Save progress between sessions
  showQuestionNumbers?: boolean;        // Display question numbers within steps
  stepTransition?: 'slide' | 'fade' | 'none'; // Transition animation between steps
  validateOnStepChange?: boolean;       // Validate current step before proceeding
}

/**
 * Wizard layout configuration
 * Guided flow with clear step indicators and navigation
 */
export interface WizardOptions {
  showSteps?: boolean;                  // Display step indicator
  stepIndicatorStyle?: 'line' | 'circles' | 'arrows' | 'breadcrumb'; // Step indicator style
  showStepLabels?: boolean;             // Show labels on step indicators
  highlightCurrentStep?: boolean;       // Highlight current step in indicator
  allowStepNavigation?: boolean;        // Allow clicking on steps to navigate
  showStepProgress?: boolean;           // Show completion status for each step
  compactIndicator?: boolean;           // Use compact step indicator on mobile
}

/**
 * Conversational layout configuration
 * Chat-like interface for form completion
 */
export interface ConversationalOptions {
  showAvatar?: boolean;                 // Display avatar/bot image
  avatarUrl?: string;                   // Custom avatar image URL
  messageDelay?: number;                // Delay between messages in milliseconds
  showTypingIndicator?: boolean;        // Show typing animation
  bubbleStyle?: 'rounded' | 'square' | 'minimal'; // Message bubble style
  enableSounds?: boolean;               // Enable sound effects
  autoAdvance?: boolean;                // Automatically advance to next question
  conversationFlow?: 'linear' | 'adaptive'; // Flow type
}

/**
 * Custom layout configuration
 * Flexible configuration for custom implementations
 */
export interface CustomLayoutOptions {
  templateName?: string;                // Custom template identifier
  configuration?: Record<string, any>;  // Custom configuration object
  cssClasses?: string[];                // Additional CSS classes
  customStyles?: Record<string, string>; // Inline styles
}

/**
 * Comprehensive layout options
 * Unified structure supporting all layout types
 */
export interface LayoutOptions {
  // General options
  maxWidth?: number;                    // Maximum form width
  padding?: number;                     // Container padding
  backgroundColor?: string;             // Background color
  
  // Layout-specific options
  singleColumn?: SingleColumnOptions;
  multiStep?: MultiStepOptions;
  wizard?: WizardOptions;
  conversational?: ConversationalOptions;
  custom?: CustomLayoutOptions;
}

/**
 * Navigation configuration for forms
 * Controls form navigation behavior and appearance
 */
export interface NavigationConfig {
  // Button visibility
  showBackButton?: boolean;             // Show back/previous button
  showNextButton?: boolean;             // Show next/continue button
  showSubmitButton?: boolean;           // Show submit button
  showProgressIndicator?: boolean;      // Show progress indicator
  showQuestionCounter?: boolean;        // Show "Question X of Y"
  
  // Button labels
  buttonLabels?: {
    back?: string;                      // Back button text
    next?: string;                      // Next button text
    submit?: string;                    // Submit button text
    continue?: string;                  // Continue button text
    previous?: string;                  // Previous button text
    finish?: string;                    // Finish button text
  };
  
  // Navigation behavior
  keyboardNavigation?: boolean;         // Enable keyboard navigation
  autoAdvance?: {
    enabled: boolean;                   // Enable auto-advance
    delay: number;                      // Delay in milliseconds
    triggerOn: 'selection' | 'input' | 'validation'; // When to trigger
  };
  
  // Button styling
  buttonStyle?: {
    variant?: 'primary' | 'secondary' | 'outline'; // Button variant
    size?: 'small' | 'medium' | 'large'; // Button size
    fullWidth?: boolean;                // Full width buttons
    position?: 'left' | 'center' | 'right' | 'split'; // Button positioning
  };
}

/**
 * Progress indicator configuration
 * Controls how progress is displayed to users
 */
export interface ProgressConfig {
  // Progress indicator type
  type?: 'bar' | 'circle' | 'steps' | 'percentage' | 'fraction';
  
  // Position and appearance
  position?: 'top' | 'bottom' | 'sidebar' | 'floating';
  showPercentage?: boolean;             // Show percentage text
  showStepLabels?: boolean;             // Show step labels
  showStepNumbers?: boolean;            // Show step numbers
  animated?: boolean;                   // Animate progress changes
  
  // Styling
  style?: {
    height?: number;                    // Progress bar height
    color?: string;                     // Progress color
    backgroundColor?: string;           // Background color
    borderRadius?: number;              // Border radius
    showGlow?: boolean;                 // Glow effect
  };
  
  // Step-specific configuration
  stepConfig?: {
    showIcons?: boolean;                // Show step icons
    iconSet?: 'default' | 'custom';    // Icon set to use
    customIcons?: Record<string, string>; // Custom icon mappings
    completedIcon?: string;             // Icon for completed steps
    currentIcon?: string;               // Icon for current step
    pendingIcon?: string;               // Icon for pending steps
  };
}

/**
 * Responsive layout configuration
 * Controls how layout adapts to different screen sizes
 */
export interface ResponsiveConfig {
  // Breakpoints
  breakpoints?: {
    mobile?: number;                    // Mobile breakpoint (px)
    tablet?: number;                    // Tablet breakpoint (px)
    desktop?: number;                   // Desktop breakpoint (px)
  };
  
  // Mobile-specific options
  mobile?: {
    layout?: FormLayoutType;            // Layout type for mobile
    maxWidth?: number;                  // Max width on mobile
    padding?: number;                   // Padding on mobile
    showProgressBar?: boolean;          // Show progress on mobile
    collapseSidebar?: boolean;          // Collapse sidebar on mobile
  };
  
  // Tablet-specific options
  tablet?: {
    layout?: FormLayoutType;            // Layout type for tablet
    maxWidth?: number;                  // Max width on tablet
    showStepIndicator?: boolean;        // Show step indicator on tablet
  };
}

/**
 * Accessibility configuration for layouts
 */
export interface AccessibilityConfig {
  // Screen reader support
  announceStepChanges?: boolean;        // Announce step changes
  announceProgress?: boolean;           // Announce progress updates
  announceValidation?: boolean;         // Announce validation messages
  
  // Keyboard navigation
  trapFocus?: boolean;                  // Trap focus within form
  skipLinks?: boolean;                  // Show skip navigation links
  highlightFocusedElement?: boolean;    // Highlight focused elements
  
  // High contrast support
  highContrastMode?: boolean;           // Enable high contrast mode
  reducedMotion?: boolean;              // Respect reduced motion preference
  
  // ARIA labels
  ariaLabels?: {
    progressBar?: string;               // Progress bar ARIA label
    stepIndicator?: string;             // Step indicator ARIA label
    navigationButtons?: Record<string, string>; // Button ARIA labels
  };
}

/**
 * Complete form layout configuration
 * Unified interface combining all layout options
 */
export interface FormLayoutConfig {
  // Core layout configuration
  type: FormLayoutType;                 // Layout type
  options: LayoutOptions;               // Layout-specific options
  
  // Navigation and progress
  navigation?: NavigationConfig;        // Navigation configuration
  progress?: ProgressConfig;            // Progress indicator configuration
  
  // Responsive and accessibility
  responsive?: ResponsiveConfig;        // Responsive behavior
  accessibility?: AccessibilityConfig;  // Accessibility features
  
  // Advanced features
  customCSS?: string;                   // Custom CSS for layout
  customJS?: string;                    // Custom JavaScript for layout
  theme?: string;                       // Layout theme identifier
}

/**
 * Layout state management
 * For tracking layout state in forms
 */
export interface LayoutState {
  currentStep: number;                  // Current step index
  totalSteps: number;                   // Total number of steps
  completedSteps: number[];             // Array of completed step indices
  visitedSteps: number[];               // Array of visited step indices
  canGoBack: boolean;                   // Whether back navigation is allowed
  canGoForward: boolean;                // Whether forward navigation is allowed
  isFirstStep: boolean;                 // Whether on first step
  isLastStep: boolean;                  // Whether on last step
  progressPercentage: number;           // Completion percentage (0-100)
}

/**
 * Layout validation error
 */
export interface LayoutValidationError {
  field: string;                        // Field that caused error
  message: string;                      // Error message
  step?: number;                        // Step where error occurred
}

/**
 * Layout transition configuration
 * Controls animations between layout changes
 */
export interface LayoutTransition {
  type: 'slide' | 'fade' | 'scale' | 'flip' | 'none'; // Transition type
  duration: number;                     // Duration in milliseconds
  easing: string;                       // CSS easing function
  direction?: 'left' | 'right' | 'up' | 'down'; // Transition direction
}

/**
 * Layout context value for React context
 */
export interface LayoutContextValue {
  // Current state
  config: FormLayoutConfig;
  state: LayoutState;
  
  // Navigation methods
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToFirstStep: () => void;
  goToLastStep: () => void;
  
  // State methods
  markStepCompleted: (step: number) => void;
  markStepVisited: (step: number) => void;
  resetProgress: () => void;
  
  // Configuration methods
  updateConfig: (config: Partial<FormLayoutConfig>) => void;
  updateNavigation: (navigation: Partial<NavigationConfig>) => void;
  updateProgress: (progress: Partial<ProgressConfig>) => void;
  
  // Validation
  validateStep: (step: number) => LayoutValidationError[];
  canNavigateToStep: (step: number) => boolean;
}

// Export legacy types for backward compatibility
export type { FormLayoutConfig as ExtendedFormLayoutConfig };

/**
 * Simple layout configuration for backward compatibility
 */
export interface LegacyFormLayoutConfig {
  type: 'singleColumn' | 'multiStep' | 'custom';
  options: {
    maxWidth?: number;
    padding?: number;
    backgroundColor?: string;
    singleColumn?: {
      showQuestionNumbers?: boolean;
      questionSpacing?: number;
      submitButtonPosition?: 'left' | 'center' | 'right';
    };
    multiStep?: {
      showProgressBar?: boolean;
      progressBarStyle?: 'bar' | 'dots' | 'numbers';
      allowBackNavigation?: boolean;
      showStepTitles?: boolean;
    };
  };
}

export type { LegacyFormLayoutConfig as BasicFormLayoutConfig };