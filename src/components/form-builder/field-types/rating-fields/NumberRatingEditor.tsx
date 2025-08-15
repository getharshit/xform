import { Star } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export interface NumberRatingEditorProps {
  field: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export const NumberRatingEditor: React.FC<NumberRatingEditorProps> = ({
  field,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Field Type Header */}
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4" />
        <Badge variant="outline">Rating Scale</Badge>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="scale">Scale</TabsTrigger>
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
            <Input
              id="description"
              value={field.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Add helpful description"
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

        {/* Scale Configuration */}
        <TabsContent value="scale" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-rating">Minimum Rating</Label>
              <Input
                id="min-rating"
                type="number"
                value={field.minRating || 1}
                onChange={(e) =>
                  onUpdate({ minRating: parseInt(e.target.value) || 1 })
                }
                min={1}
                max={10}
              />
            </div>
            <div>
              <Label htmlFor="max-rating">Maximum Rating</Label>
              <Input
                id="max-rating"
                type="number"
                value={field.maxRating || 5}
                onChange={(e) =>
                  onUpdate({ maxRating: parseInt(e.target.value) || 5 })
                }
                min={1}
                max={10}
              />
            </div>
          </div>

          <div>
            <Label>Rating Preview</Label>
            <div className="flex gap-1 mt-2 p-3 border rounded">
              {Array.from({ length: field.maxRating || 5 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 border-2 border-primary rounded flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="low-label">Low End Label</Label>
              <Input
                id="low-label"
                value={field.lowLabel || ""}
                onChange={(e) => onUpdate({ lowLabel: e.target.value })}
                placeholder="Poor"
              />
            </div>
            <div>
              <Label htmlFor="high-label">High End Label</Label>
              <Input
                id="high-label"
                value={field.highLabel || ""}
                onChange={(e) => onUpdate({ highLabel: e.target.value })}
                placeholder="Excellent"
              />
            </div>
          </div>
        </TabsContent>

        {/* Display Options */}
        <TabsContent value="display" className="space-y-4">
          <div>
            <Label>Display Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={
                  field.displayStyle === "numbers" ? "default" : "outline"
                }
                size="sm"
                onClick={() => onUpdate({ displayStyle: "numbers" })}
              >
                Numbers
              </Button>
              <Button
                variant={field.displayStyle === "stars" ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ displayStyle: "stars" })}
              >
                Stars
              </Button>
            </div>
          </div>

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
        </TabsContent>
      </Tabs>
    </div>
  );
};
