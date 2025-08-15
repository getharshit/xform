// src/components/public-form/themes/buttons/ButtonCustomizer.tsx

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "../ThemeProvider";
import {
  ButtonCustomization,
  ButtonVariant,
  ButtonSize,
  ButtonPreset,
  ButtonStyles,
} from "./types";

interface ButtonCustomizerProps {
  onCustomizationChange?: (customization: ButtonCustomization) => void;
}

export const ButtonCustomizer: React.FC<ButtonCustomizerProps> = ({
  onCustomizationChange,
}) => {
  const { updateTheme, state } = useTheme();

  // Default button customization
  const [customization, setCustomization] = useState<ButtonCustomization>({
    variant: "filled",
    size: "medium",
    borderRadius: 8,
    borderWidth: 1,
    paddingMultiplier: 1,
    fontWeight: 500,
    hoverScale: 1.02,
    transitionDuration: 200,
    minHeight: 44,
    focusRingWidth: 2,
    hoverOpacity: 0.9,
    activeOpacity: 0.95,
    disabledOpacity: 0.5,
  });

  // Button presets
  const buttonPresets: ButtonPreset[] = useMemo(
    () => [
      {
        id: "modern",
        name: "Modern",
        description: "Clean and contemporary",
        customization: {
          ...customization,
          variant: "filled",
          borderRadius: 8,
          hoverScale: 1.02,
        },
      },
      {
        id: "rounded",
        name: "Rounded",
        description: "Friendly and approachable",
        customization: {
          ...customization,
          variant: "pill",
          borderRadius: 24,
          hoverScale: 1.05,
        },
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "Subtle and clean",
        customization: {
          ...customization,
          variant: "flat",
          borderRadius: 4,
          hoverScale: 1.0,
        },
      },
      {
        id: "outlined",
        name: "Outlined",
        description: "Professional and clear",
        customization: {
          ...customization,
          variant: "outlined",
          borderRadius: 6,
          borderWidth: 2,
        },
      },
      {
        id: "bold",
        name: "Bold",
        description: "Strong and confident",
        customization: {
          ...customization,
          variant: "square",
          borderRadius: 2,
          fontWeight: 600,
          paddingMultiplier: 1.2,
        },
      },
    ],
    [customization]
  );

  // Update customization
  const updateCustomization = useCallback(
    (updates: Partial<ButtonCustomization>) => {
      const newCustomization = { ...customization, ...updates };
      setCustomization(newCustomization);
      onCustomizationChange?.(newCustomization);

      // Update theme with button customization
      updateTheme({
        buttonCustomization: newCustomization,
      } as any);
    },
    [customization, onCustomizationChange, updateTheme]
  );

  // Apply preset
  const applyPreset = useCallback(
    (preset: ButtonPreset) => {
      updateCustomization(preset.customization);
    },
    [updateCustomization]
  );

  // Generate button styles for preview
  const generateButtonStyles = useCallback(
    (
      variant: ButtonVariant,
      size: ButtonSize,
      customization: ButtonCustomization
    ): ButtonStyles => {
      const sizeMap = {
        small: { padding: "6px 12px", fontSize: "14px", minHeight: "36px" },
        medium: { padding: "8px 16px", fontSize: "16px", minHeight: "44px" },
        large: { padding: "12px 24px", fontSize: "18px", minHeight: "52px" },
      };

      const variantStyles = {
        filled: {
          backgroundColor: "var(--form-color-primary)",
          color: "var(--form-color-text-inverse)",
          border: "none",
        },
        outlined: {
          backgroundColor: "transparent",
          color: "var(--form-color-primary)",
          border: `${customization.borderWidth}px solid var(--form-color-primary)`,
        },
        flat: {
          backgroundColor: "transparent",
          color: "var(--form-color-primary)",
          border: "none",
        },
        rounded: {
          backgroundColor: "var(--form-color-primary)",
          color: "var(--form-color-text-inverse)",
          border: "none",
          borderRadius: `${Math.max(customization.borderRadius, 16)}px`,
        },
        pill: {
          backgroundColor: "var(--form-color-primary)",
          color: "var(--form-color-text-inverse)",
          border: "none",
          borderRadius: "50px",
        },
        square: {
          backgroundColor: "var(--form-color-primary)",
          color: "var(--form-color-text-inverse)",
          border: "none",
          borderRadius: "2px",
        },
      };

      return {
        className: `form-button form-button-${variant} form-button-${size}`,
        cssProperties: {
          ...sizeMap[size],
          ...variantStyles[variant],
          borderRadius:
            variant === "pill"
              ? "50px"
              : variant === "square"
              ? "2px"
              : `${customization.borderRadius}px`,
          fontWeight: customization.fontWeight.toString(),
          transition: `all ${customization.transitionDuration}ms ease-in-out`,
          minHeight: `${customization.minHeight}px`,
        },
        accessibilityProps: {
          minContrastRatio: 4.5,
          touchTargetSize: `${customization.minHeight}px`,
          focusIndicator: `${customization.focusRingWidth}px solid var(--form-color-focus)`,
        },
      };
    },
    []
  );

  return (
    <div className="button-customizer space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Button Customization
        </h3>
        <p className="text-sm text-gray-600">
          Customize the appearance and behavior of form buttons
        </p>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {buttonPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-sm text-gray-900">
                {preset.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Variant Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Button Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              "filled",
              "outlined",
              "flat",
              "rounded",
              "pill",
              "square",
            ] as ButtonVariant[]
          ).map((variant) => (
            <button
              key={variant}
              onClick={() => updateCustomization({ variant })}
              className={`p-3 text-sm border rounded-lg transition-colors ${
                customization.variant === variant
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Button Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["small", "medium", "large"] as ButtonSize[]).map((size) => (
            <button
              key={size}
              onClick={() => updateCustomization({ size })}
              className={`p-3 text-sm border rounded-lg transition-colors ${
                customization.size === size
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Customization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Radius: {customization.borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="24"
            value={customization.borderRadius}
            onChange={(e) =>
              updateCustomization({ borderRadius: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Border Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Width: {customization.borderWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="4"
            value={customization.borderWidth}
            onChange={(e) =>
              updateCustomization({ borderWidth: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Font Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Weight: {customization.fontWeight}
          </label>
          <input
            type="range"
            min="400"
            max="700"
            step="100"
            value={customization.fontWeight}
            onChange={(e) =>
              updateCustomization({ fontWeight: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Hover Scale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hover Scale: {customization.hoverScale.toFixed(2)}
          </label>
          <input
            type="range"
            min="1"
            max="1.1"
            step="0.01"
            value={customization.hoverScale}
            onChange={(e) =>
              updateCustomization({ hoverScale: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Button Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preview
        </label>
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Primary Button */}
            <button
              style={
                generateButtonStyles(
                  customization.variant,
                  customization.size,
                  customization
                ).cssProperties
              }
              className="transition-transform hover:scale-[var(--hover-scale)]"
              onMouseEnter={(e) => {
                e.currentTarget.style.setProperty(
                  "--hover-scale",
                  customization.hoverScale.toString()
                );
              }}
            >
              Submit Form
            </button>

            {/* Secondary Button */}
            <button
              style={{
                ...generateButtonStyles(
                  "outlined",
                  customization.size,
                  customization
                ).cssProperties,
                backgroundColor: "transparent",
                color: "var(--form-color-primary)",
                border: `${customization.borderWidth}px solid var(--form-color-primary)`,
              }}
              className="transition-transform hover:scale-[var(--hover-scale)]"
            >
              Back
            </button>

            {/* Disabled Button */}
            <button
              style={{
                ...generateButtonStyles(
                  customization.variant,
                  customization.size,
                  customization
                ).cssProperties,
                opacity: customization.disabledOpacity,
                cursor: "not-allowed",
              }}
              disabled
            >
              Disabled
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Accessibility</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Minimum height: {customization.minHeight}px (meets 44px touch
            target)
          </li>
          <li>• Focus ring width: {customization.focusRingWidth}px</li>
          <li>• Transition duration: {customization.transitionDuration}ms</li>
          <li>• Disabled opacity: {customization.disabledOpacity * 100}%</li>
        </ul>
      </div>
    </div>
  );
};
