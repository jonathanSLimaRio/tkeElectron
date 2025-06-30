import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().optional(),
  login: z.string().min(3, "Login deve ter ao menos 3 caracteres"),
  password: z
    .string()
    .min(8, "Senha deve ter ao menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial"
    ),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
