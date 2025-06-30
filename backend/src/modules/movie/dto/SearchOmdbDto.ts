import { z } from "zod";

export const SearchOmdbSchema = z.object({
  s: z.string().min(1, "Campo 's' (título) é obrigatório"),
  type: z.enum(["movie", "series", "episode"]).optional(),
  y: z
    .string()
    .regex(/^\d{4}$/, "Ano inválido")
    .optional(),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: "Page deve estar entre 1 e 100",
    })
    .optional(),
});

export type SearchOmdbDto = z.infer<typeof SearchOmdbSchema>;
