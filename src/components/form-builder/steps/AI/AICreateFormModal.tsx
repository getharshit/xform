// src/components/AICreateFormModal.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AICreateFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AICreateFormModal({
  onClose,
  onSuccess,
}: AICreateFormModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter a description for your form");
      return;
    }

    try {
      setLoading(true);

      // Call AI form generation endpoint
      const response = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate form");
      }

      const newForm = await response.json();

      // Redirect to form builder
      window.location.href = `/forms/${newForm.id}/builder`;
    } catch (err) {
      toast.error(
        "Failed to generate form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          ✨ Create Form with AI
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="ai-prompt">Describe your form</Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1"
              placeholder="e.g., I want a customer feedback form for a coffee shop with questions about service quality, coffee taste, and overall experience"
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {prompt.length}/500 characters
            </div>
          </div>

          <div className="mb-6 p-3 bg-purple-50 rounded border border-purple-200">
            <h4 className="text-sm font-medium text-purple-800 mb-2">
              ✨ AI will create:
            </h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Relevant form fields based on your description</li>
              <li>• Appropriate field types and options</li>
              <li>• Professional form title and description</li>
              <li>• Optimized field order and validation</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </span>
              ) : (
                "✨ Generate Form"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
