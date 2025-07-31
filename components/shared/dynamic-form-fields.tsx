"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export interface DynamicFormField {
  id: string;
  type: "text" | "number" | "percentage" | "textarea" | "image";
  label: string;
  value: string | number;
  title?: string;
  description?: string;
}

interface FieldSectionProps {
  title: string;
  description: string;
  fields: DynamicFormField[];
  fieldType: DynamicFormField["type"];
  onAddField: (type: DynamicFormField["type"]) => void;
  onUpdateField: (id: string, updates: Partial<DynamicFormField>) => void;
  onRemoveField: (id: string) => void;
}

function FieldSection({
  title,
  description,
  fields,
  fieldType,
  onAddField,
  onUpdateField,
  onRemoveField,
}: FieldSectionProps) {
  const sectionFields = fields.filter((field) => field.type === fieldType);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-foreground tracking-wide">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground ">{description}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onAddField(fieldType)}
          className="text-xs rounded-full"
        >
          <Plus strokeWidth={1} className="w-3 h-3" />
        </Button>
      </div>

      {sectionFields.length > 0 && (
        <div className="space-y-6">
          {sectionFields.map((field) => (
            <FieldItem
              key={field.id}
              field={field}
              onUpdate={onUpdateField}
              onRemove={onRemoveField}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FieldItemProps {
  field: DynamicFormField;
  onUpdate: (id: string, updates: Partial<DynamicFormField>) => void;
  onRemove: (id: string) => void;
}

function FieldItem({ field, onUpdate, onRemove }: FieldItemProps) {
  const renderValueInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder="Default value"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
            className="resize-none h-20"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder="0"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          />
        );
      case "percentage":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={field.value}
              onChange={(e) => onUpdate(field.id, { value: e.target.value })}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        );
      default:
        return (
          <Input
            type="text"
            placeholder="Default value"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="space-y-6 py-6 border-b border-border last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-6 pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-normal text-muted-foreground">
                Title
              </Label>
              <Input
                placeholder="Optional field title"
                value={field.title || ""}
                onChange={(e) => onUpdate(field.id, { title: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-normal text-muted-foreground">
                Label <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Field label"
                value={field.label}
                onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                className="h-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-muted-foreground">
              Description
            </Label>
            <Textarea
              placeholder="Optional field description"
              value={field.description || ""}
              onChange={(e) =>
                onUpdate(field.id, { description: e.target.value })
              }
              className="resize-none h-16"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-normal text-muted-foreground">
              Default Value
            </Label>
            {renderValueInput()}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(field.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function DynamicFormFields({
  fields,
  setFields,
}: {
  fields: DynamicFormField[];
  setFields: Dispatch<SetStateAction<DynamicFormField[]>>;
}) {
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addField = (type: DynamicFormField["type"]) => {
    const newField: DynamicFormField = {
      id: generateId(),
      type,
      label: "",
      value: type === "number" || type === "percentage" ? 0 : "",
      title: "",
      description: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (id: string, updates: Partial<DynamicFormField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const exportFields = () => {
    console.log("Form Fields:", fields);
    alert("Check console for exported fields data");
  };

  const fieldTypes = [
    {
      type: "text" as const,
      title: "Text Fields",
      description: "Single line text input",
    },
    {
      type: "number" as const,
      title: "Number Fields",
      description: "Numeric input with optional percentage formatting",
    },
    {
      type: "percentage" as const,
      title: "Percentage Fields",
      description: "Percentage input with optional numeric formatting",
    },
    {
      type: "textarea" as const,
      title: "Textarea Fields",
      description: "Multi-line text input",
    },
  ];

  return (
    <div className="w-full mx-auto pb-12 pt-4">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl font-semibold text-foreground">Form Builder</h1>
        <p className="text-muted-foreground">
          Create and configure form fields
        </p>
      </div>

      <div className="space-y-12">
        {fieldTypes.map(({ type, title, description }) => (
          <FieldSection
            key={type}
            description={description}
            title={title}
            fields={fields}
            fieldType={type}
            onAddField={addField}
            onUpdateField={updateField}
            onRemoveField={removeField}
          />
        ))}
      </div>

      {fields.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {fields.length} fields configured
              </p>
              <p className="text-xs text-muted-foreground">
                Ready to export or integrate
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportFields} size="sm">
                Export
              </Button>
              <Button variant="outline" onClick={() => setFields([])} size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
