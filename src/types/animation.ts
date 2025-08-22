// Add this to src/types/animation.ts (new file)

import type { 
  Variants as FramerVariants, 
  Transition as FramerTransition, 
  MotionProps as FramerMotionProps 
} from 'framer-motion';



// Animation timing configuration
export interface AnimationTiming {
  duration: number;
  delay?: number;
  stagger?: number;
  damping?: number;
  mass?: number;
}

// Intensity-specific animation settings
export interface IntensitySettings {
  duration: number;
  easing: AnimationEasing;
  scale: {
    hover: number;
    tap: number;
  };
  shake: {
    intensity: number;
    duration: number;
  };
  bounce: {
    stiffness: number;
    damping: number;
  };
}

// Complete animation configuration
export interface AnimationConfig {
  // Global settings
  enabled: boolean;
  respectReducedMotion: boolean;
  intensity: AnimationIntensity;
  
  // Intensity configurations
  intensitySettings: Record<AnimationIntensity, IntensitySettings>;
  
  // Field animations
  fieldEntrance: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    easing: AnimationEasing;
  };
  
  fieldExit: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    easing: AnimationEasing;
  };
  
  // Button animations
  button: {
    hover: {
      scale: number;
      duration: number;
      easing: AnimationEasing;
    };
    tap: {
      scale: number;
      duration: number;
    };
    disabled: {
      opacity: number;
      duration: number;
    };
  };
  
  // State animations
  error: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    shake: {
      intensity: number;
      duration: number;
    };
  };
  
  success: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    bounce: {
      stiffness: number;
      damping: number;
    };
  };
  
  // Performance settings
  performance: {
    enableGPU: boolean;
    enableWillChange: boolean;
    cleanupOnUnmount: boolean;
  };
}

// Animation context value
export interface AnimationContextValue {
  config: AnimationConfig;
  variants: AnimationVariants;
  transitions: AnimationTransitions;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
  updateIntensity: (intensity: AnimationIntensity) => void;
  isReducedMotion: boolean;
  getFieldVariants: (preset: AnimationPreset) => FramerVariants;
  getTransition: (timing: AnimationTiming, easing: AnimationEasing) => FramerTransition;
  getIntensitySettings: () => IntensitySettings;
}

// Pre-built animation variants
export interface AnimationVariants {
  field: {
    fade: Variants;
    slideUp: Variants;
    slideDown: Variants;
    slideLeft: Variants;
    slideRight: Variants;
    scale: Variants;
    scaleUp: Variants;
    scaleDown: Variants;
    bounce: Variants;
    spring: Variants;
  };
  
  error: {
    shake: Variants;
    pulse: Variants;
  };
  
  success: {
    scale: Variants;
    bounce: Variants;
  };
  
  button: {
    default: Variants;
    primary: Variants;
    secondary: Variants;
  };
}

// Animation transitions
export interface AnimationTransitions {
  none: Transition;
  subtle: Transition;
  moderate: Transition;
  playful: Transition;
  spring: Transition;
  bounce: Transition;
}

// Component animation props
export interface AnimatedComponentProps extends FramerMotionProps {
  animationPreset?: AnimationPreset;
  intensity?: AnimationIntensity;
  disabled?: boolean;
  customVariants?: Variants;
  customTransition?: Transition;
}

// Animation hook return types
export interface UseAnimationReturn {
  config: AnimationConfig;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
  updateIntensity: (intensity: AnimationIntensity) => void;
  isReducedMotion: boolean;
  getFieldVariants: (preset: AnimationPreset) => Variants;
  getTransition: (timing: AnimationTiming, easing: AnimationEasing) => Transition;
  getIntensitySettings: () => IntensitySettings;
}


// Form customization animation interface (for integration with form customization)
export interface FormAnimationCustomization {
  enabled?: boolean;
  intensity?: AnimationIntensity;
  fieldEntrancePreset?: AnimationPreset;
  buttonHoverScale?: number;
  buttonTapScale?: number;
  duration?: number;
  easing?: string;
  respectReducedMotion?: boolean;
}

// Hook-specific interfaces
export interface UseButtonAnimationReturn {
  idle: any;
  hover: any;
  tap: any;
  disabled: any;
}

export interface UseErrorAnimationReturn {
  hidden: any;
  visible: any;
  exit: any;
}

export interface UseSuccessAnimationReturn {
  hidden: any;
  visible: any;
  exit: any;
}// Add this to src/types/animation.ts (new file)

import { Variants, Transition, MotionProps } from 'framer-motion';

// Animation intensity levels
export type AnimationIntensity = 'none' | 'subtle' | 'moderate' | 'playful';

// Animation presets for different components
export type AnimationPreset = 
  | 'fade' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight' 
  | 'scale' 
  | 'scaleUp' 
  | 'scaleDown' 
  | 'bounce' 
  | 'spring'
  | 'shake'
  | 'pulse';

// Animation easing types
export type AnimationEasing = 
  | { type: 'linear' }
  | { type: 'ease' }
  | { type: 'easeIn' }
  | { type: 'easeOut' }
  | { type: 'easeInOut' }
  | { 
      type: 'spring'; 
      stiffness?: number; 
      damping?: number; 
      mass?: number; 
    }
  | { 
      type: 'bezier'; 
      values: [number, number, number, number]; 
    };

// Animation timing configuration
export interface AnimationTiming {
  duration: number;
  delay?: number;
  stagger?: number;
  damping?: number;
  mass?: number;
}

// Intensity-specific animation settings
export interface IntensitySettings {
  duration: number;
  easing: AnimationEasing;
  scale: {
    hover: number;
    tap: number;
  };
  shake: {
    intensity: number;
    duration: number;
  };
  bounce: {
    stiffness: number;
    damping: number;
  };
}

// Complete animation configuration
export interface AnimationConfig {
  // Global settings
  enabled: boolean;
  respectReducedMotion: boolean;
  intensity: AnimationIntensity;
  
  // Intensity configurations
  intensitySettings: Record<AnimationIntensity, IntensitySettings>;
  
  // Field animations
  fieldEntrance: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    easing: AnimationEasing;
  };
  
  fieldExit: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    easing: AnimationEasing;
  };
  
  // Button animations
  button: {
    hover: {
      scale: number;
      duration: number;
      easing: AnimationEasing;
    };
    tap: {
      scale: number;
      duration: number;
    };
    disabled: {
      opacity: number;
      duration: number;
    };
  };
  
  // State animations
  error: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    shake: {
      intensity: number;
      duration: number;
    };
  };
  
  success: {
    preset: AnimationPreset;
    timing: AnimationTiming;
    bounce: {
      stiffness: number;
      damping: number;
    };
  };
  
  // Performance settings
  performance: {
    enableGPU: boolean;
    enableWillChange: boolean;
    cleanupOnUnmount: boolean;
  };
}

// Animation context value
export interface AnimationContextValue {
  config: AnimationConfig;
  variants: AnimationVariants;
  transitions: AnimationTransitions;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
  updateIntensity: (intensity: AnimationIntensity) => void;
  isReducedMotion: boolean;
  getFieldVariants: (preset: AnimationPreset) => Variants;
  getTransition: (timing: AnimationTiming, easing: AnimationEasing) => Transition;
  getIntensitySettings: () => IntensitySettings;
}

// Pre-built animation variants
export interface AnimationVariants {
  field: {
    fade: Variants;
    slideUp: Variants;
    slideDown: Variants;
    slideLeft: Variants;
    slideRight: Variants;
    scale: Variants;
    scaleUp: Variants;
    scaleDown: Variants;
    bounce: Variants;
    spring: Variants;
  };
  
  error: {
    shake: Variants;
    pulse: Variants;
  };
  
  success: {
    scale: Variants;
    bounce: Variants;
  };
  
  button: {
    default: Variants;
    primary: Variants;
    secondary: Variants;
  };
}

// Animation transitions
export interface AnimationTransitions {
  none: Transition;
  subtle: Transition;
  moderate: Transition;
  playful: Transition;
  spring: Transition;
  bounce: Transition;
}

// Component animation props
export interface AnimatedComponentProps extends FramerMotionProps {
  animationPreset?: AnimationPreset;
  intensity?: AnimationIntensity;
  disabled?: boolean;
  customVariants?: Variants;
  customTransition?: Transition;
}

// Animation hook return types
export interface UseAnimationReturn {
  config: AnimationConfig;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
  updateIntensity: (intensity: AnimationIntensity) => void;
  isReducedMotion: boolean;
  getFieldVariants: (preset: AnimationPreset) => Variants;
  getTransition: (timing: AnimationTiming, easing: AnimationEasing) => Transition;
  getIntensitySettings: () => IntensitySettings;
}

// Animation provider props
export interface AnimationProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<AnimationConfig>;
}

// Form customization animation interface (for integration with form customization)
export interface FormAnimationCustomization {
  enabled?: boolean;
  intensity?: AnimationIntensity;
  fieldEntrancePreset?: AnimationPreset;
  buttonHoverScale?: number;
  buttonTapScale?: number;
  duration?: number;
  easing?: string;
  respectReducedMotion?: boolean;
}

// Hook-specific interfaces
export interface UseButtonAnimationReturn {
  idle: any;
  hover: any;
  tap: any;
  disabled: any;
}

export interface UseErrorAnimationReturn {
  hidden: any;
  visible: any;
  exit: any;
}

export interface UseSuccessAnimationReturn {
  hidden: any;
  visible: any;
  exit: any;
}