import { z } from "zod";

export const einsatzSchema = z.object({
  geraet_id: z.string().uuid("Bitte wählen Sie ein Gerät"),
  auftrag_id: z.string().uuid("Bitte wählen Sie einen Auftrag"),
  von_datum: z.string().min(1, "Von-Datum ist erforderlich"),
  bis_provisorisch: z.string().nullable().optional(),
  strasse: z.string().max(255).nullable().optional(),
  plz: z.string().max(10).nullable().optional(),
  ort: z.string().max(100).nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  notizen: z.string().nullable().optional(),
});

export type EinsatzFormValues = z.infer<typeof einsatzSchema>;

export const einsatzBeendenSchema = z.object({
  bis_effektiv: z.string().min(1, "Effektives Enddatum ist erforderlich"),
  neuer_status_id: z.string().uuid("Bitte wählen Sie einen Status"),
});

export type EinsatzBeendenFormValues = z.infer<typeof einsatzBeendenSchema>;

export function transformEinsatzValues(values: EinsatzFormValues) {
  return {
    ...values,
    bis_provisorisch: values.bis_provisorisch || null,
    strasse: values.strasse || null,
    plz: values.plz || null,
    ort: values.ort || null,
    lat: values.lat ?? null,
    lng: values.lng ?? null,
    notizen: values.notizen || null,
  };
}
