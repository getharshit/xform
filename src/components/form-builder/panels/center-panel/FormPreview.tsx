import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormField } from "@/types/form";

export interface FormPreviewProps {
  form?: Form | null;
  viewportMode?: "desktop" | "tablet" | "mobile";
  className?: string;
}

// Interactive form field component for preview
const PreviewField: React.FC<{ field: FormField; questionNumber: number }> = ({
  field,
  questionNumber,
}) => {
  const renderField = () => {
    switch (field.type) {
      case "shortText":
        return (
          <Input
            placeholder={field.placeholder || "Enter your answer..."}
            maxLength={field.maxLength}
            required={field.required}
          />
        );

      case "longText":
        return (
          <Textarea
            placeholder={field.placeholder || "Enter your detailed response..."}
            maxLength={field.maxLength}
            required={field.required}
            rows={4}
          />
        );

      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder || "name@example.com"}
            required={field.required}
          />
        );

      case "website":
        return (
          <Input
            type="url"
            placeholder={field.placeholder || "https://example.com"}
            required={field.required}
          />
        );

      case "phoneNumber":
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || "(555) 123-4567"}
            required={field.required}
          />
        );

      case "multipleChoice":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="w-4 h-4"
                  required={field.required}
                />
                <span className="text-sm">{option}</span>
              </label>
            )) || (
              <div className="text-sm text-muted-foreground">
                No options configured
              </div>
            )}
          </div>
        );

      case "dropdown":
        return (
          <select
            className="w-full p-2 border rounded-md bg-background"
            required={field.required}
          >
            <option value="">
              {field.placeholder || "Choose an option..."}
            </option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "yesNo":
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="yes"
                className="w-4 h-4"
                required={field.required}
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value="no"
                className="w-4 h-4"
                required={field.required}
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        );

      case "numberRating":
        const maxRating = field.maxRating || 5;
        const minRating = field.minRating || 1;
        return (
          <div className="flex gap-2">
            {Array.from({ length: maxRating - minRating + 1 }, (_, i) => {
              const value = minRating + i;
              return (
                <button
                  key={value}
                  type="button"
                  className="w-10 h-10 border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {value}
                </button>
              );
            })}
          </div>
        );

      case "opinionScale":
        return (
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                className="w-8 h-8 border rounded hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
              >
                {i + 1}
              </button>
            ))}
          </div>
        );

      case "statement":
        return (
          <div className="p-4 bg-muted/50 rounded border-l-4 border-primary">
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  field.description || "Statement content will appear here",
              }}
            />
          </div>
        );

      case "legal":
        return (
          <div className="space-y-3">
            {field.description && (
              <div className="max-h-32 overflow-y-auto p-3 border rounded bg-muted/30 text-sm">
                <div dangerouslySetInnerHTML={{ __html: field.description }} />
              </div>
            )}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required={field.required}
                className="w-4 h-4 mt-0.5"
              />
              <span className="text-sm">{field.label}</span>
            </label>
          </div>
        );

      case "fileUpload":
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded p-6 text-center hover:border-primary transition-colors cursor-pointer">
            <div className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop
            </div>
            {field.acceptedFileTypes && (
              <div className="text-xs text-muted-foreground">
                Accepted: {field.acceptedFileTypes.join(", ")}
              </div>
            )}
            {field.maxFileSize && (
              <div className="text-xs text-muted-foreground">
                Max size: {field.maxFileSize}MB
              </div>
            )}
            <input
              type="file"
              accept={field.acceptedFileTypes?.join(",")}
              required={field.required}
              className="hidden"
            />
          </div>
        );

      case "pageBreak":
        return (
          <div className="py-8">
            <div className="text-center">
              <div className="w-full h-px bg-border mb-4" />
              <Badge variant="secondary">Page Break</Badge>
              <div className="w-full h-px bg-border mt-4" />
            </div>
          </div>
        );

      case "startingPage":
        return (
          <div className="text-center py-8 space-y-4">
            <h2 className="text-2xl font-bold">{field.label}</h2>
            {field.description && (
              <p className="text-muted-foreground">{field.description}</p>
            )}
            {field.displayOptions?.estimatedTime && (
              <Badge variant="outline">
                ⏱️ {field.displayOptions.estimatedTime}
              </Badge>
            )}
            {field.displayOptions?.features && (
              <div className="flex justify-center gap-2 flex-wrap">
                {field.displayOptions.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      case "postSubmission":
        return (
          <div className="text-center py-8 space-y-4">
            <h2 className="text-2xl font-bold">{field.label}</h2>
            {field.description && (
              <p className="text-muted-foreground">{field.description}</p>
            )}
            <div className="flex justify-center gap-2">
              {field.displayOptions?.showDownload && (
                <Button variant="outline">Download Receipt</Button>
              )}
              {field.displayOptions?.showShare && (
                <Button variant="outline">Share</Button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            Preview for {field.type} field
          </div>
        );
    }
  };

  // Don't show question numbers for special fields
  const isSpecialField = [
    "pageBreak",
    "startingPage",
    "postSubmission",
    "statement",
  ].includes(field.type);

  return (
    <div className="space-y-3">
      {!isSpecialField && (
        <div>
          <label className="block text-sm font-medium mb-2">
            <span className="text-muted-foreground text-xs mr-2">
              {questionNumber}.
            </span>
            {field.label || "Untitled Question"}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-xs text-muted-foreground mb-3">
              {field.description}
            </p>
          )}
        </div>
      )}

      {renderField()}

      {field.helpText && !isSpecialField && (
        <div className="text-xs text-muted-foreground">💡 {field.helpText}</div>
      )}
    </div>
  );
};

export const FormPreview: React.FC<FormPreviewProps> = ({
  form,
  viewportMode = "desktop",
  className = "",
}) => {
  if (!form) {
    return (
      <div className={`bg-background ${className}`}>
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Form to Preview</h3>
              <p className="text-muted-foreground">
                Add some fields to see the form preview
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields = form.fields || [];
  const regularFields = fields.filter(
    (f) => !["startingPage", "postSubmission"].includes(f.type)
  );
  const startingPage = fields.find((f) => f.type === "startingPage");
  const postSubmissionPage = fields.find((f) => f.type === "postSubmission");

  return (
    <div className={`bg-background ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{form.title || "Untitled Form"}</CardTitle>
            <Badge variant="outline">{viewportMode}</Badge>
          </div>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Starting Page */}
          {startingPage && (
            <PreviewField field={startingPage} questionNumber={0} />
          )}

          {/* Regular Form Fields */}
          <form className="space-y-6">
            {regularFields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No form fields to preview
                </p>
              </div>
            ) : (
              regularFields.map((field, index) => (
                <PreviewField
                  key={field.id}
                  field={field}
                  questionNumber={index + 1}
                />
              ))
            )}

            {/* Submit Button */}
            {regularFields.length > 0 && (
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled>
                  {form.settings?.submitButtonText || "Submit"}
                </Button>
              </div>
            )}
          </form>

          {/* Post Submission Page */}
          {postSubmissionPage && (
            <div className="border-t pt-6">
              <PreviewField field={postSubmissionPage} questionNumber={0} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
