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

// Enhanced color harmony generators with light AND dark themes
const generateColorHarmonies = (primaryHex: string) => {
  const [h, s, l] = hexToHsl(primaryHex);

  const harmonies = [
    // LIGHT THEME VARIATIONS
    {
      name: "Vibrant Light",
      type: "monochromatic-light",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex(h, Math.max(s - 40, 15), Math.min(l + 25, 85)),
        background: hslToHex(h, Math.max(s - 70, 3), 97),
        text: hslToHex(h, Math.min(s + 10, 60), 15),
        accent: hslToHex(h, Math.min(s + 30, 90), Math.max(l - 35, 25)),
        border: hslToHex(h, Math.max(s - 50, 8), 88),
      },
    },
    {
      name: "Warm Analogous Light",
      type: "analogous-light",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 45) % 360,
          Math.max(s - 15, 40),
          Math.min(l + 10, 80)
        ),
        background: "#FFFBF7",
        text: "#2D1B0E",
        accent: hslToHex(
          (h - 20 + 360) % 360,
          Math.min(s + 25, 85),
          Math.max(l - 15, 35)
        ),
        border: hslToHex((h + 30) % 360, Math.max(s - 60, 5), 92),
      },
    },
    {
      name: "Bold Complementary Light",
      type: "complementary-light",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 180) % 360,
          Math.max(s - 10, 45),
          Math.min(l + 20, 75)
        ),
        background: "#FFFFFF",
        text: "#1A1A1A",
        accent: hslToHex(
          (h + 180) % 360,
          Math.min(s + 20, 90),
          Math.max(l - 20, 30)
        ),
        border: hslToHex(h, Math.max(s - 55, 5), 90),
      },
    },
    {
      name: "Dynamic Triadic Light",
      type: "triadic-light",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex(
          (h + 120) % 360,
          Math.max(s - 10, 45),
          Math.min(l + 15, 80)
        ),
        background: "#FEFEFE",
        text: "#212121",
        accent: hslToHex(
          (h + 240) % 360,
          Math.min(s + 15, 85),
          Math.max(l - 10, 35)
        ),
        border: hslToHex((h + 60) % 360, Math.max(s - 50, 10), 90),
      },
    },

    // DARK THEME VARIATIONS
    {
      name: "Dark Monochromatic",
      type: "monochromatic-dark",
      isDark: true,
      colors: {
        primary: hslToHex(h, Math.min(s + 20, 90), Math.max(l + 30, 60)), // Brighter primary for dark bg
        secondary: hslToHex(h, Math.max(s - 10, 30), Math.min(l + 40, 70)),
        background: hslToHex(h, Math.max(s - 50, 8), 8), // Very dark background
        text: hslToHex(h, Math.max(s - 40, 10), 92), // Light text
        accent: hslToHex(h, Math.min(s + 40, 95), Math.max(l + 35, 65)),
        border: hslToHex(h, Math.max(s - 30, 15), 25),
      },
    },
    {
      name: "Dark Analogous Warm",
      type: "analogous-dark",
      isDark: true,
      colors: {
        primary: hslToHex(
          (h + 30) % 360,
          Math.min(s + 25, 85),
          Math.max(l + 25, 65)
        ),
        secondary: hslToHex(
          (h + 60) % 360,
          Math.max(s - 5, 40),
          Math.min(l + 30, 70)
        ),
        background: "#1A1611", // Dark warm background
        text: "#F5F3F0", // Warm light text
        accent: hslToHex(
          (h - 15 + 360) % 360,
          Math.min(s + 35, 90),
          Math.max(l + 40, 70)
        ),
        border: hslToHex((h + 45) % 360, Math.max(s - 20, 20), 30),
      },
    },
    {
      name: "Dark Complementary",
      type: "complementary-dark",
      isDark: true,
      colors: {
        primary: hslToHex(h, Math.min(s + 30, 90), Math.max(l + 35, 65)),
        secondary: hslToHex(
          (h + 180) % 360,
          Math.min(s + 20, 80),
          Math.max(l + 25, 60)
        ),
        background: "#0F0F0F", // Pure dark
        text: "#F0F0F0", // Pure light text
        accent: hslToHex(
          (h + 180) % 360,
          Math.min(s + 40, 95),
          Math.max(l + 45, 75)
        ),
        border: hslToHex(h, Math.max(s - 10, 25), 35),
      },
    },
    {
      name: "Dark Triadic",
      type: "triadic-dark",
      isDark: true,
      colors: {
        primary: hslToHex(h, Math.min(s + 25, 90), Math.max(l + 30, 65)),
        secondary: hslToHex(
          (h + 120) % 360,
          Math.min(s + 15, 80),
          Math.max(l + 20, 60)
        ),
        background: hslToHex((h + 240) % 360, Math.max(s - 40, 10), 10), // Tinted dark background
        text: "#EEEEEE",
        accent: hslToHex(
          (h + 240) % 360,
          Math.min(s + 30, 85),
          Math.max(l + 35, 70)
        ),
        border: hslToHex((h + 180) % 360, Math.max(s - 20, 20), 28),
      },
    },
    {
      name: "Dark Split Complement",
      type: "split-complementary-dark",
      isDark: true,
      colors: {
        primary: hslToHex(h, Math.min(s + 20, 85), Math.max(l + 25, 60)),
        secondary: hslToHex(
          (h + 150) % 360,
          Math.min(s + 10, 75),
          Math.max(l + 15, 55)
        ),
        background: hslToHex((h + 210) % 360, Math.max(s - 45, 8), 12), // Subtle tinted dark
        text: "#F2F2F2",
        accent: hslToHex(
          (h + 210) % 360,
          Math.min(s + 25, 80),
          Math.max(l + 30, 65)
        ),
        border: hslToHex((h + 180) % 360, Math.max(s - 25, 18), 32),
      },
    },
    {
      name: "Midnight Professional",
      type: "professional-dark",
      isDark: true,
      colors: {
        primary: hslToHex(h, Math.min(s + 15, 75), Math.max(l + 20, 55)),
        secondary: hslToHex(h, Math.max(s - 20, 25), Math.min(l + 35, 65)),
        background: "#111827", // Professional dark blue-gray
        text: "#F9FAFB",
        accent: hslToHex(h, Math.min(s + 30, 85), Math.max(l + 25, 60)),
        border: "#374151", // Matching gray border
      },
    },
  ];

  // Enhanced filtering for both light and dark themes
  return harmonies
    .filter((harmony) => {
      const bgContrast = getContrastRatio(
        harmony.colors.text,
        harmony.colors.background
      );
      const primaryContrast = getContrastRatio(
        harmony.isDark ? harmony.colors.text : "#ffffff",
        harmony.colors.primary
      );
      const accentContrast = getContrastRatio(
        harmony.isDark ? harmony.colors.text : "#ffffff",
        harmony.colors.accent
      );

      return (
        bgContrast >= 4.5 && primaryContrast >= 3.0 && accentContrast >= 3.0
      );
    })
    .slice(0, 10); // Return more variety including both light and dark
};

interface CustomColor {
  name: string;
  key: keyof typeof defaultColorValues;
  default: string;
}

const defaultColorValues = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  background: "#ffffff",
  text: "#1F2937",
  accent: "#10b981",
  border: "#e5e7eb",
} as const;

const customColors: CustomColor[] = [
  { name: "Primary", key: "primary", default: "#3B82F6" },
  { name: "Secondary", key: "secondary", default: "#6B7280" },
  { name: "Background", key: "background", default: "#ffffff" },
  { name: "Text", key: "text", default: "#1F2937" },
  { name: "Accent", key: "accent", default: "#10b981" },
  { name: "Border", key: "border", default: "#e5e7eb" },
];

// Tooltip component for color circles
const ColorTooltip: React.FC<{
  color: string;
  label: string;
  usage: string;
  children: React.ReactNode;
}> = ({ color, label, usage, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
            <div className="font-medium">{label}</div>
            <div className="text-gray-300">{color}</div>
            <div className="text-gray-400 text-xs mt-1">{usage}</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ColorsTab: React.FC = () => {
  const { updateColors, state } = useBuilder();
  const currentColors = state.form?.customization?.colors || {};
  const [harmonySuggestions, setHarmonySuggestions] = useState<any[]>([]);

  // Helper function to get color value with proper typing
  const getColorValue = (colorKey: keyof typeof defaultColorValues): string => {
    return (currentColors as any)[colorKey] || defaultColorValues[colorKey];
  };

  const currentPrimary = getColorValue("primary");

  // Generate harmony suggestions when primary color changes
  useEffect(() => {
    if (currentPrimary && currentPrimary !== "#3B82F6") {
      const suggestions = generateColorHarmonies(currentPrimary);
      setHarmonySuggestions(suggestions);
    } else {
      setHarmonySuggestions([]);
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
    console.log("🎨 Harmony colors:", harmony.colors);

    try {
      // Map harmony colors to our customization structure
      const mappedColors = {
        primary: harmony.colors.primary,
        secondary: harmony.colors.secondary,
        background: harmony.colors.background,
        text: harmony.colors.text,
        accent: harmony.colors.accent,
        border: harmony.colors.border,
      };

      console.log("🎨 Mapped colors for updateColors:", mappedColors);

      // Use updateColors which properly integrates with the form builder state
      updateColors(mappedColors);

      console.log("✅ Harmony applied successfully");
    } catch (error) {
      console.error("❌ Failed to apply harmony:", error);
    }
  };

  // Color usage descriptions for tooltips
  const getColorUsage = (colorKey: string): string => {
    const usageMap: Record<string, string> = {
      primary: "Primary buttons, links, main brand color",
      secondary: "Secondary buttons, subtle accents",
      background: "Form background, page background",
      text: "Main text color, headings",
      accent: "Highlights, success states, call-to-action",
      border: "Input borders, dividers, separators",
    };
    return usageMap[colorKey] || "Color usage";
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
            <div>
              <h4 className="font-medium">Smart Color Harmonies</h4>
              <p className="text-xs text-muted-foreground">
                AI-generated color combinations • WCAG AA compliant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {harmonySuggestions.map((harmony, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-blue-200"
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
                            <ColorTooltip
                              key={key}
                              color={color as string}
                              label={key.charAt(0).toUpperCase() + key.slice(1)}
                              usage={getColorUsage(key)}
                            >
                              <div
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color as string }}
                              />
                            </ColorTooltip>
                          ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {harmony.type.charAt(0).toUpperCase() +
                        harmony.type.slice(1).replace("-", " ")}{" "}
                      •
                      <span
                        className={`ml-1 ${
                          harmony.isDark ? "text-purple-600" : "text-green-600"
                        }`}
                      >
                        {harmony.isDark ? "🌙 Dark" : "☀️ Light"} • ✓ Accessible
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Debug Info</h4>
          <div className="text-xs space-y-1">
            <div>Current Primary: {currentPrimary}</div>
            <div>Current Colors: {JSON.stringify(currentColors, null, 2)}</div>
            <div>Harmony Suggestions: {harmonySuggestions.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
