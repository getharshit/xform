// src/components/form-builder/field-types/choice-fields/OpinionScale.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type OpinionScaleProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// Opinion Scale Configuration Component
interface OpinionScaleConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const OpinionScaleConfig: React.FC<OpinionScaleConfigProps> = ({
  field,
  onUpdateField,
}) => {
  const minRating = field.minRating || 1;
  const maxRating = field.maxRating || 10;
  const defaultValue = field.defaultValue;

  const handleMinRatingChange = (value: string) => {
    const newMin = parseInt(value) || 1;
    // Ensure max is always greater than min
    const newMax = maxRating <= newMin ? newMin + 1 : maxRating;
    onUpdateField(field.id, {
      minRating: newMin,
      maxRating: newMax,
    });
  };

  const handleMaxRatingChange = (value: string) => {
    const newMax = parseInt(value) || 10;
    // Ensure min is always less than max
    const newMin = minRating >= newMax ? newMax - 1 : minRating;
    onUpdateField(field.id, {
      minRating: newMin,
      maxRating: newMax,
    });
  };

  const handleDefaultChange = (value: string) => {
    const newDefault = value === "" ? undefined : parseInt(value);
    onUpdateField(field.id, { defaultValue: newDefault });
  };

  const generatePresetRanges = () => {
    const presets = [
      { min: 1, max: 5, label: "1-5 Scale" },
      { min: 1, max: 7, label: "1-7 Scale" },
      { min: 1, max: 10, label: "1-10 Scale" },
    ];

    return presets.map((preset) => (
      <Button
        key={`${preset.min}-${preset.max}`}
        variant="outline"
        size="sm"
        className="h-6 text-xs px-2"
        onClick={() =>
          onUpdateField(field.id, {
            minRating: preset.min,
            maxRating: preset.max,
          })
        }
      >
        {preset.label}
      </Button>
    ));
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Scale Range Configuration */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Scale Range</Label>
          <div className="flex gap-1">{generatePresetRanges()}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Minimum</Label>
            <Input
              type="number"
              value={minRating}
              onChange={(e) => handleMinRatingChange(e.target.value)}
              className="h-8 text-sm"
              min="0"
              max="9"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <Label className="text-xs">Maximum</Label>
            <Input
              type="number"
              value={maxRating}
              onChange={(e) => handleMaxRatingChange(e.target.value)}
              className="h-8 text-sm"
              min="2"
              max="20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OpinionScale: React.FC<OpinionScaleProps> = (props) => {
  const { field, onUpdateField } = props;

  const minRating = field.minRating || 1;
  const maxRating = field.maxRating || 10;

  // Generate field info badge - show current scale range
  const fieldInfo = (
    <Badge variant="secondary" className="text-xs">
      {minRating}-{maxRating} scale
    </Badge>
  );

  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={fieldInfo}>
      <OpinionScaleConfig field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
