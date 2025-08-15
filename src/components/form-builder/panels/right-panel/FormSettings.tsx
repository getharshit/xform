// src/components/form-builder/panels/right-panel/FormSettings.tsx

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
import { Form } from "@/types/form";

export interface FormSettingsProps {
  form?: Form;
  onFormUpdate?: (updates: Partial<Form>) => void;
}

export const FormSettings: React.FC<FormSettingsProps> = ({
  form: propForm,
  onFormUpdate,
}) => {
  // Use builder context for state management
  const {
    state: {
      form,
      autoSave,
      loading: { isSaving },
    },
    updateForm,
    fieldCount,
    hasUnsavedChanges,
  } = useBuilder();

  // Use prop form if provided, otherwise use context form
  const currentForm = propForm || form;

  const handleFormUpdate = (updates: Partial<Form>) => {
    if (onFormUpdate) {
      onFormUpdate(updates);
    } else {
      // Use context update method
      updateForm(updates);
    }
  };

  const handleSettingsUpdate = (settingKey: string, value: any) => {
    const currentSettings = currentForm?.settings || {};
    handleFormUpdate({
      settings: {
        ...currentSettings,
        [settingKey]: value,
      },
    });
  };

  if (!currentForm) {
    return (
      <div className="p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Settings className="w-6 h-6 text-muted-foreground" />
        </div>
        <h4 className="font-medium mb-2">No Form Selected</h4>
        <p className="text-sm text-muted-foreground">
          Create a form to configure its settings
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Form Status */}
      <Card className="p-3 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="font-medium text-sm">Form Status</span>
          </div>
          {hasUnsavedChanges && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unsaved
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Fields:</span>
            <span className="font-medium">{fieldCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Modified:</span>
            <span className="font-medium">
              {new Date(currentForm.updatedAt).toLocaleDateString()}
            </span>
          </div>
          {autoSave.enabled && (
            <div className="flex justify-between">
              <span>Auto-save:</span>
              <span className="font-medium text-green-600">Enabled</span>
            </div>
          )}
        </div>
      </Card>

      {/* Form Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4" />
          <h4 className="font-medium">Form Details</h4>
        </div>

        <div>
          <Label htmlFor="form-title">Form Title</Label>
          <Input
            id="form-title"
            value={currentForm.title || ""}
            onChange={(e) => handleFormUpdate({ title: e.target.value })}
            placeholder="Enter form title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="form-description">Form Description</Label>
          <Textarea
            id="form-description"
            value={currentForm.description || ""}
            onChange={(e) => handleFormUpdate({ description: e.target.value })}
            placeholder="Describe your form"
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      <Separator />

      {/* Submission Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4" />
          <h4 className="font-medium">Submission Settings</h4>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Allow Multiple Submissions</Label>
            <p className="text-xs text-muted-foreground">
              Users can submit the form multiple times
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.allowMultipleSubmissions || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("allowMultipleSubmissions", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Progress Bar</Label>
            <p className="text-xs text-muted-foreground">
              Display completion progress to users
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.showProgressBar !== false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("showProgressBar", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Require All Fields</Label>
            <p className="text-xs text-muted-foreground">
              Mark all fields as required
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.requireAllFields || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("requireAllFields", checked)
            }
          />
        </div>
      </div>

      <Separator />

      {/* Data Collection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4" />
          <h4 className="font-medium">Data Collection</h4>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Collect IP Addresses</Label>
            <p className="text-xs text-muted-foreground">
              Track submission origins for analytics
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.collectIPAddress !== false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("collectIPAddress", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Collect User Agent</Label>
            <p className="text-xs text-muted-foreground">
              Track browser and device information
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.collectUserAgent !== false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("collectUserAgent", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>GDPR Compliant</Label>
            <p className="text-xs text-muted-foreground">
              Enable GDPR compliance features
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.gdprCompliant || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("gdprCompliant", checked)
            }
          />
        </div>
      </div>

      <Separator />

      {/* Advanced Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4" />
          <h4 className="font-medium">Advanced Settings</h4>
        </div>

        <div>
          <Label htmlFor="time-limit">Time Limit (minutes)</Label>
          <Input
            id="time-limit"
            type="number"
            value={currentForm.settings?.timeLimit || ""}
            onChange={(e) =>
              handleSettingsUpdate(
                "timeLimit",
                parseInt(e.target.value) || undefined
              )
            }
            placeholder="No time limit"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty for no time limit
          </p>
        </div>

        <div>
          <Label htmlFor="redirect-url">Redirect URL</Label>
          <Input
            id="redirect-url"
            type="url"
            value={currentForm.settings?.redirectUrl || ""}
            onChange={(e) =>
              handleSettingsUpdate("redirectUrl", e.target.value)
            }
            placeholder="https://example.com/thank-you"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Redirect users after successful submission
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Save & Continue</Label>
            <p className="text-xs text-muted-foreground">
              Allow users to save progress and continue later
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.enableSaveAndContinue || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("enableSaveAndContinue", checked)
            }
          />
        </div>
      </div>

      <Separator />

      {/* Submit Button Configuration */}
      <div className="space-y-4">
        <h4 className="font-medium">Submit Button</h4>

        <div>
          <Label htmlFor="submit-text">Button Text</Label>
          <Input
            id="submit-text"
            value={currentForm.settings?.submitButtonText || "Submit"}
            onChange={(e) =>
              handleSettingsUpdate("submitButtonText", e.target.value)
            }
            placeholder="Submit"
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Reset Button</Label>
            <p className="text-xs text-muted-foreground">
              Allow users to reset the form
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.showResetButton || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("showResetButton", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Confirm Before Submit</Label>
            <p className="text-xs text-muted-foreground">
              Ask for confirmation before submitting
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.confirmBeforeSubmit || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("confirmBeforeSubmit", checked)
            }
          />
        </div>
      </div>

      <Separator />

      {/* Custom Messages */}
      <div className="space-y-4">
        <h4 className="font-medium">Custom Messages</h4>

        <div>
          <Label htmlFor="submission-message">Custom Submission Message</Label>
          <Textarea
            id="submission-message"
            value={currentForm.settings?.customSubmissionMessage || ""}
            onChange={(e) =>
              handleSettingsUpdate("customSubmissionMessage", e.target.value)
            }
            placeholder="Thank you for your submission!"
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="privacy-notice">Privacy Notice Text</Label>
          <Textarea
            id="privacy-notice"
            value={currentForm.settings?.privacyNoticeText || ""}
            onChange={(e) =>
              handleSettingsUpdate("privacyNoticeText", e.target.value)
            }
            placeholder="Your privacy is important to us..."
            rows={2}
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show Privacy Notice</Label>
            <p className="text-xs text-muted-foreground">
              Display privacy notice on the form
            </p>
          </div>
          <Switch
            checked={currentForm.settings?.showPrivacyNotice || false}
            onCheckedChange={(checked) =>
              handleSettingsUpdate("showPrivacyNotice", checked)
            }
          />
        </div>
      </div>

      {/* Auto-save indicator */}
      {autoSave.enabled && (
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span className="font-medium">
              {isSaving ? "Auto-saving..." : "Settings auto-saved"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
