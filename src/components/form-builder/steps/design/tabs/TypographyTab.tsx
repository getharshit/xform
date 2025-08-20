// src/components/form-builder/steps/design/tabs/TypographyTab.tsx

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
import { RotateCcw, Type, Palette, Zap } from "lucide-react";
import { useBuilder } from "../../../providers/BuilderProvider";
import { applyCustomizationToDOM } from "@/components/public-form/themes/cssProperties";

// Font configurations
const systemFonts = [
  {
    id: "system-ui",
    name: "System UI",
    family: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    category: "system",
  },
  {
    id: "georgia",
    name: "Georgia",
    family: "Georgia, Times New Roman, serif",
    category: "system",
  },
];

const googleFonts = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter, system-ui, sans-serif",
    category: "sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto, system-ui, sans-serif",
    category: "sans-serif",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    family: "Open Sans, system-ui, sans-serif",
    category: "sans-serif",
  },
  {
    id: "lato",
    name: "Lato",
    family: "Lato, system-ui, sans-serif",
    category: "sans-serif",
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    family: "Playfair Display, Georgia, serif",
    category: "serif",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    family: "Merriweather, Georgia, serif",
    category: "serif",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    family: "Fira Code, Monaco, monospace",
    category: "monospace",
  },
];

const allFonts = [...systemFonts, ...googleFonts];

// Typography scales - Fixed to work with form builder
const typographyScales = {
  small: {
    name: "Small Scale",
    description: "Compact, space-efficient typography",
    baseSize: 14,
    ratio: 1.2,
    sizes: {
      title: 24,
      question: 14,
      input: 14,
      button: 14,
      description: 12,
    },
  },
  medium: {
    name: "Medium Scale",
    description: "Balanced, versatile typography",
    baseSize: 16,
    ratio: 1.25,
    sizes: {
      title: 32,
      question: 16,
      input: 16,
      button: 16,
      description: 14,
    },
  },
  large: {
    name: "Large Scale",
    description: "Bold, accessible typography",
    baseSize: 18,
    ratio: 1.333,
    sizes: {
      title: 40,
      question: 18,
      input: 18,
      button: 18,
      description: 16,
    },
  },
};

// Font weight options
const fontWeights = [
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
  { value: 700, label: "Bold" },
];

// Default typography values - Fixed structure
const defaultTypographyValues = {
  fontFamily: "Inter, system-ui, sans-serif",
  scale: "medium",
  fontSize: {
    title: 32,
    question: 16,
    input: 16,
    button: 16,
    description: 14,
  },
  fontWeight: {
    title: 700,
    question: 500,
    input: 400,
    button: 500,
    description: 400,
  },
};

export const TypographyTab: React.FC = () => {
  const { updateTypography, state } = useBuilder();

  // Get current typography from form state with proper fallbacks
  const currentTypography = state.form?.customization?.typography || {};

  // Local state for font loading
  const [fontLoadingStates, setFontLoadingStates] = useState<
    Record<string, "loading" | "loaded" | "error">
  >({});

  // Helper function to get current values with fallbacks
  const getCurrentValue = (path: string, fallback: any): any => {
    const keys = path.split(".");
    let value: any = currentTypography;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return fallback;
    }

    return value || fallback;
  };

  const currentFontFamily = getCurrentValue(
    "fontFamily",
    defaultTypographyValues.fontFamily
  );

  const currentScale = getCurrentValue("scale", defaultTypographyValues.scale);

  const currentFontSizes = getCurrentValue(
    "fontSize",
    defaultTypographyValues.fontSize
  );

  const currentFontWeights = getCurrentValue(
    "fontWeight",
    defaultTypographyValues.fontWeight
  );

  // Font loading effect for Google Fonts
  useEffect(() => {
    const loadGoogleFont = async (fontFamily: string) => {
      const googleFont = googleFonts.find((font) => font.family === fontFamily);
      if (!googleFont) return;

      setFontLoadingStates((prev) => ({ ...prev, [fontFamily]: "loading" }));

      try {
        // Create a simple font loading mechanism
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          googleFont.name.replace(" ", "+")
        )}:wght@300;400;500;600;700&display=swap`;
        link.rel = "stylesheet";

        link.onload = () => {
          setFontLoadingStates((prev) => ({ ...prev, [fontFamily]: "loaded" }));
        };

        link.onerror = () => {
          setFontLoadingStates((prev) => ({ ...prev, [fontFamily]: "error" }));
        };

        // Check if already loaded
        const existingLink = document.querySelector(
          `link[href*="${googleFont.name.replace(" ", "+")}"]`
        );
        if (existingLink) {
          setFontLoadingStates((prev) => ({ ...prev, [fontFamily]: "loaded" }));
          return;
        }

        document.head.appendChild(link);
      } catch (error) {
        setFontLoadingStates((prev) => ({ ...prev, [fontFamily]: "error" }));
      }
    };

    if (
      currentFontFamily &&
      googleFonts.some((font) => font.family === currentFontFamily)
    ) {
      loadGoogleFont(currentFontFamily);
    }
  }, [currentFontFamily]);

  // Fixed typography change handler with immediate CSS application
  const handleTypographyChange = (updates: Record<string, any>) => {
    console.log("🔤 Typography change:", updates);

    // Merge with existing typography to preserve other properties
    const updatedTypography = {
      ...currentTypography,
      ...updates,
    };

    // Update form state
    updateTypography(updatedTypography);

    // Apply CSS changes immediately for instant preview
    const fullCustomization = {
      ...state.form?.customization,
      typography: updatedTypography,
    };

    console.log(
      "🚀 Applying typography changes to preview:",
      fullCustomization
    );
    applyCustomizationToDOM(fullCustomization);
  };

  const handleFontFamilyChange = (fontId: string) => {
    const selectedFont = allFonts.find((font) => font.id === fontId);
    if (selectedFont) {
      handleTypographyChange({
        fontFamily: selectedFont.family,
      });
    }
  };

  // Fixed scale change handler
  const handleScaleChange = (scale: string) => {
    const scaleConfig =
      typographyScales[scale as keyof typeof typographyScales];
    if (scaleConfig) {
      console.log("🎯 Applying scale:", scale, scaleConfig);

      handleTypographyChange({
        scale,
        fontSize: {
          ...currentFontSizes,
          ...scaleConfig.sizes,
        },
      });
    }
  };

  const handleFontSizeChange = (element: string, size: number[]) => {
    handleTypographyChange({
      fontSize: {
        ...currentFontSizes,
        [element]: size[0],
      },
    });
  };

  const handleFontWeightChange = (element: string, weight: string) => {
    handleTypographyChange({
      fontWeight: {
        ...currentFontWeights,
        [element]: parseInt(weight),
      },
    });
  };

  const resetTypography = () => {
    console.log("🔄 Resetting typography to defaults");
    handleTypographyChange(defaultTypographyValues);
    setFontLoadingStates({});
  };

  const selectedFont = allFonts.find(
    (font) => font.family === currentFontFamily
  );

  const selectedScale =
    typographyScales[currentScale as keyof typeof typographyScales];

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Typography</h4>
            <p className="text-xs text-muted-foreground">
              Customize fonts and text styling
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTypography}
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
          {/* Font Family Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 flex-shrink-0" />
              <div>
                <h5 className="font-medium">Font Family</h5>
                <p className="text-xs text-muted-foreground">
                  Choose your primary font family
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Select
                value={selectedFont?.id || "inter"}
                onValueChange={handleFontFamilyChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    System Fonts
                  </div>
                  {systemFonts.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <div className="flex items-center justify-between w-full">
                        <span style={{ fontFamily: font.family }}>
                          {font.name}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          Fast
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}

                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
                    Google Fonts
                  </div>
                  {googleFonts.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <div className="flex items-center justify-between w-full">
                        <span style={{ fontFamily: font.family }}>
                          {font.name}
                        </span>
                        <div className="flex items-center gap-1 ml-2">
                          {fontLoadingStates[font.family] === "loading" && (
                            <Badge variant="secondary" className="text-xs">
                              Loading
                            </Badge>
                          )}
                          {fontLoadingStates[font.family] === "loaded" && (
                            <Badge variant="default" className="text-xs">
                              Loaded
                            </Badge>
                          )}
                          {fontLoadingStates[font.family] === "error" && (
                            <Badge variant="destructive" className="text-xs">
                              Error
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFont && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div
                    className="text-lg"
                    style={{ fontFamily: selectedFont.family }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedFont.category} • Preview text
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 flex-shrink-0" />
              <div>
                <h5 className="font-medium">Typography Scale</h5>
                <p className="text-xs text-muted-foreground">
                  Choose your size scale system
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(typographyScales).map(([key, scale]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentScale === key
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleScaleChange(key)}
                >
                  <CardContent className="p-3">
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">
                        {scale.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {scale.description}
                      </div>
                      <div className="space-y-1">
                        <div
                          className="font-bold"
                          style={{
                            fontSize: `${Math.min(
                              scale.sizes.title * 0.4,
                              16
                            )}px`,
                            fontFamily: currentFontFamily,
                          }}
                        >
                          Title
                        </div>
                        <div
                          style={{
                            fontSize: `${Math.min(
                              scale.sizes.question * 0.7,
                              12
                            )}px`,
                            fontFamily: currentFontFamily,
                          }}
                        >
                          Question
                        </div>
                        <div
                          className="text-muted-foreground"
                          style={{
                            fontSize: `${Math.min(
                              scale.sizes.description * 0.7,
                              10
                            )}px`,
                            fontFamily: currentFontFamily,
                          }}
                        >
                          Description
                        </div>
                      </div>
                      {currentScale === key && (
                        <Badge variant="default" className="mt-2 text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Font Sizes */}
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Font Sizes</h5>
              <p className="text-xs text-muted-foreground mb-4">
                Adjust sizes for different text elements
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "question",
                    label: "Question Labels",
                    min: 14,
                    max: 24,
                  },
                  { key: "input", label: "Input Text", min: 14, max: 20 },
                  { key: "button", label: "Button Text", min: 14, max: 20 },
                  {
                    key: "description",
                    label: "Descriptions",
                    min: 12,
                    max: 18,
                  },
                ].map(({ key, label, min, max }) => {
                  const currentSize =
                    (currentFontSizes as any)[key] ||
                    (defaultTypographyValues.fontSize as any)[key];
                  return (
                    <div key={key} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">{label}</Label>
                        <span className="text-xs text-muted-foreground">
                          {currentSize}px
                        </span>
                      </div>
                      <Slider
                        value={[currentSize]}
                        onValueChange={(value) =>
                          handleFontSizeChange(key, value)
                        }
                        min={min}
                        max={max}
                        step={1}
                        className="w-full"
                      />
                      <div
                        className="p-2 bg-gray-50 rounded text-center"
                        style={{
                          fontSize: `${Math.min(currentSize * 0.8, 18)}px`,
                          fontFamily: currentFontFamily,
                        }}
                      >
                        {label} Preview
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Debug Information (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info</h4>
              <div className="text-xs space-y-1">
                <div>Current Font: {currentFontFamily}</div>
                <div>Current Scale: {currentScale}</div>
                <div>
                  Font Sizes: {JSON.stringify(currentFontSizes, null, 2)}
                </div>
                <div>
                  Font Weights: {JSON.stringify(currentFontWeights, null, 2)}
                </div>
                <div>
                  Typography State: {JSON.stringify(currentTypography, null, 2)}
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
