import { z } from "zod";

export const SearchOmdbByTitleSchema = z.object({
  t: z.string().min(1, "Campo 't' (title) é obrigatório"),
  y: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
});
