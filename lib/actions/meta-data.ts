"use server";

import { MetadataValue } from "@/types/clerk";
import { getPrivateMetadata, updatePrivateMetadata } from "../clerk/meta-data";
import { auth } from "@clerk/nextjs/server";
import { ApiResponse } from "@/types/api-response";

export const getPrivateMetadataWithAuth = async (key: string) => {
  const { userId } = await auth();

  if (!userId) {
    return ApiResponse.failure("Unauthorized: User must be logged in.");
  }

  return await getPrivateMetadata(userId, key);
};

export async function updatePrivateMetadataWithAuth<T>(
  keyOrData: string | MetadataValue<T> | Record<string, T>,
  value?: T
) {
  const { userId } = await auth();

  if (!userId) {
    return ApiResponse.failure("Unauthorized: User must be logged in.");
  }

  // Assuming you have a function to update metadata
  // This is a placeholder for the actual implementation
  return await updatePrivateMetadata(userId, keyOrData, value);
}
