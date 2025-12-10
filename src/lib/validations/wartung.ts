import { z } from "zod";

export const wartungSchema = z.object({
  geraet_id: z.string().uuid("Ungültige Geräte-ID"),
  wartungsart_id: z.string().uuid().nullable().optional(),
  datum: z.string().min(1, "Datum ist erforderlich"),
  durchgefuehrt_von: z.string().max(100).nullable().optional(),
  notizen: z.string().nullable().optional(),
});

export type WartungFormValues = z.infer<typeof wartungSchema>;

export function transformWartungValues(values: WartungFormValues) {
  return {
    ...values,
    wartungsart_id: values.wartungsart_id || null,
    durchgefuehrt_von: values.durchgefuehrt_von || null,
    notizen: values.notizen || null,
  };
}
