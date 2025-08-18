// src/components/form-builder/steps/design/tabs/colors/CustomColorsSection.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomColor {
  name: string;
  key: string;
  default: string;
}

const customColors: CustomColor[] = [
  { name: "Primary", key: "primary", default: "#3B82F6" },
  { name: "Secondary", key: "secondary", default: "#6B7280" },
  { name: "Text", key: "text", default: "#1F2937" },
  { name: "Accent", key: "accent", default: "#10b981" },
  { name: "Border", key: "border", default: "#e5e7eb" },
];

interface CustomColorsSectionProps {
  currentColors: Record<string, any>;
  defaultColors: Record<string, string>;
  onColorChange: (colorKey: string, value: string) => void;
  getColorValue: (colorKey: string) => string;
}

export const CustomColorsSection: React.FC<CustomColorsSectionProps> = ({
  currentColors,
  defaultColors,
  onColorChange,
  getColorValue,
}) => {
  // Validate hex color input
  const isValidHex = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleHexInputChange = (colorKey: string, value: string) => {
    if (value.startsWith("#") && value.length <= 7) {
      if (value.length === 7 && isValidHex(value)) {
        onColorChange(colorKey, value);
      } else if (value.length < 7) {
        onColorChange(colorKey, value);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h5 className="font-medium mb-2">Custom Colors</h5>
        <p className="text-xs text-muted-foreground mb-4">
          Define your brand colors
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {customColors.map((color) => {
          const colorValue = getColorValue(color.key);

          return (
            <div key={color.key} className="space-y-2">
              <Label className="text-sm font-medium">{color.name}</Label>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => onColorChange(color.key, e.target.value)}
                  className="w-10 h-10 rounded border cursor-pointer"
                  style={{
                    padding: 0,
                    border: "2px solid #e5e7eb",
                  }}
                />

                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) =>
                    handleHexInputChange(color.key, e.target.value)
                  }
                  placeholder="#000000"
                  className="flex-1 h-10 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
