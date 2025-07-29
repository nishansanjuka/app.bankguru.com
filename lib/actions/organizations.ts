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

    if (!userId || !orgId) {
      return ApiResponse.failure(
        "User not authenticated or organization not found"
      );
    }

    const adminCount = await getOrganizationAdminCount(userId, orgId);

    if (!adminCount.success) {
      return ApiResponse.failure(adminCount.error);
    }

    if (newRole === "org:admin" && orgRole !== "org:admin") {
      return ApiResponse.failure(
        "Only organization admins can promote members"
      );
    }

    const memberRole = await getUserRole(memberId, orgId);

    if (!memberRole.success) {
      return ApiResponse.failure(memberRole.error);
    }

    if (
      memberRole.data.role === "org:admin" &&
      adminCount.data === 1 &&
      newRole === "org:standard_user"
    ) {
      return ApiResponse.failure("Cannot demote the last organization admin");
    }

    const clerk = await clerkClient();
    const orgResponse = await getUserOrganization(userId);

    if (!orgResponse.success) {
      return ApiResponse.failure("Organization not found");
    }

    await clerk.organizations.updateOrganizationMembership({
      organizationId: orgResponse.data.id,
      userId: memberId,
      role: newRole,
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
