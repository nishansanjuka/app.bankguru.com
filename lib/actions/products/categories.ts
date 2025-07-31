"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { ProductCategory } from "@/types/product-category";
import { auth } from "@clerk/nextjs/server";
import { defineProductType } from "./types";

const API_URL = process.env.MAIN_API_URL;

export async function defineCategory(
  category: Omit<
    ProductCategory,
    "id" | "slug" | "level" | "parent" | "children"
  >
): Promise<ApiResponseData<string>> {
  const { name, description, parentId } = category;

  const session = await auth();

  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to define a category."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/product-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify({
      name,
      description,
      parentId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return ApiResponse.failure("Failed to define category");
  }

  const typeRes = await defineProductType({
    name,
    description,
    code: name.split(" ").join("_").toUpperCase(),
    categoryId: data.id,
  });

  if (!typeRes.success) {
    return ApiResponse.failure("Failed to define product type for category");
  }

  return ApiResponse.success("Category defined successfully");
}

export async function getCategories(): Promise<
  ApiResponseData<ProductCategory[]>
> {
  const res = await fetch(`${API_URL}/product-categories`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve categories");
  }

  return ApiResponse.success(data.data);
}

export async function deleteCategories(
  id: string
): Promise<ApiResponseData<ProductCategory[]>> {
  const res = await fetch(`${API_URL}/product-categories/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) {
    return ApiResponse.failure(
      data.message.includes("used")
        ? "Category is in use and cannot be deleted"
        : "Failed to delete category"
    );
  }

  return ApiResponse.success(data.data);
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<ProductCategory, "id">>
): Promise<ApiResponseData<string>> {
  const session = await auth();
  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to update a category."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/product-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to update category");
  }

  return ApiResponse.success("Category updated successfully");
}
