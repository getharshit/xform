// src/components/form-builder/panels/right-panel/RightPanel.tsx

"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, ChevronRight, FileText, Palette } from "lucide-react";

import { DynamicFieldProperties } from "./DynamicFieldProperties";
import { FormSettings } from "./FormSettings";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { useBuilder } from "../../providers/BuilderProvider";

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
  const {
    state: { form, selectedFieldId },
    selectedField,
    updateField,
    updateForm,
    duplicateField,
    deleteField,
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

  const handleFieldUpdate = (updates: any) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, updates);
    }
  };

  const handleFormUpdate = (updates: any) => {
    if (form) {
      updateForm(updates);
    }
  };

  const handleFieldDuplicate = (fieldId: string) => {
    duplicateField(fieldId);
  };

  const handleFieldDelete = (fieldId: string) => {
    deleteField(fieldId);
  };

  return (
    <div className={`border-l bg-card flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Properties</h3>
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

        {/* Context Information */}
        <div className="mt-3 text-xs text-muted-foreground">
          {activeTab === "field" && selectedField && (
            <div className="space-y-1">
              <div>Selected: {selectedField.label || "Untitled Field"}</div>
              <div>Type: {selectedField.type}</div>
            </div>
          )}
          {activeTab === "field" && !selectedField && (
            <div>No field selected</div>
          )}
          {activeTab === "form" && (
            <div className="space-y-1">
              <div>{form?.title || "Untitled Form"}</div>
              <div>
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}
          {activeTab === "theme" && <div>Customize form appearance</div>}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="field" className="m-0 h-full">
            <DynamicFieldProperties
              selectedField={selectedField}
              onFieldUpdate={handleFieldUpdate}
              onFieldDuplicate={handleFieldDuplicate}
              onFieldDelete={handleFieldDelete}
            />
          </TabsContent>

          <TabsContent value="form" className="m-0 h-full">
            <FormSettings
              form={form || undefined}
              onFormUpdate={handleFormUpdate}
            />
          </TabsContent>

          <TabsContent value="theme" className="m-0 h-full">
            <ThemeCustomizer
              theme={form?.theme}
              onThemeUpdate={(themeUpdates) =>
                handleFormUpdate({ theme: { ...form?.theme, ...themeUpdates } })
              }
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};
