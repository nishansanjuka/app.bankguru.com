"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";

// Types matching the nested combobox structure
export interface ProductType {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  level: number;
  children?: Category[];
  productTypes?: ProductType[];
}

export interface ProductCategoryHierarchyResponse {
  data: Category[];
}

const API_URL = process.env.MAIN_API_URL;

export async function getProductCategoryHierarchy(): Promise<
  ApiResponseData<Category[]>
> {
  // const { userId } = await auth();

  // if (!userId) {
  //   return ApiResponse.failure("Unauthorized: User must be logged in.");
  // }

  const res = await fetch(`${API_URL}/product-categories/hierarchy`, {
    method: "GET",
  });
  const data: ProductCategoryHierarchyResponse = await res.json();
  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve product category hierarchy");
  }
  return ApiResponse.success(data.data);
}
