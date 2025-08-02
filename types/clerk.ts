export interface CreateOrgInput {
  userId: string; // The admin/creator user ID
  accountCategory: string;
  orgName?: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  createdAt: string;
}

export type InvitationData = {
  id: string;
  email: string;
  status: string;
  role: string;
  invitedAt: Date;
  expiresAt: Date | null;
};

export type MetadataKeys = string | string[];

export type MetadataValue<T> = {
  [key: string]: T;
};

export type UserData = {
  id: string;
  profile: string;
  fullName: string;
  role: string;
  joinedDate: Date;
};
