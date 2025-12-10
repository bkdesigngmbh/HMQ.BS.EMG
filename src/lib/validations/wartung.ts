import { z } from "zod";

export const wartungSchema = z.object({
  geraet_id: z.string().uuid("Ungültige Geräte-ID"),
  wartungsart_id: z.string().uuid().optional().nullable(),
  datum: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ungültiges Datum",
  }),
  naechste_wartung: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ungültiges Datum für nächste Wartung",
    })
    .optional()
    .nullable(),
  bemerkungen: z.string().optional().nullable(),
});

export type WartungFormValues = z.infer<typeof wartungSchema>;
