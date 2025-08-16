// src/components/form-builder/field-types/rating-fields/NumberRating.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/types/form";
import {
  BaseQuestionTile,
  BaseQuestionTileProps,
} from "../shared/BaseQuestionTile";

type NumberRatingProps = Omit<
  BaseQuestionTileProps,
  "children" | "fieldInfo" | "expandable"
>;

// Rating Configuration Component
interface NumberRatingConfigProps {
  field: FormField;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

const NumberRatingConfig: React.FC<NumberRatingConfigProps> = ({
  field,
  onUpdateField,
}) => {
  const minRating = field.minRating || 1;
  const maxRating = field.maxRating || 5;
  const defaultValue = field.defaultValue;
  const ratingStyle = field.displayOptions?.ratingStyle || "stars";

  // Rating style options with emojis
  const ratingStyles = [
    { value: "stars", label: "⭐ Stars", emoji: "⭐" },
    { value: "hearts", label: "❤️ Hearts", emoji: "❤️" },
    { value: "thumbs", label: "👍 Thumbs", emoji: "👍" },
    { value: "smiley", label: "😊 Smiley", emoji: "😊" },
    { value: "fire", label: "🔥 Fire", emoji: "🔥" },
    { value: "numbers", label: "🔢 Numbers", emoji: "1" },
  ];

  const handleMinRatingChange = (value: string) => {
    const newMin = parseInt(value) || 1;
    const newMax = maxRating <= newMin ? newMin + 1 : maxRating;
    onUpdateField(field.id, {
      minRating: newMin,
      maxRating: newMax,
    });
  };

  const handleMaxRatingChange = (value: string) => {
    const newMax = parseInt(value) || 5;
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

  const handleStyleChange = (
    style: "numbers" | "stars" | "hearts" | "thumbs" | "smiley" | "fire"
  ) => {
    onUpdateField(field.id, {
      displayOptions: {
        ...field.displayOptions,
        ratingStyle: style,
      },
    });
  };

  const generatePresetRanges = () => {
    const presets = [
      { min: 1, max: 3, label: "1-3" },
      { min: 1, max: 5, label: "1-5" },
      { min: 1, max: 7, label: "1-7" },
      { min: 1, max: 10, label: "1-10" },
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

  const getCurrentStyle = () => {
    return (
      ratingStyles.find((style) => style.value === ratingStyle) ||
      ratingStyles[0]
    );
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {/* Rating Style Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Rating Style</Label>
        <Select value={ratingStyle} onValueChange={handleStyleChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ratingStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                <span className="flex items-center gap-2">
                  <span>{style.emoji}</span>
                  <span>{style.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Range Configuration */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Rating Range</Label>
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
              min="1"
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

export const NumberRating: React.FC<NumberRatingProps> = (props) => {
  const { field, onUpdateField } = props;

  // No field info badge as per requirements
  return (
    <BaseQuestionTile {...props} expandable={true} fieldInfo={null}>
      <NumberRatingConfig field={field} onUpdateField={onUpdateField} />
    </BaseQuestionTile>
  );
};
