// src/components/form-builder/steps/ShareStep.tsx

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Share2,
  QrCode,
  Link,
  Code,
  Download,
  ExternalLink,
  Check,
  RefreshCw,
  Globe,
  Lock,
  Eye,
  Settings,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
} from "lucide-react";
import { useBuilder } from "../providers/BuilderProvider";
import { CenterPanel } from "../panels/center-panel/CenterPanel";
import { toast } from "sonner";

interface ShareStepProps {
  step: string;
}

interface QRCodeData {
  qrCodeDataUrl: string;
  size: number;
  format: string;
}

export const ShareStep: React.FC<ShareStepProps> = ({ step }) => {
  const { state, publishForm, hasUnsavedChanges } = useBuilder();
  const { form } = state;

  // Share state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(form?.id ? true : false);
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [showLinkSettings, setShowLinkSettings] = useState(false);

  // Link preview settings
  const [linkPreview, setLinkPreview] = useState({
    title: form?.title || "Untitled Form",
    description: form?.description || "Please fill out this form",
    showBranding: true,
  });

  // Generate form URL
  const formUrl = useMemo(() => {
    if (!form?.id) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/forms/${form.id}`; // Changed from /form/ to /forms/
  }, [form?.id]);

  // Auto-generate QR Code when published
  const generateQRCode = useCallback(async () => {
    if (!formUrl) return;

    setIsGeneratingQR(true);
    try {
      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formUrl,
          size: 200,
          format: "png",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate QR code");

      const data = await response.json();
      setQrCode(data);
    } catch (error) {
      console.error("QR generation failed:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGeneratingQR(false);
    }
  }, [formUrl]);

  // Auto-generate QR code when form is published
  useEffect(() => {
    if (isPublished && formUrl && !qrCode && !isGeneratingQR) {
      generateQRCode();
    }
  }, [isPublished, formUrl, qrCode, isGeneratingQR, generateQRCode]);

  // Copy to clipboard with feedback
  const copyToClipboard = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      toast.success("Copied to clipboard");

      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  // Publish form
  const handlePublish = useCallback(async () => {
    if (hasUnsavedChanges) {
      toast.error("Please save your form before publishing");
      return;
    }

    setIsPublishing(true);
    try {
      const success = await publishForm();
      if (success) {
        setIsPublished(true);
        toast.success("Form published successfully!");
      }
    } catch (error) {
      toast.error("Failed to publish form");
    } finally {
      setIsPublishing(false);
    }
  }, [hasUnsavedChanges, publishForm]);

  // Generate embed code
  const embedCode = useMemo(() => {
    if (!formUrl) return "";
    return `<iframe src="${formUrl}?embed=true" width="100%" height="600" frameborder="0"></iframe>`;
  }, [formUrl]);

  // Social sharing URLs
  const socialUrls = useMemo(() => {
    if (!formUrl) return {};
    const text = `Check out this form: ${linkPreview.title}`;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        formUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        formUrl
      )}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        formUrl
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        linkPreview.title
      )}&body=${encodeURIComponent(
        `${linkPreview.description}\n\n${formUrl}`
      )}`,
    };
  }, [formUrl, linkPreview.title, linkPreview.description]);

  if (!form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Form to Share</h3>
          <p className="text-muted-foreground">
            Create a form first to share it
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-background">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Share</h2>
            <p className="text-muted-foreground">
              Publish and share your form with the world
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isPublished && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Draft
              </Badge>
            )}
            {isPublished && (
              <Badge className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Live
              </Badge>
            )}
          </div>
        </div>
        <Button
          onClick={handlePublish}
          disabled={isPublishing || hasUnsavedChanges}
          size="lg"
        >
          {isPublishing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 mr-2" />
          )}
          {isPublished ? "Update" : "Publish"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {!isPublished ? (
          // Unpublished state
          <div className="w-full flex items-center justify-center">
            <Card className="max-w-md text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Publish to Share</CardTitle>
                <p className="text-muted-foreground">
                  Your form needs to be published before you can share it
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || hasUnsavedChanges}
                  className="w-full"
                  size="lg"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Publish Form
                    </>
                  )}
                </Button>
                {hasUnsavedChanges && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Save your form first before publishing
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Published state - 60/40 split with bento grid
          <>
            {/* Left - Form Preview (60%) */}
            <div className="w-[60%] bg-muted/20">
              <CenterPanel previewMode={true} step="share" />
            </div>

            {/* Right - Bento Grid Share Options (40%) */}
            <div className="w-[40%] bg-background border-l">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {/* Bento Grid Layout */}
                  <div className="grid grid-cols-12 gap-4 h-full">
                    {/* Share Link - Full Width */}
                    <Card className="col-span-12 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Link className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Share Link</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(formUrl, "link")}
                            className="flex-1"
                            variant={copiedStates.link ? "default" : "outline"}
                          >
                            {copiedStates.link ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(formUrl, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded truncate">
                          {formUrl}
                        </div>
                      </div>
                    </Card>

                    {/* Social Share - Left Half */}
                    <Card className="col-span-6 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <h3 className="font-semibold text-sm">Social</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(socialUrls.facebook, "_blank")
                          }
                          className="p-2"
                        >
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(socialUrls.twitter, "_blank")
                          }
                          className="p-2"
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(socialUrls.linkedin, "_blank")
                          }
                          className="p-2"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(socialUrls.email, "_blank")
                          }
                          className="p-2"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    {/* QR Code - Right Half */}
                    <Card className="col-span-6 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-4 h-4 text-green-500" />
                        <h3 className="font-semibold text-sm">QR Code</h3>
                      </div>
                      {qrCode ? (
                        <div className="text-center space-y-2">
                          <div className="bg-white p-2 rounded border inline-block">
                            <img
                              src={qrCode.qrCodeDataUrl}
                              alt="QR Code"
                              className="w-16 h-16"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.download = `form-qr-${form?.id}.png`;
                              link.href = qrCode.qrCodeDataUrl;
                              link.click();
                              toast.success("QR code downloaded");
                            }}
                            className="w-full text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          {isGeneratingQR ? (
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                          ) : (
                            <Button
                              onClick={generateQRCode}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <QrCode className="w-3 h-3 mr-1" />
                              Generate
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>

                    {/* Embed Code - Full Width */}
                    <Card className="col-span-12 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-purple-500" />
                        <h3 className="font-semibold">Embed Code</h3>
                      </div>
                      <div className="space-y-3">
                        <Textarea
                          value={embedCode}
                          readOnly
                          rows={3}
                          className="font-mono text-xs resize-none"
                        />
                        <Button
                          onClick={() => copyToClipboard(embedCode, "embed")}
                          variant="outline"
                          className="w-full"
                        >
                          {copiedStates.embed ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied Code!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Embed Code
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>

                    {/* Analytics - Left */}
                    <Card className="col-span-6 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Monitor className="w-4 h-4 text-orange-500" />
                        <h3 className="font-semibold text-sm">Views</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">
                          Total views
                        </div>
                      </div>
                    </Card>

                    {/* Responses - Right */}
                    <Card className="col-span-6 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="w-4 h-4 text-pink-500" />
                        <h3 className="font-semibold text-sm">Responses</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-xs text-muted-foreground">
                          Submissions
                        </div>
                      </div>
                    </Card>

                    {/* Settings Dialog Trigger - Full Width */}
                    <Dialog
                      open={showLinkSettings}
                      onOpenChange={setShowLinkSettings}
                    >
                      <DialogTrigger asChild>
                        <Card className="col-span-12 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-slate-500" />
                              <h3 className="font-semibold">Link Settings</h3>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Customize title, description, and visibility
                          </p>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Link Settings</DialogTitle>
                          <DialogDescription>
                            Customize how your form appears when shared
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={linkPreview.title}
                              onChange={(e) =>
                                setLinkPreview((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={linkPreview.description}
                              onChange={(e) =>
                                setLinkPreview((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="search-results">
                              Show in search results
                            </Label>
                            <Switch
                              id="search-results"
                              checked={linkPreview.showBranding}
                              onCheckedChange={(checked) =>
                                setLinkPreview((prev) => ({
                                  ...prev,
                                  showBranding: checked,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
