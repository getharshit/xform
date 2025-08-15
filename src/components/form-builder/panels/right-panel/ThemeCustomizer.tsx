// src/components/form-builder/panels/right-panel/ThemeCustomizer.tsx

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Type,
  Layout,
  Eye,
  RotateCcw,
  Save,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useBuilder } from "../../providers/BuilderProvider";
import { FormTheme } from "@/types/form";

export interface ThemeCustomizerProps {
  theme?: FormTheme;
  onThemeUpdate?: (updates: Partial<FormTheme>) => void;
}

// Predefined color palettes
const colorPalettes = [
  {
    name: "Default Blue",
    primary: "#3B82F6",
    secondary: "#6B7280",
    accent: "#10B981",
    background: "#FFFFFF",
  },
  {
    name: "Professional Green",
    primary: "#059669",
    secondary: "#6B7280",
    accent: "#3B82F6",
    background: "#FFFFFF",
  },
  {
    name: "Modern Purple",
    primary: "#7C3AED",
    secondary: "#6B7280",
    accent: "#F59E0B",
    background: "#FFFFFF",
  },
  {
    name: "Warm Orange",
    primary: "#EA580C",
    secondary: "#78716C",
    accent: "#DC2626",
    background: "#FFFFFF",
  },
  {
    name: "Dark Mode",
    primary: "#3B82F6",
    secondary: "#9CA3AF",
    accent: "#10B981",
    background: "#111827",
  },
];

// Font options
const fontFamilies = [
  { value: "Inter", label: "Inter", category: "Sans Serif" },
  { value: "Roboto", label: "Roboto", category: "Sans Serif" },
  { value: "Open Sans", label: "Open Sans", category: "Sans Serif" },
  { value: "Lato", label: "Lato", category: "Sans Serif" },
  { value: "Poppins", label: "Poppins", category: "Sans Serif" },
  { value: "Playfair Display", label: "Playfair Display", category: "Serif" },
  { value: "Merriweather", label: "Merriweather", category: "Serif" },
  { value: "Georgia", label: "Georgia", category: "Serif" },
  { value: "Fira Code", label: "Fira Code", category: "Monospace" },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme: propTheme,
  onThemeUpdate,
}) => {
  // Use builder context for state management
  const {
    state: { form },
    updateForm,
  } = useBuilder();

  // Use prop theme if provided, otherwise use form theme
  const currentTheme = propTheme || form?.theme || {};
  const [previewMode, setPreviewMode] = useState(false);

  const handleThemeUpdate = (updates: Partial<FormTheme>) => {
    if (onThemeUpdate) {
      onThemeUpdate(updates);
    } else {
      // Update theme through form update
      updateForm({
        theme: {
          ...currentTheme,
          ...updates,
        },
      });
    }
  };

  const handleColorPaletteSelect = (palette: (typeof colorPalettes)[0]) => {
    handleThemeUpdate({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      backgroundColor: palette.background,
      // Update customization colors if they exist
      ...((currentTheme as any).customization && {
        customization: {
          ...(currentTheme as any).customization,
          colors: {
            ...(currentTheme as any).customization?.colors,
            primary: palette.primary,
            secondary: palette.secondary,
            accent: palette.accent,
            background: palette.background,
          },
        },
      }),
    });
  };

  const resetTheme = () => {
    const defaultTheme: Partial<FormTheme> = {
      primaryColor: "#3B82F6",
      fontFamily: "Inter",
      backgroundColor: "#FFFFFF",
      secondaryColor: "#6B7280",
      fontSize: {
        title: 24,
        question: 16,
        input: 16,
        small: 14,
      },
      borderRadius: 8,
      spacing: 16,
    };
    handleThemeUpdate(defaultTheme);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <h4 className="font-medium">Theme Customization</h4>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTheme}
            title="Reset to default theme"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Color Palettes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <h5 className="font-medium text-sm">Color Palettes</h5>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {colorPalettes.map((palette, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleColorPaletteSelect(palette)}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[
                    palette.primary,
                    palette.secondary,
                    palette.accent,
                    palette.background,
                  ].map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{palette.name}</span>
                {currentTheme.primaryColor === palette.primary && (
                  <Badge variant="default" className="ml-auto text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Individual Colors */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Custom Colors</h5>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-8 h-8 rounded border"
                style={{
                  backgroundColor: currentTheme.primaryColor || "#3B82F6",
                }}
              />
              <Input
                type="color"
                value={currentTheme.primaryColor || "#3B82F6"}
                onChange={(e) =>
                  handleThemeUpdate({ primaryColor: e.target.value })
                }
                className="flex-1 h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Background</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-8 h-8 rounded border border-gray-200"
                style={{
                  backgroundColor: currentTheme.backgroundColor || "#FFFFFF",
                }}
              />
              <Input
                type="color"
                value={currentTheme.backgroundColor || "#FFFFFF"}
                onChange={(e) =>
                  handleThemeUpdate({ backgroundColor: e.target.value })
                }
                className="flex-1 h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Secondary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-8 h-8 rounded border"
                style={{
                  backgroundColor: currentTheme.secondaryColor || "#6B7280",
                }}
              />
              <Input
                type="color"
                value={currentTheme.secondaryColor || "#6B7280"}
                onChange={(e) =>
                  handleThemeUpdate({ secondaryColor: e.target.value })
                }
                className="flex-1 h-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Text Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: currentTheme.textColor || "#111827" }}
              />
              <Input
                type="color"
                value={currentTheme.textColor || "#111827"}
                onChange={(e) =>
                  handleThemeUpdate({ textColor: e.target.value })
                }
                className="flex-1 h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Typography */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          <h5 className="font-medium text-sm">Typography</h5>
        </div>

        <div>
          <Label className="text-xs">Font Family</Label>
          <Select
            value={currentTheme.fontFamily || "Inter"}
            onValueChange={(value) => handleThemeUpdate({ fontFamily: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(
                fontFamilies.reduce((acc, font) => {
                  if (!acc[font.category]) acc[font.category] = [];
                  acc[font.category].push(font);
                  return acc;
                }, {} as Record<string, typeof fontFamilies>)
              ).map(([category, fonts]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  {fonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.label}
                      </span>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Title Size</Label>
            <Input
              type="number"
              value={currentTheme.fontSize?.title || 24}
              onChange={(e) =>
                handleThemeUpdate({
                  fontSize: {
                    ...currentTheme.fontSize,
                    title: parseInt(e.target.value) || 24,
                  },
                })
              }
              min="16"
              max="48"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Body Size</Label>
            <Input
              type="number"
              value={currentTheme.fontSize?.question || 16}
              onChange={(e) =>
                handleThemeUpdate({
                  fontSize: {
                    ...currentTheme.fontSize,
                    question: parseInt(e.target.value) || 16,
                  },
                })
              }
              min="12"
              max="24"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Input Size</Label>
            <Input
              type="number"
              value={currentTheme.fontSize?.input || 16}
              onChange={(e) =>
                handleThemeUpdate({
                  fontSize: {
                    ...currentTheme.fontSize,
                    input: parseInt(e.target.value) || 16,
                  },
                })
              }
              min="12"
              max="20"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Small Text</Label>
            <Input
              type="number"
              value={currentTheme.fontSize?.small || 14}
              onChange={(e) =>
                handleThemeUpdate({
                  fontSize: {
                    ...currentTheme.fontSize,
                    small: parseInt(e.target.value) || 14,
                  },
                })
              }
              min="10"
              max="16"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Layout */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4" />
          <h5 className="font-medium text-sm">Layout</h5>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              type="number"
              value={currentTheme.borderRadius || 8}
              onChange={(e) =>
                handleThemeUpdate({
                  borderRadius: parseInt(e.target.value) || 8,
                })
              }
              min="0"
              max="24"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Spacing</Label>
            <Input
              type="number"
              value={currentTheme.spacing || 16}
              onChange={(e) =>
                handleThemeUpdate({ spacing: parseInt(e.target.value) || 16 })
              }
              min="8"
              max="32"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Shadow Level</Label>
          <Select
            value={currentTheme.shadowLevel || "md"}
            onValueChange={(value) =>
              handleThemeUpdate({ shadowLevel: value as any })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Button Style</Label>
          <Select
            value={currentTheme.buttonStyle || "rounded"}
            onValueChange={(value) =>
              handleThemeUpdate({ buttonStyle: value as any })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="pill">Pill</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Input Style</Label>
          <Select
            value={currentTheme.inputStyle || "outlined"}
            onValueChange={(value) =>
              handleThemeUpdate({ inputStyle: value as any })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outlined">Outlined</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Display Options */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Display Options</h5>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Show Question Numbers</Label>
            <p className="text-xs text-muted-foreground">
              Display numbers for each question
            </p>
          </div>
          <Switch
            checked={currentTheme.showQuestionNumbers !== false}
            onCheckedChange={(checked) =>
              handleThemeUpdate({ showQuestionNumbers: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Show Progress Bar</Label>
            <p className="text-xs text-muted-foreground">
              Display completion progress
            </p>
          </div>
          <Switch
            checked={currentTheme.showProgressBar !== false}
            onCheckedChange={(checked) =>
              handleThemeUpdate({ showProgressBar: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Center Form</Label>
            <p className="text-xs text-muted-foreground">
              Center form content on page
            </p>
          </div>
          <Switch
            checked={currentTheme.centerForm !== false}
            onCheckedChange={(checked) =>
              handleThemeUpdate({ centerForm: checked })
            }
          />
        </div>
      </div>

      <Separator />

      {/* Logo & Branding */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h5 className="font-medium text-sm">Branding</h5>
        </div>

        <div>
          <Label htmlFor="logo-url" className="text-xs">
            Logo URL
          </Label>
          <Input
            id="logo-url"
            type="url"
            value={currentTheme.logoUrl || ""}
            onChange={(e) => handleThemeUpdate({ logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add your company logo to the form header
          </p>
        </div>

        {currentTheme.logoUrl && (
          <div className="p-2 border rounded">
            <img
              src={currentTheme.logoUrl}
              alt="Logo preview"
              className="max-h-16 max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Responsive Preview */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Preview</h5>

        <div className="flex items-center gap-1 justify-center">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Monitor className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Tablet className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <Card className="p-4 bg-muted/30">
          <div
            className="space-y-3 transition-all duration-200"
            style={{
              fontFamily: currentTheme.fontFamily || "Inter",
              backgroundColor: currentTheme.backgroundColor || "#FFFFFF",
              borderRadius: `${currentTheme.borderRadius || 8}px`,
              color: currentTheme.textColor || "#111827",
            }}
          >
            <h3
              className="font-semibold"
              style={{
                fontSize: `${currentTheme.fontSize?.title || 24}px`,
                color: currentTheme.primaryColor || "#3B82F6",
              }}
            >
              Form Title Preview
            </h3>
            <p
              style={{
                fontSize: `${currentTheme.fontSize?.question || 16}px`,
                color: currentTheme.secondaryColor || "#6B7280",
              }}
            >
              This is how your form will look with the current theme settings.
            </p>
            <div
              className="p-2 border rounded"
              style={{
                borderRadius: `${currentTheme.borderRadius || 8}px`,
                fontSize: `${currentTheme.fontSize?.input || 16}px`,
              }}
            >
              Sample input field
            </div>
            <button
              className="px-4 py-2 text-white font-medium transition-colors"
              style={{
                backgroundColor: currentTheme.primaryColor || "#3B82F6",
                borderRadius:
                  currentTheme.buttonStyle === "pill"
                    ? "9999px"
                    : currentTheme.buttonStyle === "square"
                    ? "0px"
                    : `${currentTheme.borderRadius || 8}px`,
              }}
            >
              Submit Button
            </button>
          </div>
        </Card>
      </div>

      {/* Reset and Save Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={resetTheme}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            /* Save theme logic */
          }}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-1" />
          Save Theme
        </Button>
      </div>
    </div>
  );
};
