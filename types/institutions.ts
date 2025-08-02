import z from "zod";

export type Institution = {
  id: string;
  typeId: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  licenseNumber?: string | null;
  countryCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  type: {
    id: string;
    code: string;
    name: string;
    description: string;
  };
};

export const InstitutionFormSchema = z.object({
  typeId: z.string().uuid({ message: "Type is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  countryCode: z
    .string()
    .length(2, { message: "Country code must be 2 letters." }),
  logoUrl: z.string().url().nullable().optional(),
  licenseNumber: z.string().nullable().optional(),
});
