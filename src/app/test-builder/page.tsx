// src/app/test-builder/page.tsx

"use client";

import React from "react";
import {
  FormBuilderLayout,
  FormBuilderProvider,
} from "@/components/form-builder";
import { Form } from "@/types/form";

// Create a simple test form
const createTestForm = (): Form => {
  return {
    id: "test-form-1",
    title: "Test Form",
    description: "This is a test form for the builder",
    fields: [
      {
        id: "name",
        type: "shortText",
        label: "Full Name",
        required: true,
        placeholder: "Enter your name",
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "name@example.com",
      },
    ],
    theme: {
      primaryColor: "#3B82F6",
      fontFamily: "Inter, sans-serif",
    },
    customization: {
      colors: {
        primary: "#3B82F6",
        background: "#FFFFFF",
      },
    },
    layout: {
      type: "singleColumn",
      options: {
        maxWidth: 600,
      },
    },
    settings: {
      allowMultipleSubmissions: true,
      collectIPAddress: true,
      submitButtonText: "Submit",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export default function TestBuilderPage() {
  const testForm = createTestForm();

  const handleSave = async () => {
    console.log("Save clicked");
    alert("Save functionality - check console");
  };

  const handlePreview = () => {
    console.log("Preview clicked");
    alert("Preview functionality");
  };

  const handlePublish = () => {
    console.log("Publish clicked");
    alert("Publish functionality");
  };

  return (
    <div className="h-screen">
      <FormBuilderProvider initialForm={testForm}>
        <FormBuilderLayout
          formId={testForm.id}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
        />
      </FormBuilderProvider>
    </div>
  );
}
