"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Import the existing form builder components
import { FormBuilderLayout, BuilderProvider } from "@/components/form-builder";

import type { Form as BuilderForm } from "@/types/form";

// API Form type (what comes from your API) - Fixed to handle all possible types
interface APIForm {
  id: string;
  title: string;
  description: string | null | undefined; // Allow undefined
  fields: any[];
  theme: any;
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
    try {
      const apiFormData = convertBuilderFormToAPIForm(formData);

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save form");
      }

      const updatedAPIForm: APIForm = await response.json();
      const updatedBuilderForm = convertAPIFormToBuilderForm(updatedAPIForm);
      setForm(updatedBuilderForm);

      return true;
    } catch (err) {
      console.error("Save error:", err);
      return false;
    }
  };

  const handlePublish = async (formData: BuilderForm): Promise<boolean> => {
    try {
      // First save the form to ensure it's up to date
      const saveSuccess = await handleSave(formData);
      if (!saveSuccess) {
        return false;
      }

      // For now, publishing is just saving the form since we don't have a separate publish endpoint
      // You can add additional publish logic here if needed
      return true;
    } catch (err) {
      console.error("Publish error:", err);
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
        autoSaveInterval={30000} // 30 seconds
      >
        <FormBuilderLayout
          initialForm={form}
          formId={formId}
          onSave={handleSave}
          onPreview={handlePreview}
          onPublish={handlePublish}
          onError={handleError}
          autoSaveInterval={30000}
          enablePersistence={true}
        />
      </BuilderProvider>
    </div>
  );
}
