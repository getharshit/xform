import { Card, CardContent } from "@/components/ui/card";

export interface FieldTemplatesProps {
  onTemplateSelect?: (template: any) => void;
}

export const FieldTemplates: React.FC<FieldTemplatesProps> = ({
  onTemplateSelect,
}) => {
  const templates = [
    { id: "contact-form", name: "Contact Form", fields: 4 },
    { id: "feedback-survey", name: "Feedback Survey", fields: 6 },
    { id: "registration", name: "Registration Form", fields: 8 },
    { id: "order-form", name: "Order Form", fields: 5 },
  ];

  return (
    <div className="p-4 space-y-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
        >
          <CardContent className="p-3">
            <h4 className="font-medium text-sm mb-1">{template.name}</h4>
            <p className="text-xs text-muted-foreground">
              {template.fields} fields
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
