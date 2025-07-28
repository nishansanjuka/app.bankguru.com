export interface CreateOrgInput {
  userId: string; // The admin/creator user ID
  employeeEmails: string[]; // Array of emails for new users
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
