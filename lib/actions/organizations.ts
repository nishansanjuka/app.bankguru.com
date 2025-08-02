"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getOrganizationAdminCount,
  getUserOrganization,
} from "../clerk/organizations";
import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { PaginatedResponse } from "@/types";
import { UserData } from "@/types/clerk";
import { getUserRole } from "../clerk/permissions";

export async function getUserOrganizationWithAuth(): Promise<
  ApiResponseData<{ id: string; userId: string }>
> {
  const { userId } = await auth();

  if (!userId) {
    return ApiResponse.failure("User not authenticated");
  }

  return await getUserOrganization(userId);
}

export async function getOrganizationMembers(
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponseData<PaginatedResponse<UserData>>> {
  try {
    const { userId, orgId } = await auth();
    const clerk = await clerkClient();
    if (!userId || !orgId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    // Get organization members
    const members = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });
    // Calculate pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedMembers = members.data.slice(start, end);

    // Transform members to UserData format
    const transformedMembers: UserData[] = await Promise.all(
      paginatedMembers.map(async (member) => {
        if (!member.publicUserData) {
          throw new Error("Member public user data not found");
        }
        const user = await clerk.users.getUser(member.publicUserData.userId);
        return {
          id: user.id,
          profile: user.imageUrl,
          fullName: `${
            user.firstName ?? member.privateMetadata.first_name ?? ""
          } ${user.lastName ?? member.privateMetadata.last_name ?? ""}`,
          role: member.role,
          joinedDate: new Date(member.createdAt),
        };
      })
    );

    return ApiResponse.success({
      data: transformedMembers,
      pagination: {
        total: members.totalCount,
        totalPages: Math.ceil(members.totalCount / pageSize),
        page: page,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to fetch organization members"
    );
  }
}

export async function updateOrganizationMemberRole(
  memberId: string,
  newRole: "org:admin" | "org:standard_user"
): Promise<ApiResponseData<boolean>> {
  try {
    if (!["org:admin", "org:standard_user"].includes(newRole)) {
      return ApiResponse.failure("Invalid role specified");
    }

    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId || !orgRole) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const adminCount = await getOrganizationAdminCount(userId, orgId, orgRole);

    if (!adminCount.success) {
      return ApiResponse.failure(adminCount.error);
    }

    if (
      newRole === "org:admin" &&
      !["org:super_admin", "org:admin"].includes(orgRole)
    ) {
      return ApiResponse.failure(
        "Only organization admins can promote members"
      );
    }

    const memberRole = await getUserRole(memberId, orgId);

    if (!memberRole.success) {
      return ApiResponse.failure(memberRole.error);
    }

    if (
      ["org:admin", "org:super_admin"].includes(memberRole.data.role) &&
      adminCount.data === 1 &&
      newRole === "org:standard_user"
    ) {
      return ApiResponse.failure("Cannot demote the last organization admin");
    }

    const clerk = await clerkClient();

    await clerk.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId: memberId,
      role:
        orgRole === "org:super_admin"
          ? newRole === "org:admin"
            ? "org:super_admin"
            : "org:standard_user"
          : newRole,
    });

    return ApiResponse.success(true);
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to update member role"
    );
  }
}

export async function removeOrganizationMember(
  memberId: string
): Promise<ApiResponseData<boolean>> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const clerk = await clerkClient();

    await clerk.users.deleteUser(memberId);

    return ApiResponse.success(true);
  } catch (error) {
    console.error("Error removing member:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to remove member"
    );
  }
}

export async function createNewOrganization(
  name: string
): Promise<ApiResponseData<string>> {
  try {
    const { userId, orgRole } = await auth();

    if (!userId || !orgRole) {
      return ApiResponse.failure("User not authenticated");
    }

    if (!["org:super_standard", "org:super_admin"].includes(orgRole)) {
      return ApiResponse.failure(
        "do not have permission to create an organization"
      );
    }

    const clerk = await clerkClient();
    const organization = await clerk.organizations.createOrganization({
      name: name,
      publicMetadata: {},
      privateMetadata: {},
    });

    if (!organization) {
      return ApiResponse.failure("Failed to create organization");
    }

    return ApiResponse.success("Organization created successfully");
  } catch (error) {
    console.error("Error creating organization:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to create organization"
    );
  }
}

export type OrganizationRes = {
  id: string;
  name: string;
  imageUrl?: string | null;
};
export async function getOrganizationDetails(): Promise<
  ApiResponseData<OrganizationRes[]>
> {
  try {
    const { userId, orgId } = await auth();

    if (!orgId || !userId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const clerk = await clerkClient();
    const organizations = await clerk.organizations.getOrganizationList({
      includeMembersCount: true,
      limit: 100,
    });

    if (!organizations) {
      return ApiResponse.failure("Organization not found");
    }

    const filteredOrganizations = organizations.data.map((org) => ({
      id: org.id,
      name: org.name,
      imageUrl: org.imageUrl,
    }));
    return ApiResponse.success(filteredOrganizations);
  } catch (error) {
    console.error("Error fetching organization details:", error);
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to fetch organization details"
    );
  }
}

export async function updateOrganizationName(
  id: string,
  name: string
): Promise<ApiResponseData<string>> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const clerk = await clerkClient();
    const organization = await clerk.organizations.updateOrganization(id, {
      name: name,
    });

    if (!organization) {
      return ApiResponse.failure("Failed to update organization");
    }

    return ApiResponse.success("Organization updated successfully");
  } catch (error) {
    console.error("Error updating organization:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to update organization"
    );
  }
}

export async function deleteOrganization(
  id: string
): Promise<ApiResponseData<boolean>> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const clerk = await clerkClient();
    await clerk.organizations.deleteOrganization(id);

    return ApiResponse.success(true);
  } catch (error) {
    console.error("Error deleting organization:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to delete organization"
    );
  }
}
