// 🔧 STEP 1: Create the ShareStep component
// File: src/components/form-builder/steps/ShareStep.tsx

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Share2,
  Link2,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Eye,
  Users,
  Calendar,
  Download,
} from "lucide-react";
import { useBuilder } from "../providers/BuilderProvider";

interface ShareStepProps {
  step: string;
  onPublish?: () => Promise<boolean>;
}

export const ShareStep: React.FC<ShareStepProps> = ({ step, onPublish }) => {
  const { state, publishForm } = useBuilder();
  const { form } = state;
  const [copied, setCopied] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Check if form is published and has unsaved changes
  const isPublished = form?.published || false;
  const hasUnsavedChanges = state.autoSave.hasUnsavedChanges;
  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/forms/${form?.id}`;

  const handlePublish = async () => {
    if (!form) {
      console.log("FORM not FOUND");
      return;
    }

    try {
      setIsPublishing(true);

      if (onPublish) {
        await onPublish();
      } else {
        await publishForm();
      }
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const generateQRCode = () => {
    // This would call your QR generation API
    window.open(
      `/api/qr/generate?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this form: ${form?.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        form?.title || "Form"
      )}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    };

    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank");
    }
  };

  // UNPUBLISHED STATE - Show publish prompt
  if (!isPublished) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          {/* Warning Icon */}
          <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>

          {/* Main Message */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Publish Your Form to Share
            </h2>
            <p className="text-gray-600 mb-4">
              Your form is currently in draft mode. Publish it to make it
              available to the public and start collecting responses.
            </p>
          </div>

          {/* Form Status */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Draft
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Fields:</span>
              <span className="font-medium">
                {form?.fields?.length || 0} questions
              </span>
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Changes:</span>
                <Badge variant="destructive" className="text-xs">
                  Unsaved changes
                </Badge>
              </div>
            )}
          </div>

          {/* Publish Button */}
          <div className="space-y-3">
            {hasUnsavedChanges && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ You have unsaved changes. They will be saved when you
                publish.
              </p>
            )}

            <Button
              onClick={handlePublish}
              disabled={isPublishing || !form?.fields?.length}
              className="w-full"
              size="lg"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Publish Form
                </>
              )}
            </Button>

            {!form?.fields?.length && (
              <p className="text-sm text-red-600">
                Add at least one question before publishing.
              </p>
            )}
          </div>

          {/* Preview Link */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Preview your form:</p>
            <Button
              variant="outline"
              onClick={() => window.open(shareUrl, "_blank")}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Open Preview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // PUBLISHED STATE - Show sharing options
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Form Published Successfully! 🎉
            </h1>
            <p className="text-gray-600">
              Your form is now live and ready to collect responses.
            </p>
          </div>

          {/* Status Badge */}
          <Badge
            variant="default"
            className="flex items-center gap-1 w-fit mx-auto"
          >
            <CheckCircle2 className="w-3 h-3" />
            Published
          </Badge>
        </div>

        {/* Form Link Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Form Link
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="form-url">
                Share this link with your audience:
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="form-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleCopy(shareUrl, "url")}
                  className="flex-shrink-0"
                >
                  {copied === "url" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(shareUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={generateQRCode}
                className="flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Generate QR Code
              </Button>
              <span className="text-sm text-gray-500">
                Perfect for print materials and in-person sharing
              </span>
            </div>
          </div>
        </Card>

        {/* Social Sharing */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Sharing
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => shareToSocial("twitter")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-sm">Twitter</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => shareToSocial("facebook")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Facebook className="w-5 h-5" />
              <span className="text-sm">Facebook</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => shareToSocial("linkedin")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => shareToSocial("email")}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Email</span>
            </Button>
          </div>
        </Card>

        {/* Form Analytics Preview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Form Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {form?.fields?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {form?.publishedAt
                  ? new Date(form.publishedAt).toLocaleDateString()
                  : "Today"}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
          </div>
        </Card>

        {/* Additional Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Options</h3>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() =>
                window.open(`/forms/${form?.id}/analytics`, "_blank")
              }
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              View Analytics (Coming Soon)
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                window.open(`/forms/${form?.id}/responses`, "_blank")
              }
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Responses (Coming Soon)
            </Button>
          </div>
        </Card>

        {/* Warning about changes */}
        {hasUnsavedChanges && (
          <Card className="p-4 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Unsaved Changes</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You have unsaved changes to your form. Save your changes to
                  ensure your published form is up to date.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
