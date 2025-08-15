"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimation, useButtonAnimation } from "../AnimationProvider";
import { AnimatedComponentProps } from "../types";

interface AnimatedButtonProps extends AnimatedComponentProps {
  variant?: "default" | "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "default",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  customVariants,
  customTransition,
  ...motionProps
}) => {
  const { config, getIntensitySettings } = useAnimation();
  const buttonVariants = useButtonAnimation();
  const intensitySettings = getIntensitySettings();

  // Use custom variants if provided, otherwise use intensity-aware variants
  const variants = customVariants || buttonVariants;

  // Create transition based on intensity
  const transition = customTransition || {
    duration: intensitySettings.duration,
    ease: intensitySettings.easing.type === "spring" ? undefined : "easeOut",
    ...(intensitySettings.easing.type === "spring" && {
      type: "spring",
      stiffness: intensitySettings.easing.stiffness || 300,
      damping: intensitySettings.easing.damping || 25,
    }),
  };

  // If animations are disabled or intensity is none
  if (!config.enabled || config.intensity === "none") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-animated="false"
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      variants={variants}
      initial="idle"
      animate={disabled ? "disabled" : "idle"}
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      transition={transition}
      data-animated="true"
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};
