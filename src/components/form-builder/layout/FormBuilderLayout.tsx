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
import { ShareStep } from "../steps/ShareStep";
import { toast } from "sonner";

// const DebugPanel = () => {
//   const { state, hasUnsavedChanges, saveForm } = useBuilder();

//   React.useEffect(() => {
//     console.log("🎯 BUILDER STATE UPDATE:", {
//       hasForm: !!state.form,
//       formId: state.formId,
//       autoSaveEnabled: state.autoSave.enabled,
//       autoSaveInterval: state.autoSave.interval,
//       hasUnsavedChanges: hasUnsavedChanges,
//       isSaving: state.autoSave.isSaving,
//       lastSaved: state.autoSave.lastSaved,
//       // ✅ ADD THESE TO DEBUG THE CONNECTION
//       saveFormFunction: typeof saveForm,
//       hasError: !!state.loading.error,
//       error: state.loading.error,
//     });
//   }, [state, hasUnsavedChanges, saveForm]);

//   const handleManualSave = () => {
//     console.log("🖱️ MANUAL SAVE BUTTON CLICKED");
//     console.log("🔍 saveForm function type:", typeof saveForm);
//     saveForm()
//       .then((result) => {
//         console.log("💾 Save result:", result);
//       })
//       .catch((error) => {
//         console.log("❌ Save error:", error);
//       });
//   };

//   return (
//     <div className="fixed top-4 right-4 bg-white p-4 border rounded shadow-lg z-50 max-w-xs">
//       <h3 className="font-bold text-sm">Debug Panel</h3>
//       <div className="text-xs space-y-1">
//         <p>Form ID: {state.formId || "None"}</p>
//         <p>Auto-save: {state.autoSave.enabled ? "ON" : "OFF"}</p>
//         <p>Unsaved: {hasUnsavedChanges ? "YES" : "NO"}</p>
//         <p>Saving: {state.autoSave.isSaving ? "YES" : "NO"}</p>
//         <p>Save Func: {typeof saveForm}</p>
//         {state.loading.error && (
//           <p className="text-red-600">Error: {state.loading.error}</p>
//         )}
//       </div>
//       <div className="flex gap-2 mt-2">
//         <button
//           onClick={handleManualSave}
//           className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
//         >
//           Manual Save
//         </button>
//         <button
//           onClick={() => (window as any).testCustomizationSave?.()}
//           className="bg-green-500 text-white px-2 py-1 rounded text-xs"
//         >
//           Test Custom
//         </button>
//       </div>
//     </div>
//   );
// };

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

  const handleStepChange = (value: string) => {
    if (
      value === "build" ||
      value === "design" ||
      value === "integrate" ||
      value === "share"
    ) {
      // If trying to go to share step but form has no fields, show a warning
      if (value === "share" && (!form?.fields || form.fields.length === 0)) {
        toast.error("Add at least one question before sharing your form.");
        return;
      }

      setBuilderStep(value);
    }
  };

  const handleSave = async () => {
    if (onSave && form) {
      const success = await onSave(form);
      if (!success) {
        return;
      }
    } else {
      await saveForm();
    }
  };

  const handlePublish = async () => {
    // Check if form has fields
    if (!form?.fields || form.fields.length === 0) {
      toast.error("Add at least one question before publishing your form.");
      return false;
    }

    if (onPublish && form) {
      const success = await onPublish(form);
      if (!success) {
        return false;
      }
    } else {
      await publishForm();
    }
  };

  const handlePreview = () => {
    onPreview?.();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/*<DebugPanel />}
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

              {/* 🆕 ADD PUBLISH STATUS BADGE */}
              <Badge
                variant={form?.published ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {form?.published ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    Draft
                  </>
                )}
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
              <TabsTrigger value="build" className="relative">
                Build
                {(!form?.fields || form.fields.length === 0) && (
                  <span className="ml-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="integrate">Integrate</TabsTrigger>
              <TabsTrigger value="share" className="relative">
                Share
                {form?.published && (
                  <CheckCircle2 className="w-3 h-3 ml-1 text-green-600" />
                )}
              </TabsTrigger>
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
              disabled={
                isPublishing ||
                !form ||
                !form?.fields ||
                form.fields.length === 0
              }
              variant={form?.published ? "outline" : "default"}
              className={
                form?.published
                  ? "border-green-200 text-green-700 hover:bg-green-50"
                  : ""
              }
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isPublishing
                ? "Publishing..."
                : form?.published
                ? "Published"
                : "Publish"}
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
                <CenterPanel previewMode={previewMode} step={builderStep} />
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
            <DesignStep step={builderStep} />
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
            <ShareStep step={builderStep} onPublish={handlePublish} />
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
        autoSaveInterval={5000} // 30 seconds
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
