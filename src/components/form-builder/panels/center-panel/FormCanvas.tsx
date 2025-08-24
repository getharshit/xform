import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Plus,
  Copy,
  Trash2,
  GripVertical,
  Mail,
  Globe,
  Phone,
  Star,
  CircleDot,
  ChevronDown,
  ToggleLeft,
  BarChart3,
  FileText,
  Scale,
  Upload,
} from "lucide-react";
import { Form, FormField } from "@/types";

export interface FormCanvasProps {
  form?: Form | null;
  selectedFieldId?: string | null;
  onFieldSelect?: (fieldId: string) => void;
  onFieldAdd?: (fieldType: string, index: number) => void;
  onFieldReorder?: (fromIndex: number, toIndex: number) => void;
  viewportMode?: "desktop" | "tablet" | "mobile";
}

// Field preview component
const FieldPreview: React.FC<{
  field: FormField;
  isSelected: boolean;
  questionNumber: number;
  onSelect: () => void;
}> = ({ field, isSelected, questionNumber, onSelect }) => {
  const renderFieldInput = () => {
    switch (field.type) {
      case "shortText":
        return (
          <Input
            placeholder={field.placeholder || "Enter your answer..."}
            disabled
            className="bg-muted/50"
          />
        );

      case "longText":
        return (
          <Textarea
            placeholder={field.placeholder || "Enter your detailed response..."}
            disabled
            className="bg-muted/50 min-h-[100px]"
            rows={3}
          />
        );

      case "email":
        return (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={field.placeholder || "name@example.com"}
              disabled
              className="bg-muted/50"
            />
          </div>
        );

      case "website":
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder={field.placeholder || "https://example.com"}
              disabled
              className="bg-muted/50"
            />
          </div>
        );

      case "phoneNumber":
        return (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder={field.placeholder || "(555) 123-4567"}
              disabled
              className="bg-muted/50"
            />
          </div>
        );

      case "multipleChoice":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{option}</span>
              </div>
            )) || (
              <div className="text-sm text-muted-foreground">
                No options configured
              </div>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 p-2 border rounded bg-muted/50 text-sm text-muted-foreground">
              {field.placeholder || "Choose an option..."}
            </div>
          </div>
        );

      case "yesNo":
        return (
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" disabled>
              <ToggleLeft className="w-4 h-4 mr-1" />
              Yes
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ToggleLeft className="w-4 h-4 mr-1" />
              No
            </Button>
          </div>
        );

      case "numberRating":
        const maxRating = field.maxRating || 5;
        return (
          <div className="flex gap-1">
            {Array.from({ length: maxRating }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 border rounded flex items-center justify-center text-sm bg-muted/50"
              >
                {i + 1}
              </div>
            ))}
          </div>
        );

      case "opinionScale":
        return (
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 border rounded flex items-center justify-center text-xs bg-muted/50"
              >
                {i + 1}
              </div>
            ))}
          </div>
        );

      case "statement":
        return (
          <div className="p-4 bg-muted/50 rounded border-l-4 border-primary">
            <FileText className="w-5 h-5 text-muted-foreground mb-2" />
            <div className="text-sm text-muted-foreground">
              {field.description || "Statement content will appear here"}
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="flex items-start gap-2">
            <input type="checkbox" disabled className="mt-1" />
            <div className="text-sm">
              <Scale className="w-4 h-4 inline mr-1" />
              {field.label}
            </div>
          </div>
        );

      case "fileUpload":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded p-6 text-center bg-muted/50">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <div className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </div>
            {field.acceptedFileTypes && (
              <div className="text-xs text-muted-foreground mt-1">
                Accepted: {field.acceptedFileTypes.join(", ")}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            {field.type} field preview
          </div>
        );
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 group ${
        isSelected
          ? "border-primary shadow-md bg-primary/5"
          : "hover:shadow-md hover:border-primary/20"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50 group-hover:opacity-100" />
            <Badge variant="outline" className="text-xs">
              Q{questionNumber}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {field.type.replace(/([A-Z])/g, " $1").trim()}
            </span>
            {field.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Field Label and Description */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            {field.label || "Untitled Question"}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>

        {/* Field Input Preview */}
        <div className="mb-3">{renderFieldInput()}</div>

        {/* Field Help Text */}
        {field.helpText && (
          <div className="text-xs text-muted-foreground">
            💡 {field.helpText}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const FormCanvas: React.FC<FormCanvasProps> = ({
  form,
  selectedFieldId,
  onFieldSelect,
  onFieldAdd,
  onFieldReorder,
  viewportMode = "desktop",
}) => {
  const fields = form?.fields || [];

  const handleFieldSelect = (fieldId: string) => {
    onFieldSelect?.(fieldId);
  };

  const handleAddField = (index: number) => {
    onFieldAdd?.("shortText", index);
  };

  return (
    <Card className="min-h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{form?.title || "Untitled Form"}</span>
          <Badge variant="secondary" className="text-xs">
            {viewportMode} view
          </Badge>
        </CardTitle>
        {form?.description && (
          <p className="text-sm text-muted-foreground">{form.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No fields yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first field to start building the form
            </p>
            <Button onClick={() => handleAddField(0)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Field
            </Button>
          </div>
        ) : (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="group relative">
                {/* Drop Zone Above */}
                <div className="h-2 -mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-full border-2 border-dashed border-primary rounded" />
                </div>

                {/* Field Preview */}
                <FieldPreview
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  questionNumber={index + 1}
                  onSelect={() => handleFieldSelect(field.id)}
                />

                {/* Drop Zone Below */}
                <div className="h-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-full border-2 border-dashed border-primary rounded" />
                </div>
              </div>
            ))}

            {/* Add Field Button */}
            <Button
              variant="outline"
              className="w-full h-16 border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors"
              onClick={() => handleAddField(fields.length)}
            >
              <Plus className="w-6 h-6 mr-2" />
              Add Field
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
