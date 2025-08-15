"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  BarChart3,
  FormInput,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Form {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  responseCount: number;
}

interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  responsesToday: number;
  averageCompletionRate: number;
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalResponses: 0,
    responsesToday: 0,
    averageCompletionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load forms
      const formsResponse = await fetch("/api/forms");
      if (formsResponse.ok) {
        const formsData = await formsResponse.json();
        setForms(formsData.slice(0, 5)); // Show only recent 5 forms

        // Calculate stats
        const totalForms = formsData.length;
        const totalResponses = formsData.reduce(
          (sum: number, form: Form) => sum + form.responseCount,
          0
        );

        setStats({
          totalForms,
          totalResponses,
          responsesToday: Math.floor(totalResponses * 0.1), // Mock: 10% of total
          averageCompletionRate: 85, // Mock completion rate
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with your forms.
              </p>
            </div>
            <Link
              href="/forms/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Form
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalForms}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FormInput className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Responses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalResponses}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Responses Today
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.responsesToday}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Avg. Completion
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageCompletionRate}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Forms
                </h2>
                <Link
                  href="/forms"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {forms.length === 0 ? (
                <div className="text-center py-8">
                  <FormInput className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No forms yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first form to get started
                  </p>
                  <Link
                    href="/forms/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Create Your First Form
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {form.title}
                        </h3>
                        {form.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                            {form.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{form.responseCount} responses</span>
                          <span>
                            Created{" "}
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/forms/${form.id}/builder`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/form/${form.id}`}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          target="_blank"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/forms/new"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Create New Form
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Start building a new form from scratch
                    </p>
                  </div>
                </Link>

                <Link
                  href="/forms"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                    <FormInput className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Forms</h3>
                    <p className="text-gray-600 text-sm">
                      View and edit your existing forms
                    </p>
                  </div>
                </Link>

                <Link
                  href="/analytics"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      View Analytics
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Check your form performance and responses
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
