"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { defaultTheme } from "@/lib/defaults/defaults";

// Import the existing form builder components
import { FormBuilderLayout, BuilderProvider } from "@/components/form-builder";

import type { Form as BuilderForm } from "@/types";

// API Form type (what comes from your API) - Fixed to handle all possible types
interface APIForm {
  id: string;
  title: string;
  description: string | null | undefined; // Allow undefined
  fields: any[];
  theme?: any;
  prompt: string | null | undefined; // Allow undefined here too
  customization?: any;
  layout?: any;
  settings?: any;
  fieldGroups?: any;
  createdAt: string;
  updatedAt: string;
}

// Function to convert API form to Builder form
const convertAPIFormToBuilderForm = (apiForm: APIForm): BuilderForm => {
  return {
    ...apiForm,
    description: apiForm.description ?? null, // Convert undefined to null
    prompt: apiForm.prompt ?? null, // Convert undefined to null
    createdAt: new Date(apiForm.createdAt),
    updatedAt: new Date(apiForm.updatedAt),
  } as BuilderForm;
};

// Function to convert Builder form to API form
const convertBuilderFormToAPIForm = (builderForm: BuilderForm): APIForm => {
  return {
    ...builderForm,
    description: builderForm.description ?? null, // Ensure consistency
    prompt: builderForm.prompt ?? null, // Ensure consistency
    createdAt: builderForm.createdAt.toString(),
    updatedAt: new Date().toISOString(), // Always update the timestamp
  };
};

export default function FormBuilderPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<BuilderForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load form data
  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  useEffect(() => {
    console.log("🔍 BUILDER PAGE LOADED");
    console.log("📋 Form ID:", formId);
    console.log("🎨 Current form:", form);

    // Check if we have the conversion functions
    console.log("🔄 Conversion functions available:", {
      convertBuilderFormToAPIForm: typeof convertBuilderFormToAPIForm,
      convertAPIFormToBuilderForm: typeof convertAPIFormToBuilderForm,
    });
  }, [formId, form]);

  // 🆕 ADD THIS TEST FUNCTION
  const testCustomizationSave = () => {
    console.log("🧪 TESTING CUSTOMIZATION SAVE");

    if (form) {
      const updatedForm = {
        ...form,
        customization: {
          ...form.customization,
          colors: {
            ...form.customization?.colors,
            primary: "#FF0000", // Test color change
          },
        },
      };

      console.log("🧪 Setting form with test customization:", updatedForm);
      setForm(updatedForm);

      // This should trigger auto-save
      setTimeout(() => {
        console.log("🧪 Checking if auto-save was triggered...");
      }, 1000);
    }
  };

  // 🆕 ADD THIS useEffect to expose the test function globally
  useEffect(() => {
    // Make the test function available in browser console
    (window as any).testCustomizationSave = testCustomizationSave;

    return () => {
      delete (window as any).testCustomizationSave;
    };
  }, [form]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/forms/${formId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Form not found");
        }
        throw new Error("Failed to load form");
      }

      const apiFormData: APIForm = await response.json();
      const builderForm = convertAPIFormToBuilderForm(apiFormData);
      setForm(builderForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: BuilderForm): Promise<boolean> => {
    console.log("🚀 MANUAL SAVE TRIGGERED");
    console.log("🎨 Form customization:", formData.customization);

    try {
      const apiFormData = convertBuilderFormToAPIForm(formData);
      console.log("🔄 Converted API form data:", apiFormData);

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      console.log("📡 API Response status:", response.status);
      console.log("📡 API Response ok:", response.ok);

      if (!response.ok) {
        // ✅ BETTER ERROR HANDLING: Try to get error message
        let errorMessage = "Failed to save form";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("❌ API Error response:", errorData);
        } catch (jsonError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            errorMessage = `Server error (${response.status})`;
          } catch (textError) {
            console.error("❌ Could not parse error response");
          }
        }
        throw new Error(errorMessage);
      }

      // ✅ BETTER SUCCESS HANDLING: Handle the response properly
      const updatedAPIForm: APIForm = await response.json();
      console.log("✅ API returned updated form:", updatedAPIForm);
      console.log(
        "🎨 API returned customization:",
        updatedAPIForm.customization
      );

      const updatedBuilderForm = convertAPIFormToBuilderForm(updatedAPIForm);
      setForm(updatedBuilderForm);

      return true;
    } catch (err) {
      console.error("💥 Save error:", err);
      return false;
    }
  };

  const handlePublish = async (): Promise<boolean> => {
    if (!formId) {
      console.error("❌ No form ID available for publishing");
      return false;
    }

    try {
      console.log("🚀 Publishing form:", formId);

      const response = await fetch(`/api/forms/${formId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("✅ Form published:", result);

      if (response.ok && result.success) {
        // ✅ CRITICAL: Return true for success
        return true;
      } else {
        console.error("❌ Publish failed:", result.error || "Unknown error");
        // ✅ CRITICAL: Return false for failure
        return false;
      }
    } catch (error) {
      console.error("❌ Publish error:", error);
      // ✅ CRITICAL: Return false for errors
      return false;
    }
  };

  const handlePreview = () => {
    // Open form preview in new tab
    window.open(`/form/${formId}`, "_blank");
  };

  const handleError = (error: string) => {
    setError(error);
    console.error("Form Builder Error:", error);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Loading Form Builder
          </h2>
          <p className="text-gray-600">
            Please wait while we load your form...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Form
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadForm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
              <Link
                href="/forms"
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                Back to Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form not found
  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Form Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The form you're looking for doesn't exist.
          </p>
          <Link
            href="/forms"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      {/* Use BuilderProvider to manage form state */}
      <BuilderProvider
        initialForm={form}
        formId={formId}
        onFormSave={handleSave}
        onFormPublish={handlePublish}
        onError={handleError}
        enablePersistence={true}
        autoSaveInterval={5000} // 20 seconds
      >
        <FormBuilderLayout
          onSave={handleSave} // ✅ Add this
          onPublish={handlePublish} // ✅ Add this
          onPreview={handlePreview}
          onError={handleError}
        />
      </BuilderProvider>
    </div>
  );
}
