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

export interface FormSettingsProps {
  form?: any;
  onFormUpdate?: (updates: any) => void;
}

export const FormSettings: React.FC<FormSettingsProps> = ({
  form,
  onFormUpdate,
}) => {
  return (
    <div className="p-4 space-y-6">
      {/* Form Details */}
      <div className="space-y-4">
        <h4 className="font-medium">Form Details</h4>

        <div>
          <Label htmlFor="form-title">Form Title</Label>
          <Input
            id="form-title"
            value={form?.title || ""}
            onChange={(e) => onFormUpdate?.({ title: e.target.value })}
            placeholder="Enter form title"
          />
        </div>

        <div>
          <Label htmlFor="form-description">Form Description</Label>
          <Textarea
            id="form-description"
            value={form?.description || ""}
            onChange={(e) => onFormUpdate?.({ description: e.target.value })}
            placeholder="Describe your form"
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Settings</h4>

        <div className="flex items-center justify-between">
          <div>
            <Label>Allow Multiple Submissions</Label>
            <p className="text-xs text-muted-foreground">
              Users can submit multiple times
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Collect IP Addresses</Label>
            <p className="text-xs text-muted-foreground">
              Track submission origins
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Progress Bar</Label>
            <p className="text-xs text-muted-foreground">
              Display completion progress
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Separator />

      {/* Submit Button */}
      <div className="space-y-4">
        <h4 className="font-medium">Submit Button</h4>

        <div>
          <Label htmlFor="submit-text">Button Text</Label>
          <Input id="submit-text" defaultValue="Submit" placeholder="Submit" />
        </div>

        <div>
          <Label htmlFor="submit-position">Button Position</Label>
          <Select defaultValue="center">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
