"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "../AnimationProvider";
import { AnimatedComponentProps } from "@/types";

interface AnimatedFieldContainerProps extends AnimatedComponentProps {
  fieldId: string;
  isVisible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedFieldContainer: React.FC<AnimatedFieldContainerProps> = ({
  fieldId,
  isVisible = true,
  children,
  className = "",
  animationPreset,
  intensity,
  disabled = false,
  customVariants,
  customTransition,
  ...motionProps
}) => {
  const { config, getFieldVariants, getTransition, getIntensitySettings } =
    useAnimation();

  // Determine animation preset (use prop, config, or default)
  const preset = animationPreset || config.fieldEntrance.preset;

  // Get intensity settings
  const intensitySettings = getIntensitySettings();

  // Get variants (custom or from preset)
  const variants = customVariants || getFieldVariants(preset);

  // Get transition with intensity awareness
  const transition =
    customTransition ||
    getTransition(
      {
        duration: intensitySettings.duration,
        delay: config.fieldEntrance.timing.delay,
        stagger: config.fieldEntrance.timing.stagger,
      },
      intensitySettings.easing
    );

  // If animations are disabled or component is disabled
  if (!config.enabled || disabled || config.intensity === "none") {
    return (
      <div className={className} data-field-id={fieldId} data-animated="false">
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={fieldId}
          className={className}
          data-field-id={fieldId}
          data-animated="true"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          {...motionProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
