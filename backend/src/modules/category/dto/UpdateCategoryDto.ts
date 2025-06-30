import { z } from "zod";

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
