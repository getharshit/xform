import { Variants, Transition } from 'framer-motion';
import { 
  AnimationPreset, 
  AnimationTiming, 
  AnimationEasing, 
  AnimationVariants, 
  AnimationTransitions,
  IntensitySettings,
  AnimationIntensity
} from './types';

// Intensity-specific configurations
export const intensityConfigurations: Record<AnimationIntensity, IntensitySettings> = {
  none: {
    duration: 0,
    easing: { type: 'linear' },
    scale: { hover: 1, tap: 1 },
    shake: { intensity: 0, duration: 0 },
    bounce: { stiffness: 0, damping: 100 }
  },
  subtle: {
    duration: 0.15,
    easing: { type: 'easeOut' },
    scale: { hover: 1.01, tap: 0.99 },
    shake: { intensity: 3, duration: 0.2 },
    bounce: { stiffness: 400, damping: 30 }
  },
  moderate: {
    duration: 0.3,
    easing: { type: 'easeInOut' },
    scale: { hover: 1.02, tap: 0.98 },
    shake: { intensity: 6, duration: 0.4 },
    bounce: { stiffness: 300, damping: 25 }
  },
  playful: {
    duration: 0.5,
    easing: { type: 'spring', stiffness: 200, damping: 15 },
    scale: { hover: 1.05, tap: 0.95 },
    shake: { intensity: 10, duration: 0.6 },
    bounce: { stiffness: 400, damping: 10 }
  }
};

// Default animation variants
export const createAnimationVariants = (): AnimationVariants => ({
  field: {
    fade: {
      hidden: { 
        opacity: 0,
        willChange: 'opacity'
      },
      visible: { 
        opacity: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0,
        willChange: 'opacity'
      }
    },
    slideUp: {
      hidden: { 
        opacity: 0, 
        y: 20,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        y: -10,
        willChange: 'opacity, transform'
      }
    },
    slideDown: {
      hidden: { 
        opacity: 0, 
        y: -20,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        y: 10,
        willChange: 'opacity, transform'
      }
    },
    slideLeft: {
      hidden: { 
        opacity: 0, 
        x: 20,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        x: -10,
        willChange: 'opacity, transform'
      }
    },
    slideRight: {
      hidden: { 
        opacity: 0, 
        x: -20,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        x: 10,
        willChange: 'opacity, transform'
      }
    },
    scale: {
      hidden: { 
        opacity: 0, 
        scale: 0.95,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        scale: 0.95,
        willChange: 'opacity, transform'
      }
    },
    scaleUp: {
      hidden: { 
        opacity: 0, 
        scale: 0.8,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        scale: 1.1,
        willChange: 'opacity, transform'
      }
    },
    scaleDown: {
      hidden: { 
        opacity: 0, 
        scale: 1.1,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        scale: 0.8,
        willChange: 'opacity, transform'
      }
    },
    bounce: {
      hidden: { 
        opacity: 0, 
        scale: 0.3,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        scale: 0.3,
        willChange: 'opacity, transform'
      }
    },
    spring: {
      hidden: { 
        opacity: 0, 
        y: 30, 
        scale: 0.9,
        willChange: 'opacity, transform'
      },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        willChange: 'auto'
      },
      exit: { 
        opacity: 0, 
        y: -30, 
        scale: 0.9,
        willChange: 'opacity, transform'
      }
    }
  },
  
  error: {
    shake: {
      hidden: { x: 0 },
      visible: { 
        x: [0, -10, 10, -10, 10, 0],
        willChange: 'transform',
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      }
    },
    pulse: {
      hidden: { scale: 1 },
      visible: { 
        scale: [1, 1.05, 1],
        willChange: 'transform'
      }
    }
  },
  
  success: {
    scale: {
      hidden: { 
        scale: 0, 
        opacity: 0,
        willChange: 'opacity, transform'
      },
      visible: { 
        scale: 1, 
        opacity: 1,
        willChange: 'auto'
      }
    },
    bounce: {
      hidden: { 
        y: 20, 
        opacity: 0,
        willChange: 'opacity, transform'
      },
      visible: { 
        y: 0, 
        opacity: 1,
        willChange: 'auto'
      }
    }
  },
  
  button: {
    default: {
      idle: { 
        scale: 1,
        willChange: 'auto'
      },
      hover: { 
        scale: 1.02,
        willChange: 'transform'
      },
      tap: { 
        scale: 0.98,
        willChange: 'transform'
      },
      disabled: { 
        opacity: 0.5,
        scale: 1,
        willChange: 'auto'
      }
    },
    primary: {
      idle: { 
        scale: 1, 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        willChange: 'auto'
      },
      hover: { 
        scale: 1.02, 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        willChange: 'transform, box-shadow'
      },
      tap: { 
        scale: 0.98,
        willChange: 'transform'
      },
      disabled: { 
        opacity: 0.5, 
        scale: 1,
        willChange: 'auto'
      }
    },
    secondary: {
      idle: { 
        scale: 1,
        willChange: 'auto'
      },
      hover: { 
        scale: 1.02, 
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        willChange: 'transform, background-color'
      },
      tap: { 
        scale: 0.98,
        willChange: 'transform'
      },
      disabled: { 
        opacity: 0.5,
        willChange: 'auto'
      }
    }
  }
});

// Default animation transitions with intensity support
export const createAnimationTransitions = (): AnimationTransitions => ({
  none: {
    duration: 0,
    ease: "linear"
  },
  subtle: {
    duration: 0.15,
    ease: "easeOut"
  },
  moderate: {
    duration: 0.3,
    ease: "easeInOut"
  },
  playful: {
    type: "spring",
    stiffness: 200,
    damping: 15,
    mass: 1
  },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 1
  },
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
    mass: 1
  }
});

// Create transition from timing and easing config with intensity
export const createTransition = (
  timing: AnimationTiming, 
  easing: AnimationEasing, 
  intensity: AnimationIntensity = 'moderate'
): Transition => {
  const intensitySettings = intensityConfigurations[intensity];
  
  // For 'none' intensity, return immediate transition
  if (intensity === 'none') {
    return { duration: 0, ease: "linear" };
  }
  
  const baseTransition: Transition = {
    duration: intensitySettings.duration,
    delay: timing.delay
  };

  switch (easing.type) {
    case 'spring':
      return {
        ...baseTransition,
        type: "spring",
        stiffness: easing.stiffness || intensitySettings.bounce.stiffness,
        damping: easing.damping || intensitySettings.bounce.damping,
        mass: easing.mass || 1
      };
    case 'linear':
      return { ...baseTransition, ease: "linear" };
    case 'easeIn':
      return { ...baseTransition, ease: "easeIn" };
    case 'easeOut':
      return { ...baseTransition, ease: "easeOut" };
    case 'easeInOut':
      return { ...baseTransition, ease: "easeInOut" };
    default:
      return { ...baseTransition, ease: "easeInOut" };
  }
};

// Get variants by preset name with intensity adjustment
export const getVariantsByPreset = (
  preset: AnimationPreset, 
  variants: AnimationVariants,
  intensity: AnimationIntensity = 'moderate'
): Variants => {
  if (intensity === 'none') {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }

  let baseVariants: Variants;
  
  switch (preset) {
    case 'fade':
      baseVariants = variants.field.fade;
      break;
    case 'slideUp':
      baseVariants = variants.field.slideUp;
      break;
    case 'slideDown':
      baseVariants = variants.field.slideDown;
      break;
    case 'slideLeft':
      baseVariants = variants.field.slideLeft;
      break;
    case 'slideRight':
      baseVariants = variants.field.slideRight;
      break;
    case 'scale':
      baseVariants = variants.field.scale;
      break;
    case 'scaleUp':
      baseVariants = variants.field.scaleUp;
      break;
    case 'scaleDown':
      baseVariants = variants.field.scaleDown;
      break;
    case 'bounce':
      baseVariants = variants.field.bounce;
      break;
    case 'spring':
      baseVariants = variants.field.spring;
      break;
    case 'shake':
      baseVariants = variants.error.shake;
      break;
    case 'pulse':
      baseVariants = variants.error.pulse;
      break;
    default:
      baseVariants = variants.field.fade;
  }

  return adjustAnimationIntensity(baseVariants, intensity);
};

// Adjust animation intensity for variants
export const adjustAnimationIntensity = (
  variants: Variants, 
  intensity: AnimationIntensity
): Variants => {
  if (intensity === 'none') {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }

  const intensitySettings = intensityConfigurations[intensity];
  const multipliers = {
    subtle: 0.5,
    moderate: 1,
    playful: 1.5
  };

  const multiplier = multipliers[intensity] || 1;
  const adjustedVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      adjustedVariants[key] = { ...variant };
      
      // Adjust transform values based on intensity
      if ('x' in variant && typeof variant.x === 'number') {
        adjustedVariants[key].x = variant.x * multiplier;
      }
      if ('y' in variant && typeof variant.y === 'number') {
        adjustedVariants[key].y = variant.y * multiplier;
      }
      if ('scale' in variant && typeof variant.scale === 'number') {
        const scaleDiff = variant.scale - 1;
        adjustedVariants[key].scale = 1 + (scaleDiff * multiplier);
      }
      
      // Add willChange for performance
      if (!adjustedVariants[key].willChange) {
        adjustedVariants[key].willChange = 'auto';
      }
    }
  });
  
  return adjustedVariants;
};

// Create button variants with intensity
export const createButtonVariants = (intensity: AnimationIntensity) => {
  const settings = intensityConfigurations[intensity];
  
  return {
    idle: { 
      scale: 1,
      willChange: intensity === 'none' ? 'auto' : 'transform'
    },
    hover: { 
      scale: settings.scale.hover,
      willChange: intensity === 'none' ? 'auto' : 'transform'
    },
    tap: { 
      scale: settings.scale.tap,
      willChange: intensity === 'none' ? 'auto' : 'transform'
    },
    disabled: { 
      opacity: 0.5,
      scale: 1,
      willChange: 'auto'
    }
  };
};

// Create error shake variants with intensity
export const createShakeVariants = (intensity: AnimationIntensity) => {
  const settings = intensityConfigurations[intensity];
  
  if (intensity === 'none') {
    return {
      hidden: { x: 0 },
      visible: { x: 0 }
    };
  }
  
  const shakeValues = Array.from({ length: 5 }, (_, i) => 
    i % 2 === 0 ? 0 : (i % 4 === 1 ? -settings.shake.intensity : settings.shake.intensity)
  );
  shakeValues.push(0);
  
  return {
    hidden: { x: 0 },
    visible: { 
      x: shakeValues,
      willChange: 'transform',
      transition: {
        duration: settings.shake.duration,
        ease: "easeInOut"
      }
    }
  };
};

// Performance optimization utilities
export const optimizeVariantsForPerformance = (variants: Variants): Variants => {
  const optimized: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      optimized[key] = {
        ...variant,
        // Ensure GPU acceleration for transforms
        ...(('x' in variant || 'y' in variant || 'scale' in variant) && {
          willChange: 'transform'
        }),
        // Ensure GPU acceleration for opacity
        ...('opacity' in variant && {
          willChange: variant.willChange ? `${variant.willChange}, opacity` : 'opacity'
        })
      };
    }
  });
  
  return optimized;
};