// src/app/test-api/page.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TestResult {
  endpoint: string;
  method: string;
  status: "PASS" | "FAIL" | "RUNNING";
  statusCode?: number;
  error?: string;
  data?: any;
  duration?: number;
}

export default function APITestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState("");

  const updateResult = (result: TestResult) => {
    setResults((prev) => {
      const existing = prev.findIndex(
        (r) => r.endpoint === result.endpoint && r.method === result.method
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const makeRequest = async (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ): Promise<TestResult> => {
    const start = Date.now();

    // Add running state
    updateResult({
      endpoint,
      method,
      status: "RUNNING",
    });

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const duration = Date.now() - start;
      const data = await response.json();

      const result: TestResult = {
        endpoint,
        method,
        status: response.ok ? "PASS" : "FAIL",
        statusCode: response.status,
        data,
        duration,
      };

      if (!response.ok) {
        result.error = data.error || `HTTP ${response.status}`;
      }

      updateResult(result);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      const result: TestResult = {
        endpoint,
        method,
        status: "FAIL",
        error: error instanceof Error ? error.message : "Unknown error",
        duration,
      };

      updateResult(result);
      return result;
    }
  };

  const getSampleForm = () => ({
    title: "API Test Form",
    description: "Testing form creation via API",
    prompt: "Create a test form",
    fields: [
      {
        id: "name",
        type: "shortText",
        label: "Name",
        required: true,
        placeholder: "Your name",
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "your@email.com",
      },
      {
        id: "rating",
        type: "numberRating",
        label: "Rating",
        required: false,
        minRating: 1,
        maxRating: 5,
      },
    ],
    theme: {
      primaryColor: "#3B82F6",
      fontFamily: "Inter, sans-serif",
    },
    customization: {},
    layout: {
      type: "singleColumn",
      options: { maxWidth: 600 },
    },
    settings: {
      allowMultipleSubmissions: true,
      collectIPAddress: true,
    },
  });

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    let createdFormId = "";

    try {
      // Test 1: Health Check
      setCurrentTest("Health Check");
      await makeRequest("/api/health");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UI

      // Test 2: Create Form
      setCurrentTest("Creating Form");
      const createResult = await makeRequest(
        "/api/forms",
        "POST",
        getSampleForm()
      );
      if (createResult.status === "PASS") {
        createdFormId = createResult.data?.id;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!createdFormId) {
        console.error("Could not create form, stopping tests");
        return;
      }

      // Test 3: Get All Forms
      setCurrentTest("Getting All Forms");
      await makeRequest("/api/forms");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 4: Get Single Form
      setCurrentTest("Getting Single Form");
      await makeRequest(`/api/forms/${createdFormId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 5: Update Form
      setCurrentTest("Updating Form");
      await makeRequest(`/api/forms/${createdFormId}`, "PUT", {
        title: "Updated API Test Form",
      });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 6: Submit Response
      setCurrentTest("Submitting Response");
      await makeRequest(`/api/forms/${createdFormId}/submit`, "POST", {
        data: {
          name: "John Doe",
          email: "john@example.com",
          rating: 5,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 7: Get Responses
      setCurrentTest("Getting Responses");
      await makeRequest(`/api/forms/${createdFormId}/responses`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 8: Analytics
      setCurrentTest("Getting Analytics");
      await makeRequest(`/api/forms/${createdFormId}/analytics`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 9: Export
      setCurrentTest("Testing Export");
      await makeRequest(`/api/forms/${createdFormId}/export?format=json`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 10: QR Code
      setCurrentTest("Generating QR Code");
      await makeRequest("/api/qr/generate", "POST", {
        url: `${window.location.origin}/form/${createdFormId}`,
        size: 200,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Test 11: Delete Form (last)
      setCurrentTest("Deleting Form");
      await makeRequest(`/api/forms/${createdFormId}`, "DELETE");
    } catch (error) {
      console.error("Test suite error:", error);
    } finally {
      setIsRunning(false);
      setCurrentTest("");
    }
  };

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const running = results.filter((r) => r.status === "RUNNING").length;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">API Test Suite</h1>
        <p className="text-gray-600">Test all form builder API endpoints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run comprehensive tests on all API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>

            {isRunning && currentTest && (
              <div className="text-sm text-gray-600">
                Current: <span className="font-medium">{currentTest}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <div className="flex gap-4 text-sm">
              <Badge variant="default">{passed} Passed</Badge>
              <Badge variant="destructive">{failed} Failed</Badge>
              {running > 0 && (
                <Badge variant="secondary">{running} Running</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        result.status === "PASS"
                          ? "default"
                          : result.status === "FAIL"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {result.method}
                    </Badge>
                    <span className="font-mono text-sm">{result.endpoint}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.duration && (
                      <span className="text-xs text-gray-500">
                        {result.duration}ms
                      </span>
                    )}
                    {result.statusCode && (
                      <Badge variant="outline">{result.statusCode}</Badge>
                    )}
                    {result.status === "PASS" && (
                      <span className="text-green-600">✓</span>
                    )}
                    {result.status === "FAIL" && (
                      <span className="text-red-600">✗</span>
                    )}
                    {result.status === "RUNNING" && (
                      <span className="text-blue-600">⏳</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {failed > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-red-600 mb-2">Failed Tests:</h4>
                <div className="space-y-1">
                  {results
                    .filter((r) => r.status === "FAIL")
                    .map((result, index) => (
                      <div key={index} className="text-sm text-red-600">
                        <span className="font-mono">
                          {result.method} {result.endpoint}:
                        </span>{" "}
                        {result.error}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
