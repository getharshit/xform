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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { FileText } from "lucide-react";

export interface FieldPropertiesProps {
  selectedField?: any;
  onFieldUpdate?: (updates: any) => void;
}

export const FieldProperties: React.FC<FieldPropertiesProps> = ({
  selectedField,
  onFieldUpdate,
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

  return (
    <div className="p-4 space-y-6">
      {/* Field Type Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {selectedField.type}
        </Badge>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Basic Properties */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={selectedField.label || ""}
            onChange={(e) => onFieldUpdate?.({ label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label htmlFor="field-description">Description (Optional)</Label>
          <Textarea
            id="field-description"
            value={selectedField.description || ""}
            onChange={(e) => onFieldUpdate?.({ description: e.target.value })}
            placeholder="Add helpful description"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder Text</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ""}
            onChange={(e) => onFieldUpdate?.({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required Field</Label>
          <Switch
            id="field-required"
            checked={selectedField.required || false}
            onCheckedChange={(checked) =>
              onFieldUpdate?.({ required: checked })
            }
          />
        </div>
      </div>

      <Separator />

      {/* Validation Rules */}
      <div className="space-y-4">
        <h4 className="font-medium">Validation</h4>

        {selectedField.type === "shortText" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-length">Min Length</Label>
              <Input id="min-length" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="max-length">Max Length</Label>
              <Input id="max-length" type="number" placeholder="100" />
            </div>
          </div>
        )}

        {selectedField.type === "numberRating" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-rating">Min Rating</Label>
              <Input id="min-rating" type="number" value="1" />
            </div>
            <div>
              <Label htmlFor="max-rating">Max Rating</Label>
              <Input id="max-rating" type="number" value="5" />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Display Options */}
      <div className="space-y-4">
        <h4 className="font-medium">Display</h4>

        <div>
          <Label htmlFor="field-width">Field Width</Label>
          <Select defaultValue="full">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="half">Half Width</SelectItem>
              <SelectItem value="third">One Third</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-label">Show Label</Label>
          <Switch id="show-label" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-description">Show Description</Label>
          <Switch id="show-description" defaultChecked />
        </div>
      </div>
    </div>
  );
};
