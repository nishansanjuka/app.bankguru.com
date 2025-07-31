import z from "zod";
import { ProductType } from "@/types/product-type";
import { Institution } from "./institutions";
import { DynamicFormField } from "@/components/shared/dynamic-form-fields";

export type ProductDetails = {
  description: string;
  terms: string;
  fees: string;
  eligibility: string;
  additionalInfo: DynamicFormField[];
};

export type Product = {
  id: string;
  institutionId: string;
  productTypeId: string;
  name: string;
  slug: string;
  details: ProductDetails;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  institution?: Institution;
  productType?: ProductType;
};

export const productDetailsSchema = z.object({
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
  terms: z.string(),
  fees: z.string(),
  eligibility: z.string(),
  additionalInfo: z.record(z.string(), z.unknown()),
});

export const productFormSchema = z.object({
  institutionId: z.string().min(1, { message: "Institution is required." }),
  productTypeId: z.string().min(1, { message: "Product type is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  details: productDetailsSchema,
  isFeatured: z.boolean(),
});
