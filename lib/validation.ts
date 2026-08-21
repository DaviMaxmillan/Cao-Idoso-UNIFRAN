import { z } from "zod";

export const tutorFields = ["nomeCompleto", "whatsapp", "email", "autorizaWhatsapp", "aceitouPoliticaPrivacidade"] as const;
export const caoFields = ["nomeCao", "idadeAnos", "raca", "sexo", "pesoKg"] as const;

export const cadastroSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD.")
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 11, "Informe um WhatsApp válido com DDD."),
  email: z
    .union([z.string().trim().email("E-mail inválido."), z.literal("")])
    .optional(),
  autorizaWhatsapp: z.boolean(),
  aceitouPoliticaPrivacidade: z
    .boolean()
    .refine((v) => v === true, "É preciso concordar com a política de privacidade."),

  nomeCao: z.string().trim().min(1, "Informe o nome do seu cão."),
  idadeAnos: z.coerce
    .number({ error: "Informe a idade do cão." })
    .int("Use um número inteiro.")
    .min(1, "Idade inválida.")
    .max(35, "Idade inválida."),
  raca: z.string().trim().min(1, "Informe a raça (ou \"SRD\")."),
  sexo: z.enum(["MACHO", "FEMEA"], { error: "Selecione o sexo do cão." }),
  // vem do formulário como "sim"/"não": sem valor inicial, obriga uma escolha
  castrado: z.enum(["sim", "nao"], { error: "Informe se o cão é castrado." }),
  pesoKg: z.coerce
    .number({ error: "Informe o peso do cão." })
    .positive("Peso inválido.")
    .max(150, "Peso inválido."),
});

export type CadastroFormValues = z.input<typeof cadastroSchema>;
export type CadastroData = z.output<typeof cadastroSchema>;
