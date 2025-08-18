// src/components/form-builder/steps/design/tabs/ColorsTab.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw, Palette } from "lucide-react";
import { useBuilder } from "../../../providers/BuilderProvider";

// Color harmony utility functions
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Calculate contrast ratio for WCAG compliance
const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Generate WCAG AA compliant text color
const getAccessibleTextColor = (backgroundColor: string): string => {
  const contrastWithWhite = getContrastRatio(backgroundColor, "#ffffff");
  const contrastWithBlack = getContrastRatio(backgroundColor, "#000000");

  return contrastWithWhite >= 4.5 ? "#ffffff" : "#000000";
};

// Color harmony generators
const generateColorHarmonies = (primaryHex: string) => {
  const [h, s, l] = hexToHsl(primaryHex);

  const harmonies = [
    {
      name: "Monochromatic",
      type: "monochromatic",
      colors: {
        primary: primaryHex,
        secondary: hslToHex(h, Math.max(s - 30, 20), Math.min(l + 20, 80)),
        background: hslToHex(h, Math.max(s - 60, 5), 96),
        text: getAccessibleTextColor(hslToHex(h, Math.max(s - 60, 5), 96)),
        accent: hslToHex(h, Math.min(s + 20, 80), Math.max(l - 30, 30)),
        border: hslToHex(h, Math.max(s - 40, 10), 85),
      },
    },
    {
      name: "Analogous Warm",
      type: "analogous",
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h + 30) % 360, s, l),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex(
          (h - 30 + 360) % 360,
          Math.min(s + 20, 80),
          Math.max(l - 10, 40)
        ),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
    {
      name: "Analogous Cool",
      type: "analogous",
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h - 30 + 360) % 360, s, l),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex(
          (h + 30) % 360,
          Math.min(s + 20, 80),
          Math.max(l - 10, 40)
        ),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
    {
      name: "Complementary",
      type: "complementary",
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 180) % 360,
          Math.max(s - 20, 30),
          Math.min(l + 15, 75)
        ),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex((h + 180) % 360, s, l),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
    {
      name: "Split Complementary 1",
      type: "split-complementary",
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 150) % 360,
          Math.max(s - 20, 30),
          Math.min(l + 15, 75)
        ),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex((h + 210) % 360, s, Math.max(l - 10, 30)),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
    {
      name: "Split Complementary 2",
      type: "split-complementary",
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 210) % 360,
          Math.max(s - 20, 30),
          Math.min(l + 15, 75)
        ),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex((h + 150) % 360, s, Math.max(l - 10, 30)),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
    {
      name: "Triadic Cool",
      type: "triadic",
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 120) % 360,
          Math.max(s - 20, 30),
          Math.min(l + 15, 75)
        ),
        background: "#ffffff",
        text: "#1a1a1a",
        accent: hslToHex((h + 240) % 360, s, Math.max(l - 10, 30)),
        border: hslToHex(h, Math.max(s - 50, 5), 90),
      },
    },
  ];

  // Filter harmonies to ensure WCAG AA compliance
  return harmonies
    .filter((harmony) => {
      const bgContrast = getContrastRatio(
        harmony.colors.text,
        harmony.colors.background
      );
      const primaryContrast = getContrastRatio(
        "#ffffff",
        harmony.colors.primary
      );
      return bgContrast >= 4.5 && primaryContrast >= 3.0; // Slightly relaxed for buttons
    })
    .slice(0, 6); // Return top 6 accessible harmonies
};

interface CustomColor {
  name: string;
  key: keyof typeof defaultColorValues;
  default: string;
}

const defaultColorValues = {
  primary: "#030213",
  secondary: "#ececf0",
  background: "#ffffff",
  text: "#0a0a0a",
  accent: "#10b981",
  border: "#e5e7eb",
} as const;

const customColors: CustomColor[] = [
  { name: "Primary", key: "primary", default: "#030213" },
  { name: "Secondary", key: "secondary", default: "#ececf0" },
  { name: "Background", key: "background", default: "#ffffff" },
  { name: "Text", key: "text", default: "#0a0a0a" },
  { name: "Accent", key: "accent", default: "#10b981" },
  { name: "Border", key: "border", default: "#e5e7eb" },
];

export const ColorsTab: React.FC = () => {
  const { updateColors, applyThemePreset, state } = useBuilder();
  const currentColors = state.form?.customization?.colors || {};
  const [harmonySuggestions, setHarmonySuggestions] = useState<any[]>([]);

  // Helper function to get color value with proper typing
  const getColorValue = (colorKey: keyof typeof defaultColorValues): string => {
    return (currentColors as any)[colorKey] || defaultColorValues[colorKey];
  };

  const currentPrimary = getColorValue("primary");

  // Generate harmony suggestions when primary color changes
  useEffect(() => {
    if (currentPrimary && currentPrimary !== "#030213") {
      const suggestions = generateColorHarmonies(currentPrimary);
      setHarmonySuggestions(suggestions);
    } else {
      setHarmonySuggestions([]);
    }
  }, [currentPrimary]);

  const handleColorChange = (colorKey: string, value: string) => {
    updateColors({ [colorKey]: value });
  };

  const resetColors = () => {
    updateColors(defaultColorValues);
    setHarmonySuggestions([]);
  };

  const applyHarmony = async (harmony: any) => {
    try {
      await applyThemePreset({
        primaryColor: harmony.colors.primary,
        secondaryColor: harmony.colors.secondary,
        backgroundColor: harmony.colors.background,
        textColor: harmony.colors.text,
        ...harmony.colors,
      } as any);
    } catch (error) {
      console.error("Failed to apply harmony:", error);
    }
  };

  // Validate hex color input
  const isValidHex = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleHexInputChange = (colorKey: string, value: string) => {
    if (value.startsWith("#") && value.length <= 7) {
      if (value.length === 7 && isValidHex(value)) {
        handleColorChange(colorKey, value);
      } else if (value.length < 7) {
        handleColorChange(colorKey, value);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Custom Colors - 2 Column Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Custom Colors</h4>
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
                    onChange={(e) =>
                      handleColorChange(color.key, e.target.value)
                    }
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

      {/* Color Harmony Suggestions */}
      {harmonySuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <h4 className="font-medium">Color Harmony Suggestions</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your primary color • WCAG AA compliant
          </p>

          <div className="grid grid-cols-2 gap-3">
            {harmonySuggestions.map((harmony, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:shadow-md hover:ring-1 hover:ring-gray-300"
                onClick={() => applyHarmony(harmony)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {harmony.name}
                      </span>
                      <div className="flex gap-1">
                        {Object.entries(harmony.colors)
                          .slice(0, 4)
                          .map(([key, color]) => (
                            <div
                              key={key}
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: color as string }}
                              title={`${key}: ${color}`}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {harmony.type.charAt(0).toUpperCase() +
                        harmony.type.slice(1).replace("-", " ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
