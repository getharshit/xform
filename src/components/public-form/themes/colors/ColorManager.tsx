// src/components/public-form/themes/colors/ColorManager.tsx

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "../ThemeProvider";
import {
  ColorPalette,
  ColorCustomization,
  ColorPreset,
  ColorAccessibility,
  ColorAnalysis,
} from "./types";
import { AlertTriangle, Check, Eye, Palette, RefreshCw } from "lucide-react";

interface ColorManagerProps {
  onColorsChange?: (colors: ColorPalette) => void;
}

export const ColorManager: React.FC<ColorManagerProps> = ({
  onColorsChange,
}) => {
  const { updateTheme, state } = useTheme();

  // Current color palette
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: "#3B82F6",
    secondary: "#6B7280",
    tertiary: "#E5E7EB",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    textInverse: "#FFFFFF",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    surfaceElevated: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    focus: "#3B82F6",
    selection: "rgba(59, 130, 246, 0.1)",
    overlay: "rgba(0, 0, 0, 0.5)",
  });

  // Color presets
  const colorPresets: ColorPreset[] = useMemo(
    () => [
      {
        id: "blue",
        name: "Ocean Blue",
        description: "Professional and trustworthy",
        category: "light",
        palette: {
          ...colorPalette,
          primary: "#0EA5E9",
          secondary: "#64748B",
          tertiary: "#CBD5E1",
        },
        accessibility: {
          minimumContrast: 4.5,
          supportedStandards: ["AA"],
        },
      },
      {
        id: "green",
        name: "Nature Green",
        description: "Fresh and eco-friendly",
        category: "light",
        palette: {
          ...colorPalette,
          primary: "#059669",
          secondary: "#6B7280",
          tertiary: "#D1D5DB",
        },
        accessibility: {
          minimumContrast: 4.5,
          supportedStandards: ["AA"],
        },
      },
      {
        id: "purple",
        name: "Royal Purple",
        description: "Creative and innovative",
        category: "light",
        palette: {
          ...colorPalette,
          primary: "#7C3AED",
          secondary: "#8B5CF6",
          tertiary: "#DDD6FE",
        },
        accessibility: {
          minimumContrast: 4.5,
          supportedStandards: ["AA"],
        },
      },
      {
        id: "orange",
        name: "Warm Orange",
        description: "Energetic and friendly",
        category: "light",
        palette: {
          ...colorPalette,
          primary: "#EA580C",
          secondary: "#FB923C",
          tertiary: "#FED7AA",
        },
        accessibility: {
          minimumContrast: 4.5,
          supportedStandards: ["AA"],
        },
      },
      {
        id: "dark",
        name: "Dark Mode",
        description: "Modern dark theme",
        category: "dark",
        palette: {
          primary: "#3B82F6",
          secondary: "#9CA3AF",
          tertiary: "#374151",
          textPrimary: "#F9FAFB",
          textSecondary: "#D1D5DB",
          textTertiary: "#9CA3AF",
          textInverse: "#111827",
          background: "#111827",
          surface: "#1F2937",
          surfaceElevated: "#374151",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
          focus: "#3B82F6",
          selection: "rgba(59, 130, 246, 0.2)",
          overlay: "rgba(0, 0, 0, 0.8)",
        },
        accessibility: {
          minimumContrast: 4.5,
          supportedStandards: ["AA"],
        },
      },
      {
        id: "highcontrast",
        name: "High Contrast",
        description: "Maximum accessibility",
        category: "accessible",
        palette: {
          primary: "#000000",
          secondary: "#333333",
          tertiary: "#666666",
          textPrimary: "#000000",
          textSecondary: "#333333",
          textTertiary: "#666666",
          textInverse: "#FFFFFF",
          background: "#FFFFFF",
          surface: "#FFFFFF",
          surfaceElevated: "#FFFFFF",
          success: "#006600",
          warning: "#CC6600",
          error: "#CC0000",
          info: "#000080",
          focus: "#000000",
          selection: "rgba(0, 0, 0, 0.1)",
          overlay: "rgba(0, 0, 0, 0.8)",
        },
        accessibility: {
          minimumContrast: 7.0,
          supportedStandards: ["AA", "AAA"],
        },
      },
    ],
    [colorPalette]
  );

  // Calculate contrast ratio between two colors
  const calculateContrastRatio = useCallback(
    (foreground: string, background: string): number => {
      // Simplified contrast calculation (in real app, use a proper library)
      // This is a basic implementation for demonstration

      const getLuminance = (color: string): number => {
        // Convert hex to RGB
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;

        // Calculate relative luminance
        const toLinear = (c: number) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

        return (
          0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
        );
      };

      const l1 = getLuminance(foreground);
      const l2 = getLuminance(background);

      const brightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);

      return (brightest + 0.05) / (darkest + 0.05);
    },
    []
  );

  // Check accessibility of color combinations
  const checkAccessibility = useCallback(
    (palette: ColorPalette): Record<string, ColorAccessibility> => {
      const results: Record<string, ColorAccessibility> = {};

      // Check text on backgrounds
      const combinations = [
        {
          name: "primaryText",
          fg: palette.textPrimary,
          bg: palette.background,
        },
        {
          name: "secondaryText",
          fg: palette.textSecondary,
          bg: palette.background,
        },
        { name: "primaryButton", fg: palette.textInverse, bg: palette.primary },
        { name: "surfaceText", fg: palette.textPrimary, bg: palette.surface },
        { name: "errorText", fg: palette.textInverse, bg: palette.error },
        { name: "successText", fg: palette.textInverse, bg: palette.success },
      ];

      combinations.forEach(({ name, fg, bg }) => {
        const ratio = calculateContrastRatio(fg, bg);
        results[name] = {
          contrastRatio: ratio,
          isAccessible: ratio >= 4.5,
          isHighContrast: ratio >= 7.0,
          recommendation:
            ratio < 4.5
              ? "Increase contrast to meet WCAG AA standards (4.5:1)"
              : ratio < 7.0
              ? "Good contrast. Consider increasing for AAA compliance (7:1)"
              : "Excellent contrast!",
        };
      });

      return results;
    },
    [calculateContrastRatio]
  );

  // Update color palette
  const updateColor = useCallback(
    (colorKey: keyof ColorPalette, value: string) => {
      const newPalette = { ...colorPalette, [colorKey]: value };
      setColorPalette(newPalette);
      onColorsChange?.(newPalette);

      // Update theme
      updateTheme({
        colors: {
          ...state.currentTheme.colors,
          [colorKey]: value,
        },
      });
    },
    [colorPalette, onColorsChange, updateTheme, state.currentTheme.colors]
  );

  // Apply color preset
  const applyPreset = useCallback(
    (preset: ColorPreset) => {
      setColorPalette(preset.palette);
      onColorsChange?.(preset.palette);

      // Update theme with new colors
      updateTheme({
        colors: {
          ...state.currentTheme.colors,
          primary: preset.palette.primary,
          secondary: preset.palette.secondary,
          background: preset.palette.background,
          surface: preset.palette.surface,
          textPrimary: preset.palette.textPrimary,
          textSecondary: preset.palette.textSecondary,
          textInverse: preset.palette.textInverse,
          success: preset.palette.success,
          warning: preset.palette.warning,
          error: preset.palette.error,
          info: preset.palette.info,
        },
      });
    },
    [onColorsChange, updateTheme, state.currentTheme.colors]
  );

  // Generate color variations
  const generateVariations = useCallback((baseColor: string): string[] => {
    // Simplified color variation generation
    // In a real app, you'd use a proper color manipulation library
    const variations = [];
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Generate lighter variations
    for (let i = 1; i <= 3; i++) {
      const factor = 1 + i * 0.15;
      const newR = Math.min(255, Math.round(r * factor));
      const newG = Math.min(255, Math.round(g * factor));
      const newB = Math.min(255, Math.round(b * factor));
      variations.push(
        `#${newR.toString(16).padStart(2, "0")}${newG
          .toString(16)
          .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
      );
    }

    // Generate darker variations
    for (let i = 1; i <= 3; i++) {
      const factor = 1 - i * 0.15;
      const newR = Math.max(0, Math.round(r * factor));
      const newG = Math.max(0, Math.round(g * factor));
      const newB = Math.max(0, Math.round(b * factor));
      variations.push(
        `#${newR.toString(16).padStart(2, "0")}${newG
          .toString(16)
          .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
      );
    }

    return variations;
  }, []);

  // Current accessibility status
  const accessibilityStatus = useMemo(() => {
    return checkAccessibility(colorPalette);
  }, [colorPalette, checkAccessibility]);

  // Color input component
  const ColorInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
  }> = ({ label, value, onChange, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            // In a real app, this would open a color picker
            const newColor = prompt("Enter hex color:", value);
            if (newColor) onChange(newColor);
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="#000000"
        />
        <button
          onClick={() => {
            const variations = generateVariations(value);
            // Show variations picker (simplified)
            console.log("Variations:", variations);
          }}
          className="p-2 text-gray-500 hover:text-gray-700"
          title="Generate variations"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>
      {description && <p className="text-xs text-gray-600">{description}</p>}
    </div>
  );

  return (
    <div className="color-manager space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Color Management
        </h3>
        <p className="text-sm text-gray-600">
          Customize your form's color palette with accessibility compliance
        </p>
      </div>

      {/* Color Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Presets
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.palette.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.palette.secondary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.palette.tertiary }}
                />
              </div>
              <div className="font-medium text-sm text-gray-900">
                {preset.name}
              </div>
              <div className="text-xs text-gray-600">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Colors */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Brand Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorInput
            label="Primary Color"
            value={colorPalette.primary}
            onChange={(value) => updateColor("primary", value)}
            description="Main brand color for buttons and links"
          />
          <ColorInput
            label="Secondary Color"
            value={colorPalette.secondary}
            onChange={(value) => updateColor("secondary", value)}
            description="Accent color for highlights and icons"
          />
          <ColorInput
            label="Tertiary Color"
            value={colorPalette.tertiary}
            onChange={(value) => updateColor("tertiary", value)}
            description="Subtle color for borders and dividers"
          />
        </div>
      </div>

      {/* Background Colors */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Background Colors
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorInput
            label="Background"
            value={colorPalette.background}
            onChange={(value) => updateColor("background", value)}
            description="Main page background"
          />
          <ColorInput
            label="Surface"
            value={colorPalette.surface}
            onChange={(value) => updateColor("surface", value)}
            description="Form and card backgrounds"
          />
        </div>
      </div>

      {/* Text Colors */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Text Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorInput
            label="Primary Text"
            value={colorPalette.textPrimary}
            onChange={(value) => updateColor("textPrimary", value)}
            description="Main text color"
          />
          <ColorInput
            label="Secondary Text"
            value={colorPalette.textSecondary}
            onChange={(value) => updateColor("textSecondary", value)}
            description="Subdued text color"
          />
          <ColorInput
            label="Inverse Text"
            value={colorPalette.textInverse}
            onChange={(value) => updateColor("textInverse", value)}
            description="Text on colored backgrounds"
          />
        </div>
      </div>

      {/* State Colors */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">State Colors</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorInput
            label="Success"
            value={colorPalette.success}
            onChange={(value) => updateColor("success", value)}
          />
          <ColorInput
            label="Warning"
            value={colorPalette.warning}
            onChange={(value) => updateColor("warning", value)}
          />
          <ColorInput
            label="Error"
            value={colorPalette.error}
            onChange={(value) => updateColor("error", value)}
          />
          <ColorInput
            label="Info"
            value={colorPalette.info}
            onChange={(value) => updateColor("info", value)}
          />
        </div>
      </div>

      {/* Accessibility Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Accessibility Status
        </h4>
        <div className="space-y-2">
          {Object.entries(accessibilityStatus).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {status.contrastRatio.toFixed(1)}:1
                </span>
                {status.isAccessible ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overall accessibility summary */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Overall Compliance</span>
            <div className="flex items-center space-x-2">
              {Object.values(accessibilityStatus).every(
                (s) => s.isAccessible
              ) ? (
                <>
                  <span className="text-sm text-green-600">
                    WCAG AA Compliant
                  </span>
                  <Check className="w-4 h-4 text-green-500" />
                </>
              ) : (
                <>
                  <span className="text-sm text-red-600">
                    Accessibility Issues
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Live Preview</h4>
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: colorPalette.background,
            color: colorPalette.textPrimary,
          }}
        >
          <div className="space-y-4">
            {/* Form title */}
            <h2
              className="text-xl font-semibold"
              style={{ color: colorPalette.textPrimary }}
            >
              Sample Form Title
            </h2>

            {/* Form description */}
            <p style={{ color: colorPalette.textSecondary }}>
              This is how your form description will appear with the current
              color scheme.
            </p>

            {/* Form field */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: colorPalette.textPrimary }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-md"
                style={{
                  backgroundColor: colorPalette.surface,
                  border: `1px solid ${colorPalette.tertiary}`,
                  color: colorPalette.textPrimary,
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: colorPalette.primary,
                  color: colorPalette.textInverse,
                }}
              >
                Submit
              </button>
              <button
                className="px-4 py-2 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  color: colorPalette.primary,
                  border: `1px solid ${colorPalette.primary}`,
                }}
              >
                Cancel
              </button>
            </div>

            {/* State messages */}
            <div className="space-y-2">
              <div
                className="p-2 rounded text-sm"
                style={{
                  backgroundColor: `${colorPalette.success}20`,
                  color: colorPalette.success,
                  border: `1px solid ${colorPalette.success}40`,
                }}
              >
                Success: Form submitted successfully!
              </div>
              <div
                className="p-2 rounded text-sm"
                style={{
                  backgroundColor: `${colorPalette.error}20`,
                  color: colorPalette.error,
                  border: `1px solid ${colorPalette.error}40`,
                }}
              >
                Error: Please check your input.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
