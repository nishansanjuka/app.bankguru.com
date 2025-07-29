"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { ProductCategory } from "@/types/product-category";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.MAIN_API_URL;

export async function defineCategory(
  category: Omit<
    ProductCategory,
    "id" | "slug" | "level" | "parent" | "children" | "parentId"
  >
): Promise<ApiResponseData<string>> {
  const { name, description } = category;

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
    }),
  });

  if (!res.ok) {
    console.log(await res.json());
    return ApiResponse.failure("Failed to define category");
  }

  return ApiResponse.success("Category defined successfully");
}

export async function getCategories(): Promise<
  ApiResponseData<ProductCategory[]>
> {
  const res = await fetch(`${API_URL}/product-categories`, {
    method: "GET",
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve categories");
  }

  const data = await res.json();
  return ApiResponse.success(data);
}
