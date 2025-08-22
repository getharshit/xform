// src/components/form-builder/field-types/structure-fields/StartingPage.tsx

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Clock, Users, Play } from "lucide-react";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type StartingPageProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
> & {
  totalNonStructureFields?: number; // Add this prop
};

// Starting Page Configuration Component
interface StartingPageConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  hasOtherFields: boolean;
}

const StartingPageConfig: React.FC<StartingPageConfigProps> = ({
  field,
  onUpdateField,
  hasOtherFields,
}) => {
  const [welcomeTitle, setWelcomeTitle] = useState(field.label || "");
  const [welcomeMessage, setWelcomeMessage] = useState(field.description || "");

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Empty State Message */}
      {!hasOtherFields && (
        <Card className="p-4 bg-muted/30 border-dashed text-center">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">This is welcome screen</h4>
            <p className="text-xs text-muted-foreground">
              Use it to welcome your participants and provide instructions.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export const StartingPage: React.FC<StartingPageProps> = (props) => {
  const { field, onUpdateField } = props;

  // We need to get the field count from the builder context
  // For now, we'll add this as a prop requirement
  // Calculate if there are other non-structure fields
  const hasOtherFields = (props.totalNonStructureFields ?? 0) > 0;

  // Generate field info badge - show estimated time and participant count
  const fieldInfo = () => {
    const badges = [];

    if (field.displayOptions?.estimatedTime) {
      badges.push(
        <Badge key="time" variant="secondary" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          {field.displayOptions.estimatedTime}
        </Badge>
      );
    }

    if (
      field.displayOptions?.participantCount &&
      field.displayOptions.participantCount > 0
    ) {
      badges.push(
        <Badge key="participants" variant="outline" className="text-xs">
          <Users className="w-3 h-3 mr-1" />
          {field.displayOptions.participantCount}
        </Badge>
      );
    }

    return badges.length > 0 ? (
      <div className="flex gap-1">{badges}</div>
    ) : (
      <Badge variant="default" className="text-xs">
        Welcome Screen
      </Badge>
    );
  };

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo()}>
      <StartingPageConfig
        field={field}
        onUpdateField={onUpdateField}
        hasOtherFields={hasOtherFields}
      />
    </BaseQuestionTile>
  );
};
