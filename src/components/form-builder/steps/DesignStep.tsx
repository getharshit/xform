// src/components/form-builder/steps/DesignStep.tsx

"use client";

import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, ArrowLeft, Eye, Settings, AlertCircle } from "lucide-react";

import { CenterPanel } from "../panels/center-panel/CenterPanel";
import { DesignRightPanel } from "./design/DesignRightPanel";
import { useBuilder } from "../providers/BuilderProvider";
import { AnimationProvider } from "@/components/public-form/animation/AnimationProvider";

export interface DesignStepProps {
  className?: string;
  builderStep?: string; // Optional step prop for future use
  step?: "build" | "design" | "integrate" | "share";
}

export const DesignStep: React.FC<DesignStepProps> = ({ className = "" }) => {
  const {
    state: {
      form,
      ui: { rightPanelCollapsed, builderStep },
    },
    fieldCount,
    toggleRightPanel,
    setBuilderStep,
  } = useBuilder();

  // Local state for design-specific tabs
  const [activeDesignTab, setActiveDesignTab] = React.useState<
    "themes" | "colors" | "typography" | "layout" | "animations"
  >("colors");

  // Check if design step should be accessible
  const hasFields = fieldCount > 0;

  // If no fields, show restricted access message
  if (!hasFields) {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Add Fields First</h3>
            <p className="text-muted-foreground mb-6">
              You need to add at least one field to your form before you can
              customize its design and appearance.
            </p>
            <Button onClick={() => setBuilderStep("build")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Build Step
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Auto-set right panel to design tab when entering design step
  React.useEffect(() => {
    if (builderStep === "design") {
      // Design step manages its own tabs independently
      setActiveDesignTab("colors");
    }
  }, [builderStep]);

  return (
    <AnimationProvider>
      <div className={`h-full ${className}`}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Center Panel - Form Preview (60% default) */}
          <ResizablePanel defaultSize={rightPanelCollapsed ? 100 : 60}>
            <div className="h-full border-r bg-muted/30">
              {/* Design-specific header for center panel */}

              {/* Center Panel Content - Reuse existing CenterPanel */}
              <div className="h-[calc(100%-80px)]">
                <CenterPanel previewMode={false} step={builderStep} />
              </div>
            </div>
          </ResizablePanel>

          {/* Right Panel - Design Customization (40% default) */}
          {!rightPanelCollapsed && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
                <DesignRightPanel
                  collapsed={rightPanelCollapsed}
                  onToggleCollapse={toggleRightPanel}
                  activeTab={activeDesignTab}
                  onTabChange={setActiveDesignTab}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {/* Collapsed Panel Toggle */}
        {rightPanelCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
            onClick={toggleRightPanel}
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
      </div>
    </AnimationProvider>
  );
};
