import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CircleDot, Plus, X, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface MultipleChoiceEditorProps {
  field: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export const MultipleChoiceEditor: React.FC<MultipleChoiceEditorProps> = ({
  field,
  onUpdate,
  onDelete,
}) => {
  const options = field.options || ["Option 1", "Option 2", "Option 3"];

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_: string, i: number) => i !== index);
      onUpdate({ options: newOptions });
    }
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    const newOptions = [...options];
    const [moved] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, moved);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      {/* Field Type Header */}
      <div className="flex items-center gap-2">
        <CircleDot className="w-4 h-4" />
        <Badge variant="outline">Multiple Choice</Badge>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
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

        {/* Options Management */}
        <TabsContent value="options" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options</Label>
            <Button size="sm" onClick={addOption}>
              <Plus className="w-4 h-4 mr-1" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((option: string, index: number) => (
              <Card key={index} className="p-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className="w-4 h-4 border-2 border-primary rounded-full" />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Option text"
                    className="flex-1"
                  />
                  {options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            💡 Tip: Drag options to reorder them
          </div>
        </TabsContent>

        {/* Display Options */}
        <TabsContent value="display" className="space-y-4">
          <div>
            <Label>Layout</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={field.displayOptions?.inline ? "outline" : "default"}
                size="sm"
                onClick={() =>
                  onUpdate({
                    displayOptions: {
                      ...field.displayOptions,
                      inline: false,
                    },
                  })
                }
              >
                Vertical
              </Button>
              <Button
                variant={field.displayOptions?.inline ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onUpdate({
                    displayOptions: {
                      ...field.displayOptions,
                      inline: true,
                    },
                  })
                }
              >
                Horizontal
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
