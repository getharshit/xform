"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Import your existing form renderer component
// import { PublicFormRenderer } from '@/components/public-form/PublicFormRenderer';

interface Form {
  id: string;
  title: string;
  description: string | null;
  fields: any[];
  theme: any;
  settings?: any;
}

export default function FormViewPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Loading Form
          </h2>
          <p className="text-gray-600">Please wait while we load the form...</p>
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
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-red-800 mb-2">
              Form Not Available
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-green-800 mb-2">
              Thank You!
            </h2>
            <p className="text-green-700">
              Your response has been submitted successfully.
            </p>
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
          <p className="text-gray-600">
            The form you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply theme styles */}
      <style jsx>{`
        :root {
          --primary-color: ${form.theme?.primaryColor || "#3B82F6"};
          --font-family: ${form.theme?.fontFamily ||
          "Inter, system-ui, sans-serif"};
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Submission Error</h3>
                <p className="text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 
            Replace this placeholder with your actual PublicFormRenderer component
            Uncomment and adjust the import path above
          */}

          {/* Placeholder for now - replace with actual PublicFormRenderer */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Form Renderer Component
            </h2>
            <p className="text-gray-600 mb-6">
              This is where your PublicFormRenderer component will be rendered.
              The form data is loaded and ready to be passed to the renderer.
            </p>

            {/* Form Info Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Form Data Ready:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID: {form.id}</li>
                <li>• Title: {form.title}</li>
                <li>• Fields: {form.fields.length}</li>
                <li>• Theme: {form.theme?.primaryColor || "Default"}</li>
              </ul>
            </div>

            {/* Test Form Fields */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Fields Preview:</h3>
              {form.fields.map((field, index) => (
                <div
                  key={field.id || index}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-sm text-gray-600">
                    Type: {field.type}
                  </div>
                  {field.required && (
                    <div className="text-sm text-red-600">Required</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleSubmit({ test: "data" })}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Test Submit"
                )}
              </button>
            </div>
          </div>

          {/* 
            Uncomment this when you're ready to integrate with your PublicFormRenderer:
            
            <PublicFormRenderer
              form={form}
              onSubmit={handleSubmit}
              readonly={false}
              showValidation={true}
            />
          */}
        </div>
      </div>
    </div>
  );
}
