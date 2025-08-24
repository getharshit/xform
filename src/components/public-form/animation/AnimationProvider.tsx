"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useReducedMotion, Variants, Transition } from "framer-motion";

import * as AnimationTypes from "@/types";
import type {
  AnimationConfig,
  AnimationContextValue,
  AnimationProviderProps,
  AnimationIntensity,
  IntensitySettings,
  AnimationVariants,
  AnimationTransitions,
  AnimationPreset,
  AnimationEasing,
  AnimationTiming,
} from "@/types";
// Intensity configurations
const intensityConfigurations: Record<AnimationIntensity, IntensitySettings> = {
  none: {
    duration: 0,
    easing: { type: "linear" },
    scale: { hover: 1, tap: 1 },
    shake: { intensity: 0, duration: 0 },
    bounce: { stiffness: 0, damping: 100 },
  },
  subtle: {
    duration: 0.15,
    easing: { type: "easeOut" },
    scale: { hover: 1.01, tap: 0.99 },
    shake: { intensity: 3, duration: 0.3 },
    bounce: { stiffness: 300, damping: 20 },
  },
  moderate: {
    duration: 0.3,
    easing: { type: "easeInOut" },
    scale: { hover: 1.02, tap: 0.98 },
    shake: { intensity: 6, duration: 0.4 },
    bounce: { stiffness: 200, damping: 15 },
  },
  playful: {
    duration: 0.5,
    easing: { type: "spring", stiffness: 200, damping: 15 },
    scale: { hover: 1.05, tap: 0.95 },
    shake: { intensity: 10, duration: 0.6 },
    bounce: { stiffness: 400, damping: 10 },
  },
};

// Create default animation configuration
const createDefaultAnimationConfig = (): AnimationConfig => ({
  enabled: true,
  respectReducedMotion: true,
  intensity: "moderate",
  intensitySettings: intensityConfigurations,
  fieldEntrance: {
    preset: "slideUp",
    timing: { duration: 0.3, delay: 0, stagger: 0.1 },
    easing: { type: "easeOut" },
  },
  fieldExit: {
    preset: "fade",
    timing: { duration: 0.2, delay: 0, stagger: 0 },
    easing: { type: "easeIn" },
  },
  button: {
    hover: {
      scale: 1.02,
      duration: 0.2,
      easing: { type: "easeOut" },
    },
    tap: {
      scale: 0.98,
      duration: 0.1,
    },
    disabled: {
      opacity: 0.5,
      duration: 0.2,
    },
  },
  error: {
    preset: "shake",
    timing: { duration: 0.5, delay: 0, stagger: 0 },
    shake: {
      intensity: 10,
      duration: 0.5,
    },
  },
  success: {
    preset: "bounce",
    timing: { duration: 0.6, delay: 0, stagger: 0 },
    bounce: {
      stiffness: 400,
      damping: 10,
    },
  },
  performance: {
    enableGPU: true,
    enableWillChange: true,
    cleanupOnUnmount: true,
  },
});

// Create complete animation variants matching the AnimationVariants interface
const createAnimationVariants = (): AnimationVariants => ({
  field: {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.2 },
    },
    scaleDown: {
      hidden: { opacity: 0, scale: 1.2 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
    },
    bounce: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
      exit: { opacity: 0, scale: 0.3 },
    },
    spring: {
      hidden: { opacity: 0, scale: 0.8, rotate: -10 },
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 200, damping: 15 },
      },
      exit: { opacity: 0, scale: 0.8, rotate: 10 },
    },
  },
  error: {
    shake: {
      idle: { x: 0 },
      shake: {
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      },
    },
    pulse: {
      idle: { scale: 1 },
      pulse: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.3, ease: "easeInOut" },
      },
    },
  },
  success: {
    scale: {
      idle: { scale: 1 },
      success: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
    bounce: {
      idle: { y: 0 },
      success: {
        y: [0, -10, 0],
        transition: { type: "spring", stiffness: 400, damping: 10 },
      },
    },
  },
  button: {
    default: {
      idle: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
      disabled: { opacity: 0.5, scale: 1 },
    },
    primary: {
      idle: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
      hover: { scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.15)" },
      tap: { scale: 0.98, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" },
      disabled: {
        opacity: 0.5,
        scale: 1,
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      },
    },
    secondary: {
      idle: { scale: 1, opacity: 0.8 },
      hover: { scale: 1.01, opacity: 1 },
      tap: { scale: 0.99, opacity: 0.9 },
      disabled: { opacity: 0.3, scale: 1 },
    },
  },
});

// Create animation transitions matching the AnimationTransitions interface
const createAnimationTransitions = (): AnimationTransitions => ({
  none: { duration: 0 },
  subtle: {
    duration: 0.15,
    ease: "easeOut",
  },
  moderate: {
    duration: 0.3,
    ease: "easeInOut",
  },
  playful: {
    duration: 0.5,
    ease: "easeInOut",
  },
  spring: {
    type: "spring",
    stiffness: 200,
    damping: 15,
  },
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
});

// Create context
const AnimationContext = createContext<AnimationContextValue | null>(null);

// Hook to use animation context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  initialConfig = {},
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [config, setConfig] = useState<AnimationConfig>(() => ({
    ...createDefaultAnimationConfig(),
    ...initialConfig,
  }));

  // Determine if animations should be disabled
  const isReducedMotion = Boolean(
    config.respectReducedMotion && prefersReducedMotion
  );
  const effectiveIntensity: AnimationIntensity = isReducedMotion
    ? "none"
    : config.intensity;
  const animationsEnabled = config.enabled && !isReducedMotion;

  // Create variants and transitions - memoized and stable
  const variants = useMemo(() => createAnimationVariants(), []);
  const transitions = useMemo(() => createAnimationTransitions(), []);

  // Get current intensity settings
  const getCurrentIntensitySettings = useCallback((): IntensitySettings => {
    return config.intensitySettings[effectiveIntensity];
  }, [config.intensitySettings, effectiveIntensity]);

  // Update configuration - stable reference
  const updateConfig = useCallback((updates: Partial<AnimationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Update intensity - stable reference
  const updateIntensity = useCallback((intensity: AnimationIntensity) => {
    setConfig((prev) => ({ ...prev, intensity }));
  }, []);

  // Get field variants with proper typing
  const getFieldVariants = useCallback(
    (preset: AnimationPreset): Variants => {
      if (!animationsEnabled || effectiveIntensity === "none") {
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
          exit: { opacity: 1 },
        };
      }

      // Get the variants from the field variants
      const fieldVariants =
        variants.field[preset as keyof typeof variants.field];
      if (!fieldVariants) {
        return variants.field.slideUp; // Fallback
      }

      return fieldVariants;
    },
    [animationsEnabled, effectiveIntensity, variants]
  );

  // Get transition with intensity
  const getTransition = useCallback(
    (timing: AnimationTiming, easing: AnimationEasing): Transition => {
      if (!animationsEnabled || effectiveIntensity === "none") {
        return { duration: 0 };
      }

      const settings = getCurrentIntensitySettings();

      // Convert custom easing to Framer Motion easing
      let framerEasing: any = "easeInOut";

      if (settings.easing.type === "spring") {
        return {
          duration: settings.duration,
          type: "spring",
          stiffness: settings.easing.stiffness || 200,
          damping: settings.easing.damping || 15,
          delay: timing.delay || 0,
        };
      }

      // Map string easing types to Framer Motion values
      switch (settings.easing.type) {
        case "linear":
          framerEasing = "linear";
          break;
        case "easeIn":
          framerEasing = "easeIn";
          break;
        case "easeOut":
          framerEasing = "easeOut";
          break;
        case "easeInOut":
          framerEasing = "easeInOut";
          break;
        case "bezier":
          if ("values" in settings.easing) {
            framerEasing = settings.easing.values;
          }
          break;
        default:
          framerEasing = "easeInOut";
      }

      return {
        duration: settings.duration,
        ease: framerEasing,
        delay: timing.delay || 0,
      };
    },
    [animationsEnabled, effectiveIntensity, getCurrentIntensitySettings]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (config.performance.cleanupOnUnmount) {
        const animatedElements = document.querySelectorAll(
          '[data-animated="true"]'
        );
        animatedElements.forEach((el) => {
          const element = el as HTMLElement;
          element.style.willChange = "auto";
          element.removeAttribute("data-animated");
        });
      }
    };
  }, [config.performance.cleanupOnUnmount]);

  // Context value - properly memoized
  const contextValue = useMemo<AnimationContextValue>(
    () => ({
      config,
      variants,
      transitions,
      updateConfig,
      updateIntensity,
      isReducedMotion,
      getFieldVariants,
      getTransition,
      getIntensitySettings: getCurrentIntensitySettings,
    }),
    [
      config,
      variants,
      transitions,
      updateConfig,
      updateIntensity,
      isReducedMotion,
      getFieldVariants,
      getTransition,
      getCurrentIntensitySettings,
    ]
  );

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

// Simplified hook for form customization - NO DEPENDENCIES LOOP
export const useAnimationFromCustomization = (customization?: any) => {
  const { updateConfig } = useAnimation();
  const lastCustomizationRef = useRef<string>("");

  useEffect(() => {
    if (!customization?.animations) return;

    const customizationString = JSON.stringify(customization.animations);
    if (customizationString === lastCustomizationRef.current) {
      return;
    }

    console.log("Applying animation customization:", customization.animations);

    const animationUpdates: Partial<AnimationConfig> = {
      enabled: customization.animations.enableAnimations ?? true,
      intensity: mapIntensity(customization.animations.intensity),
    };

    updateConfig(animationUpdates);
    lastCustomizationRef.current = customizationString;
  }, [
    customization?.animations?.enableAnimations,
    customization?.animations?.intensity,
    updateConfig,
  ]);
};

// Hook for button animations
export const useButtonAnimation = (): Variants => {
  const { variants, config, isReducedMotion } = useAnimation();
  const effectiveIntensity = isReducedMotion ? "none" : config.intensity;

  return useMemo(() => {
    if (effectiveIntensity === "none") {
      return {
        idle: { scale: 1 },
        hover: { scale: 1 },
        tap: { scale: 1 },
        disabled: { opacity: 0.5 },
      };
    }

    return variants.button.default;
  }, [variants, effectiveIntensity]);
};

// Hook for error animations
export const useErrorAnimation = (): Variants => {
  const { variants, config, isReducedMotion } = useAnimation();
  const effectiveIntensity = isReducedMotion ? "none" : config.intensity;

  return useMemo(() => {
    if (effectiveIntensity === "none") {
      return {
        idle: { x: 0 },
        shake: { x: 0 },
      };
    }

    return variants.error.shake;
  }, [variants, effectiveIntensity]);
};

// Map string intensity to typed intensity
const mapIntensity = (intensity?: string): AnimationIntensity => {
  switch (intensity) {
    case "none":
      return "none";
    case "subtle":
      return "subtle";
    case "moderate":
      return "moderate";
    case "playful":
      return "playful";
    default:
      return "moderate";
  }
};

// Performance utilities
export const useAnimationPerformance = () => {
  const { config } = useAnimation();

  return useMemo(
    () => ({
      enableGPU: (element: HTMLElement) => {
        if (config.performance.enableGPU) {
          element.style.transform = "translate3d(0, 0, 0)";
          element.setAttribute("data-animated", "true");
        }
      },
      cleanup: (element: HTMLElement) => {
        if (config.performance.cleanupOnUnmount) {
          element.style.willChange = "auto";
          element.style.transform = "";
          element.removeAttribute("data-animated");
        }
      },
      shouldAnimate: config.enabled && config.intensity !== "none",
    }),
    [config]
  );
};
