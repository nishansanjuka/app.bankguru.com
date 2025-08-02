
import z from "zod";

export type ProductCategory = {
  name: string;
  slug: string;
  id: string;
  parentId?: string;
  description: string;
  level: number;
  parent?: unknown; // Can be refined if needed
  children?: unknown[]; // Can be refined if needed
};

export const productCategoryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  parentId: z.string().optional(),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
});
