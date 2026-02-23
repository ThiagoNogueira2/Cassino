import { z } from "zod";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/** CPF: 11 dígitos (sem formatação). */
function isValidCPFLength(cpf: string): boolean {
  return onlyDigits(cpf).length === 11;
}

export const loginSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Nome obrigatório"),
    email: z.string().min(1, "Email obrigatório").email("Email inválido"),
    cpf: z
      .string()
      .min(1, "CPF obrigatório")
      .refine(isValidCPFLength, "CPF deve ter 11 dígitos"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "Aceite os termos para continuar",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Senhas não conferem",
    path: ["confirm"],
  });

export const forgotSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("Email inválido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotFormData = z.infer<typeof forgotSchema>;

export const authSchemas = {
  login: loginSchema,
  register: registerSchema,
  forgot: forgotSchema,
} as const;
