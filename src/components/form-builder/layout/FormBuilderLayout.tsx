// src/components/form-builder/layout/FormBuilderLayout.tsx

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Eye,
  Save,
  Share2,
  Menu,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Form } from "@/types/form";

// Import our new state management
import { BuilderProvider, useBuilder } from "../providers/BuilderProvider";

// Import panels
import { LeftPanel } from "../panels/left-panel/LeftPanel";
import { CenterPanel } from "../panels/center-panel/CenterPanel";
import { RightPanel } from "../panels/right-panel/RightPanel";
import { DesignStep } from "../steps/DesignStep";

export interface FormBuilderLayoutProps {
  initialForm?: Form;
  formId?: string;
  onSave?: (form: Form) => Promise<boolean>;
  onPreview?: () => void;
  onPublish?: (form: Form) => Promise<boolean>;
  onError?: (error: string) => void;
  autoSaveInterval?: number; // in milliseconds
  enablePersistence?: boolean;
  className?: string;
}

// Inner component that uses the builder context
const FormBuilderLayoutInner: React.FC<{
  onSave?: (form: Form) => Promise<boolean>;
  onPreview?: () => void;
  onPublish?: (form: Form) => Promise<boolean>;
}> = ({ onSave, onPreview, onPublish }) => {
  const {
    state,
    toggleLeftPanel,
    toggleRightPanel,
    setBuilderStep,
    setPanelTab,
    saveForm,
    publishForm,
    hasUnsavedChanges,
    addFieldByType,
    fieldCount,
  } = useBuilder();

  const {
    form,
    ui: {
      builderStep,
      leftPanelCollapsed,
      rightPanelCollapsed,
      previewMode,
      activePanelTab,
    },
    loading: { isSaving, isPublishing, error },
    autoSave,
  } = state;

  // Handle step changes with proper typing
  const handleStepChange = (value: string) => {
    if (
      value === "build" ||
      value === "design" ||
      value === "integrate" ||
      value === "share"
    ) {
      setBuilderStep(value);
    }
  };

  const handleSave = async () => {
    if (onSave && form) {
      const success = await onSave(form);
      if (!success) {
        // Error is handled by the provider
        return;
      }
    } else {
      // Use built-in save functionality
      await saveForm();
    }
  };

  const handlePublish = async () => {
    if (onPublish && form) {
      const success = await onPublish(form);
      if (!success) {
        // Error is handled by the provider
        return;
      }
    } else {
      // Use built-in publish functionality
      await publishForm();
    }
  };

  const handlePreview = () => {
    onPreview?.();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">
              {form?.title || "Form Builder"}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </Badge>

              {/* Auto-save status */}
              {autoSave.enabled && (
                <Badge
                  variant={hasUnsavedChanges ? "destructive" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {autoSave.isSaving ? (
                    <>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      Saving...
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Unsaved
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Saved
                    </>
                  )}
                </Badge>
              )}

              {/* Error indicator */}
              {error && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Error
                </Badge>
              )}
            </div>
          </div>

          {/* Center - Step Navigation */}
          <Tabs
            value={builderStep}
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

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !form}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isPublishing || !form}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <Tabs value={builderStep} className="h-full">
          {/* Build Step */}
          <TabsContent value="build" className="h-full m-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Left Panel - Added Questions */}
              {!leftPanelCollapsed && (
                <>
                  <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                    <LeftPanel
                      collapsed={leftPanelCollapsed}
                      onToggleCollapse={toggleLeftPanel}
                    />
                  </ResizablePanel>
                  <ResizableHandle />
                </>
              )}

              {/* Center Panel - Form Preview */}
              <ResizablePanel defaultSize={leftPanelCollapsed ? 80 : 60}>
                <CenterPanel previewMode={previewMode} />
              </ResizablePanel>

              {/* Right Panel - Properties */}
              {!rightPanelCollapsed && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={15} minSize={15} maxSize={25}>
                    <RightPanel
                      collapsed={rightPanelCollapsed}
                      onToggleCollapse={toggleRightPanel}
                      activeTab={activePanelTab}
                      onTabChange={setPanelTab}
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </TabsContent>

          {/* Design Step */}
          <TabsContent value="design" className="h-full m-0">
            <DesignStep />
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
          onClick={toggleLeftPanel}
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

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
  );
};

// Main component that provides the builder context
export const FormBuilderLayout: React.FC<FormBuilderLayoutProps> = ({
  initialForm,
  formId,
  onSave,
  onPreview,
  onPublish,
  onError,
  className = "",
}) => {
  return (
    <div className={className}>
      <BuilderProvider
        initialForm={initialForm}
        formId={formId}
        onFormSave={onSave}
        onFormPublish={onPublish}
        onError={onError}
        enablePersistence={true}
        autoSaveInterval={30000} // 30 seconds
      >
        <FormBuilderLayoutInner
          onSave={onSave}
          onPreview={onPreview}
          onPublish={onPublish}
        />
      </BuilderProvider>
    </div>
  );
};

export default FormBuilderLayout;
