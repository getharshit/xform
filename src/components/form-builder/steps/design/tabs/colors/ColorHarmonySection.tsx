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
  // Mix light and dark harmonies and limit to 4
  const mixedHarmonies = [...harmonySuggestions]
    .sort((a, b) => {
      // Alternate between light and dark
      if (a.isDark !== b.isDark) {
        return a.isDark ? 1 : -1;
      }
      return 0;
    })
    .slice(0, 4);

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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h5 className="font-medium">Smart Color Harmonies</h5>
          <p className="text-xs text-muted-foreground">
            AI-generated color combinations using your primary color
          </p>
        </div>
      </div>

      {/* Mixed Light & Dark Harmonies in 4 columns */}
      <div className="grid grid-cols-4 gap-2">
        {mixedHarmonies.map((harmony, index) => {
          const isDark = harmony.isDark;

          return (
            <Card
              key={`harmony-${index}`}
              className={`cursor-pointer transition-all hover:shadow-md hover:ring-2 hover:ring-blue-200 ${
                isDark ? "bg-gray-900 text-white border-gray-700" : "bg-white"
              }`}
              onClick={() => onApplyHarmony(harmony)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center gap-3">
                  {/* Header with name and theme indicator */}
                  <div className="flex items-center gap-2">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-yellow-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {harmony.name}
                    </span>
                  </div>

                  {/* Color preview */}
                  <div className="flex gap-2">
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
                            className={`w-5 h-5 rounded-full border shadow-sm ${
                              isDark ? "border-gray-600" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color as string }}
                          />
                        </ColorTooltip>
                      ))}
                  </div>

                  {/* Type + Compliance Badge */}
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-gray-400" : "text-muted-foreground"
                      }`}
                    >
                      {harmony.type.charAt(0).toUpperCase() +
                        harmony.type
                          .slice(1)
                          .replace("-dark", "")
                          .replace("-", " ")}
                    </span>

                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span
                        className={isDark ? "text-green-400" : "text-green-600"}
                      >
                        ✓ {isDark ? "Dark" : "WCAG AA"}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Show count if there are more harmonies available */}
      {harmonySuggestions.length > 4 && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Showing 4 of {harmonySuggestions.length} available harmonies
          </p>
        </div>
      )}
    </div>
  );
};
