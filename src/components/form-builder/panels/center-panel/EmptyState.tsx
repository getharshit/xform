// 🔧 FIXED EmptyState with proper form initialization
// File: src/components/form-builder/panels/center-panel/EmptyState.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageSquare,
  CheckSquare,
  Mail,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useBuilder } from "../../providers/BuilderProvider";

export interface EmptyStateProps {
  onAddField?: (fieldType: string) => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddField,
  className = "",
}) => {
  const { state, addFieldByType, updateForm, dispatch } = useBuilder();

  // Quick action field types
  const quickActions = [
    {
      type: "multipleChoice",
      label: "Multiple Choice",
      description: "Let users select from multiple options",
      icon: CheckSquare,
      color: "bg-blue-500",
      popular: true,
    },
    {
      type: "shortText",
      label: "Short Text",
      description: "Single line text input",
      icon: MessageSquare,
      color: "bg-green-500",
      popular: true,
    },
    {
      type: "email",
      label: "Email Address",
      description: "Collect email addresses with validation",
      icon: Mail,
      color: "bg-purple-500",
      popular: true,
    },
  ];

  const handleQuickAction = (fieldType: string) => {
    console.log("🎯 EmptyState: Quick action clicked:", fieldType);
    console.log("🔍 Current state:", {
      hasForm: !!state.form,
      formId: state.form?.id,
      formTitle: state.form?.title,
    });

    // If no form exists, create one first
    if (!state.form) {
      console.log("📝 No form exists, creating new form...");

      const newForm = {
        id: `form-${Date.now()}`, // Temporary ID
        title: "Untitled Form",
        description: "",
        fields: [],
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        theme: {},
        customization: {},
      };

      // Create form first
      dispatch({
        type: "SET_FORM",
        payload: { form: newForm, saveToHistory: false },
      });

      // Small delay to ensure form is set, then add field
      setTimeout(() => {
        console.log("✅ Form created, now adding field:", fieldType);
        if (onAddField) {
          onAddField(fieldType);
        } else {
          addFieldByType(fieldType);
        }
      }, 10);
    } else {
      // Form exists, add field directly
      console.log("✅ Form exists, adding field:", fieldType);
      if (onAddField) {
        onAddField(fieldType);
      } else {
        addFieldByType(fieldType);
      }
    }
  };

  return (
    <div className={`bg-background ${className}`}>
      <Card className="min-h-[600px] border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-12 space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Let's build something amazing
            </h2>
            <p className="text-muted-foreground max-w-md text-lg">
              Start with one of these popular field types, or explore all
              options in the left panel
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.type}
                  className="relative group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-200"
                  onClick={() => handleQuickAction(action.type)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    {/* Popular badge */}
                    {action.popular && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 text-xs bg-orange-100 text-orange-700 border-orange-200"
                      >
                        Popular
                      </Badge>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-base">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Action indicator */}
                    <div className="flex items-center justify-center gap-1 text-primary group-hover:gap-2 transition-all">
                      <span className="text-sm font-medium">Add Field</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Options */}
          <div className="space-y-4 pt-4 border-t border-muted-foreground/10 w-full max-w-md">
            <div className="flex items-center gap-4 justify-center">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleQuickAction("shortText")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Any Field
              </Button>

              <Button variant="ghost" className="flex-1">
                Browse Templates
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
              <p className="flex items-center gap-2 justify-center">
                <span>💡</span>
                <span>
                  Tip: You can also drag field types from the left panel
                </span>
              </p>
            </div>
          </div>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-muted-foreground bg-gray-100 p-2 rounded mt-4">
              Debug: Form exists: {state.form ? "Yes" : "No"} | Form ID:{" "}
              {state.form?.id || "None"} | Fields:{" "}
              {state.form?.fields?.length || 0}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
