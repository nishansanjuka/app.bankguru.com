"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { Product } from "@/types/product";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.MAIN_API_URL;

export async function createProduct(
  product: Omit<
    Product,
    | "id"
    | "slug"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "institution"
    | "institutionId"
    | "productType"
  >
): Promise<ApiResponseData<string>> {
  const { userId, orgId, getToken } = await auth();
  if (!userId || !orgId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to create a product."
    );
  }
  const tokenRes = await getToken();
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify({ ...product, institutionId: orgId } as Product),
  });
  if (!res.ok) {
    return ApiResponse.failure("Failed to create product");
  }
  return ApiResponse.success("Product created successfully");
}

export async function getProducts(): Promise<ApiResponseData<Product[]>> {
  const res = await fetch(`${API_URL}/products`, { method: "GET" });
  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve products");
  }
  const data = await res.json();
  return ApiResponse.success(data.data);
}

export async function getProductById(
  id: string
): Promise<ApiResponseData<Product>> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "GET" });
  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve product");
  }
  const data = await res.json();
  return ApiResponse.success(data);
}

export async function updateProduct(
  id: string,
  product: Partial<
    Omit<
      Product,
      | "id"
      | "slug"
      | "isActive"
      | "createdAt"
      | "updatedAt"
      | "institution"
      | "productType"
    >
  >
): Promise<ApiResponseData<string>> {
  const session = await auth();
  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to update a product."
    );
  }
  const tokenRes = await session.getToken();
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    return ApiResponse.failure("Failed to update product");
  }
  return ApiResponse.success("Product updated successfully");
}

export async function deleteProduct(
  id: string
): Promise<ApiResponseData<string>> {
  const session = await auth();
  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to delete a product."
    );
  }
  const tokenRes = await session.getToken();
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${tokenRes}`,
    },
  });
  if (!res.ok) {
    return ApiResponse.failure("Failed to delete product");
  }
  return ApiResponse.success("Product deleted successfully");
}
