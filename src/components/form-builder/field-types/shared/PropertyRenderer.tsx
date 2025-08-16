// src/components/form-builder/field-types/shared/PropertyRenderer.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/types/form";
import { FieldPropertySchema } from "../registry/fieldRegistry";

// Import custom components
import { OptionsManager } from "../choice-fields/OptionsManager";

interface PropertyRendererProps {
  property: FieldPropertySchema;
  field: FormField;
  onFieldUpdate: (updates: Partial<FormField>) => void;
}

// Custom component registry
const CUSTOM_COMPONENTS = {
  OptionsManager,
  // Add more custom components here
  // RatingScaleConfig: RatingScaleConfig,
};

// Helper function to get nested property value
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// Helper function to set nested property value
const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split(".");
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
};

export const PropertyRenderer: React.FC<PropertyRendererProps> = ({
  property,
  field,
  onFieldUpdate,
}) => {
  const currentValue = getNestedValue(field, property.id);

  const handleValueChange = (value: any) => {
    const updates = setNestedValue({}, property.id, value);
    onFieldUpdate(updates);
  };

  const renderPropertyControl = () => {
    switch (property.component) {
      case "input":
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={property.placeholder}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={property.placeholder}
            rows={2}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={currentValue || ""}
            onChange={(e) =>
              handleValueChange(
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            placeholder={property.placeholder}
          />
        );

      case "switch":
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label>{property.label}</Label>
              {property.description && (
                <p className="text-xs text-muted-foreground">
                  {property.description}
                </p>
              )}
            </div>
            <Switch
              checked={currentValue || false}
              onCheckedChange={handleValueChange}
            />
          </div>
        );

      case "select":
        const options = property.props?.options || [];
        return (
          <Select
            value={currentValue?.toString() || ""}
            onValueChange={(value) => {
              // Handle boolean values for inline layout
              if (value === "true") handleValueChange(true);
              else if (value === "false") handleValueChange(false);
              else handleValueChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${property.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {options
                .map((option: any, index: number) => {
                  // Add null checks for option properties
                  const optionValue = option?.value;
                  const optionLabel = option?.label;

                  // Skip invalid options
                  if (optionValue === undefined || optionValue === null) {
                    console.warn(`Invalid option at index ${index}:`, option);
                    return null;
                  }

                  return (
                    <SelectItem
                      key={optionValue.toString()}
                      value={optionValue.toString()}
                    >
                      {optionLabel || optionValue.toString()}
                    </SelectItem>
                  );
                })
                .filter(Boolean)}{" "}
              {/* Remove null items */}
            </SelectContent>
          </Select>
        );

      case "custom":
        if (
          property.customComponent &&
          CUSTOM_COMPONENTS[
            property.customComponent as keyof typeof CUSTOM_COMPONENTS
          ]
        ) {
          const CustomComponent =
            CUSTOM_COMPONENTS[
              property.customComponent as keyof typeof CUSTOM_COMPONENTS
            ];
          return (
            <CustomComponent
              field={field}
              onFieldUpdate={onFieldUpdate}
              {...(property.props || {})}
            />
          );
        }
        return (
          <div className="p-2 border rounded text-sm text-muted-foreground">
            Custom component "{property.customComponent}" not found
          </div>
        );

      default:
        return (
          <div className="p-2 border rounded text-sm text-muted-foreground">
            Unknown component type: {property.component}
          </div>
        );
    }
  };

  // For switch components, don't wrap in additional label since they handle it internally
  if (property.component === "switch") {
    return <div className="space-y-2">{renderPropertyControl()}</div>;
  }

  return (
    <div className="space-y-2">
      <Label>{property.label}</Label>
      {property.description && (
        <p className="text-xs text-muted-foreground">{property.description}</p>
      )}
      {renderPropertyControl()}
    </div>
  );
};
