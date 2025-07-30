"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { Institution } from "@/types/institution";
import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.MAIN_API_URL;

export async function defineInstitute(
  institute: Omit<Institution, "id">
): Promise<ApiResponseData<string>> {
  const { code, description, name } = institute;

  const session = await auth();

  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to define an institute."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/institution-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify({
      code,
      description,
      name,
    }),
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to define institute");
  }

  return ApiResponse.success("Institute defined successfully");
}

export async function getInstitutesTypes(): Promise<
  ApiResponseData<Institution[]>
> {
  const res = await fetch(`${API_URL}/institution-types`, {
    method: "GET",
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve institutes");
  }

  const data = await res.json();
  return ApiResponse.success(data);
}

export async function updateInstitute(
  id: string,
  institute: Omit<Institution, "id">
): Promise<ApiResponseData<string>> {
  const { code, description, name } = institute;

  const session = await auth();

  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to update an institute."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/institution-types/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
    body: JSON.stringify({
      code,
      description,
      name,
    }),
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to update institute");
  }

  return ApiResponse.success("Institute updated successfully");
}

export async function deleteInstitute(id: string) {
  const session = await auth();

  if (!session || !session.userId) {
    return ApiResponse.failure(
      "Unauthorized: User must be logged in to delete an institute."
    );
  }

  const tokenRes = await session.getToken();

  const res = await fetch(`${API_URL}/institution-types/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRes}`,
    },
  });

  if (!res.ok) {
    return ApiResponse.failure("Failed to delete institute");
  }

  return ApiResponse.success("Institute deleted successfully");
}
