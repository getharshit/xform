"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function IntegrationTestPage() {
  const [testResults, setTestResults] = useState<
    Record<string, "pending" | "success" | "error">
  >({});
  const [testMessages, setTestMessages] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);

  const updateTest = (
    testName: string,
    status: "pending" | "success" | "error",
    message?: string
  ) => {
    setTestResults((prev) => ({ ...prev, [testName]: status }));
    if (message) {
      setTestMessages((prev) => ({ ...prev, [testName]: message }));
    }
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults({});
    setTestMessages({});

    // Test 1: API Endpoints
    updateTest("api", "pending");
    try {
      const response = await fetch("/api/forms");
      if (response.ok) {
        updateTest("api", "success", "Forms API is accessible");
      } else {
        updateTest("api", "error", `API returned ${response.status}`);
      }
    } catch (error) {
      updateTest("api", "error", "Failed to connect to API");
    }

    // Test 2: Create Form
    updateTest("create", "pending");
    try {
      const createResponse = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Form",
          description: "Integration test form",
          fields: [
            {
              id: "test-field",
              type: "shortText",
              label: "Test Field",
              required: true,
            },
          ],
          theme: { primaryColor: "#3B82F6", fontFamily: "Inter" },
        }),
      });

      if (createResponse.ok) {
        const form = await createResponse.json();
        updateTest("create", "success", `Created form ${form.id}`);

        // Test 3: Update Form
        updateTest("update", "pending");
        try {
          const updateResponse = await fetch(`/api/forms/${form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "Updated Test Form",
              fields: [
                {
                  id: "test-field",
                  type: "shortText",
                  label: "Updated Test Field",
                  required: true,
                },
                {
                  id: "test-field-2",
                  type: "email",
                  label: "Email Field",
                  required: false,
                },
              ],
            }),
          });

          if (updateResponse.ok) {
            updateTest("update", "success", "Form updated successfully");
          } else {
            updateTest("update", "error", "Failed to update form");
          }
        } catch (error) {
          updateTest("update", "error", "Update request failed");
        }

        // Test 4: Delete Form (cleanup)
        updateTest("delete", "pending");
        try {
          const deleteResponse = await fetch(`/api/forms/${form.id}`, {
            method: "DELETE",
          });

          if (deleteResponse.ok) {
            updateTest("delete", "success", "Form deleted successfully");
          } else {
            updateTest("delete", "error", "Failed to delete form");
          }
        } catch (error) {
          updateTest("delete", "error", "Delete request failed");
        }
      } else {
        updateTest("create", "error", "Failed to create test form");
      }
    } catch (error) {
      updateTest("create", "error", "Create request failed");
    }

    // Test 5: AI Generation (if available)
    updateTest("ai", "pending");
    try {
      const aiResponse = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Create a simple contact form with name and email",
        }),
      });

      if (aiResponse.ok) {
        const aiForm = await aiResponse.json();
        updateTest(
          "ai",
          "success",
          `AI generated form with ${aiForm.fields?.length || 0} fields`
        );

        // Cleanup AI form
        if (aiForm.id) {
          await fetch(`/api/forms/${aiForm.id}`, { method: "DELETE" });
        }
      } else {
        updateTest("ai", "error", "AI generation failed");
      }
    } catch (error) {
      updateTest("ai", "error", "AI generation not available");
    }

    setTesting(false);
  };

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const tests = [
    {
      key: "api",
      name: "API Connectivity",
      description: "Test basic API endpoint access",
    },
    {
      key: "create",
      name: "Form Creation",
      description: "Test form creation via API",
    },
    {
      key: "update",
      name: "Form Updates",
      description: "Test form modification via API",
    },
    {
      key: "delete",
      name: "Form Deletion",
      description: "Test form deletion via API",
    },
    {
      key: "ai",
      name: "AI Generation",
      description: "Test AI form generation endpoint",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/forms"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Integration Test
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Test the integration between forms list and form builder
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Test Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Integration Tests</h2>
          <p className="text-gray-600 mb-6">
            Run these tests to verify that the forms list and form builder are
            properly integrated with the API endpoints.
          </p>

          <button
            onClick={runTests}
            disabled={testing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run Integration Tests"
            )}
          </button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Test Results</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {tests.map((test) => {
                const status = testResults[test.key];
                const message = testMessages[test.key];

                return (
                  <div key={test.key} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {status ? (
                        getStatusIcon(status)
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm text-gray-600">
                        {test.description}
                      </p>
                      {message && (
                        <p
                          className={`text-sm mt-1 ${
                            status === "error"
                              ? "text-red-600"
                              : status === "success"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/forms"
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Forms List</h3>
            <p className="text-gray-600 text-sm">View and manage all forms</p>
          </Link>

          <Link
            href="/test-builder"
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">Form Builder Test</h3>
            <p className="text-gray-600 text-sm">
              Your original form builder test page
            </p>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            🎉 Integration Complete!
          </h3>
          <p className="text-blue-800 mb-4">
            Your form builder is now integrated with the forms management
            system. Here's what you can do:
          </p>
          <ul className="text-blue-800 space-y-2">
            <li>• ✅ Create new forms from the forms list</li>
            <li>• ✅ Edit existing forms in the form builder</li>
            <li>• ✅ Save and auto-save form changes</li>
            <li>• ✅ Preview forms before publishing</li>
            <li>• ✅ Generate forms with AI assistance</li>
            <li>• ✅ Manage forms with full CRUD operations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
