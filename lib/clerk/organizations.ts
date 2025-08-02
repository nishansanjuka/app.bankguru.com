import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { CreateOrgInput, OrganizationResponse } from "@/types/clerk";
import { clerkClient } from "@clerk/nextjs/server";

export async function createOrganization({
  userId,
  orgName = "New Organization",
  accountCategory,
}: CreateOrgInput): Promise<ApiResponseData<OrganizationResponse>> {
  const clerk = await clerkClient();

  try {
    if (!userId) throw new Error("userId is required");

    // Create organization
    const organization = await clerk.organizations.createOrganization({
      name: orgName,
      createdBy: userId,
      privateMetadata: {
        accountCategory,
      },
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
): Promise<ApiResponseData<{ id: string; userId: string }>> {
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

  return ApiResponse.success({ id: organization.id, userId: userId });
}

export async function getOrganizationAdminCount(
  userId: string,
  orgId: string,
  orgRole: string
): Promise<ApiResponseData<number>> {
  try {
    if (!userId || !orgId) {
      return ApiResponse.failure("User not authenticated");
    }

    const clerk = await clerkClient();
    const organizations =
      await clerk.organizations.getOrganizationMembershipList({
        organizationId: orgId,
      });

    const adminCount = organizations.data.filter(
      (member) => member.role === orgRole
    ).length;

    return ApiResponse.success(adminCount);
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to fetch organization admin count"
    );
  }
}
