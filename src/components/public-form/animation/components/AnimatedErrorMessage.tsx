"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation, useErrorAnimation } from "../AnimationProvider";
import { AnimatedComponentProps } from "@/types";

interface AnimatedErrorMessageProps extends AnimatedComponentProps {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedErrorMessage: React.FC<AnimatedErrorMessageProps> = ({
  isVisible,
  children,
  className = "",
  customVariants,
  customTransition,
  ...motionProps
}) => {
  const { config, getIntensitySettings } = useAnimation();
  const errorVariants = useErrorAnimation();
  const intensitySettings = getIntensitySettings();

  // Use custom variants or intensity-aware error variants
  const variants = customVariants || {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      willChange: config.intensity !== "none" ? "opacity, transform" : "auto",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      willChange: "auto",
      // Add shake effect based on intensity
      ...(config.intensity !== "none" &&
        typeof errorVariants.visible === "object" &&
        errorVariants.visible &&
        "x" in errorVariants.visible && {
          x: errorVariants.visible.x,
        }),
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.98,
      willChange: config.intensity !== "none" ? "opacity, transform" : "auto",
    },
  };

  // Get transition with intensity settings
  const transition = customTransition || {
    duration: intensitySettings.duration,
    ease: "easeOut", // Always use easeOut for error messages to support shake keyframes
  };

  // If animations are disabled
  if (!config.enabled || config.intensity === "none") {
    return isVisible ? (
      <div className={className} data-animated="false">
        {children}
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          data-animated="true"
          {...motionProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
