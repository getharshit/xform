// src/components/form-builder/steps/design/tabs/colors/ColorHarmonySection.tsx

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Moon, Sun } from "lucide-react";
import { getColorUsage } from "./colorHarmonyUtils";

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

interface ColorHarmonySectionProps {
  harmonySuggestions: any[];
  onApplyHarmony: (harmony: any) => void;
}

export const ColorHarmonySection: React.FC<ColorHarmonySectionProps> = ({
  harmonySuggestions,
  onApplyHarmony,
}) => {
  // Separate light and dark harmonies
  const lightHarmonies = harmonySuggestions.filter((h) => !h.isDark);
  const darkHarmonies = harmonySuggestions.filter((h) => h.isDark);

  if (harmonySuggestions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 flex-shrink-0" />
          <div>
            <h5 className="font-medium">Smart Color Harmonies</h5>
            <p className="text-xs text-muted-foreground">
              Change the primary color to see AI-generated harmonies
            </p>
          </div>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            Select a primary color to generate harmonies
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h5 className="font-medium">Smart Color Harmonies</h5>
          <p className="text-xs text-muted-foreground">
            AI-generated color combinations with light & dark variants
          </p>
        </div>
      </div>

      {/* Light Theme Harmonies */}
      {lightHarmonies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-3 h-3" />
            <h6 className="text-sm font-medium">Light Theme Variants</h6>
            <Badge variant="outline" className="text-xs">
              {lightHarmonies.length} combinations
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {lightHarmonies.map((harmony, index) => (
              <Card
                key={`light-${index}`}
                className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-blue-200"
                onClick={() => onApplyHarmony(harmony)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-sm font-medium truncate flex-1 mr-2">
                        {harmony.name}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
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
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                style={{ backgroundColor: color as string }}
                              />
                            </ColorTooltip>
                          ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-xs text-muted-foreground truncate flex-1">
                        {harmony.type.charAt(0).toUpperCase() +
                          harmony.type.slice(1).replace("-", " ")}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs h-4 px-1 flex-shrink-0"
                      >
                        <span className="text-green-600">✓ WCAG AA</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dark Theme Harmonies */}
      {darkHarmonies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon className="w-3 h-3" />
            <h6 className="text-sm font-medium">Dark Theme Variants</h6>
            <Badge variant="outline" className="text-xs">
              {darkHarmonies.length} combinations
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {darkHarmonies.map((harmony, index) => (
              <Card
                key={`dark-${index}`}
                className="cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-blue-200 bg-gray-900 text-white border-gray-700"
                onClick={() => onApplyHarmony(harmony)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-sm font-medium text-white truncate flex-1 mr-2">
                        {harmony.name}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
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
                                className="w-4 h-4 rounded-full border-2 border-gray-600 shadow-sm flex-shrink-0"
                                style={{ backgroundColor: color as string }}
                              />
                            </ColorTooltip>
                          ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="text-xs text-gray-400 truncate flex-1">
                        {harmony.type.charAt(0).toUpperCase() +
                          harmony.type
                            .slice(1)
                            .replace("-dark", "")
                            .replace("-", " ")}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs h-4 px-1 bg-gray-700 text-gray-200 flex-shrink-0"
                      >
                        <span className="text-green-400">✓ Dark</span>
                      </Badge>
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
