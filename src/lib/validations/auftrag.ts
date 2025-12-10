import { z } from "zod";

export const auftragSchema = z.object({
  auftragsnummer: z
    .string()
    .min(1, "Auftragsnummer ist erforderlich")
    .max(50, "Auftragsnummer darf maximal 50 Zeichen lang sein"),
  kunde: z
    .string()
    .min(1, "Kunde ist erforderlich")
    .max(255, "Kundenname darf maximal 255 Zeichen lang sein"),
  beschreibung: z.string().optional().nullable(),
  status: z.enum(["offen", "aktiv", "abgeschlossen"]).default("offen"),
});

export type AuftragFormValues = z.infer<typeof auftragSchema>;
