"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, ChevronRight, FileText, Palette, Zap } from "lucide-react";

import { FieldProperties } from "./FieldProperties";
import { FormSettings } from "./FormSettings";
import { ThemeCustomizer } from "./ThemeCustomizer";

export interface RightPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activeTab: "field" | "form" | "theme";
  onTabChange: (tab: "field" | "form" | "theme") => void;
  className?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  collapsed = false,
  onToggleCollapse,
  activeTab,
  onTabChange,
  className = "",
}) => {
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

  return (
    <div className={`border-l bg-card flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Additional question properties</h3>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            if (tab === "field" || tab === "form" || tab === "theme") {
              onTabChange(tab);
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="field" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Field
            </TabsTrigger>
            <TabsTrigger value="form" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Form
            </TabsTrigger>
            <TabsTrigger value="theme" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Theme
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="field" className="m-0 h-full">
            <FieldProperties />
          </TabsContent>

          <TabsContent value="form" className="m-0 h-full">
            <FormSettings />
          </TabsContent>

          <TabsContent value="theme" className="m-0 h-full">
            <ThemeCustomizer />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};
