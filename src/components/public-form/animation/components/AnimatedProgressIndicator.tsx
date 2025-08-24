"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimation } from "../AnimationProvider";
import { AnimatedComponentProps } from "@/types";

interface AnimatedProgressIndicatorProps extends AnimatedComponentProps {
  progress: number; // 0-100
  type?: "bar" | "circle" | "steps";
  steps?: number;
  currentStep?: number;
  showPercentage?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedProgressIndicator: React.FC<
  AnimatedProgressIndicatorProps
> = ({
  progress,
  type = "bar",
  steps = 1,
  currentStep = 0,
  showPercentage = false,
  className = "",
  customVariants,
  customTransition,
  ...motionProps
}: AnimatedProgressIndicatorProps) => {
  const { config, getIntensitySettings } = useAnimation();
  const intensitySettings = getIntensitySettings();

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue("--form-color-primary");
    console.log("Primary color CSS property:", primaryColor);
  }, []);

  // Create transitions based on intensity
  const barTransition = customTransition || {
    duration: intensitySettings.duration,
    ease: intensitySettings.easing.type === "spring" ? undefined : "easeOut",
    ...(intensitySettings.easing.type === "spring" && {
      type: "spring",
      stiffness: intensitySettings.easing.stiffness || 300,
      damping: intensitySettings.easing.damping || 25,
    }),
  };

  const stepsTransition = {
    duration: intensitySettings.duration * 0.8,
    ease: "easeOut" as const,
  };

  const stepStagger = config.intensity === "playful" ? 0.1 : 0.05;

  // If animations are disabled
  if (!config.enabled || config.intensity === "none") {
    return renderStaticProgress();
  }

  function renderStaticProgress() {
    switch (type) {
      case "bar":
        return (
          <div className={`w-full ${className}`} data-animated="false">
            {showPercentage && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm var(--form-color-text-secondary, #6b7280)">
                  Progress
                </span>
                <span className="text-sm font-medium var(--form-color-text-primary, #111827)">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor: "var(--form-color-primary, #3b82f6)",
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        );

      case "circle":
        return (
          <div
            className={`flex justify-center ${className}`}
            data-animated="false"
          >
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 * (1 - progress / 100)}
                  style={{ color: "var(--form-color-primary, #3b82f6)" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium var(--form-color-text-primary, #111827)">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        );

      case "steps":
        return (
          <div
            className={`flex items-center justify-center space-x-4 ${className}`}
            data-animated="false"
          >
            {Array.from({ length: steps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor:
                      index <= currentStep
                        ? "var(--form-color-primary, #3b82f6)"
                        : "var(--form-color-secondary, #e5e7eb)",
                    color:
                      index <= currentStep
                        ? "var(--form-color-text-inverse, #ffffff)"
                        : "var(--form-color-text-muted, #6b7280)",
                  }}
                >
                  {index + 1}
                </div>
                {index < steps - 1 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      index < currentStep
                        ? "var(--form-color-primary, #3b82f6)"
                        : "var(--form-color-secondary, #f3f4f6)"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  switch (type) {
    case "bar":
      return (
        <div className={`w-full ${className}`} data-animated="true">
          {showPercentage && (
            <motion.div
              className="flex justify-between items-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: intensitySettings.duration * 0.5 }}
            >
              <span className="text-sm var(--form-color-text-secondary, #6b7280)">
                Progress
              </span>
              <motion.span
                className="text-sm font-medium var(--form-color-text-primary, #111827)"
                key={progress}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: intensitySettings.duration * 0.5 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{
                backgroundColor:
                  "var(--form-color-primary, #3b82f6) !important",
                willChange: config.enabled ? "width" : "auto",
              }}
              initial={{
                width: 0,
                backgroundColor: "var(--form-color-primary, #3b82f6)",
              }}
              animate={{
                width: `${progress}%`,
                backgroundColor: "var(--form-color-primary, #3b82f6)",
              }}
              transition={barTransition}
              {...motionProps}
            />
          </div>
        </div>
      );

    case "circle":
      const circumference = 175.9; // 2 * Math.PI * 28
      const strokeDashoffset = circumference * (1 - progress / 100);

      return (
        <div
          className={`flex justify-center ${className}`}
          data-animated="true"
        >
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-blue-600"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={barTransition}
                style={{
                  willChange: config.enabled ? "stroke-dashoffset" : "auto",
                }}
                {...motionProps}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-sm font-medium var(--form-color-text-primary, #111827)"
                key={progress}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: intensitySettings.duration * 0.5 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>
        </div>
      );

    case "steps":
      return (
        <div
          className={`flex items-center justify-center space-x-4 ${className}`}
          data-animated="true"
        >
          {Array.from({ length: steps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 var(--form-color-text-secondary, #6b7280)"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  backgroundColor:
                    index <= currentStep
                      ? "var(--form-color-primary, #3b82f6)"
                      : "var(--form-color-secondary, #e5e7eb)",
                }}
                transition={{
                  ...stepsTransition,
                  delay: index * stepStagger,
                }}
                whileHover={
                  config.intensity === "playful" ? { scale: 1.1 } : undefined
                }
                style={{
                  willChange:
                    config.intensity !== "none"
                      ? "transform, background-color"
                      : "auto",
                }}
                {...motionProps}
              >
                {index + 1}
              </motion.div>
              {index < steps - 1 && (
                <motion.div
                  className={`w-8 h-1 mx-2 ${
                    index < currentStep
                      ? "var(--form-color-primary, #f3f4f6)"
                      : "var(--form-color-secondary, #f3f4f6)"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: 1,
                    backgroundColor:
                      index < currentStep ? "#2563EB" : "#E5E7EB",
                  }}
                  transition={{
                    ...stepsTransition,
                    delay: (index + 0.5) * stepStagger,
                  }}
                  style={{
                    originX: 0,
                    willChange:
                      config.intensity !== "none"
                        ? "transform, background-color"
                        : "auto",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};
