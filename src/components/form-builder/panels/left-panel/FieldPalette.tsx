// src/components/form-builder/panels/left-panel/FieldPalette.tsx

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Type,
  AlignLeft,
  Mail,
  Globe,
  Phone,
  CircleDot,
  ChevronDown,
  ToggleLeft,
  BarChart3,
  Star,
  FileText,
  Scale,
  Upload,
  Minus,
  Play,
  CheckCircle,
  Sparkles,
  Layout,
} from "lucide-react";
import { useBuilder } from "../../providers/BuilderProvider";
import {
  FIELD_TEMPLATES,
  getTemplatesByCategory,
} from "../../utils/field-templates";

export interface FieldPaletteProps {
  searchQuery?: string;
  onFieldDrag?: (fieldType: string) => void;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({
  searchQuery = "",
  onFieldDrag,
}) => {
  // Use builder context
  const { addFieldByType, fieldCount } = useBuilder();

  const fieldCategories = [
    {
      id: "text-fields",
      label: "Text Fields",
      icon: Type,
      color: "blue",
      fields: [
        { type: "shortText", label: "Short Text", icon: Type, isNew: false },
        { type: "longText", label: "Long Text", icon: AlignLeft, isNew: false },
        { type: "email", label: "Email", icon: Mail, isNew: false },
        { type: "website", label: "Website", icon: Globe, isNew: false },
        {
          type: "phoneNumber",
          label: "Phone Number",
          icon: Phone,
          isNew: false,
        },
      ],
    },
    {
      id: "choice-fields",
      label: "Choice Fields",
      icon: CircleDot,
      color: "green",
      fields: [
        {
          type: "multipleChoice",
          label: "Multiple Choice",
          icon: CircleDot,
          isNew: false,
        },
        {
          type: "dropdown",
          label: "Dropdown",
          icon: ChevronDown,
          isNew: false,
        },
        { type: "yesNo", label: "Yes/No", icon: ToggleLeft, isNew: false },
        {
          type: "opinionScale",
          label: "Opinion Scale",
          icon: BarChart3,
          isNew: false,
        },
      ],
    },
    {
      id: "rating-fields",
      label: "Rating Fields",
      icon: Star,
      color: "yellow",
      fields: [
        {
          type: "numberRating",
          label: "Rating Scale",
          icon: Star,
          isNew: false,
        },
      ],
    },
    {
      id: "special-fields",
      label: "Special Fields",
      icon: Sparkles,
      color: "purple",
      fields: [
        { type: "statement", label: "Statement", icon: FileText, isNew: false },
        { type: "legal", label: "Legal", icon: Scale, isNew: false },
        {
          type: "fileUpload",
          label: "File Upload",
          icon: Upload,
          isNew: false,
        },
      ],
    },
    {
      id: "structure-fields",
      label: "Structure Fields",
      icon: Layout,
      color: "gray",
      fields: [
        { type: "pageBreak", label: "Page Break", icon: Minus, isNew: false },
        {
          type: "startingPage",
          label: "Starting Page",
          icon: Play,
          isNew: false,
        },
        {
          type: "postSubmission",
          label: "Thank You Page",
          icon: CheckCircle,
          isNew: false,
        },
      ],
    },
  ];

  // Filter categories based on search query
  const filteredCategories = fieldCategories
    .map((category) => ({
      ...category,
      fields: category.fields.filter(
        (field) =>
          field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field.type.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.fields.length > 0);

  const handleFieldClick = (fieldType: string) => {
    // Use the integrated state management
    if (onFieldDrag) {
      onFieldDrag(fieldType);
    } else {
      // Add field directly using context
      addFieldByType(fieldType);
    }
  };

  const handleDragStart = (fieldType: string) => {
    onFieldDrag?.(fieldType);
  };

  return (
    <div className="p-4">
      {/* Header with total field count */}
      {fieldCount > 0 && (
        <div className="mb-4 p-2 bg-muted/50 rounded text-center">
          <div className="text-sm font-medium">
            Form has {fieldCount} field{fieldCount !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Search results info */}
      {searchQuery && (
        <div className="mb-4 p-2 bg-primary/10 rounded">
          <div className="text-sm text-primary">
            {filteredCategories.reduce(
              (acc, cat) => acc + cat.fields.length,
              0
            )}{" "}
            field
            {filteredCategories.reduce(
              (acc, cat) => acc + cat.fields.length,
              0
            ) !== 1
              ? "s"
              : ""}{" "}
            found for "{searchQuery}"
          </div>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["text-fields", "choice-fields"]}
        className="space-y-2"
      >
        {filteredCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-3 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{category.label}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {category.fields.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-1">
                  {category.fields.map((field) => {
                    const FieldIcon = field.icon;
                    return (
                      <Button
                        key={field.type}
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 cursor-pointer hover:bg-primary/10 transition-colors"
                        draggable
                        onDragStart={() => handleDragStart(field.type)}
                        onClick={() => handleFieldClick(field.type)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-8 h-6 rounded bg-primary/10 flex items-center justify-center">
                            <FieldIcon className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            {field.label}
                          </span>
                          {field.isNew && (
                            <Badge
                              variant="default"
                              className="ml-auto text-xs"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* No results message */}
      {filteredCategories.length === 0 && searchQuery && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-sm">No fields found for "{searchQuery}"</div>
          <div className="text-xs mt-1">Try a different search term</div>
        </div>
      )}

      {/* Field template tip */}
      <div className="mt-6 p-3 bg-muted/30 rounded border text-sm text-muted-foreground">
        <div className="font-medium mb-1">💡 Pro Tip</div>
        <div>
          Click any field type to add it to your form instantly. You can also
          drag fields to specific positions.
        </div>
      </div>
    </div>
  );
};
