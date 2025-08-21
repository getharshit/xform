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
import { Badge } from "@/components/ui/badge";
import { Palette, Zap, Sparkles } from "lucide-react";

interface BackgroundSectionProps {
  currentColors: Record<string, any>;
  onColorChange: (colorKey: string, value: any) => void;
}

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

const animatedBackgroundTypes = [
  {
    type: "aurora",
    name: "Aurora",
    description: "Flowing aurora-like animations",
    icon: "🌌",
    defaultConfig: {
      colorStops: ["#5227FF", "#7cff67", "#5227FF"],
      amplitude: 1.0,
      blend: 0.5,
      speed: 1.0,
    },
  },
  {
    type: "darkVeil",
    name: "Dark Veil",
    description: "Mysterious flowing patterns",
    icon: "🌊",
    defaultConfig: {
      hueShift: 0,
      noiseIntensity: 0.1,
      scanlineIntensity: 0.05,
      speed: 0.5,
      scanlineFrequency: 2,
      warpAmount: 0.1,
    },
  },
  {
    type: "lightRays",
    name: "Light Rays",
    description: "Radiant light beams",
    icon: "☀️",
    defaultConfig: {
      raysOrigin: "top-center",
      raysColor: "#ffffff",
      raysSpeed: 1,
      lightSpread: 1,
      rayLength: 2,
      pulsating: false,
      fadeDistance: 1.0,
      saturation: 1.0,
      followMouse: true,
      mouseInfluence: 0.1,
      noiseAmount: 0.0,
      distortion: 0.0,
    },
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
  const animatedConfig = currentColors.animatedConfig;

  const handleBackgroundTypeChange = (type: string) => {
    onColorChange("backgroundType", type);

    // Set default animated config when switching to animated
    if (type === "animated" && !animatedConfig) {
      const defaultAnimated = animatedBackgroundTypes[0]; // Default to Aurora
      onColorChange("animatedConfig", {
        type: defaultAnimated.type,
        [defaultAnimated.type]: defaultAnimated.defaultConfig,
      });
    }
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

  const handleAnimatedTypeChange = (animatedType: string) => {
    const selectedAnimated = animatedBackgroundTypes.find(
      (a) => a.type === animatedType
    );

    if (selectedAnimated) {
      onColorChange("animatedConfig", {
        type: selectedAnimated.type,
        [selectedAnimated.type]: selectedAnimated.defaultConfig,
      });
    }
  };

  const updateAnimatedProperty = (
    animatedType: string,
    property: string,
    value: any
  ) => {
    const currentConfig = animatedConfig || {};
    const currentTypeConfig = currentConfig[animatedType] || {};

    onColorChange("animatedConfig", {
      ...currentConfig,
      [animatedType]: {
        ...currentTypeConfig,
        [property]: value,
      },
    });
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
          {["solid", "gradient", "animated"].map((type) => (
            <Button
              key={type}
              variant={backgroundType === type ? "default" : "outline"}
              size="sm"
              onClick={() => handleBackgroundTypeChange(type)}
              className="capitalize relative"
            >
              {type === "animated" && <Sparkles className="w-3 h-3 mr-1" />}
              {type}
              {type === "animated" && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 text-xs px-1 h-4"
                >
                  New
                </Badge>
              )}
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

      {/* Animated Background */}
      {backgroundType === "animated" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-blue-500" />
            <Label className="text-sm font-medium">
              Animated Background Type
            </Label>
          </div>

          {/* Animated Background Type Selector */}
          <div className="grid grid-cols-1 gap-2">
            {animatedBackgroundTypes.map((animated) => (
              <Card
                key={animated.type}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  animatedConfig?.type === animated.type
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleAnimatedTypeChange(animated.type)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{animated.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h6 className="font-medium text-sm">{animated.name}</h6>
                        {animatedConfig?.type === animated.type && (
                          <Badge variant="default" className="text-xs h-4 px-1">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {animated.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Basic Controls for Selected Animation */}
          {animatedConfig && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium mb-2 block">
                {
                  animatedBackgroundTypes.find(
                    (a) => a.type === animatedConfig.type
                  )?.name
                }{" "}
                Settings
              </Label>

              {/* Aurora Controls */}
              {animatedConfig.type === "aurora" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Animation Speed
                      </Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={animatedConfig.aurora?.speed || 1}
                        onChange={(e) =>
                          updateAnimatedProperty(
                            "aurora",
                            "speed",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {animatedConfig.aurora?.speed || 1}x
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Intensity
                      </Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={animatedConfig.aurora?.amplitude || 1}
                        onChange={(e) =>
                          updateAnimatedProperty(
                            "aurora",
                            "amplitude",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {animatedConfig.aurora?.amplitude || 1}x
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DarkVeil Controls */}
              {animatedConfig.type === "darkVeil" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Animation Speed
                      </Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={animatedConfig.darkVeil?.speed || 0.5}
                        onChange={(e) =>
                          updateAnimatedProperty(
                            "darkVeil",
                            "speed",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {animatedConfig.darkVeil?.speed || 0.5}x
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Hue Shift
                      </Label>
                      <Input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={animatedConfig.darkVeil?.hueShift || 0}
                        onChange={(e) =>
                          updateAnimatedProperty(
                            "darkVeil",
                            "hueShift",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {animatedConfig.darkVeil?.hueShift || 0}°
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LightRays Controls */}
              {animatedConfig.type === "lightRays" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Ray Color
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={
                            animatedConfig.lightRays?.raysColor || "#ffffff"
                          }
                          onChange={(e) =>
                            updateAnimatedProperty(
                              "lightRays",
                              "raysColor",
                              e.target.value
                            )
                          }
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={
                            animatedConfig.lightRays?.raysColor || "#ffffff"
                          }
                          onChange={(e) =>
                            updateAnimatedProperty(
                              "lightRays",
                              "raysColor",
                              e.target.value
                            )
                          }
                          className="flex-1 h-8 font-mono text-xs"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Animation Speed
                      </Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={animatedConfig.lightRays?.raysSpeed || 1}
                        onChange={(e) =>
                          updateAnimatedProperty(
                            "lightRays",
                            "raysSpeed",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {animatedConfig.lightRays?.raysSpeed || 1}x
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
