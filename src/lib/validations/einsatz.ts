import { z } from "zod";

export const einsatzSchema = z.object({
  geraet_id: z.string().uuid("Ungültige Geräte-ID"),
  auftrag_id: z.string().uuid("Ungültige Auftrags-ID"),
  standort_adresse: z.string().max(500).optional().nullable(),
  standort_lat: z.number().min(-90).max(90).optional().nullable(),
  standort_lng: z.number().min(-180).max(180).optional().nullable(),
  startdatum: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ungültiges Startdatum",
  }),
  enddatum: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ungültiges Enddatum",
    })
    .optional()
    .nullable(),
  bemerkungen: z.string().optional().nullable(),
});

export type EinsatzFormValues = z.infer<typeof einsatzSchema>;
