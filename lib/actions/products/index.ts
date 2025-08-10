"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { Product } from "@/types/product";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.MAIN_API_URL;

interface ProductsQuery {
  categoryId?: string;
  institutionId?: string;
  productTypeId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minRate?: number;
  maxRate?: number;
  limit?: number;
}

export async function createProduct(
  product: Omit<
    Product,
    | "id"
    | "slug"
    | "isActive"
    | "createdAt"
    | "updatedAt"
    | "institution"
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
    body: JSON.stringify({ ...product } as Product),
  });
  if (!res.ok) {
    return ApiResponse.failure("Failed to create product");
  }
  return ApiResponse.success("Product created successfully");
}

export async function getProducts(
  query: ProductsQuery
): Promise<ApiResponseData<Product[]>> {
  const searchParams = new URLSearchParams();

  if (query.categoryId) searchParams.append("categoryId", query.categoryId);
  if (query.institutionId)
    searchParams.append("institutionId", query.institutionId);
  if (query.productTypeId)
    searchParams.append("productTypeId", query.productTypeId);
  if (query.isActive !== undefined)
    searchParams.append("isActive", query.isActive.toString());
  if (query.isFeatured !== undefined)
    searchParams.append("isFeatured", query.isFeatured.toString());
  if (query.minRate !== undefined)
    searchParams.append("minRate", query.minRate.toString());
  if (query.maxRate !== undefined)
    searchParams.append("maxRate", query.maxRate.toString());
  if (query.limit !== undefined)
    searchParams.append("limit", query.limit.toString());

  const url = `${API_URL}/products${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const res = await fetch(url, { method: "GET" });
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
