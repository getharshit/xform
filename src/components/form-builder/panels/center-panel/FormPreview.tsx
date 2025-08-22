// src/components/form-builder/panels/center-panel/FormPreview.tsx

"use client";

import React from "react";
import { Form } from "@/types";
import { PublicFormRenderer } from "@/components/public-form";

export interface FormPreviewProps {
  form: Form | null;
  viewportMode?: "desktop" | "tablet" | "mobile";
  className?: string;
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  form,
  viewportMode = "desktop",
  className = "",
}) => {
  // Handle empty form state
  if (!form) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-muted-foreground">
          <p>No form to preview</p>
        </div>
      </div>
    );
  }

  // Mock submission handler for preview
  const handlePreviewSubmit = async (data: Record<string, any>) => {
    console.log("Preview form submission:", data);
    alert("Form submitted successfully!\nCheck console for submission data.");
  };

  // Get scale factor based on viewport
  const getScale = () => {
    switch (viewportMode) {
      case "mobile":
        return 0.9; // 70% for mobile preview
      case "tablet":
        return 0.9; // 75% for tablet preview
      default:
        return 0.9; // 80% for desktop preview
    }
  };

  const scale = getScale();
  const compensateWidth = `${100 / scale}%`; // Compensate width for scaling

  return (
    <div className={className}>
      <div
        className="transform origin-top-left overflow-hidden"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: compensateWidth,
          height: "fit-content",
        }}
      >
        <PublicFormRenderer form={form} onSubmit={handlePreviewSubmit} />
      </div>
    </div>
  );
};
