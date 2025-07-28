import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { CreateOrgInput, OrganizationResponse } from "@/types/clerk";
import { clerkClient } from "@clerk/nextjs/server";

export async function createOrganization({
  userId,
  orgName = "New Organization",
}: CreateOrgInput): Promise<ApiResponseData<OrganizationResponse>> {
  const clerk = await clerkClient();

  try {
    if (!userId) throw new Error("userId is required");

    // Create organization
    const organization = await clerk.organizations.createOrganization({
      name: orgName,
      createdBy: userId,
    });

    return ApiResponse.success({
      id: organization.id,
      name: organization.name,
      createdAt: organization.createdAt.toString(),
    });
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to create organization"
    );
  }
}

export async function getUserOrganization(
  userId: string
): Promise<ApiResponseData<string>> {
  const clerk = await clerkClient();

  if (!userId) {
    return ApiResponse.failure("User not found");
  }

  const organizations = await clerk.users.getOrganizationMembershipList({
    userId,
  });

  const organization = await clerk.organizations.getOrganization({
    organizationId: organizations.data[0].organization.id,
  });

  if (!organization) return ApiResponse.failure("Organization not found");

  return ApiResponse.success(organization.id);
}
