// src/components/public-form/themes/BrandCustomizationPanel.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import { ButtonCustomizer } from "./buttons/ButtonCustomizer";
import { ColorManager } from "./colors/ColorManager";
import { ButtonColorCSSGenerator } from "./css/buttonColorGenerator";
import { ButtonCustomization } from "./buttons/types";
import { ColorPalette } from "./colors/types";
import {
  Palette,
  MousePointer,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Check,
  Settings,
} from "lucide-react";

interface BrandCustomizationPanelProps {
  onCustomizationChange?: (customization: {
    buttons: ButtonCustomization;
    colors: ColorPalette;
  }) => void;
}

export const BrandCustomizationPanel: React.FC<
  BrandCustomizationPanelProps
> = ({ onCustomizationChange }) => {
  const { updateTheme, state } = useTheme();
  const [activeTab, setActiveTab] = useState<"colors" | "buttons" | "preview">(
    "colors"
  );
  const [isApplying, setIsApplying] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Current customization state
  const [buttonCustomization, setButtonCustomization] =
    useState<ButtonCustomization>({
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

  // Handle button customization changes
  const handleButtonChange = useCallback(
    (newButtonCustomization: ButtonCustomization) => {
      setButtonCustomization(newButtonCustomization);
      setHasChanges(true);
      onCustomizationChange?.({
        buttons: newButtonCustomization,
        colors: colorPalette,
      });
    },
    [colorPalette, onCustomizationChange]
  );

  // Handle color changes
  const handleColorChange = useCallback(
    (newColorPalette: ColorPalette) => {
      setColorPalette(newColorPalette);
      setHasChanges(true);
      onCustomizationChange?.({
        buttons: buttonCustomization,
        colors: newColorPalette,
      });
    },
    [buttonCustomization, onCustomizationChange]
  );

  // Apply changes to theme
  const applyChanges = useCallback(async () => {
    setIsApplying(true);

    try {
      // Generate and inject CSS
      ButtonColorCSSGenerator.injectCSS(buttonCustomization, colorPalette);

      // Update theme state
      updateTheme({
        colors: {
          ...state.currentTheme.colors,
          primary: colorPalette.primary,
          secondary: colorPalette.secondary,
          background: colorPalette.background,
          surface: colorPalette.surface,
          textPrimary: colorPalette.textPrimary,
          textSecondary: colorPalette.textSecondary,
          textInverse: colorPalette.textInverse,
          success: colorPalette.success,
          warning: colorPalette.warning,
          error: colorPalette.error,
          info: colorPalette.info,
        },
        buttonCustomization: buttonCustomization as any, // Extended theme property
      });

      setHasChanges(false);
    } catch (error) {
      console.error("Failed to apply customization:", error);
    } finally {
      setIsApplying(false);
    }
  }, [
    buttonCustomization,
    colorPalette,
    updateTheme,
    state.currentTheme.colors,
  ]);

  // Auto-apply changes with debouncing
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        applyChanges();
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [hasChanges, applyChanges]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultButtonCustomization: ButtonCustomization = {
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
    };

    const defaultColorPalette: ColorPalette = {
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
    };

    setButtonCustomization(defaultButtonCustomization);
    setColorPalette(defaultColorPalette);
    setHasChanges(true);
  }, []);

  // Export customization
  const exportCustomization = useCallback(() => {
    const exportData = {
      buttons: buttonCustomization,
      colors: colorPalette,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-brand-customization.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [buttonCustomization, colorPalette]);

  // Import customization
  const importCustomization = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);

          if (importData.buttons) {
            setButtonCustomization(importData.buttons);
          }

          if (importData.colors) {
            setColorPalette(importData.colors);
          }

          setHasChanges(true);
        } catch (error) {
          console.error("Failed to import customization:", error);
          alert("Failed to import file. Please check the file format.");
        }
      };

      reader.readAsText(file);
    },
    []
  );

  return (
    <div className="brand-customization-panel bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Brand Customization
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Customize colors and button styles for your forms
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {hasChanges && (
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                Auto-saving...
              </div>
            )}

            {!hasChanges && !isApplying && (
              <div className="flex items-center text-sm text-green-600">
                <Check className="w-4 h-4 mr-1" />
                Saved
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab("colors")}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "colors"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Colors
          </button>

          <button
            onClick={() => setActiveTab("buttons")}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "buttons"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <MousePointer className="w-4 h-4 inline mr-2" />
            Buttons
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "preview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "colors" && (
          <ColorManager onColorsChange={handleColorChange} />
        )}

        {activeTab === "buttons" && (
          <ButtonCustomizer onCustomizationChange={handleButtonChange} />
        )}

        {activeTab === "preview" && (
          <div className="space-y-6">
            {/* Live Form Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Form Preview
              </h3>
              <div
                className="p-8 rounded-lg border-2 border-dashed border-gray-300"
                style={{
                  backgroundColor: colorPalette.background,
                  color: colorPalette.textPrimary,
                }}
              >
                {/* Form Preview Content */}
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: colorPalette.textPrimary }}
                    >
                      Contact Information
                    </h2>
                    <p style={{ color: colorPalette.textSecondary }}>
                      Please fill out your details below
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="form-label block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="form-input w-full px-3 py-2 rounded-md"
                        style={{
                          backgroundColor: colorPalette.surface,
                          border: `1px solid ${colorPalette.tertiary}`,
                          color: colorPalette.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label className="form-label block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="form-input w-full px-3 py-2 rounded-md"
                        style={{
                          backgroundColor: colorPalette.surface,
                          border: `1px solid ${colorPalette.tertiary}`,
                          color: colorPalette.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label className="form-label block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        placeholder="Enter your message"
                        rows={3}
                        className="form-input w-full px-3 py-2 rounded-md"
                        style={{
                          backgroundColor: colorPalette.surface,
                          border: `1px solid ${colorPalette.tertiary}`,
                          color: colorPalette.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      className={`form-button form-button-${buttonCustomization.variant} form-button-${buttonCustomization.size}`}
                      style={ButtonColorCSSGenerator.generateButtonCSS(
                        buttonCustomization.variant,
                        buttonCustomization.size,
                        buttonCustomization
                      )}
                    >
                      Submit Form
                    </button>

                    <button
                      className="form-button form-button-outlined form-button-medium"
                      style={{
                        backgroundColor: "transparent",
                        color: colorPalette.primary,
                        border: `${buttonCustomization.borderWidth}px solid ${colorPalette.primary}`,
                        borderRadius: `${buttonCustomization.borderRadius}px`,
                        padding: `${
                          8 * buttonCustomization.paddingMultiplier
                        }px ${16 * buttonCustomization.paddingMultiplier}px`,
                        fontWeight: buttonCustomization.fontWeight,
                        transition: `all ${buttonCustomization.transitionDuration}ms ease-in-out`,
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* State Messages Preview */}
                  <div className="space-y-2">
                    <div
                      className="form-message form-message-success p-3 rounded-md text-sm"
                      style={{
                        backgroundColor: `${colorPalette.success}20`,
                        color: colorPalette.success,
                        border: `1px solid ${colorPalette.success}40`,
                      }}
                    >
                      ✓ Form submitted successfully!
                    </div>

                    <div
                      className="form-message form-message-error p-3 rounded-md text-sm"
                      style={{
                        backgroundColor: `${colorPalette.error}20`,
                        color: colorPalette.error,
                        border: `1px solid ${colorPalette.error}40`,
                      }}
                    >
                      ⚠ Please check your input and try again.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Accessibility Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-800">
                    Primary Button Contrast:
                  </span>
                  <span className="ml-2 font-mono">
                    {
                      ButtonColorCSSGenerator.validateColorAccessibility(
                        colorPalette.textInverse,
                        colorPalette.primary
                      ).contrastRatio
                    }
                    :1
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Text Contrast:</span>
                  <span className="ml-2 font-mono">
                    {
                      ButtonColorCSSGenerator.validateColorAccessibility(
                        colorPalette.textPrimary,
                        colorPalette.background
                      ).contrastRatio
                    }
                    :1
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Button Size:</span>
                  <span className="ml-2">
                    {buttonCustomization.minHeight}px (min 44px)
                  </span>
                </div>
                <div>
                  <span className="text-blue-800">Focus Ring:</span>
                  <span className="ml-2">
                    {buttonCustomization.focusRingWidth}px
                  </span>
                </div>
              </div>
            </div>

            {/* CSS Code Export */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Generated CSS</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  <code>
                    {ButtonColorCSSGenerator.generateCSS(
                      buttonCustomization,
                      colorPalette
                    )
                      .split("\n")
                      .slice(0, 20) // Show first 20 lines
                      .join("\n")}
                    {"\n\n/* ... and more ... */"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset to Defaults
          </button>

          <div className="h-4 w-px bg-gray-300" />

          <button
            onClick={exportCustomization}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Export Config
          </button>

          <label className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-1" />
            Import Config
            <input
              type="file"
              accept=".json"
              onChange={importCustomization}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={applyChanges}
            disabled={!hasChanges || isApplying}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              hasChanges && !isApplying
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isApplying ? "Applying..." : "Apply Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
