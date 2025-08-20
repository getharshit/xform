// src/components/form-builder/steps/design/tabs/DesignRightPanel.tsx

"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Palette,
  Type,
  Minus,
  Square,
  Sparkles,
  Zap,
} from "lucide-react";

import { ColorsTab } from "./tabs/ColorsTab";
import { TypographyTab } from "./tabs/TypographyTab";
import { BordersTab } from "./tabs/BordersTab";
import { AnimationsTab } from "./tabs/AnimationsTab";

import { useBuilder } from "../../providers/BuilderProvider";

export interface DesignRightPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activeTab?: "colors" | "typography" | "borders" | "animations";
  onTabChange?: (
    tab: "colors" | "typography" | "borders" | "animations"
  ) => void;
  className?: string;
}

// Placeholder components for tabs we haven't implemented yet
const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
      <Sparkles className="w-6 h-6 text-muted-foreground" />
    </div>
    <h4 className="font-medium mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">Coming soon...</p>
  </div>
);

export const DesignRightPanel: React.FC<DesignRightPanelProps> = ({
  collapsed = false,
  onToggleCollapse,
  activeTab = "colors",
  onTabChange,
  className = "",
}) => {
  const {
    state: { form },
    fieldCount,
  } = useBuilder();

  if (collapsed) {
    return (
      <div
        className={`w-12 border-l bg-card flex flex-col items-center py-4 ${className}`}
      >
        <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    if (
      tab === "colors" ||
      tab === "typography" ||
      tab === "borders" ||
      tab === "animations"
    ) {
      onTabChange?.(tab);
    }
  };

  return (
    <div className={`border-l bg-card flex flex-col h-full ${className}`}>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Design Customization</h3>
            <p className="text-sm text-muted-foreground">
              Customize the appearance and feel of your form
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Horizontal Tab Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="colors" className="p-2 flex flex-row gap-1">
              <Palette className="w-4 h-4" />
              <span className="text-xs">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="p-2 flex flex-row gap-1">
              <Type className="w-4 h-4" />
              <span className="text-xs">Typography</span>
            </TabsTrigger>
            <TabsTrigger value="borders" className="p-2 flex flex-row gap-1">
              <Square className="w-4 h-4" />
              <span className="text-xs">Borders</span>
            </TabsTrigger>
            <TabsTrigger value="animations" className="p-2 flex flex-row gap-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Animations</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content - NO ScrollArea wrapper, let individual tabs handle their own scrolling */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="colors" className="m-0 h-full">
            <ColorsTab />
          </TabsContent>

          <TabsContent value="typography" className="m-0 h-full">
            <TypographyTab />
          </TabsContent>

          <TabsContent value="borders" className="m-0 h-full overflow-y-auto">
            <BordersTab />
          </TabsContent>

          <TabsContent
            value="animations"
            className="m-0 h-full overflow-y-auto"
          >
            <AnimationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
