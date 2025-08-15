import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus } from "lucide-react";

export interface FormCanvasProps {
  onFieldSelect?: (fieldId: string) => void;
  onFieldAdd?: (fieldType: string, index: number) => void;
  onFieldReorder?: (fromIndex: number, toIndex: number) => void;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({
  onFieldSelect,
  onFieldAdd,
  onFieldReorder,
}) => {
  // Mock fields for now
  const mockFields = [
    { id: "name", type: "shortText", label: "Full Name", required: true },
    { id: "email", type: "email", label: "Email Address", required: true },
    {
      id: "rating",
      type: "numberRating",
      label: "Rate our service",
      required: false,
    },
  ];

  return (
    <Card className="min-h-[600px]">
      <CardHeader>
        <CardTitle>Untitled Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockFields.map((field, index) => (
          <div key={field.id} className="group relative">
            {/* Drop Zone Above */}
            <div className="h-2 -mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-full border-2 border-dashed border-primary rounded" />
            </div>

            {/* Field */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{field.label}</span>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {/* Field Preview */}
                <div className="mt-3">
                  {field.type === "shortText" && (
                    <div className="border rounded px-3 py-2 text-muted-foreground text-sm">
                      Enter your answer...
                    </div>
                  )}
                  {field.type === "email" && (
                    <div className="border rounded px-3 py-2 text-muted-foreground text-sm">
                      name@example.com
                    </div>
                  )}
                  {field.type === "numberRating" && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className="w-8 h-8 border rounded flex items-center justify-center text-sm"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
        >
          <Plus className="w-6 h-6 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};
