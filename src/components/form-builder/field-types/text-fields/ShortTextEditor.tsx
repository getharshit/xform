import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ShortTextEditorProps {
  field: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export const ShortTextEditor: React.FC<ShortTextEditorProps> = ({
  field,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Field Type Header */}
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4" />
        <Badge variant="outline">Short Text</Badge>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        {/* Basic Properties */}
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="label">Field Label</Label>
            <Input
              id="label"
              value={field.label || ""}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={field.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Add helpful description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder Text</Label>
            <Input
              id="placeholder"
              value={field.placeholder || ""}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={field.required || false}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
          </div>
        </TabsContent>

        {/* Validation */}
        <TabsContent value="validation" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-length">Min Length</Label>
              <Input
                id="min-length"
                type="number"
                value={field.minLength || ""}
                onChange={(e) =>
                  onUpdate({ minLength: parseInt(e.target.value) || undefined })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="max-length">Max Length</Label>
              <Input
                id="max-length"
                type="number"
                value={field.maxLength || ""}
                onChange={(e) =>
                  onUpdate({ maxLength: parseInt(e.target.value) || undefined })
                }
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pattern">Validation Pattern (Regex)</Label>
            <Input
              id="pattern"
              value={field.validationRules?.pattern || ""}
              onChange={(e) =>
                onUpdate({
                  validationRules: {
                    ...field.validationRules,
                    pattern: e.target.value,
                  },
                })
              }
              placeholder="^[a-zA-Z\\s]+$"
            />
          </div>

          <div>
            <Label htmlFor="custom-message">Custom Error Message</Label>
            <Input
              id="custom-message"
              value={field.validationRules?.customMessage || ""}
              onChange={(e) =>
                onUpdate({
                  validationRules: {
                    ...field.validationRules,
                    customMessage: e.target.value,
                  },
                })
              }
              placeholder="Please enter a valid value"
            />
          </div>
        </TabsContent>

        {/* Display Options */}
        <TabsContent value="display" className="space-y-4">
          <div>
            <Label>Field Width</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["full", "half", "third"].map((width) => (
                <Button
                  key={width}
                  variant={
                    field.displayOptions?.width === width
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    onUpdate({
                      displayOptions: {
                        ...field.displayOptions,
                        width,
                      },
                    })
                  }
                  className="capitalize"
                >
                  {width}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-label">Show Label</Label>
            <Switch
              id="show-label"
              checked={field.displayOptions?.showLabel !== false}
              onCheckedChange={(checked) =>
                onUpdate({
                  displayOptions: {
                    ...field.displayOptions,
                    showLabel: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-description">Show Description</Label>
            <Switch
              id="show-description"
              checked={field.displayOptions?.showDescription !== false}
              onCheckedChange={(checked) =>
                onUpdate({
                  displayOptions: {
                    ...field.displayOptions,
                    showDescription: checked,
                  },
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
