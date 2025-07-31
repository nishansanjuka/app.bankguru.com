"use server";

import { ApiResponse, ApiResponseData } from "@/types/api-response";
import { Institution } from "@/types/institutions";

const API_URL = process.env.MAIN_API_URL;

export async function createInstitution(body: {
  id: string;
  typeId: string;
  name: string;
  countryCode: string;
  logoUrl?: string | null;
  licenseNumber?: string | null;
}): Promise<ApiResponseData<string>> {
  const res = await fetch(`${API_URL}/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Institution;
  if (!res.ok) {
    console.log(data);
    return ApiResponse.failure("Failed to create institution");
  }
  return ApiResponse.success(data.id);
}

export async function getInstitutions(): Promise<
  ApiResponseData<Institution[]>
> {
  const res = await fetch(`${API_URL}/institutions`, {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok) {
    return ApiResponse.failure("Failed to retrieve institutions");
  }
  return ApiResponse.success(data.data);
}

export async function deleteInstitution(
  id: string
): Promise<ApiResponseData<Institution[]>> {
  const res = await fetch(`${API_URL}/institutions/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    return ApiResponse.failure(
      data.message?.includes("used")
        ? "Institution is in use and cannot be deleted"
        : "Failed to delete institution"
    );
  }
  return ApiResponse.success(data.data);
}

export async function updateInstitution(
  id: string,
  data: Partial<Omit<Institution, "id">>
): Promise<ApiResponseData<string>> {
  const res = await fetch(`${API_URL}/institutions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return ApiResponse.failure("Failed to update institution");
  }
  return ApiResponse.success("Institution updated successfully");
}
