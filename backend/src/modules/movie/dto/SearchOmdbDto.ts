import { z } from "zod";

export const SearchOmdbSchema = z.object({
  s: z.string().min(1, "Campo 's' (title) is required"),
  type: z.enum(["movie", "series", "episode"]).optional(),
  y: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Page must be between 1 and 100",
    }),
});

export type SearchOmdbDto = z.infer<typeof SearchOmdbSchema>;
