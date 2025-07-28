"use server";

import {
  createOrganization,
  getUserOrganization,
} from "@/lib/clerk/organizations";
import { ApiResponse } from "@/types/api-response";
import { auth } from "@clerk/nextjs/server";

export const handleUserPromote = async (instituteName: string) => {
  const { userId } = await auth();

  if (!userId) {
    return ApiResponse.failure("User not authenticated");
  }

  const res = await createOrganization({
    userId,
    orgName: instituteName,
  });

  if (res.success) {
    return ApiResponse.success("DONE");
  } else {
    return ApiResponse.failure(`Failed to create organization: ${res.error}`);
  }
};

export const validateCallbackForInstitutes = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return ApiResponse.failure("User not authenticated");
    }
    const organization = await getUserOrganization(userId);

    if (!organization) {
      return ApiResponse.failure("Organization not found");
    }

    return ApiResponse.success("DONE");
  } catch (error) {
    console.error("Error validating callback for institutes:", error);
    return ApiResponse.failure("Failed to validate callback");
  }
};
