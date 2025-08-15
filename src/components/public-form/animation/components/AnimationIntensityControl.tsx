"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAnimation } from "../AnimationProvider";
import { AnimationIntensity } from "../types";

interface AnimationIntensityControlProps {
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
}

export const AnimationIntensityControl: React.FC<
  AnimationIntensityControlProps
> = ({
  className = "",
  showLabels = true,
  size = "md",
  orientation = "horizontal",
}) => {
  const { config, updateIntensity, isReducedMotion } = useAnimation();

  const intensityOptions: Array<{
    value: AnimationIntensity;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      value: "none",
      label: "None",
      description: "No animations, instant transitions",
      icon: "⚫",
    },
    {
      value: "subtle",
      label: "Subtle",
      description: "Fast, minimal animations (0.15s)",
      icon: "🔹",
    },
    {
      value: "moderate",
      label: "Moderate",
      description: "Smooth animations (0.3s)",
      icon: "🔵",
    },
    {
      value: "playful",
      label: "Playful",
      description: "Bouncy animations (0.5s)",
      icon: "🟢",
    },
  ];

  const handleIntensityChange = (intensity: AnimationIntensity) => {
    updateIntensity(intensity);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          container: "text-xs gap-1",
          button: "px-2 py-1 text-xs",
          icon: "text-sm",
        };
      case "lg":
        return {
          container: "text-base gap-3",
          button: "px-4 py-3 text-base",
          icon: "text-xl",
        };
      default:
        return {
          container: "text-sm gap-2",
          button: "px-3 py-2 text-sm",
          icon: "text-base",
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const currentIntensity = isReducedMotion ? "none" : config.intensity;

  return (
    <div className={`animation-intensity-control ${className}`}>
      <div
        className={`flex ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        } ${sizeClasses.container}`}
      >
        {intensityOptions.map((option) => {
          const isSelected = currentIntensity === option.value;
          const isDisabled = isReducedMotion && option.value !== "none";

          return (
            <motion.button
              key={option.value}
              onClick={() => handleIntensityChange(option.value)}
              disabled={isDisabled}
              className={`
                relative overflow-hidden rounded-md border transition-all duration-200
                ${sizeClasses.button}
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-500 text-blue-900 shadow-sm"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              `}
              whileHover={!isDisabled ? { scale: 1.02 } : undefined}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * intensityOptions.indexOf(option) }}
              title={option.description}
              aria-label={`Set animation intensity to ${option.label}: ${option.description}`}
              aria-pressed={isSelected}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 bg-blue-500 opacity-10 rounded-md"
                  layoutId="intensity-selection"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-center gap-2">
                <span
                  className={sizeClasses.icon}
                  role="img"
                  aria-hidden="true"
                >
                  {option.icon}
                </span>
                {showLabels && (
                  <span className="font-medium">{option.label}</span>
                )}
              </div>

              {/* Reduced motion indicator */}
              {isReducedMotion && option.value !== "none" && (
                <div
                  className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full"
                  title="Disabled due to reduced motion preference"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Current intensity info */}
      {showLabels && (
        <motion.div
          className="mt-2 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-1">
            <span>Current:</span>
            <strong>
              {
                intensityOptions.find((opt) => opt.value === currentIntensity)
                  ?.label
              }
            </strong>
            {isReducedMotion && (
              <span className="text-orange-600 font-medium">
                (Reduced Motion Active)
              </span>
            )}
          </div>
          <div className="text-gray-500 mt-1">
            {
              intensityOptions.find((opt) => opt.value === currentIntensity)
                ?.description
            }
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Compact version for tight spaces
export const CompactAnimationControl: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <AnimationIntensityControl
      className={className}
      showLabels={false}
      size="sm"
      orientation="horizontal"
    />
  );
};

// Vertical version for sidebars
export const VerticalAnimationControl: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <AnimationIntensityControl
      className={className}
      showLabels={true}
      size="md"
      orientation="vertical"
    />
  );
};

// Demo component showing current intensity effects
export const AnimationIntensityDemo: React.FC = () => {
  const { config } = useAnimation();
  const settings = config.intensitySettings[config.intensity];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-3">Animation Preview</h3>

      <div className="space-y-3">
        {/* Duration demo */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-20">Duration:</span>
          <div className="flex-1 bg-white h-2 rounded overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: settings.duration, ease: "easeOut" }}
              key={config.intensity}
            />
          </div>
          <span className="text-xs text-gray-500">{settings.duration}s</span>
        </div>

        {/* Scale demo */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-20">Hover:</span>
          <motion.div
            className="w-8 h-8 bg-blue-500 rounded cursor-pointer"
            whileHover={{ scale: settings.scale.hover }}
            transition={{ duration: settings.duration }}
          />
          <span className="text-xs text-gray-500">{settings.scale.hover}x</span>
        </div>

        {/* Shake demo */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 w-20">Shake:</span>
          <motion.div
            className="w-8 h-8 bg-red-500 rounded cursor-pointer"
            whileTap={{
              x:
                settings.shake.intensity > 0
                  ? [0, -settings.shake.intensity, settings.shake.intensity, 0]
                  : 0,
            }}
            transition={{ duration: settings.shake.duration }}
          />
          <span className="text-xs text-gray-500">
            {settings.shake.intensity}px
          </span>
        </div>
      </div>
    </div>
  );
};
