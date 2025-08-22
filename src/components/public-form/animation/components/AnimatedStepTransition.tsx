"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimation } from "../AnimationProvider";
import { AnimatedComponentProps } from "@/types";

interface AnimatedStepTransitionProps extends AnimatedComponentProps {
  currentStep: number;
  direction: "forward" | "backward";
  children: React.ReactNode;
  className?: string;
}

export const AnimatedStepTransition: React.FC<AnimatedStepTransitionProps> = ({
  currentStep,
  direction,
  children,
  className = "",
  customVariants,
  customTransition,
  ...motionProps
}) => {
  const { config, getIntensitySettings } = useAnimation();
  const intensitySettings = getIntensitySettings();

  // Create direction-aware variants based on intensity
  const createStepVariants = () => {
    if (customVariants) return customVariants;

    // Base movement distance based on intensity
    const moveDistance =
      config.intensity === "none"
        ? 0
        : {
            subtle: 20,
            moderate: 50,
            playful: 80,
          }[config.intensity] || 50;

    switch (direction) {
      case "forward":
        return {
          hidden: {
            opacity: 0,
            x: moveDistance,
            willChange: config.enabled ? "opacity, transform" : "auto",
          },
          visible: {
            opacity: 1,
            x: 0,
            willChange: "auto",
          },
          exit: {
            opacity: 0,
            x: -moveDistance,
            willChange: config.enabled ? "opacity, transform" : "auto",
          },
        };
      case "backward":
        return {
          hidden: {
            opacity: 0,
            x: -moveDistance,
            willChange: config.enabled ? "opacity, transform" : "auto",
          },
          visible: {
            opacity: 1,
            x: 0,
            willChange: "auto",
          },
          exit: {
            opacity: 0,
            x: moveDistance,
            willChange: config.enabled ? "opacity, transform" : "auto",
          },
        };
      default:
        return {
          hidden: {
            opacity: 0,
            willChange: config.enabled ? "opacity" : "auto",
          },
          visible: {
            opacity: 1,
            willChange: "auto",
          },
          exit: {
            opacity: 0,
            willChange: config.enabled ? "opacity" : "auto",
          },
        };
    }
  };

  const stepVariants = createStepVariants();

  // Get transition with intensity awareness
  const transition = customTransition || {
    duration: intensitySettings.duration,
    ease: intensitySettings.easing.type === "spring" ? undefined : "easeInOut",
    ...(intensitySettings.easing.type === "spring" && {
      type: "spring",
      stiffness: intensitySettings.easing.stiffness || 300,
      damping: intensitySettings.easing.damping || 25,
    }),
  };

  // If animations are disabled
  if (!config.enabled) {
    return (
      <div className={className} data-animated="false">
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          data-animated="true"
          {...motionProps}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
