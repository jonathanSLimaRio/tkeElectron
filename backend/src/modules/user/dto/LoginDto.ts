import { z } from "zod";

export const LoginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginDto = z.infer<typeof LoginSchema>;
