import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface FormPreviewProps {
  className?: string;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ className = "" }) => {
  return (
    <div className={`bg-background ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Untitled Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview of actual form fields */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your answer..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rate our service
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="w-10 h-10 border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full">Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};
