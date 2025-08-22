// src/components/form-builder/panels/right-panel/FormSettings.tsx - UPDATED VERSION

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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Settings,
  Save,
  Eye,
  Share2,
  Users,
  Shield,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useBuilder } from "../../providers/BuilderProvider";
import { Form } from "@/types";

export interface FormSettingsProps {
  form?: Form;
  onFormUpdate?: (updates: Partial<Form>) => void;
  className?: string;
}

export const FormSettings: React.FC<FormSettingsProps> = ({
  form,
  onFormUpdate,
  className,
}) => {
  const { state, updateForm } = useBuilder();

  // Use form from props or builder state
  const currentForm = form || state.form;

  const handleSettingChange = (key: string, value: any) => {
    const updates = {
      settings: {
        ...currentForm?.settings,
        [key]: value,
      },
    };

    if (onFormUpdate) {
      onFormUpdate(updates);
    } else {
      updateForm(updates);
    }
  };

  const handleFormPropertyChange = (key: keyof Form, value: any) => {
    const updates = { [key]: value };

    if (onFormUpdate) {
      onFormUpdate(updates);
    } else {
      updateForm(updates);
    }
  };

  if (!currentForm) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No form selected</p>
      </div>
    );
  }

  const settings = currentForm.settings || {};

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4" />
          <h3 className="font-medium">Form Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={currentForm.title || ""}
              onChange={(e) =>
                handleFormPropertyChange("title", e.target.value)
              }
              placeholder="Enter form title"
            />
          </div>

          <div>
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={currentForm.description || ""}
              onChange={(e) =>
                handleFormPropertyChange("description", e.target.value)
              }
              placeholder="Describe your form's purpose"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Submission Settings */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4" />
          <h3 className="font-medium">Submission Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multiple-submissions">
                Allow Multiple Submissions
              </Label>
              <p className="text-sm text-gray-500">
                Allow users to submit multiple responses
              </p>
            </div>
            <Switch
              id="multiple-submissions"
              checked={settings.allowMultipleSubmissions || false}
              onCheckedChange={(checked) =>
                handleSettingChange("allowMultipleSubmissions", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="collect-ip">Collect IP Addresses</Label>
              <p className="text-sm text-gray-500">
                Track submitter IP addresses
              </p>
            </div>
            <Switch
              id="collect-ip"
              checked={settings.collectIPAddress !== false} // Default to true
              onCheckedChange={(checked) =>
                handleSettingChange("collectIPAddress", checked)
              }
            />
          </div>

          <div>
            <Label htmlFor="submit-button-text">Submit Button Text</Label>
            <Input
              id="submit-button-text"
              value={settings.submitButtonText || "Submit"}
              onChange={(e) =>
                handleSettingChange("submitButtonText", e.target.value)
              }
              placeholder="Submit"
            />
          </div>
        </div>
      </Card>

      {/* Response Management */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4" />
          <h3 className="font-medium">Response Management</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="thank-you-message">Thank You Message</Label>
            <Textarea
              id="thank-you-message"
              value={
                settings.thankYouMessage || "Thank you for your submission!"
              }
              onChange={(e) =>
                handleSettingChange("thankYouMessage", e.target.value)
              }
              placeholder="Thank you for your submission!"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-progress">Show Progress Bar</Label>
              <p className="text-sm text-gray-500">
                Display progress for multi-step forms
              </p>
            </div>
            <Switch
              id="show-progress"
              checked={settings.showProgressBar !== false} // Default to true
              onCheckedChange={(checked) =>
                handleSettingChange("showProgressBar", checked)
              }
            />
          </div>
        </div>
      </Card>

      {/* Security & Privacy */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4" />
          <h3 className="font-medium">Security & Privacy</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-captcha">Require CAPTCHA</Label>
              <p className="text-sm text-gray-500">Prevent spam submissions</p>
            </div>
            <Switch
              id="require-captcha"
              checked={settings.requireCaptcha || false}
              onCheckedChange={(checked) =>
                handleSettingChange("requireCaptcha", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="encrypt-data">Encrypt Response Data</Label>
              <p className="text-sm text-gray-500">
                Additional data protection
              </p>
            </div>
            <Switch
              id="encrypt-data"
              checked={settings.encryptData || false}
              onCheckedChange={(checked) =>
                handleSettingChange("encryptData", checked)
              }
            />
          </div>
        </div>
      </Card>

      {/* Form Status */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4" />
          <h3 className="font-medium">Form Status</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Current Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={currentForm.published ? "default" : "secondary"}
                >
                  {currentForm.published ? "Published" : "Draft"}
                </Badge>
                {currentForm.publishedAt && (
                  <span className="text-xs text-gray-500">
                    Published{" "}
                    {new Date(currentForm.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="accept-responses">Accept Responses</Label>
              <p className="text-sm text-gray-500">Allow new submissions</p>
            </div>
            <Switch
              id="accept-responses"
              checked={settings.acceptResponses !== false} // Default to true
              onCheckedChange={(checked) =>
                handleSettingChange("acceptResponses", checked)
              }
            />
          </div>

          {settings.acceptResponses === false && (
            <div>
              <Label htmlFor="closed-message">Form Closed Message</Label>
              <Textarea
                id="closed-message"
                value={
                  settings.closedMessage ||
                  "This form is no longer accepting responses."
                }
                onChange={(e) =>
                  handleSettingChange("closedMessage", e.target.value)
                }
                placeholder="This form is no longer accepting responses."
                rows={2}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Settings */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4" />
          <h3 className="font-medium">Advanced Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="response-limit">Response Limit</Label>
            <Input
              id="response-limit"
              type="number"
              value={settings.responseLimit || ""}
              onChange={(e) =>
                handleSettingChange(
                  "responseLimit",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="No limit"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of responses to accept
            </p>
          </div>

          <div>
            <Label htmlFor="auto-close-date">Auto-close Date</Label>
            <Input
              id="auto-close-date"
              type="datetime-local"
              value={
                settings.autoCloseDate
                  ? new Date(settings.autoCloseDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                handleSettingChange(
                  "autoCloseDate",
                  e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined
                )
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Automatically stop accepting responses
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
