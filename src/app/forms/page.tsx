"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Edit,
  Trash2,
  Copy,
  Badge,
} from "lucide-react";
import Link from "next/link";
import { AICreateFormModal } from "@/components/form-builder/steps/AI/AICreateFormModal";
import { toast, Toaster } from "sonner";

// Types based on your API response
import type { Form } from "@/types";

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAICreateModal, setShowAICreateModal] = useState(false);

  // Fetch forms from API
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      setForms(data.forms || data); // Handle both formats
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search term
  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const handleDeleteForm = async (formId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      // Remove from local state
      setForms(forms.filter((form) => form.id !== formId));
    } catch (err) {
      toast.error(
        "Failed to delete form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleDuplicateForm = async (form: Form) => {
    try {
      const response = await fetch(`/api/forms/${form.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch form details");
      }

      const fullForm = await response.json();

      // Create duplicate with modified title
      const duplicateData = {
        title: `${form.title} (Copy)`,
        description: form.description,
        fields: fullForm.fields,
        theme: fullForm.theme,
        prompt: fullForm.prompt,
      };

      const createResponse = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicateData),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to duplicate form");
      }

      // Refresh forms list
      fetchForms();
    } catch (err) {
      toast.error(
        "Failed to duplicate form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium">Error Loading Forms</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchForms}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
              <p className="text-gray-600 mt-1">
                Create and manage your forms ({forms.length} total)
              </p>
            </div>
            {/* Create Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAICreateModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create with AI
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Form
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No forms found" : "No forms yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first form"}
            </p>
            {!searchTerm && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setShowAICreateModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Create with AI
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Your First Form
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {form.title}
                    </h3>
                    {/* 🆕 ADD PUBLISH STATUS BADGE */}

                    {!form.published && (
                      <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                    )}

                    {form.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {form.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{form.responseCount || 0} responses</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created{" "}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/forms/${form.id}/builder`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Form"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDuplicateForm(form)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Duplicate Form"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteForm(form.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modals */}
      {showCreateModal && (
        <CreateFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchForms();
          }}
        />
      )}

      {showAICreateModal && (
        <AICreateFormModal
          onClose={() => setShowAICreateModal(false)}
          onSuccess={() => {
            setShowAICreateModal(false);
            fetchForms();
          }}
        />
      )}
    </div>
  );
}

// Create Form Modal Component
function CreateFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          fields: [], // Start with empty fields
          theme: {
            primaryColor: "#3B82F6",
            fontFamily: "Inter",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create form");
      }

      const newForm = await response.json();

      // Redirect to form builder
      window.location.href = `/forms/${newForm.id}/builder`;
    } catch (err) {
      toast.error(
        "Failed to create form: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Customer Feedback Form"
              maxLength={100}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your form"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
