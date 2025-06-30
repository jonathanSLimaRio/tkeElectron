import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
