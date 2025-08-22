// src/app/forms/[id]/page.tsx

"use client";

import { useState, useEffect, use } from "react";
import { PublicFormRenderer } from "@/components/public-form";
import type { Form } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// Simple Skeleton component if not available in UI
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

interface FormPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    embed?: string;
    branding?: string;
    header?: string;
    footer?: string;
  }>;
}

export default function FormPage({ params, searchParams }: FormPageProps) {
  // Unwrap params and searchParams using React.use()
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle embed mode using resolved searchParams
  const isEmbedMode = resolvedSearchParams.embed === "true";
  const showHeader = resolvedSearchParams.header !== "false";
  const showFooter = resolvedSearchParams.footer !== "false";
  const showBranding = resolvedSearchParams.branding !== "false";

  // Fetch form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/forms/${resolvedParams.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("not-found");
            return;
          }
          throw new Error(`Failed to fetch form: ${response.status}`);
        }

        const formData = await response.json();
        setForm(formData);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(err instanceof Error ? err.message : "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [resolvedParams.id]);

  // Handle form submission
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`/api/forms/${resolvedParams.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simulate form fields loading */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - Not found
  if (error === "not-found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto py-12 px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle>Form Not Found</CardTitle>
              <p className="text-muted-foreground">
                The form you're looking for doesn't exist or has been removed.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    If you believe this is an error, please contact the form
                    creator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - Other errors
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto py-12 px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-destructive">
                Error Loading Form
              </CardTitle>
              <p className="text-muted-foreground">{error}</p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No form data
  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Form not available</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Embedded form - minimal styling
  if (isEmbedMode) {
    return (
      <div className="min-h-screen bg-background">
        <div
          className={`${!showHeader ? "pt-0" : ""} ${
            !showFooter ? "pb-0" : ""
          }`}
        >
          <PublicFormRenderer
            form={form}
            onSubmit={handleSubmit}
            readonly={false}
            showValidation={true}
          />
        </div>
        {showBranding && showFooter && (
          <div className="text-center py-4 text-xs text-muted-foreground border-t">
            Powered by Your Forms Platform
          </div>
        )}
      </div>
    );
  }

  const isPreviewMode = !form?.published;
  const handlePreviewSubmit = async (formData: Record<string, any>) => {
    // For preview mode, just show a message instead of actually submitting
    toast.error(
      "This is preview mode. Publish your form to collect real responses!"
    );
    return;
  };

  // Full page form
  return (
    <div className="min-h-screen bg-background">
      {/* Optional header/nav can go here */}
      {isPreviewMode && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Preview Mode</p>
                <p className="text-sm text-yellow-700">
                  This form is not published. Only you can see this preview.
                </p>
              </div>
            </div>
            <div className="text-sm text-yellow-700">
              Publish your form to start collecting responses
            </div>
          </div>
        </div>
      )}
      <main>
        <PublicFormRenderer
          form={form}
          onSubmit={isPreviewMode ? handlePreviewSubmit : handleSubmit}
          readonly={false}
          showValidation={true}
        />
      </main>

      {/* Optional footer */}
      {showBranding && (
        <footer className="text-center py-8 text-sm text-muted-foreground border-t mt-12">
          <p>Powered by Your Forms Platform</p>
        </footer>
      )}
    </div>
  );
}
