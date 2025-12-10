import { z } from "zod";

export const geraetSchema = z.object({
  name: z
    .string()
    .min(1, "Name ist erforderlich")
    .regex(
      /^(HMQ-\d{4}|ZC-\d{3})$/,
      "Name muss im Format HMQ-XXXX oder ZC-XXX sein"
    ),
  eigentum: z.enum(["eigen", "miete"]),
  seriennummer: z
    .string()
    .min(1, "Seriennummer ist erforderlich")
    .regex(/^\d{8}$/, "Seriennummer muss 8 Ziffern haben"),
  client: z
    .string()
    .regex(/^\d{2}-\d{2}$/, "Client muss im Format XX-XX sein")
    .nullable()
    .optional()
    .or(z.literal("")),
  ip_adresse: z
    .string()
    .regex(
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
      "Ungültige IPv4-Adresse"
    )
    .nullable()
    .optional()
    .or(z.literal("")),
  pin: z
    .string()
    .regex(/^\d{4}$/, "PIN muss 4 Ziffern haben")
    .nullable()
    .optional()
    .or(z.literal("")),
  geraeteart_id: z.string().uuid("Ungültige Geräteart").nullable().optional(),
  status_id: z.string().uuid("Ungültiger Status").nullable().optional(),
  kaufdatum: z.string().nullable().optional(),
  naechster_service: z.string().nullable().optional(),
  notizen: z.string().nullable().optional(),
});

export type GeraetFormValues = z.infer<typeof geraetSchema>;

export function transformGeraetValues(values: GeraetFormValues) {
  return {
    ...values,
    client: values.client || null,
    ip_adresse: values.ip_adresse || null,
    pin: values.pin || null,
    geraeteart_id: values.geraeteart_id || null,
    status_id: values.status_id || null,
    kaufdatum: values.kaufdatum || null,
    naechster_service: values.naechster_service || null,
    notizen: values.notizen || null,
  };
}
