import { z } from "zod";

export const geraetSchema = z.object({
  seriennummer: z
    .string()
    .min(1, "Seriennummer ist erforderlich")
    .max(100, "Seriennummer darf maximal 100 Zeichen lang sein"),
  geraeteart_id: z.string().uuid().optional().nullable(),
  status_id: z.string().uuid().optional().nullable(),
  standort: z.string().max(255).optional().nullable(),
  bemerkungen: z.string().optional().nullable(),
});

export type GeraetFormValues = z.infer<typeof geraetSchema>;
