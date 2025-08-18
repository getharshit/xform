// src/components/form-builder/steps/design/tabs/ColorsTab.tsx

"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useBuilder } from "../../../providers/BuilderProvider";

// Import sub-components
import { CustomColorsSection } from "./colors/CustomColorsSection";
import { ColorHarmonySection } from "./colors/ColorHarmonySection";
import { BackgroundSection } from "./colors/BackgroundSection";

// Import utility functions
import { generateColorHarmonies } from "./colors/colorHarmonyUtils";

// Default color values
const defaultColorValues = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  background: "#ffffff",
  text: "#1F2937",
  accent: "#10b981",
  border: "#e5e7eb",
};

export const ColorsTab: React.FC = () => {
  const { updateColors, state } = useBuilder();
  const currentColors = state.form?.customization?.colors || {};
  const [harmonySuggestions, setHarmonySuggestions] = useState<any[]>([]);

  // Helper function to get color value with proper typing
  const getColorValue = (colorKey: string): string => {
    return (
      (currentColors as any)[colorKey] ||
      (defaultColorValues as any)[colorKey] ||
      "#000000"
    );
  };

  const currentPrimary = getColorValue("primary");

  // Generate harmony suggestions when primary color changes
  useEffect(() => {
    if (currentPrimary) {
      try {
        const suggestions = generateColorHarmonies(currentPrimary);
        setHarmonySuggestions(suggestions);
        console.log(
          `🎨 Generated ${suggestions.length} color harmonies for ${currentPrimary}`
        );
      } catch (error) {
        console.error("Error generating harmonies:", error);
        setHarmonySuggestions([]);
      }
    }
  }, [currentPrimary]);

  const handleColorChange = (colorKey: string, value: string) => {
    console.log("🎨 Color change:", { colorKey, value });
    updateColors({ [colorKey]: value });
  };

  const resetColors = () => {
    console.log("🔄 Resetting colors to defaults");
    updateColors(defaultColorValues);
    setHarmonySuggestions([]);
  };

  const applyHarmony = (harmony: any) => {
    console.log("🎨 Applying harmony preset:", harmony.name);
    try {
      const mappedColors = {
        primary: harmony.colors.primary,
        secondary: harmony.colors.secondary,
        background: harmony.colors.background,
        text: harmony.colors.text,
        accent: harmony.colors.accent,
        border: harmony.colors.border,
      };

      updateColors(mappedColors);
      console.log("✅ Harmony applied successfully");
    } catch (error) {
      console.error("❌ Failed to apply harmony:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Colors</h4>
            <p className="text-xs text-muted-foreground">
              Customize your form's color scheme
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetColors}
            className="h-8 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Custom Colors Section */}
          <CustomColorsSection
            currentColors={currentColors}
            defaultColors={defaultColorValues}
            onColorChange={handleColorChange}
            getColorValue={getColorValue}
          />

          {/* Background Options Section */}
          <BackgroundSection
            currentColors={currentColors}
            onColorChange={handleColorChange}
          />

          {/* Color Harmony Section */}
          <ColorHarmonySection
            harmonySuggestions={harmonySuggestions}
            onApplyHarmony={applyHarmony}
          />

          {/* Debug Information (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info</h4>
              <div className="text-xs space-y-1">
                <div>Current Primary: {currentPrimary}</div>
                <div>Harmony Suggestions: {harmonySuggestions.length}</div>
                <div>
                  Light Variants:{" "}
                  {harmonySuggestions.filter((h) => !h.isDark).length}
                </div>
                <div>
                  Dark Variants:{" "}
                  {harmonySuggestions.filter((h) => h.isDark).length}
                </div>
                <div>
                  Background Type:{" "}
                  {(currentColors as any)?.backgroundType || "solid"}
                </div>
              </div>
            </div>
          )}

          {/* Extra padding at bottom */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
