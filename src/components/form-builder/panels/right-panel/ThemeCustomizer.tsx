import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface ThemeCustomizerProps {
  theme?: any;
  onThemeUpdate?: (updates: any) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onThemeUpdate,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Colors */}
      <div className="space-y-4">
        <h4 className="font-medium">Colors</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-8 bg-primary rounded border" />
              <Input value="#3B82F6" className="flex-1" />
            </div>
          </div>

          <div>
            <Label>Background</Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-8 bg-background border rounded" />
              <Input value="#FFFFFF" className="flex-1" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="font-medium">Typography</h4>

        <div>
          <Label>Font Family</Label>
          <Select defaultValue="inter">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="open-sans">Open Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Title Size</Label>
            <Input type="number" defaultValue="24" />
          </div>
          <div>
            <Label>Body Size</Label>
            <Input type="number" defaultValue="16" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Layout */}
      <div className="space-y-4">
        <h4 className="font-medium">Layout</h4>

        <div>
          <Label>Max Width</Label>
          <Input type="number" defaultValue="600" />
        </div>

        <div>
          <Label>Border Radius</Label>
          <Input type="number" defaultValue="8" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Question Numbers</Label>
            <p className="text-xs text-muted-foreground">
              Number each question
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};
