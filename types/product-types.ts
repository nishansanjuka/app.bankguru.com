import * as z from "zod";

const additionalInfoSchema = z
  .array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "number", "percentage", "textarea", "image"]),
      label: z.string(),
      value: z.union([z.string(), z.number()]),
      title: z.string().optional(),
      description: z.string().optional(),
    })
  )
  .optional();

export const productFormSchema = z.object({
  institutionId: z.string().min(1, { message: "Institution is required." }),
  productTypeId: z.string().min(1, { message: "Product Type is required." }),
  name: z.string().min(1, { message: "Product name is required." }),
  details: z.object({
    description: z.string().min(1, { message: "Description is required." }),
    terms: z.string().optional(),
    fees: z.string().optional(),
    eligibility: z.string().optional(),
    additionalInfo: additionalInfoSchema, // Dynamic fields
  }),
  isFeatured: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Define types for the hierarchical product type data from the API
export interface ProductTypeNode {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  level: number;
  children?: ProductTypeNode[];
  productTypes?: {
    id: string;
    categoryId: string;
    code: string;
    name: string;
    description: string;
  }[];
}

// Define a type for the dynamic field definitions used to render the form
export interface DynamicFieldDefinition {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "percentage"
    | "list"
    | "file"
    | "textarea";
  options?: { label: string; value: string }[]; // For list/select types
  placeholder?: string;
  required?: boolean;
}

// Define the structure for a nested option in the combobox
export interface NestedOption {
  value: string;
  label: string;
  isSelectable: boolean; // True for actual product types, false for categories/groups
  children?: NestedOption[];
}
