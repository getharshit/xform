// src/components/form-builder/steps/design/tabs/AnimationsTab.tsx

"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Zap, Play } from "lucide-react";
import { useAnimation } from "@/components/public-form/animation/AnimationProvider";
import { AnimationIntensity } from "@/components/public-form/animation/types";

// Animation intensity options matching the provider system
const animationIntensityOptions: Array<{
  value: AnimationIntensity;
  name: string;
  description: string;
  multiplier: number;
}> = [
  {
    value: "none",
    name: "None",
    description: "No animations",
    multiplier: 0,
  },
  {
    value: "subtle",
    name: "Gentle",
    description: "Smooth, subtle animations",
    multiplier: 0.5,
  },
  {
    value: "playful",
    name: "Playful",
    description: "Bouncy, engaging animations",
    multiplier: 1.5,
  },
];

export const AnimationsTab: React.FC = () => {
  const {
    config,
    updateConfig,
    updateIntensity,
    isReducedMotion,
    getIntensitySettings,
  } = useAnimation();

  const currentIntensitySettings = getIntensitySettings();

  // Animation change handlers
  const handleIntensityChange = (intensity: AnimationIntensity) => {
    console.log("⚡ Updating animation intensity to:", intensity);
    updateIntensity(intensity);
  };

  const handleEnabledToggle = (enabled: boolean) => {
    console.log("⚡ Toggling animations:", enabled);
    updateConfig({ enabled });
  };

  const handleReducedMotionToggle = (respectReducedMotion: boolean) => {
    console.log("⚡ Toggling reduced motion respect:", respectReducedMotion);
    updateConfig({ respectReducedMotion });
  };

  const handleButtonHoverScaleChange = (scale: number[]) => {
    const newScale = scale[0] / 100;
    console.log("⚡ Updating button hover scale:", newScale);
    updateConfig({
      button: {
        ...config.button,
        hover: {
          ...config.button.hover,
          scale: newScale,
        },
      },
    });
  };

  const handleButtonTapScaleChange = (scale: number[]) => {
    const newScale = scale[0] / 100;
    console.log("⚡ Updating button tap scale:", newScale);
    updateConfig({
      button: {
        ...config.button,
        tap: {
          ...config.button.tap,
          scale: newScale,
        },
      },
    });
  };

  const handleTransitionDurationChange = (duration: number[]) => {
    const newDuration = duration[0] / 1000; // Convert ms to seconds
    console.log("⚡ Updating transition duration:", newDuration);

    // Update the intensity settings for current intensity
    const updatedSettings = {
      ...config.intensitySettings,
      [config.intensity]: {
        ...currentIntensitySettings,
        duration: newDuration,
      },
    };

    updateConfig({ intensitySettings: updatedSettings });
  };

  const resetAnimations = () => {
    console.log("🔄 Resetting animations to defaults");
    updateConfig({
      enabled: true,
      respectReducedMotion: true,
      intensity: "subtle",
    });
  };

  // Get current preset
  const currentPreset =
    animationIntensityOptions.find(
      (option) => option.value === config.intensity
    ) || animationIntensityOptions[1]; // Default to "subtle"

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Animations</h4>
            <p className="text-xs text-muted-foreground">
              Control motion and transitions
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAnimations}
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
          {/* Animation Style Presets */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 flex-shrink-0" />
              <div>
                <h5 className="font-medium">Animation Style</h5>
                <p className="text-xs text-muted-foreground">
                  Choose overall animation feel
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {animationIntensityOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    config.intensity === option.value
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleIntensityChange(option.value)}
                >
                  <CardContent className="p-3">
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">
                        {option.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {option.description}
                      </div>
                      {config.intensity === option.value && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Button Interactions */}
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Button Interactions</h5>
              <p className="text-xs text-muted-foreground mb-4">
                Button hover and click effects
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Hover Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hover Scale</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(config.button.hover.scale * 100)}%
                  </span>
                </div>
                <Slider
                  value={[Math.round(config.button.hover.scale * 100)]}
                  onValueChange={handleButtonHoverScaleChange}
                  min={100}
                  max={110}
                  step={1}
                  className="w-full"
                  disabled={!config.enabled || config.intensity === "none"}
                />
              </div>

              {/* Tap Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Tap Scale</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(config.button.tap.scale * 100)}%
                  </span>
                </div>
                <Slider
                  value={[Math.round(config.button.tap.scale * 100)]}
                  onValueChange={handleButtonTapScaleChange}
                  min={90}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={!config.enabled || config.intensity === "none"}
                />
              </div>
            </div>

            {/* Button Test Area */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-3">
                Test button animations:
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded transition-all"
                  style={{
                    transitionDuration: `${currentIntensitySettings.duration}s`,
                    transform: `scale(1)`,
                  }}
                  onMouseEnter={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.hover.scale})`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.tap.scale})`;
                    }
                  }}
                  onMouseUp={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.hover.scale})`;
                    }
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded transition-all hover:bg-gray-50"
                  style={{
                    transitionDuration: `${currentIntensitySettings.duration}s`,
                    transform: `scale(1)`,
                  }}
                  onMouseEnter={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.hover.scale})`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.tap.scale})`;
                    }
                  }}
                  onMouseUp={(e) => {
                    if (config.enabled && config.intensity !== "none") {
                      e.currentTarget.style.transform = `scale(${config.button.hover.scale})`;
                    }
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>

          {/* Accessibility - Moved to end */}
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Accessibility</h5>
              <p className="text-xs text-muted-foreground mb-4">
                Accessibility preferences
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Respect Reduced Motion
                </Label>
                <p className="text-xs text-muted-foreground">
                  Honor user's system preferences
                </p>
              </div>
              <Switch
                checked={config.respectReducedMotion}
                onCheckedChange={handleReducedMotionToggle}
              />
            </div>

            {isReducedMotion && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Reduced Motion Detected:</strong> Animations are
                  currently disabled based on your system preferences.
                </p>
              </div>
            )}
          </div>

          {/* Debug Information (Development only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Debug Info</h4>
              <div className="text-xs space-y-1">
                <div>Intensity: {config.intensity}</div>
                <div>Enabled: {config.enabled ? "Yes" : "No"}</div>
                <div>Reduced Motion: {isReducedMotion ? "Yes" : "No"}</div>
                <div>
                  Respect Reduced Motion:{" "}
                  {config.respectReducedMotion ? "Yes" : "No"}
                </div>
                <div>
                  Hover Scale: {Math.round(config.button.hover.scale * 100)}%
                </div>
                <div>
                  Tap Scale: {Math.round(config.button.tap.scale * 100)}%
                </div>
                <div>Full Config: {JSON.stringify(config, null, 2)}</div>
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
