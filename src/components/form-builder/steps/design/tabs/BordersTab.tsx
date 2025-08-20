// src/components/form-builder/steps/design/tabs/BordersTab.tsx

"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Square, SquareRoundCorner, Circle } from "lucide-react";
import { useBuilder } from "../../../providers/BuilderProvider";
import { applyCustomizationToDOM } from "@/components/public-form/themes/cssProperties";

// Border radius presets
const borderRadiusPresets = {
  none: {
    name: "None",
    description: "Sharp, angular corners",
    radius: 0,
    icon: Square,
  },
  small: {
    name: "Small",
    description: "Slightly rounded corners",
    radius: 4,
    icon: Square,
  },
  medium: {
    name: "Medium",
    description: "Moderately rounded corners",
    radius: 8,
    icon: SquareRoundCorner,
  },
  large: {
    name: "Large",
    description: "Very rounded corners",
    radius: 16,
    icon: SquareRoundCorner,
  },
  full: {
    name: "Full",
    description: "Pill-shaped elements",
    radius: 32,
    icon: Circle,
  },
};

// Border width options
const borderWidthOptions = [
  { value: 0, label: "None" },
  { value: 1, label: "Thin" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Thick" },
  { value: 4, label: "Extra Thick" },
];

// Border style options
const borderStyleOptions = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

// Default border values
const defaultBorderValues = {
  radius: 8,
  width: 1,
  style: "solid",
  color: "#e5e7eb",
};

// Type for borders object to fix TypeScript errors
interface BordersConfig {
  radius?: number;
  width?: number;
  style?: string;
  color?: string;
  [key: string]: any; // Add index signature for dynamic access
}

export const BordersTab: React.FC = () => {
  const { updateBorders, state } = useBuilder();

  // Get current borders from form state with proper typing
  const currentBorders: BordersConfig =
    state.form?.customization?.borders || {};

  // Helper function to get current values with fallbacks (Fixed TypeScript errors)
  const getCurrentValue = (
    key: keyof typeof defaultBorderValues,
    fallback: any
  ): any => {
    // Use type-safe property access
    if (key in currentBorders && currentBorders[key] !== undefined) {
      return currentBorders[key];
    }
    return fallback;
  };

  const currentRadius = getCurrentValue("radius", defaultBorderValues.radius);
  const currentWidth = getCurrentValue("width", defaultBorderValues.width);
  const currentStyle = getCurrentValue("style", defaultBorderValues.style);
  const currentColor = getCurrentValue("color", defaultBorderValues.color);

  // Border change handler with immediate CSS application
  const handleBorderChange = (updates: Record<string, any>) => {
    console.log("🔲 Border change:", updates);

    // Merge with existing borders to preserve other properties
    const updatedBorders = {
      ...currentBorders,
      ...updates,
    };

    // Update form state
    updateBorders(updatedBorders);

    // Apply CSS changes immediately for instant preview
    const fullCustomization = {
      ...state.form?.customization,
      borders: updatedBorders,
    };

    console.log("🚀 Applying border changes to preview:", fullCustomization);
    applyCustomizationToDOM(fullCustomization);
  };

  const handleRadiusPresetChange = (presetKey: string) => {
    const preset =
      borderRadiusPresets[presetKey as keyof typeof borderRadiusPresets];
    if (preset) {
      console.log("🎯 Applying radius preset:", presetKey, preset);
      handleBorderChange({ radius: preset.radius });
    }
  };

  const handleRadiusChange = (radius: number[]) => {
    handleBorderChange({ radius: radius[0] });
  };

  const handleWidthChange = (width: number[]) => {
    handleBorderChange({ width: width[0] });
  };

  const handleStyleChange = (style: string) => {
    handleBorderChange({ style });
  };

  const handleColorChange = (color: string) => {
    handleBorderChange({ color });
  };

  const resetBorders = () => {
    console.log("🔄 Resetting borders to defaults");
    handleBorderChange(defaultBorderValues);
  };

  // Find current preset based on radius value
  const currentPreset =
    Object.entries(borderRadiusPresets).find(
      ([key, preset]) => preset.radius === currentRadius
    )?.[0] || "custom";

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Borders</h4>
            <p className="text-xs text-muted-foreground">
              Customize border radius, width, and style
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetBorders}
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
          {/* Border Radius Presets */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SquareRoundCorner className="w-4 h-4 flex-shrink-0" />
              <div>
                <h5 className="font-medium">Border Radius</h5>
                <p className="text-xs text-muted-foreground">
                  Choose corner roundness style
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Object.entries(borderRadiusPresets).map(([key, preset]) => {
                const IconComponent = preset.icon;
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      currentPreset === key
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleRadiusPresetChange(key)}
                  >
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <div
                            className="w-8 h-8 bg-gray-300 border-2 border-gray-500"
                            style={{
                              borderRadius: `${Math.min(preset.radius, 16)}px`,
                              borderWidth: "2px",
                            }}
                          />
                        </div>
                        <div className="font-medium text-xs mb-1">
                          {preset.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {preset.radius}px
                        </div>
                        {currentPreset === key && (
                          <Badge variant="default" className="mt-1 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {/* Custom Radius Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Custom Radius</Label>
                <span className="text-xs text-muted-foreground">
                  {currentRadius}px
                </span>
              </div>
              <Slider
                value={[currentRadius]}
                onValueChange={handleRadiusChange}
                min={0}
                max={32}
                step={1}
                className="w-full"
              />
              <div className="flex justify-center p-4 bg-gray-50 rounded">
                <div
                  className="w-16 h-16 bg-blue-200 border-2 border-blue-500"
                  style={{
                    borderRadius: `${currentRadius}px`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Debug Information (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info</h4>
              <div className="text-xs space-y-1">
                <div>Current Radius: {currentRadius}px</div>
                <div>Current Width: {currentWidth}px</div>
                <div>Current Style: {currentStyle}</div>
                <div>Current Color: {currentColor}</div>
                <div>Current Preset: {currentPreset}</div>
                <div>
                  Border State: {JSON.stringify(currentBorders, null, 2)}
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
