"use server";

import { PaginatedResponse } from "@/types";
import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { OrgRole } from "@/types/auth";
import { InvitationData } from "@/types/clerk";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function inviteOrganizationUsers(
  emails: string[]
): Promise<ApiResponseData<string>> {
  const { userId, orgId, orgRole } = await auth();

  try {
    if (!userId || !orgId) {
      return ApiResponse.failure("User not authenticated");
    }

    if (orgRole !== "org:super_admin" && orgRole !== "org:admin") {
      return ApiResponse.failure("Only super admins can invite other admins");
    }

    const invitationBody = emails.map((email) => ({
      email_address: email,
      inviter_user_id: userId,
      role:
        orgRole === "org:super_admin"
          ? "org:super_standard"
          : "org:standard_user",
      private_metadata: {
        userType: "institute",
      },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
      expires_in_days: 30,
    }));

    const invitationRes = await fetch(
      `https://api.clerk.com/v1/organizations/${orgId}/invitations/bulk`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invitationBody),
      }
    );

    if (!invitationRes.ok) {
      console.log(await invitationRes.json());
      return ApiResponse.failure(
        `Failed to invite users: ${invitationRes.statusText}`
      );
    }

    return ApiResponse.success("Users invited successfully");
  } catch (error) {
    console.error("Error inviting users:", error);
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to invite users"
    );
  }
}

export async function getOrganizationInvitations(
  page: number = 1,
  pageSize: number = 10,
  status?: "accepted" | "pending" | "revoked",
  includedRoles?: OrgRole[],
  notIncludedRoles?: OrgRole[]
): Promise<ApiResponseData<PaginatedResponse<InvitationData>>> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return ApiResponse.failure("User not authenticated");
    }
    const clerk = await clerkClient();

    const invitations = await clerk.organizations.getOrganizationInvitationList(
      {
        organizationId: orgId,
      }
    );

    // Calculate pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedInvitations = invitations.data.slice(start, end);

    // Transform invitations with enhanced role filtering
    const transformedInvitations: InvitationData[] = paginatedInvitations
      .filter((org) => {
        // Status filtering
        if (status && org.status !== status) {
          return false;
        }

        const invitationRole = org.role as OrgRole;

        // Role filtering logic
        // If includedRoles has values, only include those specific roles
        if (includedRoles && includedRoles.length > 0) {
          return includedRoles.includes(invitationRole);
        }

        // If notIncludedRoles has values, exclude those specific roles
        if (notIncludedRoles && notIncludedRoles.length > 0) {
          return !notIncludedRoles.includes(invitationRole);
        }

        return true;
      })
      .map((invitation) => ({
        id: invitation.id,
        email: invitation.emailAddress,
        status: invitation.status ?? "unknown",
        role: invitation.role,
        invitedAt: new Date(invitation.createdAt),
        expiresAt: invitation.publicMetadata?.expiresAt
          ? new Date(invitation.publicMetadata.expiresAt as string)
          : null,
      }));

    return ApiResponse.success({
      data: transformedInvitations,
      pagination: {
        total: invitations.totalCount,
        totalPages: Math.ceil(invitations.totalCount / pageSize),
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to fetch organization invitations"
    );
  }
}

export async function revokeOrganizationInvitation(
  invitationId: string,
  emailAddress: string
): Promise<ApiResponseData<boolean>> {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      return ApiResponse.failure("User not authenticated");
    }

    if (orgRole !== "org:super_admin" && orgRole !== "org:admin") {
      return ApiResponse.failure("Only super admins can revoke invitations");
    }

    const clerk = await clerkClient();

    await clerk.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId: invitationId,
      requestingUserId: userId,
    });

    const users = await clerk.users.getUserList({
      emailAddress: [emailAddress],
    });

    if (users.totalCount > 0) {
      await clerk.users.deleteUser(users.data[0].id);
    }

    return ApiResponse.success(true);
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to revoke invitation"
    );
  }
}

export async function resendOrganizationInvitation(
  emailAddress: string
): Promise<ApiResponseData<boolean>> {
  try {
    const { userId, orgId , orgRole } = await auth();
    if (!userId || !orgId) {
      return ApiResponse.failure("User not authenticated");
    }

    const clerk = await clerkClient();

    await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: emailAddress,
      inviterUserId: userId,
      role: orgRole === "org:super_admin" ? "org:super_standard" : "org:member",
    });

    return ApiResponse.success(true);
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to resend invitation"
    );
  }
}
