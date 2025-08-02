import z from "zod";

export type InstitutionTypes = {
  code: string;
  name: string;
  description: string;
  id: string;
};

export const institutionTypesFormSchema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
});
