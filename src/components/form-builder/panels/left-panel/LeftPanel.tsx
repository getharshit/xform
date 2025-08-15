// src/components/form-builder/panels/left-panel/LeftPanel.tsx

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Type,
  Mail,
  Star,
  Settings,
  GripVertical,
} from "lucide-react";

export interface LeftPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  collapsed = false,
  onToggleCollapse,
  className = "",
}) => {
  // Mock added questions - this would come from form state
  const addedQuestions = [
    { id: "question-1", type: "shortText", label: "Full Name", icon: Type },
    { id: "question-2", type: "email", label: "Email Address", icon: Mail },
    {
      id: "question-3",
      type: "numberRating",
      label: "Rate our service",
      icon: Star,
    },
  ];

  if (collapsed) {
    return (
      <div
        className={`w-12 border-r bg-card flex flex-col items-center py-4 ${className}`}
      >
        <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`border-r bg-card flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Added questions</h3>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{addedQuestions.length} questions</span>
          <Badge variant="outline">{addedQuestions.length}</Badge>
        </div>
      </div>

      {/* Added Questions List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {addedQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No questions added yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the "Add Question" button to start
              </p>
            </div>
          ) : (
            addedQuestions.map((question, index) => {
              const IconComponent = question.icon;
              return (
                <Card
                  key={question.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {question.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm truncate">
                          {question.label}
                        </h4>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
