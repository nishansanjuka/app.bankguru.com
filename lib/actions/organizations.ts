"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserOrganization } from "../clerk/organizations";
import { ApiResponse, ApiResponseData } from "@/types/api-response";

export async function getUserOrganizationWithAuth(): Promise<
  ApiResponseData<string>
> {
  const { userId } = await auth();

  if (!userId) {
    return ApiResponse.failure("User not authenticated");
  }

  return await getUserOrganization(userId);
}
