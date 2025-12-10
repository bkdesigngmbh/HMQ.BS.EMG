import { z } from "zod";

export const auftragSchema = z.object({
  auftragsnummer: z
    .string()
    .min(1, "Auftragsnummer ist erforderlich")
    .regex(
      /^51\d{4}\.\d{4}$/,
      "Auftragsnummer muss im Format 51XXXX.XXXX sein"
    ),
  auftragsort: z.string().max(255).nullable().optional(),
  bezeichnung: z.string().max(500).nullable().optional(),
  status: z.enum(["aktiv", "inaktiv"]),
});

export type AuftragFormValues = z.infer<typeof auftragSchema>;

export function transformAuftragValues(values: AuftragFormValues) {
  return {
    ...values,
    auftragsort: values.auftragsort || null,
    bezeichnung: values.bezeichnung || null,
  };
}
