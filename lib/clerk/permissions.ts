import { clerkClient } from "@clerk/nextjs/server";
import { OrgRole } from "@/types/auth";
import { ApiResponse, ApiResponseData } from "@/types/api-response";

/**
 * Gets the current user's organization role
 * @returns ApiResponseData with the user's organization role
 */
export async function getUserRole(
  userId: string,
  orgId: string
): Promise<ApiResponseData<{ role: OrgRole; permissions: string[] }>> {
  try {
    const clerk = await clerkClient();

    if (!userId || !orgId) {
      return ApiResponse.failure("User not found");
    }

    // Get the user's organization membership
    const organizations = await clerk.users.getOrganizationMembershipList({
      userId,
    });

    const organization =
      organizations.totalCount === 1
        ? organizations.data[0]
        : organizations.data.find((data) => data.organization.id === orgId);

    if (!organization) {
      return {
        success: true,
        data: {
          role: "non-org",
          permissions: [],
        },
      };
    }

    // Get the first organization membership (assuming user belongs to one org)
    const orgMembership = organization;

    const role = orgMembership.role as OrgRole;

    return ApiResponse.success({
      role,
      permissions: orgMembership.permissions ?? [],
    });
  } catch (error) {
    console.error("Error getting user role:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to get user role"
    );
  }
}
