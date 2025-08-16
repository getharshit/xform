// src/components/form-builder/panels/right-panel/DynamicFieldProperties.tsx

"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";
import { FormField } from "@/types/form";
import {
  getFieldConfig,
  getFieldPropertySchema,
  FieldPropertySchema,
} from "../../field-types/registry/fieldRegistry";
import { PropertyRenderer } from "../../field-types/shared/PropertyRenderer";

export interface DynamicFieldPropertiesProps {
  selectedField?: FormField | null;
  onFieldUpdate?: (updates: Partial<FormField>) => void;
  onFieldDuplicate?: (fieldId: string) => void;
  onFieldDelete?: (fieldId: string) => void;
}

export const DynamicFieldProperties: React.FC<DynamicFieldPropertiesProps> = ({
  selectedField,
  onFieldUpdate,
  onFieldDuplicate,
  onFieldDelete,
}) => {
  if (!selectedField) {
    return (
      <div className="p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h4 className="font-medium mb-2">No field selected</h4>
        <p className="text-sm text-muted-foreground">
          Select a field from the canvas to edit its properties
        </p>
      </div>
    );
  }

  // Get field configuration from registry
  const fieldConfig = getFieldConfig(selectedField.type);
  const propertySchema = getFieldPropertySchema(selectedField.type);

  if (!fieldConfig) {
    return (
      <div className="p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-6 h-6 text-destructive" />
        </div>
        <h4 className="font-medium mb-2">Unknown Field Type</h4>
        <p className="text-sm text-muted-foreground">
          Field type "{selectedField.type}" is not configured in the registry
        </p>
      </div>
    );
  }

  // Group properties by section
  const groupedProperties = propertySchema.reduce((acc, property) => {
    if (!acc[property.section]) {
      acc[property.section] = [];
    }
    acc[property.section].push(property);
    return acc;
  }, {} as Record<string, FieldPropertySchema[]>);

  // Section display names
  const sectionDisplayNames: Record<string, string> = {
    basic: "Basic Properties",
    options: "Options",
    validation: "Validation Rules",
    display: "Display Options",
    advanced: "Advanced Settings",
  };

  // Determine default open sections
  const defaultSections = ["basic"];
  if (
    selectedField.type === "multipleChoice" ||
    selectedField.type === "dropdown"
  ) {
    defaultSections.push("options");
  }
  defaultSections.push("display");

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate?.(updates);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Field Type Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {fieldConfig.displayName}
        </Badge>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Field Description */}
      {fieldConfig.description && (
        <p className="text-xs text-muted-foreground">
          {fieldConfig.description}
        </p>
      )}

      {/* Dynamic Properties Accordion */}
      {Object.keys(groupedProperties).length > 0 ? (
        <Accordion
          type="multiple"
          defaultValue={defaultSections}
          className="w-full"
        >
          {Object.entries(groupedProperties).map(([section, properties]) => (
            <AccordionItem key={section} value={section}>
              <AccordionTrigger>
                {sectionDisplayNames[section] || section}
                <Badge variant="secondary" className="ml-2">
                  {properties.length}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {properties.map((property) => (
                  <PropertyRenderer
                    key={property.id}
                    property={property}
                    field={selectedField}
                    onFieldUpdate={updateField}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No properties configured for this field type
          </p>
        </div>
      )}

      {/* Field Actions */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFieldDuplicate?.(selectedField.id)}
          >
            Duplicate Field
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (window.confirm("Delete this field?")) {
                onFieldDelete?.(selectedField.id);
              }
            }}
          >
            Delete Field
          </Button>
        </div>
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="pt-4 border-t">
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              Debug Info
            </summary>
            <div className="mt-2 p-2 bg-muted/30 rounded">
              <p>
                <strong>Field Type:</strong> {selectedField.type}
              </p>
              <p>
                <strong>Field ID:</strong> {selectedField.id}
              </p>
              <p>
                <strong>Properties Count:</strong> {propertySchema.length}
              </p>
              <p>
                <strong>Sections:</strong>{" "}
                {Object.keys(groupedProperties).join(", ")}
              </p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
