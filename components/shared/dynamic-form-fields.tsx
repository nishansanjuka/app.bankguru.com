"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Combobox, { type ComboboxOption } from "../ui/combobox";
import {
  Plus,
  Type,
  Hash,
  Percent,
  FileText,
  Edit,
  Save,
  Trash2,
} from "lucide-react";
import { Product } from "@/types/product";
import { getLabelSuggestionsForType } from "@/lib/utils/extract-product-labels";

// Array of field IDs that should be hidden from the table display
const HIDDEN_FIELD_IDS: string[] = ["product-image", "product-url"];

export interface DynamicFormField {
  id: string;
  type: "text" | "number" | "percentage" | "textarea" | "image";
  label: string;
  value: string | number;
  title?: string;
  description?: string;
}

interface FieldFormProps {
  field?: DynamicFormField | null;
  onSave: (field: DynamicFormField) => void;
  onCancel: () => void;
  products?: Product[];
}

function FieldForm({ field, onSave, onCancel, products = [] }: FieldFormProps) {
  const [formData, setFormData] = useState<DynamicFormField>(
    field || {
      id: "",
      type: "text",
      label: "",
      value: "",
      title: "",
      description: "",
    }
  );

  const fieldTypes: ComboboxOption[] = [
    { value: "text", label: "Text", icon: Type },
    { value: "number", label: "Number", icon: Hash },
    { value: "percentage", label: "Percentage", icon: Percent },
    { value: "textarea", label: "Textarea", icon: FileText },
  ];

  const handleSave = () => {
    if (!formData.label.trim()) return;

    // Generate ID from label if not already set
    const generateIdFromLabel = (label: string) => {
      return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters except spaces
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    };

    const fieldToSave = {
      ...formData,
      id: formData.id || generateIdFromLabel(formData.label),
    };
    onSave(fieldToSave);
  };

  const renderValueInput = () => {
    switch (formData.type) {
      case "textarea":
        return (
          <Textarea
            placeholder="Default value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            className="resize-none h-20"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder="0"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
          />
        );
      case "percentage":
        return (
          <div className="relative">
            <Input
              type="number"
              placeholder="0"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
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
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
          />
        );
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-muted/50 space-y-4">
      <h3 className="text-lg font-semibold">
        {field ? "Edit Field" : "Add New Field"}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Field Type</Label>
            <Combobox
              value={formData.type}
              onChange={(value: string) =>
                setFormData({
                  ...formData,
                  type: value as DynamicFormField["type"],
                })
              }
              options={fieldTypes}
              placeholder="Select field type..."
              searchPlaceholder="Search field type..."
              emptyMessage="No field type found."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Label <span className="text-red-500">*</span>
            </Label>
            <Combobox
              value={formData.label}
              onChange={(value: string) =>
                setFormData({ ...formData, label: value })
              }
              options={getLabelSuggestionsForType(formData.type, products).map(
                (label) => ({
                  value: label,
                  label: label,
                })
              )}
              placeholder="Enter or select field label..."
              searchPlaceholder="Search existing labels..."
              emptyMessage="No existing labels found for this type."
              enhanced={true}
              allowCustom={true}
              customOptionTitle="Add Custom Label"
              customOptionDescription="This will create a new field label."
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            placeholder="Optional field title"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Description</Label>
          <Textarea
            placeholder="Optional field description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="resize-none h-16"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Default Value</Label>
          {renderValueInput()}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {field ? "Update Field" : "Add Field"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FieldSectionProps {
  title: string;
  description: string;
  fields: DynamicFormField[];
  onAddField: (field: DynamicFormField) => void;
  onUpdateField: (field: DynamicFormField) => void;
  onRemoveField: (id: string) => void;
  products?: Product[];
}

function FieldSection({
  title,
  description,
  fields,
  onAddField,
  onUpdateField,
  onRemoveField,
  products = [],
}: FieldSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<DynamicFormField | null>(
    null
  );

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

  const handleSaveField = (field: DynamicFormField) => {
    if (editingField) {
      onUpdateField(field);
    } else {
      onAddField(field);
    }
    setShowForm(false);
    setEditingField(null);
  };

  const handleEditField = (field: DynamicFormField) => {
    setEditingField(field);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingField(null);
  };

  const startAddingField = () => {
    setEditingField(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {!showForm && (
          <Button
            onClick={startAddingField}
            type="button"
            className="gap-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
        )}
      </div>

      {/* Fields Table */}
      {fields.filter((field) => !HIDDEN_FIELD_IDS.includes(field.id)).length >
      0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Type</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields
                .filter((field) => !HIDDEN_FIELD_IDS.includes(field.id))
                .map((field) => (
                  <TableRow
                    key={field.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleEditField(field)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFieldTypeIcon(field.type)}
                        <span className="text-xs font-medium text-muted-foreground">
                          {getFieldTypeLabel(field.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {field.label || (
                        <span className="text-muted-foreground italic">
                          No label
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.title || (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {field.description ? (
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {field.description}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {field.value ? (
                        <span className="text-sm">
                          {field.type === "percentage"
                            ? `${field.value}%`
                            : field.value}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditField(field);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveField(field.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : !showForm ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No fields added yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first form field using the button above
          </p>
          <Button onClick={() => startAddingField()} variant="outline">
            Add Your First Field
          </Button>
        </div>
      ) : null}

      {/* Add/Edit Form */}
      {showForm && (
        <FieldForm
          field={editingField}
          onSave={handleSaveField}
          onCancel={handleCancel}
          products={products}
        />
      )}
    </div>
  );
}

export default function DynamicFormFields({
  fields,
  setFields,
  products = [],
}: {
  fields: DynamicFormField[];
  setFields: Dispatch<SetStateAction<DynamicFormField[]>>;
  products?: Product[];
}) {
  const addField = (field: DynamicFormField) => {
    setFields((prev) => [...prev, field]);
  };

  const updateField = (field: DynamicFormField) => {
    setFields((prev) => prev.map((f) => (f.id === field.id ? field : f)));
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
        products={products}
      />
    </div>
  );
}
