// src/components/form-builder/layout/FormBuilderLayout.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Eye, Save, Share2, Menu } from "lucide-react";

// Import panels
import { LeftPanel } from "../panels/left-panel/LeftPanel";
import { CenterPanel } from "../panels/center-panel/CenterPanel";
import { RightPanel } from "../panels/right-panel/RightPanel";
import { FloatingAddQuestionToolbar } from "../floating-elements/FloatingAddQuestionToolbar";

export interface FormBuilderLayoutProps {
  formId?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  className?: string;
}

export const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({
  formId,
  onSave,
  onPreview,
  onPublish,
  className = "",
}) => {
  const [activeStep, setActiveStep] = useState<
    "build" | "design" | "integrate" | "share"
  >("build");
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Fix: Handle string type from Tabs component
  const handleStepChange = (value: string) => {
    if (
      value === "build" ||
      value === "design" ||
      value === "integrate" ||
      value === "share"
    ) {
      setActiveStep(value);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    onPreview?.();
  };

  const handleFieldAdd = (fieldType: string) => {
    console.log("Adding field:", fieldType);
    // This will be connected to the form builder state later
  };

  return (
    <div className={`h-screen flex flex-col bg-background ${className}`}>
      {/* Top Navigation Bar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Form Builder</h1>
            <Badge variant="outline">Draft</Badge>
          </div>

          {/* Center - Step Navigation */}
          <Tabs
            value={activeStep}
            onValueChange={handleStepChange}
            className="flex-1 max-w-md"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="build">Build</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="integrate">Integrate</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right side - Actions (removed Undo/Redo) */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={togglePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={onPublish}>
              <Share2 className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <Tabs value={activeStep} className="h-full">
          {/* Build Step */}
          <TabsContent value="build" className="h-full m-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Left Panel - Added Questions */}
              {!leftPanelCollapsed && (
                <>
                  <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                    <LeftPanel
                      collapsed={leftPanelCollapsed}
                      onToggleCollapse={() =>
                        setLeftPanelCollapsed(!leftPanelCollapsed)
                      }
                    />
                  </ResizablePanel>
                  <ResizableHandle />
                </>
              )}

              {/* Center Panel - Form Preview */}
              <ResizablePanel defaultSize={leftPanelCollapsed ? 80 : 60}>
                <CenterPanel previewMode={previewMode} />
              </ResizablePanel>

              {/* Right Panel - Properties (made narrower) */}
              {!rightPanelCollapsed && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
                    <RightPanel
                      collapsed={rightPanelCollapsed}
                      onToggleCollapse={() =>
                        setRightPanelCollapsed(!rightPanelCollapsed)
                      }
                      activeTab="field"
                      onTabChange={() => {}}
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>

            {/* Floating Add Question Toolbar - Only show in build step */}
            <FloatingAddQuestionToolbar onFieldAdd={handleFieldAdd} />
          </TabsContent>

          {/* Design Step */}
          <TabsContent value="design" className="h-full m-0">
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Design Step</h3>
                <p className="text-muted-foreground">
                  Theme customization coming soon
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Integrate Step */}
          <TabsContent value="integrate" className="h-full m-0">
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Integration Step</h3>
                <p className="text-muted-foreground">
                  Integration options coming soon
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Share Step */}
          <TabsContent value="share" className="h-full m-0">
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 text-center">
                <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Share Step</h3>
                <p className="text-muted-foreground">
                  Sharing options coming soon
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Panel Toggle Buttons (when collapsed) */}
      {leftPanelCollapsed && (
        <Button
          variant="outline"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => setLeftPanelCollapsed(false)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {rightPanelCollapsed && (
        <Button
          variant="outline"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => setRightPanelCollapsed(false)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default FormBuilderLayout;
