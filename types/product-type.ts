import z from "zod";
import { ProductCategory } from "@/types/product-category";

export type ProductType = {
  categoryId: string;
  code: string;
  name: string;
  id: string;
  description: string;
  category?: ProductCategory;
};

export const productTypeFormSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required." }),
  code: z.string().min(2, { message: "Code must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
});
