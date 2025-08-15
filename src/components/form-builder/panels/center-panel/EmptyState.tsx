import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export interface EmptyStateProps {
  onAddField?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddField,
  className = "",
}) => {
  return (
    <div className={`bg-background ${className}`}>
      <Card className="min-h-[600px] border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>

          <h3 className="text-xl font-semibold mb-2">
            Start building your form
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Drag field types from the left panel to start building your form, or
            choose from pre-built templates.
          </p>

          <div className="flex gap-3">
            <Button onClick={onAddField}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Field
            </Button>
            <Button variant="outline">Browse Templates</Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              💡 Tip: You can also use AI to generate forms from a description
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
