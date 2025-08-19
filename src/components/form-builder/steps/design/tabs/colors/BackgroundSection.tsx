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

const gradientTypes = [{ value: "linear", label: "Linear" }];

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

  console.log("🔍 BackgroundSection Debug:", {
    backgroundType,
    backgroundColor,
    gradientColor1,
    gradientColor2,
    gradientDirection,
    currentColors,
  });

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
        <div className="grid grid-cols-3 gap-2">
          {["solid", "gradient"].map((type) => (
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
          {/* Gradient Colors */}
          <div className="grid grid-cols-3 gap-4">
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
        </div>
      )}
    </div>
  );
};
