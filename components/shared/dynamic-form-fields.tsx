"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  X,
  ChevronDown,
  Type,
  Hash,
  Percent,
  FileText,
} from "lucide-react";

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
  onAddField: (type: DynamicFormField["type"]) => void;
  onUpdateField: (id: string, updates: Partial<DynamicFormField>) => void;
  onRemoveField: (id: string) => void;
}

function FieldSection({
  title,
  description,
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
}: FieldSectionProps) {
  const getFieldTypeIcon = (type: DynamicFormField["type"]) => {
    switch (type) {
      case "text":
        return <Type className="w-4 h-4" />;
      case "number":
        return <Hash className="w-4 h-4" />;
      case "percentage":
        return <Percent className="w-4 h-4" />;
      case "textarea":
        return <FileText className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getFieldTypeLabel = (type: DynamicFormField["type"]) => {
    switch (type) {
      case "text":
        return "Text";
      case "number":
        return "Number";
      case "percentage":
        return "Percentage";
      case "textarea":
        return "Textarea";
      default:
        return "Text";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Field Dropdown */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Field
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onAddField("text")}>
              <Type className="w-4 h-4 mr-2" />
              Text Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddField("number")}>
              <Hash className="w-4 h-4 mr-2" />
              Number Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddField("percentage")}>
              <Percent className="w-4 h-4 mr-2" />
              Percentage Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddField("textarea")}>
              <FileText className="w-4 h-4 mr-2" />
              Textarea Field
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Fields Table */}
      {fields.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Type</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFieldTypeIcon(field.type)}
                      <span className="text-xs font-medium text-muted-foreground">
                        {getFieldTypeLabel(field.type)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Input
                      placeholder="Field label"
                      value={field.label}
                      onChange={(e) =>
                        onUpdateField(field.id, { label: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <FieldValueInput field={field} onUpdate={onUpdateField} />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Optional title"
                      value={field.title || ""}
                      onChange={(e) =>
                        onUpdateField(field.id, { title: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <Input
                      placeholder="Optional description"
                      value={field.description || ""}
                      onChange={(e) =>
                        onUpdateField(field.id, { description: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveField(field.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No fields added yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first form field using the button above
          </p>
        </div>
      )}
    </div>
  );
}

interface FieldValueInputProps {
  field: DynamicFormField;
  onUpdate: (id: string, updates: Partial<DynamicFormField>) => void;
}

function FieldValueInput({ field, onUpdate }: FieldValueInputProps) {
  const renderValueInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder="Default value"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
            className="resize-none h-8 text-sm"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder="0"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
            className="h-8 text-sm"
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
              className="pr-8 h-8 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
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
            className="h-8 text-sm"
          />
        );
    }
  };

  return renderValueInput();
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

  return (
    <div className="w-full mx-auto pb-12 pt-4">
      <FieldSection
        title="Dynamic Form Fields"
        description="Manage your form fields with different types and configurations"
        fields={fields}
        onAddField={addField}
        onUpdateField={updateField}
        onRemoveField={removeField}
      />
    </div>
  );
}
