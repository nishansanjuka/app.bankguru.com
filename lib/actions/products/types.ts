"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { ProductType } from "@/types/product-type";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.MAIN_API_URL;

export async function defineProductType(
  productType: Omit<ProductType, "id" | "category">,
): Promise<ApiResponseData<string>> {
  const { categoryId, code, name, description } = productType;

  const session = await auth();
  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to define a product type."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/product-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify({
      categoryId,
      code,
      name,
      description,
    }),
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to define product type");
  }

  return ApiResponse.success("Product type defined successfully");
}

export async function getProductTypes(): Promise<
  ApiResponseData<ProductType[]>
> {
  const res = await fetch(`${API_URL}/product-types`, {
    method: "GET",
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve product types");
  }

  const data = await res.json();
  return ApiResponse.success(data);
}
