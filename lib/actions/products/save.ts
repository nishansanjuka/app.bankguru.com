"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.MAIN_API_URL!;

interface SavedProduct {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SaveProductResponse {
  success: boolean;
  message?: string;
  data?: SavedProduct | SavedProduct[] | null;
}

interface SaveProductRequest {
  productId: string;
}

/**
 * Save a product for the current user
 * @param productId - The ID of the product to save
 * @returns Promise with the save operation result
 */
export async function saveProduct(
  productId: string
): Promise<SaveProductResponse> {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const requestBody: SaveProductRequest = {
      productId,
    };

    const response = await fetch(`${API_BASE_URL}/saved-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to save product: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Revalidate relevant paths to update the UI
    revalidatePath("/saved-products");
    revalidatePath("/services");

    return {
      success: true,
      message: "Product saved successfully",
      data,
    };
  } catch (error) {
    console.error("Error saving product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to save product",
    };
  }
}

/**
 * Unsave (remove) a product for the current user
 * @param productId - The ID of the product to unsave
 * @returns Promise with the unsave operation result
 */
export async function unsaveProduct(
  productId: string
): Promise<SaveProductResponse> {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      throw new Error("Unauthorized!");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/saved-products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if needed
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to unsave product: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Revalidate relevant paths to update the UI
    revalidatePath("/saved-products");
    revalidatePath("/services");

    return {
      success: true,
      message: "Product removed from saved items",
      data,
    };
  } catch (error) {
    console.error("Error unsaving product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to unsave product",
    };
  }
}

/**
 * Get all saved products for the current user
 * @returns Promise with the list of saved products
 */
export async function getSavedProducts(): Promise<SaveProductResponse> {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      throw new Error("User ID is required");
    }

    const token = await getToken();

    const response = await fetch(`${API_BASE_URL}/saved-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch saved products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      message: "Saved products fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching saved products:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch saved products",
    };
  }
}

/**
 * Check if a specific product is saved by the current user
 * @param productId - The ID of the product to check
 * @returns Promise with the saved status
 */
export async function isProductSaved(
  productId: string
): Promise<SaveProductResponse & { isSaved?: boolean }> {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/saved-products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authentication headers if needed
          // "Authorization": `Bearer ${token}`,
        },
        cache: "no-store", // Ensure fresh data
      }
    );

    if (response.status === 404) {
      // Product is not saved
      return {
        success: true,
        isSaved: false,
        message: "Product is not saved",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to check saved status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      isSaved: true,
      message: "Product is saved",
      data,
    };
  } catch (error) {
    console.error("Error checking saved status:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to check saved status",
    };
  }
}
