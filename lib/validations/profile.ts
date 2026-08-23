import { z } from "zod";

const urlOrEmpty = z
  .string()
  .max(200)
  .optional()
  .refine(
    (v) => !v || v === "" || /^https?:\/\/.+/.test(v),
    "Must be a valid URL starting with http:// or https://"
  );

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be under 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be under 50 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  headline: z
    .string()
    .max(100, "Headline cannot exceed 100 characters")
    .optional(),
  country: z.string().optional(),
  city: z.string().max(100).optional(),
  phone: z.string().max(20, "Phone number is too long").optional(),
  occupation: z
    .string()
    .max(100, "Occupation cannot exceed 100 characters")
    .optional(),
  employer: z
    .string()
    .max(100, "Employer name cannot exceed 100 characters")
    .optional(),
  website: urlOrEmpty,
  linkedIn: z.string().max(200).optional(),
});

export const privacySchema = z.object({
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showCountry: z.boolean(),
  showOccupation: z.boolean(),
  isDirectoryVisible: z.boolean(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PrivacyInput = z.infer<typeof privacySchema>;
