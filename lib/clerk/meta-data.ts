import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { MetadataKeys, MetadataValue } from "@/types/clerk";
import { clerkClient } from "@clerk/nextjs/server";

export async function updatePrivateMetadata<T>(
  clerkUserId: string,
  keyOrData: string | MetadataValue<T> | Record<string, T>,
  value?: T
): Promise<ApiResponseData<T | MetadataValue<T> | Record<string, T>>> {
  try {
    const clerk = await clerkClient();

    if (!clerkUserId) {
      return ApiResponse.failure("User ID is required");
    }

    // Get current metadata
    const user = await clerk.users.getUser(clerkUserId);
    const currentMetadata = user.privateMetadata;
    let updatedMetadata: Record<string, unknown>;

    // Handle single key-value pair
    if (typeof keyOrData === "string" && value !== undefined) {
      updatedMetadata = {
        ...currentMetadata,
        [keyOrData]: value,
      };

      await clerk.users.updateUser(clerkUserId, {
        privateMetadata: updatedMetadata,
      });

      return ApiResponse.success(value);
    }

    // Handle multiple key-value pairs as object
    if (typeof keyOrData === "object") {
      updatedMetadata = {
        ...currentMetadata,
        ...keyOrData,
      };

      await clerk.users.updateUser(clerkUserId, {
        privateMetadata: updatedMetadata,
      });
      return ApiResponse.success(keyOrData);
    }

    return ApiResponse.failure("Invalid input parameters");
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to update private metadata"
    );
  }
}

// New helper function to update multiple metadata values
export async function updateMultiplePrivateMetadata<T>(
  updates: Array<{ key: string; value: T }>,
  clerkUserId: string
): Promise<ApiResponseData<Record<string, T>>> {
  try {
    if (!updates || updates.length === 0) {
      return ApiResponse.failure("No updates provided");
    }

    // Convert array of updates to an object
    const updatesObject = updates.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, T>);

    // Use the existing function to perform the update
    const response = await updatePrivateMetadata(
      clerkUserId,
      updatesObject,
      undefined
    );
    if (
      response.success &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      return ApiResponse.success(response.data as Record<string, T>);
    }
    return ApiResponse.failure("Failed to update multiple metadata values");
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error
        ? error.message
        : "Failed to update multiple metadata values"
    );
  }
}

export async function getPrivateMetadata<T>(
  clerkUserId: string,
  keys: MetadataKeys
): Promise<ApiResponseData<T | Record<string, T> | undefined>> {
  try {
    const clerk = await clerkClient();
    if (!clerkUserId) {
      return ApiResponse.failure("User ID is required");
    }

    const user = await clerk.users.getUser(clerkUserId);

    // For other roles, get user metadata as before
    if (typeof keys === "string") {
      return ApiResponse.success(user.privateMetadata[keys] as T);
    }

    const result = keys.reduce((acc, key) => {
      acc[key] = user.privateMetadata[key] as T;
      return acc;
    }, {} as Record<string, T>);

    return ApiResponse.success(result);
  } catch (error) {
    return ApiResponse.failure(
      error instanceof Error ? error.message : "Failed to get metadata"
    );
  }
}

// export async function updateOrganizationPrivateMetadata<T>(
//   keyOrData: string | MetadataValue<T>,
//   value?: T
// ): Promise<ApiResponseData<T | MetadataValue<T>>> {
//   try {
//     const clerk = await clerkClient();

//     // Get the current organization
//     const orgResponse = await getUserOrganization();
//     if (!orgResponse.success) {
//       return ApiResponse.failure(orgResponse.error ?? "Organization not found");
//     }

//     const organizationId = orgResponse.data.id;

//     // Get current metadata
//     const organization = await clerk.organizations.getOrganization({
//       organizationId,
//     });
//     const currentMetadata = organization.privateMetadata;

//     // Handle single key-value pair
//     if (typeof keyOrData === "string" && value !== undefined) {
//       const updatedMetadata = {
//         ...currentMetadata,
//         [keyOrData]: value,
//       };

//       await clerk.organizations.updateOrganization(organizationId, {
//         privateMetadata: updatedMetadata,
//       });

//       return ApiResponse.success(value);
//     }

//     // Handle multiple key-value pairs
//     if (typeof keyOrData === "object") {
//       const updatedMetadata = {
//         ...currentMetadata,
//         ...keyOrData,
//       };

//       await clerk.organizations.updateOrganization(organizationId, {
//         privateMetadata: updatedMetadata,
//       });

//       return ApiResponse.success(keyOrData);
//     }

//     return ApiResponse.failure("Invalid input parameters");
//   } catch (error) {
//     return ApiResponse.failure(
//       error instanceof Error
//         ? error.message
//         : "Failed to update organization private metadata"
//     );
//   }
// }

// export async function getOrganizationPrivateMetadata<T>(
//   keys: MetadataKeys
// ): Promise<ApiResponseData<T | Record<string, T> | undefined>> {
//   try {
//     const clerk = await clerkClient();

//     // Get the current organization
//     const orgResponse = await getUserOrganization();
//     if (!orgResponse.success) {
//       return ApiResponse.failure(orgResponse.error ?? "Organization not found");
//     }

//     const organizationId = orgResponse.data.id;

//     const organization = await clerk.organizations.getOrganization({
//       organizationId,
//     });

//     // Handle single key case
//     if (typeof keys === "string") {
//       return ApiResponse.success(organization.privateMetadata[keys] as T);
//     }

//     // Handle multiple keys case
//     const result = keys.reduce((acc, key) => {
//       acc[key] = organization.privateMetadata[key] as T;
//       return acc;
//     }, {} as Record<string, T>);

//     return ApiResponse.success(result);
//   } catch (error) {
//     return ApiResponse.failure(
//       error instanceof Error
//         ? error.message
//         : "Failed to get organization metadata"
//     );
//   }
// }
