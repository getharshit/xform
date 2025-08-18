// src/components/form-builder/steps/design/tabs/colors/BackgroundSection.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface BackgroundSectionProps {
  currentColors: Record<string, any>;
  onColorChange: (colorKey: string, value: string) => void;
}

const gradientTypes = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" },
];

const gradientDirections = [
  { value: "to-r", label: "Left to Right", angle: "90deg" },
  { value: "to-l", label: "Right to Left", angle: "270deg" },
  { value: "to-t", label: "Bottom to Top", angle: "0deg" },
  { value: "to-b", label: "Top to Bottom", angle: "180deg" },
  { value: "to-tr", label: "Bottom Left to Top Right", angle: "45deg" },
  { value: "to-tl", label: "Bottom Right to Top Left", angle: "135deg" },
  { value: "to-br", label: "Top Left to Bottom Right", angle: "225deg" },
  { value: "to-bl", label: "Top Right to Bottom Left", angle: "315deg" },
];

const patternTypes = [
  {
    value: "dots",
    label: "Dots",
    preview: "radial-gradient(circle, #000 1px, transparent 1px)",
  },
  {
    value: "grid",
    label: "Grid",
    preview:
      "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
  },
  {
    value: "diagonal",
    label: "Diagonal",
    preview:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)",
  },
  {
    value: "waves",
    label: "Waves",
    preview:
      "repeating-linear-gradient(90deg, transparent, transparent 20px, #000 20px, #000 40px)",
  },
  {
    value: "zigzag",
    label: "Zigzag",
    preview:
      "repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)",
  },
  {
    value: "hexagon",
    label: "Hexagon",
    preview: "radial-gradient(circle at 50% 50%, #000 30%, transparent 30%)",
  },
];

export const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  currentColors,
  onColorChange,
}) => {
  const backgroundType = currentColors.backgroundType || "solid";
  const backgroundColor = currentColors.background || "#ffffff";
  const gradientColor1 = currentColors.backgroundGradientColor1 || "#3B82F6";
  const gradientColor2 = currentColors.backgroundGradientColor2 || "#6B7280";
  const gradientDirection =
    currentColors.backgroundGradientDirection || "135deg";
  const patternType = currentColors.backgroundPattern || "dots";
  const patternColor =
    currentColors.backgroundPatternColor || "rgba(0, 0, 0, 0.05)";

  const handleBackgroundTypeChange = (type: string) => {
    onColorChange("backgroundType", type);
  };

  const handleGradientDirectionChange = (direction: string) => {
    const selectedDirection = gradientDirections.find(
      (d) => d.value === direction
    );
    onColorChange(
      "backgroundGradientDirection",
      selectedDirection?.angle || "135deg"
    );
  };

  const generateGradientPreview = () => {
    if (backgroundType === "gradient") {
      return `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
    }
    return backgroundColor;
  };

  const generatePatternPreview = () => {
    const pattern = patternTypes.find((p) => p.value === patternType);
    if (pattern) {
      return pattern.preview.replace(/#000/g, patternColor);
    }
    return "none";
  };

  return (
    <div className="space-y-4">
      <div>
        <h5 className="font-medium mb-2">Background</h5>
        <p className="text-xs text-muted-foreground mb-4">
          Customize your form's background appearance
        </p>
      </div>

      {/* Background Type Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Background Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {["solid", "gradient", "pattern"].map((type) => (
            <Button
              key={type}
              variant={backgroundType === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleBackgroundTypeChange(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Solid Background */}
      {backgroundType === "solid" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onColorChange("background", e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <Input
              type="text"
              value={backgroundColor}
              onChange={(e) => onColorChange("background", e.target.value)}
              className="flex-1 h-10 font-mono text-sm"
              maxLength={7}
            />
          </div>
        </div>
      )}

      {/* Gradient Background */}
      {backgroundType === "gradient" && (
        <div className="space-y-4">
          {/* Gradient Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div
              className="w-full h-20 rounded-lg border"
              style={{ background: generateGradientPreview() }}
            />
          </div>

          {/* Gradient Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Color 1</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradientColor1}
                  onChange={(e) =>
                    onColorChange("backgroundGradientColor1", e.target.value)
                  }
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  type="text"
                  value={gradientColor1}
                  onChange={(e) =>
                    onColorChange("backgroundGradientColor1", e.target.value)
                  }
                  className="flex-1 h-10 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Color 2</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradientColor2}
                  onChange={(e) =>
                    onColorChange("backgroundGradientColor2", e.target.value)
                  }
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <Input
                  type="text"
                  value={gradientColor2}
                  onChange={(e) =>
                    onColorChange("backgroundGradientColor2", e.target.value)
                  }
                  className="flex-1 h-10 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Gradient Direction */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Direction</Label>
            <Select onValueChange={handleGradientDirectionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select gradient direction" />
              </SelectTrigger>
              <SelectContent>
                {gradientDirections.map((direction) => (
                  <SelectItem key={direction.value} value={direction.value}>
                    {direction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Pattern Background */}
      {backgroundType === "pattern" && (
        <div className="space-y-4">
          {/* Pattern Background Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onColorChange("background", e.target.value)}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => onColorChange("background", e.target.value)}
                className="flex-1 h-10 font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>

          {/* Pattern Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Pattern Type</Label>
            <div className="grid grid-cols-5 gap-3">
              {patternTypes.map((pattern) => (
                <Card
                  key={pattern.value}
                  className={`cursor-pointer transition-all ${
                    patternType === pattern.value
                      ? "ring-2 ring-blue-500"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  onClick={() =>
                    onColorChange("backgroundPattern", pattern.value)
                  }
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded border bg-white"
                        style={{
                          background: pattern.preview.replace(
                            /#000/g,
                            patternColor
                          ),
                          backgroundSize: "12px 12px",
                        }}
                      />
                      <span className="text-xs font-medium text-center block">
                        {pattern.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pattern Color */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Pattern Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={patternColor.replace("rgba(", "#").replace(/,.*/, "")}
                onChange={(e) =>
                  onColorChange("backgroundPatternColor", e.target.value)
                }
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <Input
                type="text"
                value={patternColor}
                onChange={(e) =>
                  onColorChange("backgroundPatternColor", e.target.value)
                }
                placeholder="rgba(0, 0, 0, 0.05)"
                className="flex-1 h-10 font-mono text-sm"
              />
            </div>
          </div>

          {/* Pattern Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div
              className="w-full h-10 rounded-lg border"
              style={{
                backgroundColor: backgroundColor,
                backgroundImage: generatePatternPreview(),
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
