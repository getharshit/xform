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
import { useBuilder } from "@/components/form-builder/providers/BuilderProvider";
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
  // Get both animation provider (for preview) and builder (for form data)
  const {
    config,
    updateConfig,
    updateIntensity,
    isReducedMotion,
    getIntensitySettings,
  } = useAnimation();

  const { state, updateCustomization } = useBuilder();

  const currentIntensitySettings = getIntensitySettings();

  // Get current animation settings from form customization
  const formAnimations = state.form?.customization?.animations || {};

  // Helper function to update animations via customization
  const updateAnimations = (animationUpdates: Record<string, any>) => {
    const currentAnimations = state.form?.customization?.animations || {};
    const updatedAnimations = { ...currentAnimations, ...animationUpdates };
    updateCustomization({ animations: updatedAnimations });
  };

  // Animation change handlers - SAVE TO FORM CUSTOMIZATION
  const handleIntensityChange = (intensity: AnimationIntensity) => {
    console.log("⚡ Updating animation intensity to:", intensity);

    // Update both preview (AnimationProvider) and form data (BuilderProvider)
    updateIntensity(intensity);
    updateAnimations({ intensity });
  };

  const handleEnabledToggle = (enabled: boolean) => {
    console.log("⚡ Toggling animations:", enabled);

    // Update both preview and form data
    updateConfig({ enabled });
    updateAnimations({ enabled });
  };

  const handleReducedMotionToggle = (respectReducedMotion: boolean) => {
    console.log("⚡ Toggling reduced motion respect:", respectReducedMotion);

    // Update both preview and form data
    updateConfig({ respectReducedMotion });
    updateAnimations({ respectReducedMotion });
  };

  const handleButtonHoverScaleChange = (scale: number[]) => {
    const newScale = scale[0] / 100;
    console.log("⚡ Updating button hover scale:", newScale);

    // Update both preview and form data
    updateConfig({
      button: {
        ...config.button,
        hover: {
          ...config.button.hover,
          scale: newScale,
        },
      },
    });
    updateAnimations({ buttonHoverScale: newScale });
  };

  const handleButtonTapScaleChange = (scale: number[]) => {
    const newScale = scale[0] / 100;
    console.log("⚡ Updating button tap scale:", newScale);

    // Update both preview and form data
    updateConfig({
      button: {
        ...config.button,
        tap: {
          ...config.button.tap,
          scale: newScale,
        },
      },
    });
    updateAnimations({ buttonTapScale: newScale });
  };

  const handleTransitionDurationChange = (duration: number[]) => {
    const newDuration = duration[0]; // Keep in ms for form data
    console.log("⚡ Updating transition duration:", newDuration);

    // Update preview (convert to seconds)
    const updatedSettings = {
      ...config.intensitySettings,
      [config.intensity]: {
        ...currentIntensitySettings,
        duration: newDuration / 1000, // Convert to seconds for AnimationProvider
      },
    };
    updateConfig({ intensitySettings: updatedSettings });

    // Update form data (keep in ms)
    updateAnimations({ duration: newDuration });
  };

  const resetAnimations = () => {
    console.log("🔄 Resetting animations to defaults");

    const defaults = {
      enabled: true,
      respectReducedMotion: true,
      intensity: "subtle" as AnimationIntensity,
    };

    // Update both preview and form data
    updateConfig(defaults);
    updateAnimations(defaults);
  };

  // Get current preset

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Animations</h3>
            <p className="text-sm text-muted-foreground">
              Configure form animations and micro-interactions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnimations}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {isReducedMotion && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                Reduced motion detected
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Animations are disabled due to your system preferences
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
