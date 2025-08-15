"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Import your existing form builder components
// Note: Adjust these imports based on your actual file structure
// import { FormBuilderLayout } from '@/components/form-builder/FormBuilderLayout';

// Types based on your API
interface Form {
  id: string;
  title: string;
  description: string | null;
  fields: any[];
  theme: any;
  prompt: string | null;
  customization?: any;
  layout?: any;
  settings?: any;
  fieldGroups?: any;
  createdAt: string;
  updatedAt: string;
}

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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

      const formData = await response.json();
      setForm(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Form): Promise<boolean> => {
    try {
      setSaving(true);

      const response = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save form");
      }

      const updatedForm = await response.json();
      setForm(updatedForm);
      setLastSaved(new Date());

      return true;
    } catch (err) {
      console.error("Save error:", err);
      alert(
        "Failed to save form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (formData: Form): Promise<boolean> => {
    try {
      // First save the form
      const saveSuccess = await handleSave(formData);
      if (!saveSuccess) {
        return false;
      }

      // For now, publishing is just saving the form
      // In the future, you might have a separate publish endpoint
      alert(
        "Form published successfully! Share your form using its unique link."
      );
      return true;
    } catch (err) {
      console.error("Publish error:", err);
      alert(
        "Failed to publish form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      return false;
    }
  };

  const handlePreview = () => {
    // Open form preview in new tab
    window.open(`/form/${formId}`, "_blank");
  };

  const handleError = (error: string) => {
    alert("Error: " + error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/forms"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {form.title}
                </h1>
                {form.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {form.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Status */}
              <div className="text-sm text-gray-600">
                {saving ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>Unsaved changes</span>
                )}
              </div>

              {/* Preview Button */}
              <button
                onClick={handlePreview}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="h-[calc(100vh-80px)]">
        {/* 
          Replace this placeholder with your actual FormBuilderLayout component
          Uncomment and adjust the import path above
        */}

        {/* Placeholder for now - replace with actual FormBuilderLayout */}
        <div className="h-full flex items-center justify-center bg-white">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Form Builder Component
            </h2>
            <p className="text-gray-600 mb-6">
              This is where your FormBuilderLayout component will be rendered.
              The form data is loaded and ready to be passed to the builder.
            </p>

            {/* Form Info Display */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-medium text-gray-900 mb-2">
                Form Data Ready:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID: {form.id}</li>
                <li>• Title: {form.title}</li>
                <li>• Fields: {form.fields.length}</li>
                <li>• Theme: {JSON.stringify(form.theme)}</li>
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleSave(form)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3"
                disabled={saving}
              >
                Test Save
              </button>
              <button
                onClick={() => handlePublish(form)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={saving}
              >
                Test Publish
              </button>
            </div>
          </div>
        </div>

        {/* 
          Uncomment this when you're ready to integrate with your FormBuilderLayout:
          
          <FormBuilderLayout
            initialForm={form}
            onSave={handleSave}
            onPublish={handlePublish}
            onPreview={handlePreview}
            onError={handleError}
            autoSaveInterval={30000}
            enablePersistence={true}
          />
        */}
      </div>
    </div>
  );
}
