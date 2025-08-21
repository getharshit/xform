// Quick test - create this as a temporary page for debugging
// src/app/debug-form/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DebugFormPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [formId, setFormId] = useState("AGoEVZ");
  const [newFormId, setNewFormId] = useState("");

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Test 1: Check if API endpoint exists
  const testAPI = async () => {
    addResult("🔍 Testing API endpoint...");
    try {
      const response = await fetch(`/api/forms/${formId}`);
      const data = await response.json();

      if (response.ok) {
        addResult(`✅ API works! Form found: ${data.title}`);
        addResult(`📝 Form has ${data.fields?.length || 0} fields`);
      } else {
        addResult(`❌ API returned ${response.status}: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ API request failed: ${error}`);
    }
  };

  // Test 2: Create a new form
  const createTestForm = async () => {
    addResult("🔧 Creating test form...");

    const testForm = {
      title: "Debug Test Form",
      description: "A form created for debugging",
      fields: [
        {
          id: "name",
          type: "shortText",
          label: "Your Name",
          required: true,
          placeholder: "Enter your name",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "your@email.com",
        },
      ],
    };

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testForm),
      });

      const data = await response.json();

      if (response.ok) {
        addResult(`✅ Form created! ID: ${data.id}`);
        setNewFormId(data.id);
        addResult(`🔗 Test URL: http://localhost:3000/forms/${data.id}`);
      } else {
        addResult(`❌ Form creation failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Form creation error: ${error}`);
    }
  };

  // Test 3: List all forms
  const listForms = async () => {
    addResult("📋 Listing all forms...");
    try {
      const response = await fetch("/api/forms");
      const data = await response.json();

      if (response.ok) {
        // Handle both wrapped and unwrapped response formats
        const forms = data.forms || data;
        addResult(`✅ Found ${forms?.length || 0} forms`);
        if (Array.isArray(forms)) {
          forms.slice(0, 3).forEach((form: any) => {
            addResult(`📄 ${form.id}: ${form.title}`);
          });
        }
      } else {
        addResult(`❌ Failed to list forms: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ List forms error: ${error}`);
    }
  };

  // Test 4: Test page route
  const testPageRoute = async () => {
    addResult("🌐 Testing page route...");
    const testId = newFormId || formId;
    try {
      const response = await fetch(`/forms/${testId}`);
      if (response.ok) {
        addResult(`✅ Page route works for form ${testId}`);
      } else {
        addResult(`❌ Page route failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Page route error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🐛 Form Debug Tools</CardTitle>
          <p className="text-muted-foreground">
            Test your form system and debug the 404 issue
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Form ID to Test:</label>
              <Input
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                placeholder="Enter form ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Form ID:</label>
              <Input
                value={newFormId}
                readOnly
                placeholder="Will be set after creating form"
              />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={testAPI} variant="outline">
              Test API
            </Button>
            <Button onClick={createTestForm} variant="outline">
              Create Form
            </Button>
            <Button onClick={listForms} variant="outline">
              List Forms
            </Button>
            <Button onClick={testPageRoute} variant="outline">
              Test Page
            </Button>
          </div>

          <Button
            onClick={() => setTestResults([])}
            variant="secondary"
            className="w-full"
          >
            Clear Results
          </Button>

          {/* Quick Links */}
          {newFormId && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">
                ✅ Form Created!
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  Form ID:{" "}
                  <code className="bg-green-100 px-1 rounded">{newFormId}</code>
                </p>
                <p>
                  <a
                    href={`/forms/${newFormId}`}
                    target="_blank"
                    className="text-green-600 hover:underline"
                  >
                    🔗 Open Form: /forms/{newFormId}
                  </a>
                </p>
                <p>
                  <a
                    href={`/api/forms/${newFormId}`}
                    target="_blank"
                    className="text-green-600 hover:underline"
                  >
                    🔗 Test API: /api/forms/{newFormId}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            <h3 className="font-medium mb-2">Test Results:</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">
                  Click a test button to see results...
                </p>
              ) : (
                testResults.map((result, i) => <div key={i}>{result}</div>)
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
